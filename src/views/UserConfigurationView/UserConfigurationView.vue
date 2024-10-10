<template>
  <div class="card layout-content min-h-full">
    <ConfirmDialog />
    <Toast />
    <AppProgressSpinner :showSpinner="isLoadingUserConfig"></AppProgressSpinner>

    <Splitter style="height: 56rem">
      <!-- Tree  -->
      <SplitterPanel :size="25" :minSize="10" style="overflow-y: auto">
        <Card style="height: 100%">
          <template #title>
            <div class="flex flex-wrap justify-content-between align-items-center gap-2">
              <div>Project</div>
              <div class="flex flex-wrap gap-2 mb-4">
                <Button
                  type="button"
                  icon="pi pi-chevron-down"
                  severity="secondary"
                  text
                  title="Expand All"
                  @click="expandAll"
                />
                <Button
                  type="button"
                  icon="pi pi-chevron-up"
                  severity="secondary"
                  text
                  title="Collapse All"
                  @click="collapseAll"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div style="height: 48rem" aria-haspopup="true" @contextmenu="onProjectRightClick">
              <Tree
                v-model:expandedKeys="expandedKeys"
                selectionMode="single"
                :value="treeData"
                class="w-full"
                @node-select="onNodeSelect"
              >
                <template #default="slotProps">
                  <div aria-haspopup="true" @contextmenu="onAppRightClick($event, slotProps.node.appId)">
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #Application="slotProps">
                  <div
                    class="font-bold"
                    aria-haspopup="true"
                    @contextmenu="onAppRightClick($event, slotProps.node.appId)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #MonitorGroup="slotProps">
                  <div
                    class="font-semibold"
                    aria-haspopup="true"
                    @contextmenu="onAppRightClick($event, slotProps.node.appId)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #DsaGroup="slotProps">
                  <div
                    class="font-semibold"
                    aria-haspopup="true"
                    @contextmenu="onAppRightClick($event, slotProps.node.appId)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                </template>
              </Tree>
              <ContextMenu ref="appContextMenuRef" :model="appContextMenu" />
            </div>
            <ContextMenu ref="projectContextMenuRef" :model="projectContextMenu" />
          </template>
        </Card>
      </SplitterPanel>

      <!-- Config  -->
      <SplitterPanel :size="75" :minSize="20" style="overflow-y: auto">
        <Card style="height: 100%">
          <template #title>
            <div class="flex flex-wrap justify-content-between align-items-center gap-2">
              <div>Configuration {{ nodeSelected._id ? ' - ' + nodeSelected.type : '' }}</div>
            </div>
          </template>
          <template #content>
            <div class="card" style="height: 50rem" aria-haspopup="true">
              <template v-if="nodeSelected.type === 'Application' && appData !== undefined">
                <applicationFormWidget v-model="appData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateApplication"></Button>
                  <Button type="button" severity="danger" label="Delete" @click="confirmDeleteApp"></Button>
                </div>
              </template>

              <template v-if="nodeSelected.type === 'Monitor' && monitorData !== undefine">
                <monitorFormWidget v-model="monitorData" :is-create-form="false" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateMonitor"></Button>
                  <Button type="button" severity="danger" label="Delete" @click="confirmDeleteMonitor"></Button>
                </div>
              </template>

              <!-- this is for test  -->

              <!-- <div class="flex gap-3">
                <div>
                  nodeSelected
                  <pre>
    {{ nodeSelected }}
  </pre
                  >
                </div>
                <div>
                  monitorData
                  <pre>
    {{ monitorData }}
  </pre
                  >
                </div>
                <div v-for="(row, index) in treeData" :key="index">
                  {{ index }}
                  <pre>
                  {{ row }}
                </pre
                  >
                  <hr />
                </div>
              </div> -->
              <!-- end test  -->
            </div>
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
  </div>

  <Dialog
    v-model:visible="createApplicationVisibleDialog"
    :style="{ width: '32rem' }"
    header="Create New "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Application</span>
      </div>
    </template>

    <applicationFormWidget v-model="newAppData" />

    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="createApplicationVisibleDialog = false"
      ></Button>

      <Button type="button" label="Submit" :disabled="!newAppData.name" @click="createApplication"></Button>
    </template>
  </Dialog>

  <Dialog v-model:visible="createMonitorVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Application</span>
      </div>
    </template>

    <monitorFormWidget v-model="newMonitorData" :project-version-id="projectVersionId" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createMonitorVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newMonitorData.name" @click="createMonitor"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputSwitch from 'primevue/inputswitch';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import ContextMenu from 'primevue/contextmenu';

import LoadingContainer from '@/components/LoadingContainer.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';

import applicationFormWidget from './applicationFormWidget.vue';
import monitorFormWidget from './monitorFormWidget.vue';

import { ApiApplication, ApiMonitor } from '@/views/UserConfigurationView/api';

const toast = useToast();
const confirm = useConfirm();
const isLoadingUserConfig = ref(false);

onMounted(async () => {
  await getTreeData();
});

const projectVersionId = ref('66decf1dcff005199529524b');

// treeData
const treeData = ref();

const getTreeData = async () => {
  await getAppList();
  const tree = [];
  for (let appIndex = 0; appIndex < appList.value.length; appIndex++) {
    const app = appList.value[appIndex];
    tree.push(await getAppLeaf(app, appIndex));
  }
  treeData.value = tree;
};

const getAppLeaf = async (app, key = '') => {
  return {
    key: key,
    label: app.name,
    _id: app._id,
    appId: app._id,
    type: 'Application',
    children: [
      {
        key: 'monitor_' + key,
        label: 'Monitor',
        type: 'MonitorGroup',
        appId: app._id,
        children: await getMonitorBranch(app._id, key),
      },
      {
        type: 'DsaGroup',
        appId: app._id,
        key: 'dsa_' + key,
        label: 'DSA Module',
      },
    ],
  };
};

const getMonitorBranch = async (appId, appKey = '') => {
  const monitorList = await getMonitorList(appId);
  const leafData = [];
  for (let index = 0; index < monitorList.length; index++) {
    const monitor = monitorList[index];
    leafData.push(getMonitorLeaf(appId, monitor, appKey + '_' + index));
  }
  return leafData;
};

const addNewMonitorLeaf = (appId, monitor) => {
  const appLeaf = treeData.value.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    appLeaf.children[0].children.push(getMonitorLeaf(appId, monitor, appLeaf.key + '_' + appLeaf.children[0].length));
  }
};

const updateLabelMonitorLeaf = (appId, newName) => {
  const appLeaf = treeData.value.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorData.value._id)[0];
    if (monitorLeaf) {
      monitorLeaf.label = newName;
    }
  }
};

const getMonitorLeaf = (appId, monitor, key = '') => {
  return {
    key: key,
    label: monitor.name,
    _id: monitor._id,
    appId: appId,
    type: 'Monitor',
    children: [
      {
        key: 'scada_' + key,
        label: 'Scada',
        type: 'Scada',
      },
      {
        key: 'pml_' + key,
        label: 'PML',
        type: 'PML',
      },
    ],
  };
};

// controll tree
const expandedKeys = ref({});
const nodeSelected = ref({});

const expandAll = () => {
  for (const node of treeData.value) {
    expandNode(node);
  }

  expandedKeys.value = { ...expandedKeys.value };
};
const expandNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;

    for (const child of node.children) {
      expandNode(child);
    }
  }
};

const collapseAll = () => {
  expandedKeys.value = {};
};

const onNodeSelect = async (node) => {
  nodeSelected.value = node;
  if (node.type === 'Application') {
    await getAppData(node._id);
  }
  if (node.type === 'Monitor') {
    await getMonitorData(node._id);
  }
};

// --------- Application

const projectContextMenuRef = ref();
const onProjectRightClick = (event) => {
  projectContextMenuRef.value.show(event); // this is my ref
};
const projectContextMenu = ref([
  {
    label: 'Create Application',
    icon: 'pi pi-plus',
    command: () => {
      createApplicationVisibleDialog.value = true;
    },
  },
]);

const appList = ref([]);
const getAppList = async () => {
  try {
    const res = await ApiApplication.getList(projectVersionId.value);
    appList.value = res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Application Data

const createApplicationVisibleDialog = ref(false);
const appData = ref({
  name: '',
  active: true,
  _id: '',
});
const newAppData = ref({
  name: '',
  active: true,
});

const getAppData = async (appId) => {
  try {
    const res = await ApiApplication.getAppData(appId);
    appData.value = res.data;
  } catch (error) {
    console.log('getAppData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createApplication = async () => {
  try {
    const res = await ApiApplication.createApp(projectVersionId.value, newAppData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createApplicationVisibleDialog.value = false;
    treeData.value.push(await getAppLeaf(res.data, treeData.value.length));
  } catch (error) {
    console.log('createApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateApplication = async () => {
  try {
    const res = await ApiApplication.updateAppData(appData.value._id, {
      name: appData.value.name,
      active: appData.value.active,
    });
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    treeData.value[nodeSelected.value.key].label = res.data.name;
  } catch (error) {
    console.log('updateApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteApp = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Application',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteApplication();
    },
  });
};
const deleteApplication = async () => {
  try {
    await ApiApplication.delAppData(appData.value._id);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    treeData.value = treeData.value.filter((item) => item._id !== appData.value._id);
  } catch (error) {
    console.log('deleteApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- App Menu
const appIdclick = ref();
const appContextMenuRef = ref();
const onAppRightClick = (event, appId) => {
  appIdclick.value = appId;
  appContextMenuRef.value.show(event);
};

const appContextMenu = ref([
  {
    label: 'Create Application',
    icon: 'pi pi-plus',
    command: () => {
      createApplicationVisibleDialog.value = true;
    },
  },
  {
    separator: true,
  },
  {
    label: 'Create Monitor',
    icon: 'pi pi-plus',
    command: () => {
      createMonitorVisibleDialog.value = true;
    },
  },
  {
    label: 'Create DSA Moudule',
    icon: 'pi pi-plus',
    command: () => {
      createApplicationVisibleDialog.value = true;
    },
  },
]);

// ------- Monitor

const createMonitorVisibleDialog = ref(false);
const monitorData = ref();
const newMonitorData = ref({
  monitorType: 1,
  name: '',
  powersystemId: '',
  priority: 1,
  scadaMonitorPowerSytemId: '',
});

const getMonitorList = async (appId) => {
  try {
    const res = await ApiMonitor.getList(projectVersionId.value, appId);
    return res.data;
  } catch (error) {
    console.log('getMonitorList: error ', error);
    return [];
  }
};

const getMonitorData = async (monitorId) => {
  try {
    const res = await ApiMonitor.getMonitor(monitorId);
    monitorData.value = res.data;
  } catch (error) {
    console.log('getMonitorData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createMonitor = async () => {
  try {
    const res = await ApiMonitor.createMonitor(projectVersionId.value, appIdclick.value, newMonitorData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createMonitorVisibleDialog.value = false;
    addNewMonitorLeaf(appIdclick.value, res.data);
  } catch (error) {
    console.log('createMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateMonitor = async () => {
  try {
    const res = await ApiMonitor.updateMonitor(monitorData.value._id, monitorData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelMonitorLeaf(nodeSelected.value.appId, res.data.name);
  } catch (error) {
    console.log('updateMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteMonitor = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delMonitor();
    },
  });
};
const delMonitor = async () => {
  try {
    await ApiMonitor.delMonitor(monitorData.value._id);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    monitorData.value = undefined;
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

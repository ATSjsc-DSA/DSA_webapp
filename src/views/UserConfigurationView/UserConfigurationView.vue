<template>
  <div class="card layout-content min-h-full">
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
                  :disabled="!treeData"
                  @click="expandAll"
                />
                <Button
                  type="button"
                  icon="pi pi-chevron-up"
                  severity="secondary"
                  text
                  title="Collapse All"
                  :disabled="!treeData"
                  @click="collapseAll"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div style="height: 48rem" aria-haspopup="true">
              <Tree
                v-model:expandedKeys="expandedKeys"
                v-model:selectionKeys="keySelected"
                selectionMode="single"
                :value="treeData"
                class="w-full"
                @node-select="onNodeSelect"
              >
                <template #default="slotProps">
                  <div>{{ slotProps.node.label }}</div>
                </template>

                <template #Project="slotProps">
                  <div class="font-bold text-xl" aria-haspopup="true" @contextmenu="onProjectRightClick">
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="projectContextMenuRef" :model="projectContextMenu" />
                </template>
                <template #Application="slotProps">
                  <div
                    class="font-bold text-lg"
                    aria-haspopup="true"
                    @contextmenu="onApplicationRightClick($event, slotProps.node.appId)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="appContextMenuRef" :model="appContextMenu" />
                </template>

                <!-- --- Monitor --- -->
                <template #MonitorGroup="slotProps">
                  <div
                    class="font-semibold"
                    aria-haspopup="true"
                    @contextmenu="onMonitorGroupRightClick($event, slotProps.node)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="monitorGroupContextMenuRef" :model="monitorGroupContextMenu" />
                </template>
                <template #Monitor="slotProps">
                  <div aria-haspopup="true" @contextmenu="onMonitorRightClick($event, slotProps.node)">
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="monitorContextMenuRef" :model="monitorContextMenu" />
                </template>

                <!-- --- DSA --- -->
                <template #DSAGroup="slotProps">
                  <div
                    class="font-semibold"
                    aria-haspopup="true"
                    @contextmenu="onDsaGroupRightClick($event, slotProps.node)"
                  >
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="dsaGroupContextMenuRef" :model="dsaGroupContextMenu" />
                </template>
                <template #DSA="slotProps">
                  <div aria-haspopup="true" @contextmenu="onDsaRightClick($event, slotProps.node)">
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="dsaContextMenuRef" :model="dsaContextMenu" />
                </template>

                <template #VSA="slotProps">
                  <div aria-haspopup="true" @contextmenu="onVsaRightClick($event, slotProps.node)">
                    <Tag value="VSA" rounded /> {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="vsaContextMenuRef" :model="vsaContextMenu" />
                </template>

                <template #TSA="slotProps">
                  <div aria-haspopup="true" @contextmenu="onTsaRightClick($event, slotProps.node)">
                    <Tag value="TSA" severity="secondary" rounded /> {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="tsaContextMenuRef" :model="tsaContextMenu" />
                </template>
              </Tree>
            </div>
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
            <LoadingContainer v-show="isLoadingContainer" class="relative" />
            <ScrollPanel
              v-if="nodeSelected.type === 'Application' && appData !== undefined"
              class="card"
              style="width: 100%; height: 50rem"
            >
              <applicationFormWidget v-model="appData" />
              <div class="flex justify-content-end gap-3">
                <Button type="button" label="Update" @click="updateApplication"></Button>
              </div>
            </ScrollPanel>

            <ScrollPanel
              v-if="nodeSelected.type === 'Monitor' && monitorData !== undefined"
              class="card"
              style="width: 100%; height: 50rem"
            >
              <monitorWidget
                :node-monitor-selected="nodeSelected"
                :project-version-id="projectVersionId"
                @update-label-monitor-leaf="updateLabelMonitorLeaf"
              />
            </ScrollPanel>

            <ScrollPanel
              v-if="nodeSelected.type === 'DSA' && dsaData !== undefined"
              class="card"
              style="width: 100%; height: 50rem"
            >
              <dsaFormWidget v-model="dsaData" />
              <div class="flex justify-content-end gap-3">
                <Button type="button" label="Update" @click="updateDsa"></Button>
              </div>
            </ScrollPanel>

            <TabView v-if="nodeSelected.type === 'VSA' && vsaData !== undefined">
              <TabPanel header="Common">
                <ScrollPanel style="padding-right: 1rem; width: 100%; height: 45rem">
                  <DsaVsaFormWidget v-model="vsaData" :is-create-form="false" />
                  <div class="flex justify-content-end gap-3">
                    <Button type="button" label="Update" @click="updateVsa"></Button>
                  </div>
                </ScrollPanel>
              </TabPanel>
              <TabPanel header="Dependency Plan">
                <ScrollPanel style="padding-right: 1rem; width: 100%; height: 45rem">
                  <dependencyTableWidget :project-version-id="projectVersionId" :dependency-id="vsaData._id" />
                </ScrollPanel>
              </TabPanel>
            </TabView>
            <TabView v-if="nodeSelected.type === 'TSA' && tsaData !== undefined">
              <TabPanel header="Common">
                <ScrollPanel style="padding-right: 1rem; width: 100%; height: 45rem">
                  <DsaTsaFormWidget v-model="tsaData" :is-create-form="false" />
                  <div class="flex justify-content-end gap-3">
                    <Button type="button" label="Update" @click="updateTsa"></Button>
                  </div>
                </ScrollPanel>
              </TabPanel>
              <TabPanel header="Dependency Plan">
                <ScrollPanel style="padding-right: 1rem; width: 100%; height: 45rem">
                  <dependencyTableWidget :project-version-id="projectVersionId" :dependency-id="tsaData._id" />
                </ScrollPanel>
              </TabPanel>
              <TabPanel header="Disturbances">
                <ScrollPanel style="padding-right: 1rem; width: 100%; height: 45rem">
                  <div>Tôi là disturbance Tab</div>
                </ScrollPanel>
              </TabPanel>
            </TabView>
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

  <!-- ------ Monitor - Dialog --  -->
  <Dialog v-model:visible="createMonitorVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor</span>
      </div>
    </template>

    <monitorFormWidget v-model="newMonitorData" :project-version-id="projectVersionId" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createMonitorVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newMonitorData.name" @click="createMonitor"></Button>
    </template>
  </Dialog>

  <!-- ------ DSA - Dialog --  -->
  <Dialog v-model:visible="createDsaVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new DSA</span>
      </div>
    </template>
    <dsaFormWidget v-model="newDsaData" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createDsaVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newDsaData.name" @click="createDsa"></Button>
    </template>
  </Dialog>

  <Dialog v-model:visible="createTaskDsaDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Task</span>
      </div>
    </template>

    <div class="grid">
      <div class="col-10">
        <div class="flex flex-column gap-2 mb-3">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="newTaskData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-2">
        <div class="flex flex-column gap-2 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="newTaskData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="dsaType" class="font-semibold"> Type</label>
          <!-- <InputText id="sourceId" v-model="data.sourceId" class="flex-auto" autocomplete="off" /> -->

          <Dropdown
            v-model="newTaskData.type"
            :options="typeDsaOpts"
            option-label="label"
            option-value="value"
            placeholder="Select a Type"
          />
        </div>
      </div>
      <Divider />
    </div>
    <DsaVsaFormWidget v-if="newTaskData.type === 'VSA'" v-model="newVsaData" :is-create-form="true" />
    <DsaTsaFormWidget v-if="newTaskData.type === 'TSA'" v-model="newTsaData" :is-create-form="true" />

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createTaskDsaDialog = false"></Button>
      <Button type="button" label="Submit" @click="handlecreateTask"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dropdown from 'primevue/dropdown';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import ContextMenu from 'primevue/contextmenu';
import LoadingContainer from '@/components/LoadingContainer.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';

import applicationFormWidget from './formWidget/applicationFormWidget.vue';
import monitorFormWidget from './formWidget/monitorFormWidget.vue';

import monitorWidget from './monitorWidget.vue';
import dsaFormWidget from './formWidget/dsaFormWidget.vue';
import { ApiApplication, ApiMonitor, ApiDsa } from '@/views/UserConfigurationView/api';
import DsaVsaFormWidget from './formWidget/dsaVsaFormWidget.vue';
import DsaTsaFormWidget from './formWidget/dsaTsaFormWidget.vue';
import dependencyTableWidget from './dependencyTableWidget.vue';
const toast = useToast();
const confirm = useConfirm();
const isLoadingUserConfig = ref(false);

onMounted(async () => {
  await getTreeData();
});

const projectVersionId = ref('66decf1dcff005199529524b');

// treeData
const treeData = ref([
  {
    key: 'root',
    label: 'Project',
    type: 'Project',
    icon: 'pi pi-server',
    children: [],
  },
]);
const isLoadingContainer = ref(false);

const getTreeData = async () => {
  await getAppList();
  const tree = [
    {
      key: 'root',
      label: 'Project',
      type: 'Project',
      icon: 'pi pi-server',
      children: [],
    },
  ];
  for (let appIndex = 0; appIndex < appList.value.length; appIndex++) {
    const app = appList.value[appIndex];
    tree[0].children.push(await getAppLeaf(app, appIndex));
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
    icon: 'pi pi-folder-open',
    children: [
      {
        key: 'monitor_' + key,
        label: 'Monitor',
        type: 'MonitorGroup',
        icon: 'pi pi-list',
        appId: app._id,
        children: await getMonitorBranch(app._id, key),
      },
      {
        key: 'dsa_' + key,
        label: 'DSA Module',
        appId: app._id,
        icon: 'pi pi-th-large',
        type: 'DSAGroup',
        children: await getDsaBranch(app._id, key),
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

const getMonitorLeaf = (appId, monitor, key = '') => {
  return {
    key: 'monitor_' + key,
    label: monitor.name,
    _id: monitor._id,
    appId: appId,
    icon: 'pi pi-file',
    type: 'Monitor',
  };
};

const addNewMonitorLeaf = (appId, monitor) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    appLeaf.children[0].children.push(getMonitorLeaf(appId, monitor, appLeaf.key + '_' + appLeaf.children[0].length));
  }
};

const updateLabelMonitorLeaf = (appId, monitorId, newName) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorId)[0];
    if (monitorLeaf) {
      monitorLeaf.label = newName;
    }
  }
};

const getDsaBranch = async (appId, appKey = '') => {
  const dsaList = await getDsaList(appId);
  const leafData = [];
  for (let index = 0; index < dsaList.length; index++) {
    const dsa = dsaList[index];
    leafData.push(await getDsaLeaf(appId, dsa, appKey + '_' + index));
  }
  return leafData;
};

const addNewDsaLeaf = async (appId, dsa) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    appLeaf.children[1].children.push(await getDsaLeaf(appId, dsa, appLeaf.key + '_' + appLeaf.children[0].length));
  }
};

const updateLabelDsaLeaf = (appId, dsaId, newName) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const dsaLeaf = appLeaf.children[1].children.filter((item) => item._id === dsaId)[0];
    if (dsaLeaf) {
      dsaLeaf.label = newName;
    }
  }
};

const getDsaLeaf = async (appId, dsa, key = '') => {
  return {
    key: 'dsa_' + key,
    label: dsa.name,
    _id: dsa._id,
    appId: appId,
    type: 'DSA',
    icon: 'pi pi-clone',
    children: await getTaskBranch(appId, dsa._id, key),
  };
};

const getTaskBranch = async (appId, dsaId, dsaKey = '') => {
  const vsaList = await getVsaList(dsaId);
  const leafData = [];
  for (let index = 0; index < vsaList.length; index++) {
    const vsa = vsaList[index];
    leafData.push(getTaskLeaf(appId, dsaId, vsa, 'VSA', dsaKey + '_vsa_' + index));
  }
  const tsaList = await getTsaList(dsaId);
  for (let index = 0; index < tsaList.length; index++) {
    const tsa = tsaList[index];
    leafData.push(getTaskLeaf(appId, dsaId, tsa, 'TSA', dsaKey + '_tsa_' + index));
  }

  return leafData;
};

const addNewTaskLeaf = (appId, dsaId, taskData, taskType = 'VSA') => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const dsaLeaf = appLeaf.children[1].children.filter((item) => item._id === dsaId)[0];
    if (dsaLeaf) {
      dsaLeaf.children.push(getTaskLeaf(appId, dsaId, taskData, taskType, dsaLeaf.key + '_' + dsaLeaf.children.length));
    }
  }
};

const updateLabelTaskLeaf = (appId, dsaId, vsaId, newName) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const dsaLeaf = appLeaf.children[1].children.filter((item) => item._id === dsaId)[0];
    if (dsaLeaf) {
      const vsaLeaf = dsaLeaf.children.filter((item) => item._id === vsaId)[0];
      if (vsaLeaf) {
        vsaLeaf.label = newName;
      }
    }
  }
};

const getTaskLeaf = (appId, dsaId, data, taskType = 'VSA', key = '') => {
  return {
    key: 'task_' + key,
    label: data.name,
    _id: data._id,
    appId: appId,
    dsaId: dsaId,
    type: taskType,
  };
};

// controll tree
const expandedKeys = ref({});
const nodeSelected = ref({});
const keySelected = ref({});
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
  isLoadingContainer.value = true;
  if (node.type === 'Application') {
    await getAppData(node._id);
  }
  if (node.type === 'Monitor') {
    await getMonitorData(node._id);
  }
  if (node.type === 'DSA') {
    await getDsaData(node._id);
  }
  if (node.type === 'VSA') {
    await getVsaData(node._id);
  }
  if (node.type === 'TSA') {
    await getTsaData(node._id);
  }
  isLoadingContainer.value = false;
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
  startTimestamp: 0,
});
const newAppData = ref({
  name: '',
  active: true,
  startTimestamp: new Date(),
});

const getAppData = async (appId) => {
  try {
    const res = await ApiApplication.getAppData(appId);
    res.data.startTimestamp = new Date(res.data.startTimestamp);
    appData.value = res.data;
  } catch (error) {
    console.log('getAppData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createApplication = async () => {
  try {
    const dataLoad = {
      name: newAppData.value.name,
      active: newAppData.value.active,
      startTimestamp: newAppData.value.startTimestamp.getTime(),
    };
    const res = await ApiApplication.createApp(projectVersionId.value, dataLoad);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createApplicationVisibleDialog.value = false;
    treeData.value[0].children.push(await getAppLeaf(res.data, treeData.value[0].children.length));
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateApplication = async () => {
  try {
    const res = await ApiApplication.updateAppData(appData.value._id, {
      name: appData.value.name,
      active: appData.value.active,
      startTimestamp: appData.value.startTimestamp.getTime(),
    });
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    treeData.value[0].children[nodeSelected.value.key].label = res.data.name;
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
    await ApiApplication.delAppData(appIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    await getTreeData();
  } catch (error) {
    console.log('deleteApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- App Menu
const appIdclick = ref();
const appContextMenuRef = ref();
const onApplicationRightClick = (event, appId) => {
  appIdclick.value = appId;
  appContextMenuRef.value.show(event);
};

const appContextMenu = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: (event) => {
      confirmDeleteApp(event);
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
  listScadaMonitorId: [],
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
    await ApiMonitor.delMonitor(monitorIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- Monitor Menu

const monitorGroupContextMenuRef = ref();
const onMonitorGroupRightClick = (event, node) => {
  appIdclick.value = node.appId;
  monitorGroupContextMenuRef.value.show(event);
};

const monitorGroupContextMenu = computed(() => [
  {
    label: 'Create Monitor',
    icon: 'pi pi-plus',
    command: () => {
      createMonitorVisibleDialog.value = true;
    },
  },
]);

const monitorIdclick = ref();
const monitorContextMenuRef = ref();
const onMonitorRightClick = (event, node) => {
  monitorIdclick.value = node._id;
  appIdclick.value = node.appId;
  monitorContextMenuRef.value.show(event);
};

const monitorContextMenu = computed(() => [
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    disabled: !monitorIdclick.value,
    command: (event) => {
      confirmDeleteMonitor(event);
    },
  },
]);

// ------- DSA Menu
const dsaGroupContextMenuRef = ref();
const onDsaGroupRightClick = (event, node) => {
  appIdclick.value = node.appId;
  dsaGroupContextMenuRef.value.show(event);
};

const dsaGroupContextMenu = computed(() => [
  {
    label: 'Create DSA Module',
    icon: 'pi pi-plus',
    command: () => {
      createDsaVisibleDialog.value = true;
    },
  },
]);

const dsaIdclick = ref();
const dsaContextMenuRef = ref();
const onDsaRightClick = (event, node) => {
  dsaIdclick.value = node._id;
  appIdclick.value = node.appId;
  dsaContextMenuRef.value.show(event);
};

const createTaskDsaDialog = ref(false);

const dsaContextMenu = computed(() => [
  {
    label: 'Create Task',
    icon: 'pi pi-plus',
    disabled: !dsaIdclick.value,
    command: () => {
      createTaskDsaDialog.value = true;
    },
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    disabled: !dsaIdclick.value,
    command: (event) => {
      confirmDeleteDsa(event);
    },
  },
]);

const vsaIdclick = ref();
const vsaContextMenuRef = ref();
const onVsaRightClick = (event, node) => {
  vsaIdclick.value = node._id;
  vsaContextMenuRef.value.show(event);
};

const vsaContextMenu = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: (event) => {
      confirmDeleteVsa(event);
    },
  },
]);

const tsaIdclick = ref();
const tsaContextMenuRef = ref();
const onTsaRightClick = (event, node) => {
  tsaIdclick.value = node._id;
  tsaContextMenuRef.value.show(event);
};

const tsaContextMenu = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: (event) => {
      confirmDeleteTsa(event);
    },
  },
]);
// ------- DSA

const createDsaVisibleDialog = ref(false);
const dsaData = ref();
const newDsaData = ref({
  name: '',
  active: true,
});

const getDsaList = async (appId) => {
  try {
    const res = await ApiDsa.getList(projectVersionId.value, appId);
    return res.data;
  } catch (error) {
    console.log('getDsaList: error ', error);
    return [];
  }
};

const getDsaData = async (dsaId) => {
  try {
    const res = await ApiDsa.getDsa(dsaId);
    dsaData.value = res.data;
  } catch (error) {
    console.log('getDsaData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createDsa = async () => {
  try {
    const res = await ApiDsa.createDsa(projectVersionId.value, appIdclick.value, newDsaData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createDsaVisibleDialog.value = false;
    await addNewDsaLeaf(appIdclick.value, res.data);
  } catch (error) {
    console.log('createDsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateDsa = async () => {
  try {
    const res = await ApiDsa.updateDsa(dsaData.value._id, dsaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelDsaLeaf(nodeSelected.value.appId, dsaData.value._id, res.data.name);
  } catch (error) {
    console.log('updateDsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteDsa = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Dsa',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delDsa();
    },
  });
};
const delDsa = async () => {
  try {
    await ApiDsa.delDsa(dsaIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delDsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const newTaskData = ref({
  name: '',
  active: true,
  type: 'VSA',
});
const typeDsaOpts = ref([
  { label: 'VSA', value: 'VSA' },
  { label: 'TSA', value: 'TSA' },
]);
const handlecreateTask = async () => {
  if (newTaskData.value.type === 'VSA') {
    newVsaData.value.name = newTaskData.value.name;
    newVsaData.value.active = newTaskData.value.active;
    await createVsa();
  }
  if (newTaskData.value.type === 'TSA') {
    newTsaData.value.name = newTaskData.value.name;
    newTsaData.value.active = newTaskData.value.active;
    await createTsa();
  }
};

// ---DSA - VSA

const vsaData = ref();
const newVsaData = ref({
  name: 'string',
  active: true,
  maxChange: 0,
  stepChange: 0,
  sourceId: '5eb7cf5a86d9755df3a6c593',
  sinkId: '5eb7cf5a86d9755df3a6c593',

  monitor: {
    monitorSubSystemId: '5eb7cf5a86d9755df3a6c593',
    signalP: true,
    signalQ: true,
    signalV: true,
    active: true,
  },
  contingencyId: '5eb7cf5a86d9755df3a6c593',
  remedialActionId: '5eb7cf5a86d9755df3a6c593',
  digsilentSettingId: '5eb7cf5a86d9755df3a6c593',
  fixSubSystemId: '5eb7cf5a86d9755df3a6c593',
});

const getVsaList = async (dsaId) => {
  try {
    const res = await ApiDsa.getVsaList(projectVersionId.value, dsaId);
    return res.data;
  } catch (error) {
    console.log('getVsaList: error ', error);
    return [];
  }
};

const getVsaData = async (vsaId) => {
  try {
    const res = await ApiDsa.getVsa(vsaId);
    vsaData.value = res.data;
  } catch (error) {
    console.log('getVsaData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createVsa = async () => {
  try {
    const res = await ApiDsa.createVsa(projectVersionId.value, dsaIdclick.value, newVsaData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    addNewTaskLeaf(appIdclick.value, dsaIdclick.value, res.data, 'VSA');
    createTaskDsaDialog.value = false;
  } catch (error) {
    console.log('createVsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateVsa = async () => {
  try {
    const res = await ApiDsa.updateVsa(vsaData.value._id, vsaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelTaskLeaf(nodeSelected.value.appId, nodeSelected.value.dsaId, nodeSelected.value._id, res.data.name);
  } catch (error) {
    console.log('updateVsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteVsa = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Vsa',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delVsa();
    },
  });
};
const delVsa = async () => {
  try {
    await ApiDsa.delVsa(vsaIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delVsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ---DSA - Tsa

const tsaData = ref();
const newTsaData = ref({
  name: 'string',
  sourceId: '5eb7cf5a86d9755df3a6c593',
  sinkId: '5eb7cf5a86d9755df3a6c593',
  maxChange: 0,
  stepChange: 0,
  monitor: {
    monitorSubSystemId: '5eb7cf5a86d9755df3a6c593',
    busConfig: {
      voltage: 0,
      freq: 0,
      angle: 0,
      active: true,
    },
    branchConfig: {
      activePower: 0,
      reActivePower: 0,
      active: true,
    },
    genConfig: {
      rotorAngle: 0,
      electP: 0,
      electQ: 0,
      mechP: 0,
      efd: 0,
      active: true,
    },
    active: true,
  },
  disturbanceId: '5eb7cf5a86d9755df3a6c593',
  remedialActionId: '5eb7cf5a86d9755df3a6c593',
  digsilentSettingId: '5eb7cf5a86d9755df3a6c593',
  fixSubSystemId: '5eb7cf5a86d9755df3a6c593',
  active: true,
});

const getTsaList = async (dsaId) => {
  try {
    const res = await ApiDsa.getTsaList(projectVersionId.value, dsaId);
    return res.data;
  } catch (error) {
    console.log('getTsaList: error ', error);
    return [];
  }
};

const getTsaData = async (tsaId) => {
  try {
    const res = await ApiDsa.getTsa(tsaId);
    tsaData.value = res.data;
  } catch (error) {
    console.log('getTsaData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createTsa = async () => {
  try {
    const res = await ApiDsa.createTsa(projectVersionId.value, dsaIdclick.value, newTsaData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    addNewTaskLeaf(appIdclick.value, dsaIdclick.value, res.data, 'TSA');
    createTaskDsaDialog.value = false;
  } catch (error) {
    console.log('createTsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateTsa = async () => {
  try {
    const res = await ApiDsa.updateTsa(tsaData.value._id, tsaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelTaskLeaf(nodeSelected.value.appId, nodeSelected.value.dsaId, nodeSelected.value._id, res.data.name);
  } catch (error) {
    console.log('updateTsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteTsa = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Tsa',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delTsa();
    },
  });
};
const delTsa = async () => {
  try {
    await ApiDsa.delTsa(tsaIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delTsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style>
.p-treenode-label {
  width: 100%;
}
</style>

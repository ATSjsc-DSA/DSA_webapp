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
            <div style="height: 48rem" aria-haspopup="true">
              <Tree
                v-model:expandedKeys="expandedKeys"
                selectionMode="single"
                :value="treeData"
                class="w-full"
                @node-select="onNodeSelect"
              >
                <template #default="slotProps">
                  <div>
                    {{ slotProps.node.label }}
                  </div>
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
                    @contextmenu="onMonitorGroupRightClick($event, slotProps.node.appId)"
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

                <template #Scada="slotProps">
                  <div aria-haspopup="true" @contextmenu="onScadaRightClick($event, slotProps.node)">
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="scadaContextMenuRef" :model="scadaContextMenu" />
                </template>

                <template #PMU="slotProps">
                  <div aria-haspopup="true" @contextmenu="onPmuRightClick($event, slotProps.node)">
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="pmuContextMenuRef" :model="pmuContextMenu" />
                </template>

                <!-- --- DSA --- -->
                <template #DSAGroup="slotProps">
                  <div
                    class="font-semibold"
                    aria-haspopup="true"
                    @contextmenu="onDsaGroupRightClick($event, slotProps.node.appId)"
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
                    {{ slotProps.node.label }}
                  </div>
                  <ContextMenu ref="vsaContextMenuRef" :model="vsaContextMenu" />
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
            <ScrollPanel class="card" style="width: 100%; height: 50rem">
              <template v-if="nodeSelected.type === 'Application' && appData !== undefined">
                <applicationFormWidget v-model="appData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateApplication"></Button>
                </div>
              </template>

              <template v-if="nodeSelected.type === 'Monitor' && monitorData !== undefined">
                <monitorFormWidget v-model="monitorData" :is-create-form="false" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateMonitor"></Button>
                </div>
              </template>

              <template v-if="nodeSelected.type === 'Scada' && scadaData !== undefined">
                <monitorScadaFormWidget v-model="scadaData" :is-create-form="false" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateScada"></Button>
                </div>
              </template>

              <template v-if="nodeSelected.type === 'PMU' && pmuData !== undefined">
                <monitorPmuFormWidget v-model="pmuData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updatePmu"></Button>
                </div>
              </template>

              <template v-if="nodeSelected.type === 'DSA' && dsaData !== undefined">
                <dsaFormWidget v-model="dsaData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateDsa"></Button>
                </div>
              </template>
              <template v-if="nodeSelected.type === 'VSA' && vsaData !== undefined">
                <DsaVsaFormWidget v-model="vsaData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateVsa"></Button>
                </div>
              </template>
            </ScrollPanel>
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

  <Dialog v-model:visible="createScadaVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor Scada Configuration</span>
      </div>
    </template>

    <monitorScadaFormWidget v-model="newScadaData" :project-version-id="projectVersionId" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createScadaVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newScadaData.name" @click="createScada"></Button>
    </template>
  </Dialog>

  <Dialog v-model:visible="createPmuVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor PMU Configuration</span>
      </div>
    </template>

    <monitorPmuFormWidget v-model="newPmuData" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createPmuVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newPmuData.name" @click="createPmu"></Button>
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

  <Dialog v-model:visible="createVsaVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new VSA Information</span>
      </div>
    </template>
    <DsaVsaFormWidget v-model="newVsaData" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVsaVisibleDialog = false"></Button>
      <Button type="button" label="Submit" :disabled="!newVsaData.name" @click="createVsa"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import ContextMenu from 'primevue/contextmenu';

import AppProgressSpinner from '@/components/AppProgressSpinner .vue';

import applicationFormWidget from './formWidget/applicationFormWidget.vue';
import monitorFormWidget from './formWidget/monitorFormWidget.vue';
import monitorScadaFormWidget from './formWidget/monitorScadaFormWidget.vue';
import monitorPmuFormWidget from './formWidget/monitorPmuFormWidget.vue';

import dsaFormWidget from './formWidget/dsaFormWidget.vue';
import { ApiApplication, ApiMonitor, ApiDsa } from '@/views/UserConfigurationView/api';
import DsaVsaFormWidget from './formWidget/dsaVsaFormWidget.vue';

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
  const tree = [
    {
      key: 'root',
      label: 'Project',
      type: 'Project',
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
    children: [
      {
        key: 'monitor_' + key,
        label: 'Monitor',
        type: 'MonitorGroup',
        appId: app._id,
        children: await getMonitorBranch(app._id, key),
      },
      {
        key: 'dsa_' + key,
        label: 'DSA Module',
        appId: app._id,
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
    leafData.push(await getMonitorLeaf(appId, monitor, appKey + '_' + index));
  }
  return leafData;
};

const addNewMonitorLeaf = async (appId, monitor) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    appLeaf.children[0].children.push(
      await getMonitorLeaf(appId, monitor, appLeaf.key + '_' + appLeaf.children[0].length),
    );
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

const getMonitorLeaf = async (appId, monitor, key = '') => {
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
        type: 'Group',
        children: await getScadaBranch(appId, monitor._id, key),
      },
      {
        key: 'pml_' + key,
        label: 'PMU',
        type: 'Group',
        children: await getPmuBranch(appId, monitor._id, key),
      },
    ],
  };
};
const getScadaBranch = async (appId, monitorId, monitorKey = '') => {
  const scadaList = await getScadaList(monitorId);
  const leafData = [];
  for (let index = 0; index < scadaList.length; index++) {
    const scada = scadaList[index];
    leafData.push(getScadaLeaf(appId, monitorId, scada, monitorKey + '_' + index));
  }
  return leafData;
};

const addNewScadaLeaf = (appId, monitorId, scada) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorId)[0];
    if (monitorLeaf) {
      monitorLeaf.children[0].children.push(
        getScadaLeaf(appId, monitorId, scada, monitorLeaf.key + '_' + monitorLeaf.children[0].length),
      );
    }
  }
};

const updateLabelScadaLeaf = (appId, monitorId, scadaId, newName) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorId)[0];
    if (monitorLeaf) {
      const scadaLeaf = monitorLeaf.children[0].children.filter((item) => item._id === scadaId)[0];
      if (scadaLeaf) {
        scadaLeaf.label = newName;
      }
    }
  }
};

const getScadaLeaf = (appId, monitorId, scada, key = '') => {
  return {
    key: key,
    label: scada.name,
    _id: scada._id,
    appId: appId,
    monitorId: monitorId,
    type: 'Scada',
  };
};

const getPmuBranch = async (appId, monitorId, monitorKey = '') => {
  const pmuList = await getPmuList(monitorId);
  const leafData = [];
  for (let index = 0; index < pmuList.length; index++) {
    const pmu = pmuList[index];
    leafData.push(getPmuLeaf(appId, monitorId, pmu, monitorKey + '_' + index));
  }
  return leafData;
};

const addNewPmuLeaf = (appId, monitorId, pmu) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorId)[0];
    if (monitorLeaf) {
      monitorLeaf.children[1].children.push(
        getPmuLeaf(appId, monitorId, pmu, monitorLeaf.key + '_' + monitorLeaf.children[1].length),
      );
    }
  }
};

const updateLabelPmuLeaf = (appId, monitorId, pmuId, newName) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const monitorLeaf = appLeaf.children[0].children.filter((item) => item._id === monitorId)[0];
    if (monitorLeaf) {
      const scadaLeaf = monitorLeaf.children[1].children.filter((item) => item._id === pmuId)[0];
      if (scadaLeaf) {
        scadaLeaf.label = newName;
      }
    }
  }
};

const getPmuLeaf = (appId, monitorId, pmu, key = '') => {
  return {
    key: key,
    label: pmu.name,
    _id: pmu._id,
    appId: appId,
    monitorId: monitorId,
    type: 'PMU',
  };
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
    key: key,
    label: dsa.name,
    _id: dsa._id,
    appId: appId,
    type: 'DSA',
    children: await getVsaBranch(appId, dsa._id, key),
  };
};

const getVsaBranch = async (appId, dsaId, dsaKey = '') => {
  const vsaList = await getVsaList(dsaId);
  const leafData = [];
  for (let index = 0; index < vsaList.length; index++) {
    const vsa = vsaList[index];
    leafData.push(getVsaLeaf(appId, dsaId, vsa, dsaKey + '_' + index));
  }
  return leafData;
};

const addNewVsaLeaf = (appId, dsaId, vsa) => {
  const appLeaf = treeData.value[0].children.filter((item) => item._id === appId)[0];
  if (appLeaf) {
    const dsaLeaf = appLeaf.children[1].children.filter((item) => item._id === dsaId)[0];
    if (dsaLeaf) {
      dsaLeaf.children.push(getVsaLeaf(appId, dsaId, vsa, dsaLeaf.key + '_' + dsaLeaf.children.length));
    }
  }
};

const updateLabelVsaLeaf = (appId, dsaId, vsaId, newName) => {
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

const getVsaLeaf = (appId, dsaId, vsa, key = '') => {
  return {
    key: key,
    label: vsa.name,
    _id: vsa._id,
    appId: appId,
    dsaId: dsaId,
    type: 'VSA',
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
  if (node.type === 'Scada') {
    await getScadaData(node._id);
  }
  if (node.type === 'PMU') {
    await getPmuData(node._id);
  }
  if (node.type === 'DSA') {
    await getDsaData(node._id);
  }
  if (node.type === 'VSA') {
    await getVsaData(node._id);
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
    treeData.value[0].children.push(await getAppLeaf(res.data, treeData.value[0].children.length));
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
    await addNewMonitorLeaf(appIdclick.value, res.data);
  } catch (error) {
    console.log('createMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateMonitor = async () => {
  try {
    const res = await ApiMonitor.updateMonitor(monitorData.value._id, monitorData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelMonitorLeaf(nodeSelected.value.appId, monitorData.value._id, res.data.name);
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

const monitorGroupIdclick = ref();
const monitorGroupContextMenuRef = ref();
const onMonitorGroupRightClick = (event, node) => {
  monitorGroupIdclick.value = node._id;
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

const scadaIdClick = ref();
const scadaContextMenuRef = ref();
const onScadaRightClick = (event, node) => {
  scadaIdClick.value = node._id;
  scadaContextMenuRef.value.show(event);
};

const scadaContextMenu = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: (event) => {
      confirmDeleteScada(event);
    },
  },
]);

const pmuIdclick = ref();
const pmuContextMenuRef = ref();
const onPmuRightClick = (event, node) => {
  pmuIdclick.value = node._id;
  pmuContextMenuRef.value.show(event);
};

const pmuContextMenu = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: (event) => {
      confirmDeletePmu(event);
    },
  },
]);

// ------- Monitor - Scada

const createScadaVisibleDialog = ref(false);
const scadaData = ref();
const newScadaData = ref({
  active: true,
  kFactorCur: 0,
  kFactorPower: 0,
  monitorScadaId: '',
  name: '',
});

const getScadaList = async (monitorId) => {
  try {
    const res = await ApiMonitor.getScadaList(projectVersionId.value, monitorId);
    return res.data;
  } catch (error) {
    console.log('getScadaList: error ', error);
    return [];
  }
};

const getScadaData = async (scadaId) => {
  try {
    const res = await ApiMonitor.getMonitorScada(scadaId);
    scadaData.value = res.data;
  } catch (error) {
    console.log('getScadaData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createScada = async () => {
  try {
    const res = await ApiMonitor.createMonitorScada(projectVersionId.value, monitorIdclick.value, newScadaData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    addNewScadaLeaf(appIdclick.value, monitorIdclick.value, res.data);
    createScadaVisibleDialog.value = false;
  } catch (error) {
    console.log('createScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateScada = async () => {
  try {
    const res = await ApiMonitor.updateMonitorScada(scadaData.value._id, scadaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelScadaLeaf(nodeSelected.value.appId, nodeSelected.value.monitorId, nodeSelected.value._id, res.data.name);
  } catch (error) {
    console.log('updateScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteScada = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Scada',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delScada();
    },
  });
};
const delScada = async () => {
  try {
    await ApiMonitor.delMonitorScada(scadaIdClick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- Monitor - PMU

const createPmuVisibleDialog = ref(false);
const pmuData = ref();
const newPmuData = ref({
  active: true,
  current: {
    anglePhaseA: '',
    anglePhaseB: '',
    anglePhaseC: '',
    phaseA: '',
    phaseB: '',
    phaseC: '',
    kFactorCur: 1,
  },
  pmuIp: '',
  name: '',
  power: {
    activePower: '',
    kFactorPower: 1,
    reactivePower: '',
  },
  voltage: {
    anglePhaseA: '',
    anglePhaseB: '',
    anglePhaseC: '',
    phaseA: '',
    phaseB: '',
    phaseC: '',
  },
});

const getPmuList = async (monitorId) => {
  try {
    const res = await ApiMonitor.getPmuList(projectVersionId.value, monitorId);
    return res.data;
  } catch (error) {
    console.log('getPmuList: error ', error);
    return [];
  }
};

const getPmuData = async (pmuId) => {
  try {
    const res = await ApiMonitor.getMonitorPmu(pmuId);
    pmuData.value = res.data;
  } catch (error) {
    console.log('getPmuData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createPmu = async () => {
  try {
    const res = await ApiMonitor.createMonitorPmu(projectVersionId.value, monitorIdclick.value, newPmuData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    addNewPmuLeaf(appIdclick.value, monitorIdclick.value, res.data);
    createPmuVisibleDialog.value = false;
  } catch (error) {
    console.log('createPmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updatePmu = async () => {
  try {
    const res = await ApiMonitor.updateMonitorPmu(pmuData.value._id, pmuData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelPmuLeaf(nodeSelected.value.appId, nodeSelected.value.monitorId, nodeSelected.value._id, res.data.name);
  } catch (error) {
    console.log('updatePmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeletePmu = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Pmu',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delPmu();
    },
  });
};
const delPmu = async () => {
  try {
    await ApiMonitor.delMonitorPmu(pmuIdclick.value);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    nodeSelected.value = {};
    await getTreeData();
  } catch (error) {
    console.log('delPmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- DSA Menu
const dsaGroupIdclick = ref();
const dsaGroupContextMenuRef = ref();
const onDsaGroupRightClick = (event, node) => {
  dsaGroupIdclick.value = node._id;
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

const dsaContextMenu = computed(() => [
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
// ---DSA - VSA

const createVsaVisibleDialog = ref(false);
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
    addNewVsaLeaf(appIdclick.value, dsaIdclick.value, res.data);
    createVsaVisibleDialog.value = false;
  } catch (error) {
    console.log('createVsa: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateVsa = async () => {
  try {
    const res = await ApiDsa.updateVsa(vsaData.value._id, vsaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updateLabelVsaLeaf(nodeSelected.value.appId, nodeSelected.value.dsaId, nodeSelected.value._id, res.data.name);
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
</script>

<style>
.p-treenode-label {
  width: 100%;
}
</style>

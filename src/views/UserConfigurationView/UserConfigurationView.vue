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
            <div style="height: 48rem" aria-haspopup="true" @contextmenu="onProjectClick">
              <Tree
                v-model:expandedKeys="expandedKeys"
                selectionMode="single"
                :value="treeData"
                class="w-full"
                @node-select="onNodeSelect"
              ></Tree>
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
              <div>Configuration</div>
            </div>
          </template>
          <template #content>
            <div class="card" style="height: 50rem" aria-haspopup="true">
              <template v-if="nodeSelected.type === 'Application'">
                <appDataFormWidget v-model="appData" />
                <div class="flex justify-content-end gap-3">
                  <Button type="button" label="Update" @click="updateApplication"></Button>
                  <Button type="button" severity="danger" label="Delete" @click="confirmDeleteApp"></Button>
                </div>
              </template>

              <!-- <div style="background-color: aquamarine">
                nodeSelected
                <pre>
              {{ nodeSelected }}
             </pre
                >
                <hr />
                appDatas
                <pre>
                {{ appData }}
              </pre
                >
              </div> -->
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

    <appDataFormWidget v-model="newAppData" />

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

import appDataFormWidget from './appDataFormWidget.vue';

import { ApiApplication } from '@/views/UserConfigurationView/api';
import { update } from 'lodash';

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
    tree.push(getAppLeaf(app, appIndex));
  }
  treeData.value = tree;
};

const getAppLeaf = (app, key = '') => {
  return {
    key: key,
    label: app.name,
    _id: app._id,
    type: 'Application',
    children: [
      {
        key: 'monitor_' + key,
        label: 'Monitor',
      },
      {
        key: 'dsa_' + key,
        label: 'DSA Module',
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
};

// --------- Application

const projectContextMenuRef = ref();
const onProjectClick = (event) => {
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
const appData = reactive({
  name: '',
  active: true,
  _id: '',
});
const newAppData = reactive({
  name: '',
  active: true,
});

const getAppData = async (appId) => {
  try {
    const res = await ApiApplication.getAppData(appId);
    appData.name = res.data.name;
    appData.active = res.data.active;
    appData._id = res.data._id;
  } catch (error) {
    console.log('getAppData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createApplication = async () => {
  try {
    const res = await ApiApplication.createApp(projectVersionId.value, newAppData);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createApplicationVisibleDialog.value = false;
    treeData.value = [...treeData.value, getAppLeaf(res.data, treeData.value.length)];
  } catch (error) {
    console.log('createApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateApplication = async () => {
  try {
    const res = await ApiApplication.updateAppData(appData._id, {
      name: appData.name,
      active: appData.active,
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
    header: 'Delete',
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
    await ApiApplication.delAppData(appData._id);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    treeData.value = treeData.value.filter((item) => item._id !== appData._id);
  } catch (error) {
    console.log('deleteApplication: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

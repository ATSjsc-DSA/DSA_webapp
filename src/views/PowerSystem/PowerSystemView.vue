<template>
  <div class="card layout-content min-h-full">
    <Toast />
    <AppProgressSpinner :showSpinner="isLoadingProgress"></AppProgressSpinner>

    <TabView @tab-change="onTabMenuTopChange">
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-table" />
            <span class="font-bold white-space-nowrap">Power System</span>
          </div>
        </template>
        <Splitter style="height: 76vh">
          <SplitterPanel :size="25" :minSize="10" style="overflow-y: auto">
            <Card class="h-full">
              <template #title>
                <div class="flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>{{ showDefinitionList ? 'Flat List' : 'Hierarchical List' }}</div>
                  <div>
                    <Button
                      :icon="showDefinitionList ? 'pi pi-sitemap' : 'pi pi-align-left'"
                      severity="secondary"
                      aria-label="show List PSD As Tree"
                      :title="showDefinitionList ? 'Show as menu' : 'Show as list'"
                      @click="showDefinitionList = !showDefinitionList"
                    />
                  </div>
                </div>
              </template>
              <template #content>
                <template v-if="showDefinitionList">
                  <DataView :value="definitionList" class="w-full">
                    <template #list="slotProps">
                      <div class="grid grid-nogutter">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                          <div
                            class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-3"
                            :class="{
                              'border-top-1 surface-border': index !== 0,
                              'selected-item': definitionId === item._id,
                            }"
                            @click="handleRowClick(item._id)"
                          >
                            <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2">
                              <i class="pi pi-code text-cyan-300"></i>{{ item.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </DataView>
                </template>
                <template v-else>
                  <Tree
                    v-model:selectionKeys="nodeSelected"
                    :value="treePs"
                    loadingMode="icon"
                    class="w-full md:w-[30rem]"
                    selectionMode="single"
                    @node-expand="onNodeExpand"
                    @node-select="onNodeSelect"
                  />
                </template>
              </template>
            </Card>
          </SplitterPanel>
          <SplitterPanel :size="75" style="overflow-y: auto" class="relative">
            <div>
              <div class="m-3 flex gap-2 justify-content-between">
                <div class="flex gap-2 justify-content-start">
                  <div class="flex gap-2 justify-content-start">
                    <Button label="General" class="" :text="tabMenuPSActive !== 0" @click="tabMenuPSActive = 0" />
                    <Button label="Engine" class="" :text="tabMenuPSActive !== 1" @click="tabMenuPSActive = 1" />
                    <Button label="Scada" class="" :text="tabMenuPSActive !== 2" @click="tabMenuPSActive = 2" />
                  </div>
                </div>
                <div>
                  <Button severity="secondary" text icon="pi pi-download" label="Download" disabled />
                  <Button severity="info" text icon="pi pi-upload" label="Upload" disabled />
                  <Button
                    text
                    icon="pi pi-plus"
                    label="Create"
                    :disabled="!showDefinitionList"
                    @click="handleCreatePS"
                  />
                </div>
              </div>
              <div>
                <LoadingContainer v-show="isLoadingContainer" style="top: 10%" />
                <TabView id="ps-tab-view" v-model:activeIndex="tabMenuPSActive">
                  <TabPanel header="">
                    <generalTabWidget :data="psData" @editData="editPSE" @deleteData="deletePSE" />
                  </TabPanel>
                  <TabPanel>
                    <engineInfoTabWidget
                      :data="psData"
                      :headerData="definitionHeader"
                      @editData="editPSE"
                      @deleteData="deletePSE"
                    />
                  </TabPanel>
                  <TabPanel>
                    <scadaInfoTabWidget :data="psData" @editData="editPSE" @deleteData="deletePSE" />
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-list" />
            <span class="font-bold white-space-nowrap">Version</span>
          </div>
        </template>
        <versionTabWidget
          :data="versionList"
          :totalRecord="totalRecordVersion"
          @getVersionList="getVersionList"
          @reload-all="loadAllData"
        />
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2 mx-3">
            <i class="pi pi-history" />
            <span class="font-bold white-space-nowrap">Compare</span>
          </div>
        </template>
        <div class="flex align-items-center justify-content-end gap-2 w-full mb-3">
          <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="getComparePSD(true)" />
          <Button
            severity="success"
            icon="pi pi-save"
            label="Create new Version"
            @click="createVersionVisibleDialog = true"
          />
        </div>
        <div style="overflow: auto">
          <compareTabWidget :data="psCompareData" />
        </div>
      </TabPanel>
    </TabView>

    <!-- create new version dialog  -->
    <Dialog v-model:visible="createVersionVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Create new Version</span>
        </div>
      </template>

      <div class="my-3">
        <div class="flex flex-column gap-2 mb-3">
          <label :for="nameVersion" class="font-semibold"> Name Version</label>
          <InputText :id="nameVersion" v-model="nameVersion" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label :for="scheduledOperationTime" class="font-semibold"> Scheduled Operation Time</label>
          <InputNumber
            :id="scheduledOperationTime"
            v-model="scheduledOperationTime"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="createVersionVisibleDialog = false"></Button>
        <Button
          type="button"
          label="Submit"
          :disabled="!nameVersion || !scheduledOperationTime"
          @click="createNewVersion"
        ></Button>
      </template>
    </Dialog>

    <!-- create ps data dialog  -->
    <Dialog v-model:visible="createVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Power Systwem</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">General information.</span>

      <div v-for="(val, name) in psCreate.generalInfo" :key="name" class="flex align-items-center gap-3 mb-3">
        <label :for="name" class="font-semibold w-10rem"> {{ capitalizeFirstLetter(name) }} </label>
        <InputText :id="name" v-model="psCreate.generalInfo[name]" class="flex-auto" autocomplete="off" />
      </div>

      <span class="p-text-secondary block my-5">Scada information.</span>
      <div v-for="(val, name) in psCreate.scadaInfo" :key="name" class="flex align-items-center gap-3 mb-3">
        <label :for="name" class="font-semibold w-10rem"> {{ capitalizeFirstLetter(name) }}</label>
        <InputText :id="name" v-model="psCreate.scadaInfo[name]" class="flex-auto" autocomplete="off" />
      </div>
      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
        <Button type="button" label="Submit" @click="createPS()"></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from './api';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import generalTabWidget from './generalTabWidget.vue';
import engineInfoTabWidget from './engineInfoTabWidget.vue';
import scadaInfoTabWidget from './scadaInfoTabWidget.vue';
import compareTabWidget from './compareTableWidget.vue';
import versionTabWidget from './versionTabWidget.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectId } = storeToRefs(commonStore);

const toast = useToast();
const isLoadingProgress = ref(false);
const isLoadingContainer = ref(false);
onMounted(async () => {
  loadAllData();
});

const tabMenuPSActive = ref(0);

const loadAllData = async () => {
  await getDefinitionList();
  // if (definitionList.value.length > 0) {
  //   await getDefinitionHeader(definitionList.value[0]._id);
  //   if (definitionHeader.value) {
  //     await getDefinitionData();
  //   }
  // }
  treePs.value = await getLeaf(projectId.value);
  tabMenuPSActive.value = 0;
};
// get data
const showDefinitionList = ref(true);
const psData = ref([]);
const isAddNew = ref(false);
const reloadData = async () => {
  if (showDefinitionList.value) {
    await getDefinitionData();
  } else {
    await getPSEditData();
  }
};
watch(showDefinitionList, (newStatus) => {
  if (newStatus === false && isAddNew.value) {
    treePs.value = getLeaf(projectId.value);
  }
});
//  -- list - definition list
const definitionList = ref([]);
const definitionId = ref();
const definitionHeader = ref({});

const getDefinitionList = async () => {
  try {
    const res = await api.getDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const handleRowClick = async (definition) => {
  isLoadingContainer.value = true;
  definitionId.value = definition;
  await getDefinitionHeader();
  await getDefinitionData();
  setTimeout(() => {
    isLoadingContainer.value = false;
  }, 500);
};

const getDefinitionHeader = async () => {
  try {
    const res = await api.getDefinitionHeader(definitionId.value);
    definitionHeader.value = res.data;
  } catch (error) {
    definitionHeader.value = {};
    console.log('getDefinitionHeader: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};
const getDefinitionData = async () => {
  try {
    const res = await api.getDefinitionData(definitionId.value);
    psData.value = res.data;
  } catch (error) {
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Data', detail: error.data.detail, life: 3000 });
  }
};
//  tree - powersystem edit
const treePs = ref();
const nodeSelected = ref();
const parentNodeSelected = ref(projectId.value);
const pseId = ref();

const onNodeExpand = async (node) => {
  if (!node.children) {
    node.loading = true;
    node.children = await getLeaf(node.key);
    if (node.children.length == 0) {
      node.leaf = true;
    }
    node.loading = false;
  }
  if (!node.leaf) {
    for (let childInd = 0; childInd < node.children.length; childInd++) {
      const grandchildrenData = await getLeaf(node.children[childInd].key);
      if (grandchildrenData.length > 0) {
        node.children[childInd].children = grandchildrenData;
      } else {
        node.children[childInd].leaf = true;
      }
    }
  }
};

const getLeaf = async (parentId) => {
  try {
    const childData = await api.getChildOnPSEdit(parentId);
    const data = [];
    for (let index = 0; index < childData.data.length; index++) {
      data.push({
        key: childData.data[index]._id,
        label: childData.data[index].name,
        parentId: parentId,
        leaf: false,
        loading: false,
      });
    }
    return data;
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    toast.add({ severity: 'error', summary: 'Child On Power System Edit', detail: error.data.detail, life: 3000 });
  }
};
const onNodeSelect = (node) => {
  if (node.key != pseId.value) {
    isLoadingContainer.value = true;

    pseId.value = node.key;
    parentNodeSelected.value = node.parentId;
    getPSEditData(true);
    setTimeout(() => {
      isLoadingContainer.value = false;
    }, 500);
  }
};
const getPSEditData = async (getHeader = false) => {
  try {
    const res = await api.getPSEditData(pseId.value);
    psData.value = [res.data];
    if (getHeader && res.data) {
      definitionId.value = res.data.engineInfo.powerSystemDefinitionId;
      await getDefinitionHeader();
    }
  } catch (error) {
    console.log('getPSEditData: error ', error);
    // toast.add({ severity: 'error', summary: 'Power System Edit', detail: error.data.detail, life: 3000 });
  }
};
// --- compare

const psCompareData = ref({});
const onTabMenuTopChange = (event) => {
  if (event.index === 1) {
    getVersionList();
  }
  if (event.index === 2) {
    getComparePSD();
  }
};
const getComparePSD = async (reloadMsg = false) => {
  try {
    const res = await api.getComparePSD();
    psCompareData.value = res.data;
    if (reloadMsg) {
      isLoadingProgress.value = true;
      toast.add({ severity: 'success', summary: 'History', detail: 'Reload Successfully', life: 3000 });
    }
  } catch (error) {
    psCompareData.value = {};
    toast.add({ severity: 'error', summary: 'Compare Power System', detail: error.data.detail, life: 3000 });
  }
  setTimeout(() => {
    isLoadingProgress.value = false;
  }, 500);
};

const createVersionVisibleDialog = ref(false);
const nameVersion = ref('');
const scheduledOperationTime = ref();
const createNewVersion = async () => {
  try {
    await api.createNewVersion(nameVersion.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    getComparePSD();
    createVersionVisibleDialog.value = false;
  } catch (error) {
    console.log('createPS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// create ps data
const createVisibleDialog = ref(false);

const psCreate = ref();

const handleCreatePS = () => {
  psCreate.value = {
    _id: '',
    generalInfo: {
      name: '',
      parrentId: showDefinitionList.value ? definitionHeader.value.parrentId : parentNodeSelected.value,
      uniqueId: '',
      emsName: '',
      emsUniqueId: '',
      operationName: '',
      operationUniqueId: '',
      softwareName: '',
      softwareUniqueId: '',
    },
    engineInfo: {
      powerSystemDefinitionId: showDefinitionList.value ? definitionId.value : '',
      values: [''],
    },
    scadaInfo: {
      skey: '',
      scadaName: '',
      scadaUniqueId: '',
    },
  };

  createVisibleDialog.value = true;
};
const createPS = async () => {
  try {
    await api.createPS(psCreate.value);
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    reloadData();
  } catch (error) {
    console.log('createPS: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System', detail: error.data.detail, life: 3000 });
  }
};
// Edit
const editPSE = async (pseUpdate) => {
  try {
    await api.editPSE(pseUpdate);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    // reloadData();
  } catch (error) {
    console.log('editPS: error ', error);
    toast.add({ severity: 'error', summary: 'Updated Power System', detail: error.data.detail, life: 3000 });
  }
};

// Delete
const deletePSE = async (pseId) => {
  try {
    await api.deletePSE(pseId);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    reloadData();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Power System', detail: error.data.detail, life: 3000 });
  }
};

function capitalizeFirstLetter(string) {
  return string
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// version
const versionList = ref([]);
const totalRecordVersion = ref(0);

const getVersionList = async (page = 1) => {
  try {
    const res = await api.getVersionList(page);
    versionList.value = res.data[0];
    totalRecordVersion.value = res.data[1];
  } catch (error) {
    versionList.value = [];
    console.log('getVersionList: error ', error);
    toast.add({ severity: 'error', summary: 'Version List', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style>
#ps-tab-view ul.p-tabview-nav {
  display: none !important;
}

.item-data:hover {
  cursor: pointer;
  transform: scale(1.05);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  background-color: var(--surface-hover);
}

.selected-item {
  background-color: var(--highlight-bg) !important;
}
</style>

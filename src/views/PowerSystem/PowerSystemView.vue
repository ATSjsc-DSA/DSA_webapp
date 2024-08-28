<template>
  <Toast />

  <div class="card layout-content h-full">
    <Splitter style="height: 100%">
      <SplitterPanel :size="25" :minSize="10" style="overflow-y: auto">
        <Card class="h-full">
          <template #title>
            <div class="flex flex-wrap justify-content-between align-items-center justify-center gap-2">
              <div>Power System definition</div>
              <div>
                <Button
                  :icon="showListPSDAsTree ? 'pi pi-align-left' : 'pi pi-sitemap'"
                  severity="secondary"
                  aria-label="show List PSD As Tree"
                  :title="showListPSDAsTree ? 'Show as list' : 'Show as menu'"
                  @click="showListPSDAsTree = !showListPSDAsTree"
                />
              </div>
            </div>
          </template>
          <template #content>
            <template v-if="showListPSDAsTree">
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
            <template v-else>
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
                        @click="getDefinitionHeader(item)"
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
          </template>
        </Card>
      </SplitterPanel>
      <SplitterPanel :size="75" style="overflow-y: auto">
        <div class="m-3 flex gap-2 justify-content-between">
          <div class="flex gap-2 justify-content-start">
            <div class="flex gap-2 justify-content-start">
              <Button label="General" class="" :text="tabMenuActive !== 0" @click="tabMenuActive = 0" />
              <Button label="Engine" class="" :text="tabMenuActive !== 1" @click="tabMenuActive = 1" />
              <Button label="Scada" class="" :text="tabMenuActive !== 2" @click="tabMenuActive = 2" />
            </div>
            <div class="pl-3 border-left-1"></div>
            <div class="pl-1 flex gap-2 justify-content-start">
              <Button
                icon="pi pi-history"
                label="Compare"
                class=""
                :outlined="tabMenuActive !== 3"
                @click="tabMenuActive = 3"
              />
              <Button
                icon="pi pi-list"
                label="Version"
                class=""
                :outlined="tabMenuActive !== 4"
                @click="tabMenuActive = 4"
              />
            </div>
          </div>
          <div>
            <Button severity="secondary" text icon="pi pi-download" label="Download" disabled />
            <Button severity="info" text icon="pi pi-upload" label="Upload" disabled />
            <Button text icon="pi pi-plus" label="Create" @click="createVisibleDialog = true" />
          </div>
        </div>

        <TabView v-model:activeIndex="tabMenuActive">
          <TabPanel header="">
            <generalTabWidget
              :data="psData"
              :psdData="definitionHeader"
              @getData="getDefinitionListEdit"
              @editData="editPSE"
              @deleteData="deletePSE"
            />
          </TabPanel>
          <TabPanel>
            <engineInfoTabWidget
              :data="psData"
              :psdData="definitionHeader"
              @getData="getDefinitionListEdit"
              @editData="editPSE"
              @deleteData="deletePSE"
            />
          </TabPanel>
          <TabPanel>
            <scadaInfoTabWidget
              :data="psData"
              :psdData="definitionHeader"
              @getData="getDefinitionListEdit"
              @editData="editPSE"
              @deleteData="deletePSE"
            />
          </TabPanel>
          <TabPanel>
            <compareTabWidget :data="psCompareData" @get-data="getComparePSD" />
          </TabPanel>
          <TabPanel>
            <p class="m-0">Version</p>
          </TabPanel>
        </TabView>
      </SplitterPanel>
    </Splitter>

    <!-- create dialog data -->
    <Dialog v-model:visible="createVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Power Systwem</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">General information.</span>

      <div v-for="(val, name) in psCreate.generalInfo" :key="name" class="flex align-items-center gap-3 mb-3">
        <template v-if="name !== 'parrentId'">
          <label :for="name" class="font-semibold w-12rem"> {{ capitalizeFirstLetter(name) }} </label>
          <InputText :id="name" v-model="psCreate.generalInfo[name]" class="flex-auto" autocomplete="off" />
        </template>
      </div>

      <span class="p-text-secondary block my-5">Scada information.</span>
      <div v-for="(val, name) in psCreate.scadaInfo" :key="name" class="flex align-items-center gap-3 mb-3">
        <label :for="name" class="font-semibold w-12rem"> {{ capitalizeFirstLetter(name) }}</label>
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
import { ref, reactive, onMounted, watch } from 'vue';
import api from './api';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import generalTabWidget from './generalTabWidget.vue';
import engineInfoTabWidget from './engineInfoTabWidget.vue';
import scadaInfoTabWidget from './scadaInfoTabWidget.vue';
import compareTabWidget from './compareTabWidget.vue';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectId } = storeToRefs(commonStore);

const toast = useToast();

onMounted(async () => {
  await getDefinitionList();
  if (definitionList.value.length > 0) {
    await getDefinitionHeader(definitionList.value[0]);
    if (definitionHeader.value) {
      await getDefinitionData();
    }
  }
  treePs.value = await getLeaf(projectId.value);
});

// get data
const showListPSDAsTree = ref(true);
const psData = ref([]);

//  -- list - definition list
const definitionList = ref([]);
const definitionId = ref();
const definitionHeader = ref();

const getDefinitionList = async () => {
  try {
    const res = await api.getDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getDefinitionHeader = async (definition) => {
  definitionId.value = definition._id;
  try {
    const res = await api.getDefinitionHeader(definitionId.value);
    definitionHeader.value = res.data;
  } catch (error) {
    definitionHeader.value = undefined;
    console.log('getDefinitionHeader: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const getDefinitionData = async () => {
  try {
    const res = await api.getDefinitionData(definitionId.value);
    psData.value = res.data;
  } catch (error) {
    console.log('getDefinitionData: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
//  tree - powersystem edit
const treePs = ref();
const nodeSelected = ref();
const pseId = ref();
const onNodeSelect = (node) => {
  if (node.key != pseId.value) {
    pseId.value = node.key;
    getPSEditData();
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
        leaf: false,
        loading: false,
      });
    }
    return data;
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

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

const getPSEditData = async () => {
  try {
    const res = await api.getPSEditData(pseId.value);
    await getDefinitionHeader(res.data.engineInfo.powerSystemDefinitionId);
    psData.value = [res.data];
  } catch (error) {
    console.log('getPSEditData: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
// --- compare
const psCompareData = ref();
const tabMenuActive = ref(0);
watch(tabMenuActive, (newId) => {
  if (newId === 3) {
    // compare tab
    getComparePSD();
  }
});

const getComparePSD = async (reload = false) => {
  try {
    const res = await api.getComparePSD();
    psCompareData.value = res.data;
    if (reload) {
      toast.add({ severity: 'success', summary: 'History', detail: 'Reload Successfully', life: 3000 });
    }
  } catch (error) {
    psCompareData.value = undefined;

    console.log('getComparePSD: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
// create
const createVisibleDialog = ref(false);

const randomString = generateRandomString(10);
const psCreate = reactive({
  _id: '',
  generalInfo: {
    name: randomString,
    parrentId: '',
    uniqueId: randomString,
    emsName: randomString,
    emsUniqueId: randomString,
    operationName: randomString,
    operationUniqueId: randomString,
    softwareName: randomString,
    softwareUniqueId: randomString,
  },
  engineInfo: {
    powerSystemDefinitionId: '',
    values: [''],
  },
  scadaInfo: {
    skey: randomString,
    scadaName: randomString,
    scadaUniqueId: randomString,
  },
});
const createPS = async () => {
  try {
    await api.createPS(psCreate);
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    getDefinitionListEdit();
  } catch (error) {
    console.log('createPS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
// Edit
const editPSE = async (pseUpdate) => {
  try {
    await api.editPSE(pseUpdate);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    getDefinitionListEdit();
  } catch (error) {
    console.log('editPS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Delete
const deletePSE = async (pseId) => {
  try {
    await api.deletePSE(pseId);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    getDefinitionListEdit();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

function capitalizeFirstLetter(string) {
  return string
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}
</script>

<style scoped>
.selected-item {
  background-color: var(--highlight-bg);
}
ul.p-tabview-nav {
  display: none !important;
}
</style>

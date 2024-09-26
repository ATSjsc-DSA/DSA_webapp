<template>
  <div class="card layout-content min-h-full">
    <Toast />
    <AppProgressSpinner :showSpinner="isLoadingProgress"></AppProgressSpinner>
    <div class="flex gap-2 justify-content-between align-items-center">
      <div class="flex gap-2 justify-content-start">
        <Button
          icon="pi pi-table"
          label="Power System"
          text
          :severity="tabMenuOnTopActive === 0 ? 'primary' : 'secondary'"
          @click="tabMenuOnTopActive = 0"
        />
        <Button
          icon="pi pi-list"
          label="Version"
          text
          :severity="tabMenuOnTopActive === 1 ? 'primary' : 'secondary'"
          @click="tabMenuOnTopActive = 1"
        />
        <Button
          icon="pi pi-history"
          label="Compare"
          text
          :severity="tabMenuOnTopActive === 2 ? 'primary' : 'secondary'"
          @click="tabMenuOnTopActive = 2"
        />
      </div>
      <div v-tooltip="'Current Version'" class="p-text-secondary font-semibold px-2">
        {{ capitalizeFirstLetter(editVersionData.name) }}
        <span v-show="isEditingVersion > 0">(Editing)</span>
      </div>
    </div>
    <Divider />

    <TabView id="on-top-tab-view" v-model:activeIndex="tabMenuOnTopActive">
      <!-- tab Power System table  -->

      <TabPanel>
        <Splitter style="height: 53rem">
          <SplitterPanel :size="25" :minSize="10" style="overflow-y: auto">
            <Card style="height: 52.8rem">
              <template #title>
                <div class="flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>{{ showDefinitionFlatList ? 'Flat List' : 'Hierarchical List' }}</div>
                  <div class="flex flex-wrap justify-content-between align-items-center gap-2">
                    <Button
                      :icon="showDefinitionFlatList ? 'pi pi-sitemap' : 'pi pi-align-left'"
                      severity="secondary"
                      aria-label="show List PSD As Tree"
                      :title="showDefinitionFlatList ? 'Show as menu' : 'Show as list'"
                      @click="showDefinitionFlatList = !showDefinitionFlatList"
                    />
                  </div>
                </div>
              </template>
              <template #content>
                <hierarchicalListWidget
                  v-if="!showDefinitionFlatList"
                  :version-id="projectVersionId"
                  :definition-filter="treeDefinitionFilterOpts"
                  @onNodeSelect="onNodeSelect"
                />
                <DataView
                  v-else
                  :value="definitionList"
                  class="w-full"
                  style="height: 46rem; overflow-y: auto; overflow-x: hidden; margin-right: -1rem"
                >
                  <template #list="slotProps">
                    <div class="grid grid-nogutter">
                      <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                        <div
                          class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-3"
                          :class="{
                            'border-top-1 surface-border': index !== 0,
                            'selected-item': definitionSelected._id === item._id,
                          }"
                          @click="handleDefinitionRowClick(item)"
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
            </Card>
          </SplitterPanel>
          <SplitterPanel :size="75" class="relative">
            <Card style="height: 100%">
              <!-- ps table -  header: tab & filter  -->
              <template #title>
                <div class="flex gap-2 justify-content-between align-items-center flex-wrap 2xl:flex-nowrap">
                  <!-- tab -->
                  <div class="flex gap-2 justify-content-start">
                    <div class="flex gap-2 justify-content-start">
                      <template v-for="(tab, index) in tabMenuPSList" :key="tab">
                        <Button
                          v-if="tab !== 'EMS'"
                          :label="tab"
                          class=""
                          :text="tabMenuPSActive !== index"
                          :disabled="tab === 'Dynamic' && !isDefinitionGenerator"
                          @click="tabMenuPSActive = index"
                        />
                        <SplitButton
                          v-else
                          label="EMS"
                          :model="emsFilter"
                          :text="tabMenuPSActive !== index"
                          @click="tabMenuPSActive = index"
                        >
                          <template #item="slotProps">
                            <div
                              class="flex align-items-center p-2"
                              :class="slotProps.item._id === emsFilterSelected._id ? 'font-bold' : ''"
                            >
                              <span>{{ slotProps.item.label }}</span>
                            </div>
                          </template>
                        </SplitButton>
                      </template>
                    </div>
                  </div>

                  <!-- menu import/export -->
                  <div>
                    <Button
                      severity="secondary"
                      type="button"
                      icon="pi pi-ellipsis-v"
                      aria-haspopup="true"
                      aria-controls="config_menu"
                      style="width: 32px"
                      @click="toggleMenuConfig"
                    />
                    <Menu id="menuImportExport" ref="menuImportExport" :model="itemsMenuImportExport" :popup="true">
                      <template #item="{ item }">
                        <Button
                          severity="secondary"
                          text
                          :icon="item.icon"
                          :label="item.label"
                          :disabled="item.disabled"
                        />
                      </template>
                    </Menu>
                  </div>
                </div>
                <!-- filter -->
                <flatListFilterWidget
                  v-if="showflatListFilterWidget"
                  class="pt-6 px-3"
                  :canUseDefinitionFilter="canUseDefinitionFilter"
                  :canUseDefinitionStationFilter="definitionSelected.name !== 'Station'"
                  :definitionList="definitionList"
                  :projectVersionId="projectVersionId"
                  @handleFilter="handleFlatListFilterClick"
                />
              </template>

              <!-- ps table - table data  -->
              <template #content>
                <div class="flex flex-column">
                  <LoadingContainer v-show="isLoadingContainer" />
                  <TabView id="ps-tab-view" v-model:activeIndex="tabMenuPSActive">
                    <!-- ['General', 'Parameter', 'EMS', 'PSSE', 'Scada', 'Dynamic'] -->
                    <TabPanel>
                      <div :style="{ height: showDefinitionFlatList ? '38rem' : '43rem' }">
                        <generalTabWidget
                          :data="psParameterData"
                          :loading="isLoadingPsParameterData"
                          @editData="updatePsParameter"
                          @deleteData="deletePSParameter"
                        />
                      </div>
                      <!-- ps table - Paginator -->
                      <div class="flex justify-content-end align-items-center">
                        <Paginator
                          v-if="psParameterTotal > pageRowNumber"
                          v-model:first="psParameterPaginatorOffset"
                          class="flex-grow-1"
                          :rows="pageRowNumber"
                          :totalRecords="psParameterTotal"
                          :page="psParameterCurrentPage"
                          @page="onPagePsParameterChange"
                        ></Paginator>
                        <div class="mr-3">Total: {{ psParameterTotal }}</div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div :style="{ height: showDefinitionFlatList ? '38rem' : '43rem' }">
                        <engineInfoTabWidget
                          :data="psParameterData"
                          :headerData="parameterDefinitionData"
                          :loading="isLoadingPsParameterData"
                          @editData="updatePsParameter"
                          @deleteData="deletePSParameter"
                        />
                      </div>
                      <!-- ps table - Paginator -->
                      <div class="flex justify-content-end align-items-center">
                        <Paginator
                          v-if="psParameterTotal > pageRowNumber"
                          v-model:first="psParameterPaginatorOffset"
                          class="flex-grow-1"
                          :rows="pageRowNumber"
                          :totalRecords="psParameterTotal"
                          :page="psParameterCurrentPage"
                          @page="onPagePsParameterChange"
                        ></Paginator>
                        <div class="mr-3">Total: {{ psParameterTotal }}</div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div :style="{ height: showDefinitionFlatList ? '38rem' : '43rem' }">
                        <emsTabWidget
                          :emsData="psEmsData"
                          :loading="isLoadingPsEmsData"
                          :headerData="emsDefinitionData"
                        />
                      </div>
                      <!-- ps table - Paginator -->
                      <div class="flex justify-content-between align-items-center">
                        <div class="w-10rem">{{ emsFilterSelected.name.replace('Ems', '') }}</div>

                        <Paginator
                          v-if="psEmsTotal > pageRowNumber"
                          v-model:first="psEmsPaginatorOffset"
                          class="flex-grow-1"
                          :rows="pageRowNumber"
                          :totalRecords="psEmsTotal"
                          :page="psEmsCurrentPage"
                          @page="onPagePsEmsChange"
                        ></Paginator>
                        <div class="mr-3">Total: {{ psEmsTotal }}</div>
                      </div>
                    </TabPanel>
                    <TabPanel> Tôi là PSSE </TabPanel>
                    <TabPanel>
                      <div :style="{ height: showDefinitionFlatList ? '38rem' : '43rem' }">
                        <scadaInfoTabWidget
                          :data="psParameterData"
                          :loading="isLoadingPsParameterData"
                          @editData="updatePsParameter"
                          @deleteData="deletePSParameter"
                        />
                      </div>
                      <!-- ps table - Paginator -->
                      <div class="flex justify-content-end align-items-center">
                        <Paginator
                          v-if="psParameterTotal > pageRowNumber"
                          v-model:first="psParameterPaginatorOffset"
                          class="flex-grow-1"
                          :rows="pageRowNumber"
                          :totalRecords="psParameterTotal"
                          :page="psParameterCurrentPage"
                          @page="onPagePsParameterChange"
                        ></Paginator>
                        <div class="mr-3">Total: {{ psParameterTotal }}</div>
                      </div>
                    </TabPanel>

                    <TabPanel :disabled="!isDefinitionGenerator">
                      <dynamicDefinitionTabWidget
                        v-if="isDefinitionGenerator"
                        :projectVersionId="projectVersionId"
                        :definitionId="definitionSelected._id"
                        :showDefinitionFlatList="showDefinitionFlatList"
                        :nodeSelected="nodeSelected"
                      />
                    </TabPanel>
                  </TabView>
                </div>
              </template>
            </Card>
          </SplitterPanel>
        </Splitter>
      </TabPanel>

      <!-- tab version  -->
      <TabPanel>
        <versionTabWidget
          :data="versionList"
          :totalRecord="totalRecordVersion"
          @getVersionList="getVersionData"
          @reload-all="loadAllData"
        />
      </TabPanel>

      <!-- tab compare -->

      <TabPanel>
        <div class="flex align-items-center justify-content-between gap-2 w-full mb-3">
          <div
            v-if="sampleVersion._id !== editVersionData._id"
            class="flex align-items-center justify-content-start gap-2 w-full mx-2"
          >
            <label class="">Sample Version:</label>
            <Tag severity="secondary" :value="sampleVersion.name" style="font-size: 16px"></Tag>

            <div class="px-3">
              <i class="pi pi-arrow-right" style="font-size: 18px" />
            </div>

            <label class="">Editing Version:</label>
            <Tag severity="primary" :value="editVersionData.name" style="font-size: 16px"></Tag>
          </div>
          <div class="flex align-items-center justify-content-end gap-2 w-full mb-3">
            <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="getComparePSD(true)" />
            <Button
              severity="success"
              icon="pi pi-save"
              label="Create new Version"
              @click="createVersionVisibleDialog = true"
            />
          </div>
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
          <label for="scheduledOperationTime" class="font-semibold"> Scheduled Operation Time</label>
          <Calendar id="scheduledOperationTime" v-model="scheduledOperationTime" showTime hourFormat="24" />
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
        <Button type="button" label="Submit" @click="createPSParameter()"></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted, version } from 'vue';

import * as api from './api';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import SplitButton from 'primevue/splitbutton';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import compareTabWidget from './compareTableWidget.vue';
import versionTabWidget from './versionTabWidget.vue';

import flatListFilterWidget from './flatListFilterWidget.vue';

import generalTabWidget from './parameterTableTabWidget/generalTabWidget.vue';
import scadaInfoTabWidget from './parameterTableTabWidget/scadaInfoTabWidget.vue';
import engineInfoTabWidget from './parameterTableTabWidget/engineInfoTabWidget.vue';

import emsTabWidget from './emsTabWidget.vue';

import dynamicDefinitionTabWidget from './dynamicDefinitionTabWidget.vue';
import hierarchicalListWidget from './hierarchicalListWidget.vue';

import LoadingContainer from '@/components/LoadingContainer.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { projectData, editVersionData } = storeToRefs(commonStore);

const toast = useToast();
const isLoadingProgress = ref(false);
const isLoadingContainer = ref(false);

const projectVersionId = ref('66decf1dcff005199529524b');

onMounted(async () => {
  await loadAllData();

  // this is for test
  // await handleDefinitionRowClick(definitionList.value[0]);
  // tabMenuPSActive.value = 2;

  // end test
});

onUnmounted(() => {});

const tabMenuPSActive = ref(0);
const tabMenuPSList = ref(['General', 'Parameter', 'EMS', 'PSSE', 'Scada', 'Dynamic']);
const showDefinitionFlatList = ref(false);

const loadAllData = async () => {
  await getDefinitionList();
  // await getVersionData();
  // await getComparePSD();
  tabMenuPSActive.value = 0;
  await getEmsfilterOptions();
};

//  -- Flat List - definition list
const definitionList = ref([]);
const definitionSelected = ref({});
const parameterDefinitionData = ref({});
const isDefinitionGenerator = ref(false);

watch(isDefinitionGenerator, (newStatus) => {
  const isDynamicTab = tabMenuPSList.value[tabMenuPSActive.value] === 'Dynamic';
  if (!newStatus && isDynamicTab) {
    tabMenuPSActive.value = 0;
  }
});
watch(showDefinitionFlatList, () => {
  tabMenuPSActive.value = 0;
});

const getDefinitionList = async () => {
  try {
    const res = await api.DefinitionList.getParameterDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const handleDefinitionRowClick = async (definition) => {
  isLoadingContainer.value = true;
  definitionSelected.value = definition;
  await getParameterDefinitionData(definitionSelected.value._id);
  psParameterCurrentPage.value = 1;
  await getPsParametertWithDefinition(psParameterCurrentPage.value);

  psEmsCurrentPage.value = 1;
  await getPsEmstWithDefinition(psParameterCurrentPage.value, true);

  isLoadingContainer.value = false;
  isDefinitionGenerator.value = definition.name === 'Generator';
};

const getParameterDefinitionData = async (id) => {
  try {
    const res = await api.DefinitionList.getDefinitionData(id);
    parameterDefinitionData.value = res.data;
  } catch (error) {
    parameterDefinitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};

const emsDefinitionData = ref({});

const getEmsDefinitionData = async (id) => {
  try {
    const res = await api.DefinitionList.getDefinitionData(id);
    emsDefinitionData.value = res.data;
  } catch (error) {
    emsDefinitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};

// --- Flat List - filter

const handleFlatListFilterClick = async (newFilter) => {
  flatListFilter.value = newFilter;
  psParameterCurrentPage.value = 1;
  isLoadingPsParameterData.value = true;
  await getPsParametertWithDefinition();
  isLoadingPsParameterData.value = false;

  psEmsCurrentPage.value = 1;
  isLoadingPsEmsData.value = true;
  await getPsEmstWithDefinition(psEmsCurrentPage.value, true);
  isLoadingPsEmsData.value = false;
};

// parameter filter
const definitionCanNotUseFilter = ref(['Area', 'Zone', 'Owner', 'SubstationType', 'Substation_kVBase']);
const canUseDefinitionFilter = computed(() => {
  if (definitionSelected.value.name) {
    return !definitionCanNotUseFilter.value.includes(definitionSelected.value.name);
  }
  return false;
});

const showflatListFilterWidget = computed(() => {
  if (tabMenuPSList.value[tabMenuPSActive.value] === 'Dynamic') {
    return false;
  }
  return showDefinitionFlatList.value;
});
const flatListFilter = ref({});

// ems - filter
const emsFilter = ref([]);
const emsFilterSelected = ref({ name: 'all', _id: undefined });
const getEmsfilterOptions = async () => {
  try {
    const res = await api.DefinitionList.getEmsList();
    const filterOpts = [
      {
        label: 'None',
        _id: undefined,
        command: () => {
          emsFilterSelected.value = { name: 'All', _id: undefined };
        },
      },
    ];
    for (const opts of res.data) {
      filterOpts.push({
        label: opts.name.replace('Ems', ''),
        _id: opts._id,
        command: () => {
          emsFilterSelected.value = opts;
        },
      });
    }
    emsFilter.value = filterOpts;
  } catch (error) {
    console.log('getfilterOptions: error ', error);
    toast.add({ severity: 'error', summary: 'EMS List', detail: error.data.detail, life: 3000 });
  }
};

//  tree - powersystem edit
const treedefinitionFilter = ref(['Station', 'Area', 'Zone', 'Owner', 'kV']);
const treeDefinitionFilterOpts = computed(() => {
  const opts = definitionList.value.filter((item) => treedefinitionFilter.value.includes(item.name));
  opts.push({
    name: 'kV',
    _id: 'can_not_filter',
  });
  return opts;
});

const nodeSelected = ref();
const pseId = ref();

const onNodeSelect = async (node) => {
  isDefinitionGenerator.value = node.label === 'Generator';
  nodeSelected.value = node;
  isLoadingContainer.value = true;
  pseId.value = node._id;
  psParameterCurrentPage.value = 1;
  await getPsParameterWithTree(true);
  await getPsEmsWithTree(true);

  isLoadingContainer.value = false;
};

// get PS data

const psParameterData = ref([]);
const psParameterTotal = ref();
const psParameterCurrentPage = ref(1);
const pageRowNumber = ref(10);
const isLoadingPsParameterData = ref(false);
const psParameterPaginatorOffset = computed(() => pageRowNumber.value * psParameterCurrentPage.value - 1);

// Parameter
const onPagePsParameterChange = async (event) => {
  isLoadingPsParameterData.value = true;
  psParameterCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await reloadPsParameter();
  isLoadingPsParameterData.value = false;
  if (syncEmsPaginatorWithParameter.value && psEmsCurrentPage.value != psParameterCurrentPage.value) {
    psEmsCurrentPage.value = psParameterCurrentPage.value;
  }
};
const reloadPsParameter = async () => {
  if (showDefinitionFlatList.value && definitionSelected.value.name) {
    await getPsParametertWithDefinition(psParameterCurrentPage.value);
  }
  if (!showDefinitionFlatList.value && pseId.value) {
    await getPsParameterWithTree();
  }
};

const getPsParametertWithDefinition = async (page = 1) => {
  let filter = {};
  if (canUseDefinitionFilter.value) {
    filter = JSON.parse(JSON.stringify(flatListFilter.value));
    // --without Station
    if (definitionSelected.value.name === 'Station') {
      delete filter.sub;
    }
  } else {
    // -- only station
    filter = { sub: flatListFilter.value.sub };
  }
  const res = await api.PowerSystemParameter.getPsDataWithDefinition(
    definitionSelected.value._id,
    projectVersionId.value,
    filter,
    page,
  );

  psParameterData.value = res.data.items;
  psParameterTotal.value = res.data.total;
};

const getPsParameterWithTree = async (getHeader = false) => {
  let nodeParentId;
  if (nodeSelected.value.engineClassId === 'middleParent') {
    nodeParentId = nodeSelected.value.parentId;
  }
  try {
    const res = await api.PowerSystemParameter.getPsDataWithTree(
      pseId.value,
      projectVersionId.value,
      nodeParentId,
      psParameterCurrentPage.value,
    );
    psParameterData.value = res.data.items;
    psParameterTotal.value = res.data.total;

    if (getHeader && res.data.items.length > 0) {
      const firstRow = res.data.items[0];
      definitionSelected.value = {
        _id: firstRow.engineInfo.powerSystemDefinitionId,
      };

      await getParameterDefinitionData(definitionSelected.value._id);
    }
  } catch (error) {
    psParameterData.value = [];
    psParameterTotal.value = 0;
    console.log('getPsDataWithTree: error ', error);
    toast.add({ severity: 'error', summary: 'Power System Edit', detail: error.data.detail, life: 3000 });
  }
};

// ems

const psEmsData = ref([]);
const psEmsTotal = ref();
const psEmsCurrentPage = ref(1);
const isLoadingPsEmsData = ref(false);
const psEmsPaginatorOffset = computed(() => pageRowNumber.value * psEmsCurrentPage.value - 1);

watch(emsFilterSelected, async () => {
  isLoadingPsEmsData.value = true;
  psEmsCurrentPage.value = 1;
  await reloadPsEms(true);
  isLoadingPsEmsData.value = false;
});

const onPagePsEmsChange = async (event) => {
  isLoadingPsEmsData.value = true;
  psEmsCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await reloadPsEms();
  isLoadingPsEmsData.value = false;
};
const reloadPsEms = async (getHeader = false) => {
  if (showDefinitionFlatList.value && definitionSelected.value.name) {
    await getPsEmstWithDefinition(psParameterCurrentPage.value, getHeader);
  }
  if (!showDefinitionFlatList.value && pseId.value) {
    await getPsEmsWithTree(getHeader);
  }
};

const getPsEmstWithDefinition = async (page = 1, getHeader = false) => {
  let filter = {};
  if (canUseDefinitionFilter.value) {
    filter = JSON.parse(JSON.stringify(flatListFilter.value));
    // --without Station
    if (definitionSelected.value.name === 'Station') {
      delete filter.sub;
    }
  } else {
    // -- only station
    filter = { sub: flatListFilter.value.sub };
  }
  if (emsFilterSelected.value._id) {
    filter['ems_definition_id'] = emsFilterSelected.value._id;
  }
  const res = await api.PowerSystemEms.getPsDataWithDefinition(
    definitionSelected.value._id,
    projectVersionId.value,
    filter,
    page,
  );

  psEmsData.value = res.data.items;
  psEmsTotal.value = res.data.total;
  if (getHeader && res.data.items.length > 0) {
    const firstRow = res.data.items[0];
    await getEmsDefinitionData(firstRow.engineInfo.powerSystemDefinitionId);
  }
};

const getPsEmsWithTree = async (getHeader = false) => {
  let nodeParentId;

  if (nodeSelected.value.engineClassId === 'middleParent') {
    nodeParentId = nodeSelected.value.parentId;
  }
  try {
    const res = await api.PowerSystemEms.getPsDataWithTree(
      pseId.value,
      projectVersionId.value,
      nodeParentId,
      psEmsCurrentPage.value,
    );
    psEmsData.value = res.data.items;
    psEmsTotal.value = res.data.total;

    if (getHeader && res.data.items.length > 0) {
      const firstRow = res.data.items[0];
      await getEmsDefinitionData(firstRow.engineInfo.powerSystemDefinitionId);
    }
  } catch (error) {
    psEmsData.value = [];
    psEmsTotal.value = 0;
    console.log('getPsDataWithTree: error ', error);
    toast.add({ severity: 'error', summary: 'Power System Edit', detail: error.data.detail, life: 3000 });
  }
};

// --- compare
const psCompareData = ref({});
const isEditingVersion = ref(false);
const tabMenuOnTopActive = ref(0);
watch(tabMenuOnTopActive, (newTab) => {
  if (newTab === 1) {
    getVersionData();
  }
  if (newTab === 2) {
    getComparePSD();
  }
});

const getComparePSD = async (reloadMsg = false) => {
  try {
    const res = await api.api.getComparePSD();
    psCompareData.value = res.data;
    if (reloadMsg) {
      isLoadingProgress.value = true;
      toast.add({ severity: 'success', summary: 'History', detail: 'Reload Successfully', life: 3000 });
    }
    isEditingVersion.value = Boolean(
      psCompareData.value.Add.length + psCompareData.value.Update.length + psCompareData.value.Delete.length,
    );
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
    await api.api.createNewVersion(nameVersion.value, scheduledOperationTime.value);
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
  let nodeParentId = projectData.value._id;
  const powerSystemDefinitionId = definitionSelected.value._id ? definitionSelected.value._id : '';
  if (showDefinitionFlatList.value && definitionSelected.value.name) {
    nodeParentId = parameterDefinitionData.value.parrentId;
  }
  if (!showDefinitionFlatList.value && nodeSelected.value) {
    nodeParentId = nodeSelected.value.parentId;
  }
  psCreate.value = {
    _id: '',
    generalInfo: {
      name: '',
      parrentId: nodeParentId,
      uniqueId: '',
      operationName: '',
      operationUniqueId: '',
    },
    engineInfo: {
      powerSystemDefinitionId: powerSystemDefinitionId,
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
const createPSParameter = async () => {
  try {
    await api.PowerSystemParameter.create(psCreate.value, projectVersionId.value);
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    reloadPsParameter();
  } catch (error) {
    console.log('createPS: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System', detail: error.data.detail, life: 3000 });
  }
};
// Edit
const updatePsParameter = async (pseUpdate) => {
  try {
    await api.PowerSystemParameter.update(pseUpdate, projectVersionId.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    // reloadData();
  } catch (error) {
    console.log('editPS: error ', error);
    toast.add({ severity: 'error', summary: 'Updated Power System', detail: error.data.detail, life: 3000 });
  }
};

// Delete
const deletePSParameter = async (pseId) => {
  try {
    await api.PowerSystemParameter.delete(pseId, projectVersionId.value);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    reloadPsParameter();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Power System', detail: error.data.detail, life: 3000 });
  }
};

function capitalizeFirstLetter(string) {
  if (!string) {
    return '';
  }
  return string
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// version
const versionList = ref([]);
const totalRecordVersion = ref(0);

const sampleVersion = ref({});

const getVersionData = async (page = 1) => {
  try {
    const res = await api.api.getVersionList(page);
    versionList.value = res.data[0];
    totalRecordVersion.value = res.data[1];

    // set version init
    if (!sampleVersion.value.name) {
      sampleVersion.value = versionList.value[0];
    }
    if (!editVersionData.value.name) {
      commonStore.editVersionData = versionList.value[0];
    }
  } catch (error) {
    versionList.value = [];
    console.log('getVersionList: error ', error);
    toast.add({ severity: 'error', summary: 'Version List', detail: error.data.detail, life: 3000 });
  }
};

// menu import/export
const menuImportExport = ref();
const itemsMenuImportExport = computed(() => {
  return [
    {
      label: 'Import/Export',
      items: [
        {
          label: 'Export',
          icon: 'pi pi-download',
          disabled: true,
          command: () => {},
        },
        {
          label: 'Import',
          icon: 'pi pi-upload',
          disabled: true,
          command: () => {},
        },
        {
          label: 'Create',
          icon: 'pi pi-plus',
          disabled: !showDefinitionFlatList.value || !definitionSelected.value._id,
          command: () => {
            handleCreatePS();
          },
        },
      ],
    },
  ];
});

const toggleMenuConfig = (event) => {
  menuImportExport.value.toggle(event);
};
</script>

<style>
#ps-tab-view ul.p-tabview-nav,
#on-top-tab-view ul.p-tabview-nav {
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

.p-dropdown-item {
  min-height: 2rem;
}
.p-dropdown-panel {
  width: 16rem;
}
tr {
  height: 3.3rem;
}
</style>

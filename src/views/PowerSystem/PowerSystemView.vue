<template>
  <div class="card layout-content min-h-full">
    <Toast />
    <AppProgressSpinner :showSpinner="isLoadingProgress"></AppProgressSpinner>

    <!-- this is for test  -->
    <!-- end test  -->

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
        <Splitter style="min-height: 78vh">
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
            <div class="flex flex-column h-full">
              <!-- ps table -  header: tab & filter  -->
              <div class="m-3 flex gap-2 justify-content-between align-items-center">
                <!-- tab -->
                <div class="flex gap-2 justify-content-start">
                  <div class="flex gap-2 justify-content-start">
                    <Button label="General" class="" :text="tabMenuPSActive !== 0" @click="tabMenuPSActive = 0" />
                    <Button label="Engine" class="" :text="tabMenuPSActive !== 1" @click="tabMenuPSActive = 1" />
                    <Button label="Scada" class="" :text="tabMenuPSActive !== 2" @click="tabMenuPSActive = 2" />
                  </div>
                </div>
                <Divider layout="vertical" />
                <!-- filter -->
                <div class="flex-grow-1 m-3 flex gap-2 justify-content-between">
                  <FloatLabel class="w-full md:w-34rem">
                    <label for="filter-area">Area</label>
                    <Dropdown
                      v-model="areaSelected"
                      :options="areaList"
                      showClear
                      :virtualScrollerOptions="{
                        lazy: areaList.length > 0,
                        onLazyLoad: onLazyLoadArea,
                        itemSize: psPageRowNumber,
                        loading: isLoadingAreaFilter,
                        delay: 250,
                        showLoader: true,
                      }"
                      :disabled="!canUseDefinitionFilter"
                      class="w-full md:w-34rem"
                    >
                      <template #value="slotProps">
                        <div class="flex align-items-center">
                          <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
                          <div v-else>Select a Area</div>
                        </div>
                      </template>
                      <template v-slot:option="slotProps">
                        <div v-if="slotProps.option" class="flex align-items-center">
                          <div class="py-6">{{ slotProps.option.label }}</div>
                        </div>
                      </template>

                      <template v-slot:loader="{ options }">
                        <div class="flex align-items-center p-1" style="height: 30px">
                          <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
                        </div>
                      </template>
                    </Dropdown>
                  </FloatLabel>

                  <FloatLabel class="w-full md:w-34rem">
                    <label for="filter-zone">Zone</label>
                    <Dropdown
                      v-model="zoneSelected"
                      :options="zoneList"
                      showClear
                      :virtualScrollerOptions="{
                        lazy: zoneList.length > 0,
                        onLazyLoad: onLazyLoadZone,
                        itemSize: psPageRowNumber,
                        loading: isLoadingZoneFilter,
                        delay: 250,
                        showLoader: true,
                      }"
                      :disabled="!canUseDefinitionFilter"
                      class="w-full md:w-34rem"
                    >
                      <template #value="slotProps">
                        <div class="flex align-items-center">
                          <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
                          <div v-else>Select a Zone</div>
                        </div>
                      </template>
                      <template v-slot:option="slotProps">
                        <div v-if="slotProps.option" class="flex align-items-center">
                          <div class="py-6">{{ slotProps.option.label }}</div>
                        </div>
                      </template>

                      <template v-slot:loader="{ options }">
                        <div class="flex align-items-center p-1" style="height: 30px">
                          <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
                        </div>
                      </template>
                    </Dropdown>
                  </FloatLabel>

                  <FloatLabel class="w-full md:w-34rem">
                    <label for="filter-owner">Owner</label>
                    <Dropdown
                      v-model="ownerSelected"
                      showClear
                      :options="ownerList"
                      :virtualScrollerOptions="{
                        lazy: ownerList.length > 0,
                        onLazyLoad: onLazyLoadOwner,
                        itemSize: psPageRowNumber,
                        loading: isLoadingOwnerFilter,
                        delay: 250,
                        showLoader: true,
                      }"
                      :disabled="!canUseDefinitionFilter"
                      class="w-full md:w-34rem"
                    >
                      <template #value="slotProps">
                        <div class="flex align-items-center">
                          <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
                          <div v-else>Select a Owner</div>
                        </div>
                      </template>
                      <template v-slot:option="slotProps">
                        <div v-if="slotProps.option" class="flex align-items-center">
                          <div class="py-6">{{ slotProps.option.label }}</div>
                        </div>
                      </template>

                      <template v-slot:loader="{ options }">
                        <div class="flex align-items-center p-1" style="height: 30px">
                          <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
                        </div>
                      </template>
                    </Dropdown>
                  </FloatLabel>
                  <Divider type="solid" layout="vertical" />

                  <FloatLabel class="w-full md:w-34rem">
                    <label for="filter-sub">Substation</label>
                    <Dropdown
                      v-model="subSelected"
                      :options="subList"
                      showClear
                      :virtualScrollerOptions="{
                        lazy: subList.length > 0,
                        onLazyLoad: onLazyLoadSubstation,
                        itemSize: psPageRowNumber,
                        loading: isLoadingSubsFilter,
                        delay: 250,
                        showLoader: true,
                      }"
                      :disabled="
                        !canUseDefinitionFilter || subList.length === 0 || definitionSelected.name === 'Substation'
                      "
                      class="w-full md:w-34rem"
                    >
                      <template #value="slotProps">
                        <div class="flex align-items-center">
                          <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
                          <div v-else>Select a Substation</div>
                        </div>
                      </template>
                      <template v-slot:option="slotProps">
                        <div v-if="slotProps.option" class="flex align-items-center">
                          <div class="py-6">{{ slotProps.option.label }}</div>
                        </div>
                      </template>

                      <template v-slot:loader="{ options }">
                        <div class="flex align-items-center p-1" style="height: 30px">
                          <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
                        </div>
                      </template>
                    </Dropdown>
                  </FloatLabel>
                  <div>
                    <Button
                      severity="primary"
                      icon="pi pi-filter"
                      style="width: 32px"
                      :disabled="!definitionSelected"
                      @click="handleFilterClick"
                    />
                  </div>
                </div>
                <Divider layout="vertical" />

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

              <!-- ps table - table data  -->
              <div class="flex-grow-1">
                <LoadingContainer v-show="isLoadingContainer" />
                <TabView id="ps-tab-view" v-model:activeIndex="tabMenuPSActive">
                  <TabPanel header="">
                    <generalTabWidget :data="psData" @editData="editPSE" @deleteData="deletePSE" />
                  </TabPanel>
                  <TabPanel>
                    <engineInfoTabWidget
                      :data="psData"
                      :headerData="definitionData"
                      @editData="editPSE"
                      @deleteData="deletePSE"
                    />
                  </TabPanel>
                  <TabPanel>
                    <scadaInfoTabWidget :data="psData" @editData="editPSE" @deleteData="deletePSE" />
                  </TabPanel>
                </TabView>
              </div>
              <!-- ps table - Paginator -->

              <div v-if="psDataListLength > psPageRowNumber">
                <Paginator
                  :rows="psPageRowNumber"
                  :totalRecords="psDataListLength"
                  @page="onPagePsDataChange"
                ></Paginator>
              </div>
            </div>
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
        <Button type="button" label="Submit" @click="createPS()"></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import api from './api';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';

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
const { projectId, editVersionData } = storeToRefs(commonStore);
import { intervalTime } from '@/Constants/';

const toast = useToast();
const isLoadingProgress = ref(false);
const isLoadingContainer = ref(false);

const versionId = ref('66decf1dcff005199529524b');
const getDataInterval = ref();

onMounted(async () => {
  loadAllData();

  getDataInterval.value = setInterval(() => {
    reloadData();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(getDataInterval.value);
});

const tabMenuPSActive = ref(0);

const loadAllData = async () => {
  await getDefinitionList();
  await getVersionData();
  await getComparePSD();
  treePs.value = await getLeaf(projectId.value);
  tabMenuPSActive.value = 0;
  await resetFilterList();
};

// get data
const showDefinitionList = ref(true);
const psData = ref([]);
const psDataListLength = ref();
const psCurrentPage = ref(1);
const psPageRowNumber = ref(10);

const isAddNew = ref(false);

const onPagePsDataChange = (event) => {
  psCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  reloadData();
};
const reloadData = async () => {
  if (showDefinitionList.value && definitionSelected.value.name) {
    const resData = await getPsDataWithDefinitionFilter(definitionSelected.value.name);
    psData.value = resData.items;
    psDataListLength.value = resData.total;
  }
  if (!showDefinitionList.value) {
    await getPSEditData();
  }
};

watch(showDefinitionList, (newStatus) => {
  if (newStatus === false && isAddNew.value) {
    treePs.value = getLeaf(projectId.value);
  }
});
//  -- Flat List - definition list
const definitionList = ref([]);
const definitionSelected = ref({});
const definitionData = ref({});

const getDefinitionList = async () => {
  try {
    const res = await api.getDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const handleDefinitionRowClick = async (definition) => {
  isLoadingContainer.value = true;
  definitionSelected.value = definition;
  await getDefinitionData(definitionSelected.value._id);
  await getPsDataWithDefinitionFilter(definitionSelected.value.name);
  setTimeout(() => {
    isLoadingContainer.value = false;
  }, 500);
  areaSelected.value = undefined;
  zoneSelected.value = undefined;
  ownerSelected.value = undefined;
  subSelected.value = undefined;
};

const getDefinitionData = async (id) => {
  try {
    const res = await api.getDefinitionData(id);
    definitionData.value = res.data;
  } catch (error) {
    definitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};

// Flat List - filter
const definitionNoFilterList = ref(['Area', 'Zone', 'Owner']);
const canUseDefinitionFilter = computed(() => {
  if (definitionSelected.value) {
    return !definitionNoFilterList.value.includes(definitionSelected.value.name);
  }
  return false;
});
const areaSelected = ref();
const areaList = ref([]);
const isLoadingAreaFilter = ref(false);
const definitionArea = ref();

const zoneSelected = ref();
const zoneList = ref([]);
const isLoadingZoneFilter = ref(false);
const definitionZone = ref();

const ownerSelected = ref();
const ownerList = ref([]);
const isLoadingOwnerFilter = ref(false);
const definitionOwner = ref();

const subSelected = ref();
const subList = ref([]);
const isLoadingSubsFilter = ref(false);
const definitionSub = ref();

const resetFilterList = async () => {
  definitionArea.value = definitionList.value.filter((item) => item.name.toLowerCase() === 'area')[0];
  const areaFilterLength = await api.getPsDataWithDefinition(definitionArea.value._id, versionId.value, 1, {});
  areaList.value = Array.from({ length: areaFilterLength.data.total });

  definitionZone.value = definitionList.value.filter((item) => item.name.toLowerCase() === 'zone')[0];
  const zoneFilterLength = await api.getPsDataWithDefinition(definitionZone.value._id, versionId.value, 1, {});
  zoneList.value = Array.from({ length: zoneFilterLength.data.total });

  definitionOwner.value = definitionList.value.filter((item) => item.name.toLowerCase() === 'owner')[0];
  const ownerFilterLength = await api.getPsDataWithDefinition(definitionOwner.value._id, versionId.value, 1, {});
  ownerList.value = Array.from({ length: ownerFilterLength.data.total });

  definitionSub.value = definitionList.value.filter((item) => item.name.toLowerCase() === 'substation')[0];
  updateSubstationFilterLength();
};

const onLazyLoadArea = async (event) => {
  isLoadingAreaFilter.value = true;
  const { first, last } = event;
  const _items = [...areaList.value];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;

    const resData = await api.getPsDataWithDefinition(definitionArea.value._id, versionId.value, page, {});
    for (let i = 0; i < resData.data.items.length; i++) {
      if (!resData.data.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.data.items[i].generalInfo.name, _id: resData.data.items[i]._id };
    }
  }
  areaList.value = _items;
  isLoadingAreaFilter.value = false;
};

const onLazyLoadZone = async (event) => {
  isLoadingZoneFilter.value = true;
  const { first, last } = event;
  const _items = [...zoneList.value];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;
    const resData = await api.getPsDataWithDefinition(definitionZone.value._id, versionId.value, page, {});
    for (let i = 0; i < resData.data.items.length; i++) {
      if (!resData.data.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.data.items[i].generalInfo.name, _id: resData.data.items[i]._id };
    }
  }
  zoneList.value = _items;
  isLoadingZoneFilter.value = false;
};

const onLazyLoadOwner = async (event) => {
  isLoadingOwnerFilter.value = true;
  const { first, last } = event;
  const _items = [...ownerList.value];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;
    const resData = await api.getPsDataWithDefinition(definitionOwner.value._id, versionId.value, page, {});
    for (let i = 0; i < resData.data.items.length; i++) {
      if (!resData.data.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.data.items[i].generalInfo.name, _id: resData.data.items[i]._id };
    }
  }
  ownerList.value = _items;
  isLoadingOwnerFilter.value = false;
};

watch(areaSelected, () => {
  updateSubstationFilterLength();
});

watch(zoneSelected, () => {
  updateSubstationFilterLength();
});

watch(ownerSelected, () => {
  updateSubstationFilterLength();
});
const updateSubstationFilterLength = async () => {
  subSelected.value = undefined;
  const subsFilterLength = await getPsDataWithDefinitionFilter('Substation', 1);
  subList.value = Array.from({ length: subsFilterLength.total });
};

const onLazyLoadSubstation = async (event) => {
  isLoadingSubsFilter.value = true;
  const { first, last } = event;
  const _items = [...subList.value];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;
    const resData = await getPsDataWithDefinitionFilter('Substation', page);
    for (let i = 0; i < resData.items.length; i++) {
      if (!resData.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.items[i].generalInfo.name, _id: resData.items[i]._id };
    }
  }
  subList.value = _items;
  isLoadingSubsFilter.value = false;
};

const getPsDataWithDefinitionFilter = async (nameFilter, page = 1) => {
  try {
    const definition = definitionList.value.filter((item) => item.name.toLowerCase() === nameFilter.toLowerCase())[0];
    let data = {};
    if (canUseDefinitionFilter.value) {
      data = {
        area: areaSelected.value ? areaSelected.value._id : undefined,
        zone: zoneSelected.value ? zoneSelected.value._id : undefined,
        owner: ownerSelected.value ? ownerSelected.value._id : undefined,
        sub: subSelected.value ? subSelected.value._id : undefined,
      };
    }
    const res = await api.getPsDataWithDefinition(definition._id, versionId.value, page, data);
    return res.data;
  } catch (error) {
    console.log('getDefinitionFilterData: error ', error);
  }
};

const handleFilterClick = async () => {
  const resData = await getPsDataWithDefinitionFilter(definitionSelected.value.name);
  psData.value = resData.items;
  psDataListLength.value = resData.total;
};

// areaList.value = getDefinitionData();

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
    const childData = await api.getChildOnPSEdit(parentId, versionId.value);
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
      await getDefinitionData(res.data.engineInfo.powerSystemDefinitionId);
    }
  } catch (error) {
    console.log('getPSEditData: error ', error);
    // toast.add({ severity: 'error', summary: 'Power System Edit', detail: error.data.detail, life: 3000 });
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
    const res = await api.getComparePSD();
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
    await api.createNewVersion(nameVersion.value, scheduledOperationTime.value);
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
      parrentId: showDefinitionList.value ? definitionData.value.parrentId : parentNodeSelected.value,
      uniqueId: '',
      emsName: '',
      emsUniqueId: '',
      operationName: '',
      operationUniqueId: '',
      softwareName: '',
      softwareUniqueId: '',
    },
    engineInfo: {
      powerSystemDefinitionId: showDefinitionList.value ? definitionSelected.value : '',
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
    const res = await api.getVersionList(page);
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
          disabled: !showDefinitionList.value,
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
  min-height: 25px;
}
</style>

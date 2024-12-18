<template>
  <div class="card layout-content min-h-full">
    <Toast />
    <ConfirmDialog />
    <AppProgressSpinner :showSpinner="isLoadingProgress"></AppProgressSpinner>

    <div class="flex gap-2 justify-content-between align-items-center">
      <div class="flex gap-2 justify-content-start">
        <Button
          icon="pi pi-table"
          label="Power System"
          text
          :severity="tabMenuOnTopActive === tabMenuOnTopList.indexOf('Power System') ? 'primary' : 'secondary'"
          @click="tabMenuOnTopActive = tabMenuOnTopList.indexOf('Power System')"
        />

        <Button
          v-if="slotData.name !== 'Online'"
          icon="pi pi-history"
          label="History"
          text
          :severity="tabMenuOnTopActive === tabMenuOnTopList.indexOf('History') ? 'primary' : 'secondary'"
          @click="tabCompareClick"
        />
        <Button
          v-if="slotData.name !== 'Online'"
          icon="pi pi-list"
          label="Snapshot"
          text
          :severity="tabMenuOnTopActive === tabMenuOnTopList.indexOf('Snapshot') ? 'primary' : 'secondary'"
          @click="tabMenuOnTopActive = tabMenuOnTopList.indexOf('Snapshot')"
        />
      </div>
      <div class="flex gap-2 justify-content-between align-items-center">
        <router-link to="/powersystem/slot" rel="Slot">
          <Button title="Back to Workspace Table" icon="pi pi-list" severity="secondary" text />
        </router-link>
        <Tag v-if="slotData.name !== 'Online'" :value="slotData.name" severity="secondary" class="px-6" />
        <Tag v-else value="Online" severity="primary" class="px-6" />
      </div>
    </div>
    <Divider />

    <TabView id="on-top-tab-view" v-model:activeIndex="tabMenuOnTopActive">
      <!-- tab Power System table  -->

      <TabPanel>
        <Splitter style="height: 50rem">
          <SplitterPanel :size="25" :minSize="10" style="overflow-y: auto">
            <Card style="height: 49.8rem">
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
                  :definition-filter="treeDefinitionFilterOpts"
                  :emsFilterFollowDefinition="Object.keys(emsFilterFollowDefinition)"
                  @onNodeSelect="onNodeSelect"
                />
                <DataView
                  v-else
                  :value="definitionList"
                  class="w-full"
                  style="height: 43rem; overflow-y: auto; overflow-x: hidden; margin-right: -1rem"
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
                          v-if="tab === 'PSSE'"
                          label="PSSE"
                          class=""
                          :text="tabMenuPSActive !== index"
                          disabled
                        />
                        <SplitButton
                          v-else-if="tab === 'EMS'"
                          label="ATS Standard"
                          :model="emsFilterList"
                          :text="tabMenuPSActive !== index"
                          :disabled="isSublineNode"
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
                        <Button
                          v-else
                          :label="tab"
                          class=""
                          :text="tabMenuPSActive !== index"
                          :disabled="
                            (tab === 'Dynamic' && !isDefinitionGenerator) || (tab === 'Graphics' && !isStation)
                          "
                          @click="tabMenuPSActive = index"
                        />
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
                  class="px-3 pt-3"
                  :canUseDefinitionFilter="canUseDefinitionFilter"
                  :canUseDefinitionStationFilter="definitionSelected.name !== 'Station'"
                  :definitionList="definitionList"
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
                      <template v-if="isSublineNode && !showDefinitionFlatList">
                        <div class="flex gap-2 justify-content-between align-items-center">
                          <div>
                            <Button
                              label="Parameter"
                              text
                              :severity="tabParameterMenuActive === 0 ? 'primary' : 'secondary'"
                              @click="tabParameterMenuActive = 0"
                            />
                            <Button
                              label="Pole"
                              text
                              :severity="tabParameterMenuActive === 1 ? 'primary' : 'secondary'"
                              @click="tabParameterMenuActive = 1"
                            />
                          </div>
                          <Button icon="pi pi-plus" text class="mx-3" severity="primary" @click="handleCreatePole" />
                        </div>

                        <TabView id="parameter-pole-tab-view" v-model:activeIndex="tabParameterMenuActive">
                          <TabPanel>
                            <div style="height: 37rem">
                              slotData.name !== 'Online'{{ slotData.name !== 'Online' }}
                              <parameterTabWidget
                                :data="psParameterData"
                                :headerData="parameterDefinitionData"
                                :loading="isLoadingPsParameterData"
                                :show-change-column="slotData.name !== 'Online'"
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
                                @page="onPsParameterPageChange"
                              ></Paginator>
                              <div class="mr-3">Total: {{ psParameterTotal }}</div>
                            </div>
                          </TabPanel>
                          <TabPanel>
                            <div style="height: 36rem">
                              <poleTableWidget
                                :data="sublineData || []"
                                :nodeSelected="nodeSelected"
                                :currentPage="sublineCurrentPage"
                                :loading="isLoadingsubline"
                                @reloadData="getSublineData"
                              />
                            </div>
                            <!-- ps table - pole - Paginator -->
                            <div class="flex justify-content-end align-items-center">
                              <Paginator
                                v-if="sublineTotal > pageRowNumber"
                                v-model:first="sublinePaginatorOffset"
                                class="flex-grow-1"
                                :rows="pageRowNumber"
                                :totalRecords="sublineTotal"
                                :page="sublineCurrentPage"
                                @page="onSublinePageChange"
                              ></Paginator>
                              <div class="mr-3">Total: {{ sublineTotal }}</div>
                            </div>
                          </TabPanel>
                        </TabView>
                      </template>

                      <template v-else>
                        <div
                          :style="{
                            height: showDefinitionFlatList ? '35rem' : '37rem',
                            marginTop: showDefinitionFlatList ? '0' : '3rem',
                          }"
                        >
                          <parameterTabWidget
                            :data="psParameterData"
                            :headerData="parameterDefinitionData"
                            :loading="isLoadingPsParameterData"
                            :show-change-column="slotData.name !== 'Online'"
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
                            @page="onPsParameterPageChange"
                          ></Paginator>
                          <div class="mr-3">Total: {{ psParameterTotal }}</div>
                        </div>
                      </template>
                    </TabPanel>

                    <TabPanel>
                      <div
                        :style="{
                          height: showDefinitionFlatList ? '35rem' : '37rem',
                          marginTop: showDefinitionFlatList ? '0' : '3rem',
                        }"
                      >
                        <emsTabWidget
                          :emsData="psEmsData"
                          :loading="isLoadingPsEmsData"
                          :headerData="emsDefinitionData"
                          :show-change-column="slotData.name !== 'Online'"
                          @update="updatePsEms"
                          @delete="deletePsEms"
                        />
                      </div>
                      <!-- ps table - Paginator -->
                      <div class="flex justify-content-between align-items-center">
                        <Tag
                          v-if="emsFilterSelected"
                          class="w-10rem px-3 py-1"
                          style="font-size: 1rem"
                          severity="secondary"
                          :value="emsFilterSelected.label"
                        ></Tag>
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
                      <div
                        :style="{
                          height: showDefinitionFlatList ? '35rem' : '37rem',
                          marginTop: showDefinitionFlatList ? '0' : '3rem',
                        }"
                      >
                        <scadaInfoTabWidget
                          :data="psParameterData"
                          :loading="isLoadingPsParameterData"
                          :show-change-column="slotData.name !== 'Online'"
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
                          @page="onPsParameterPageChange"
                        ></Paginator>
                        <div class="mr-3">Total: {{ psParameterTotal }}</div>
                      </div>
                    </TabPanel>

                    <TabPanel :disabled="!isDefinitionGenerator">
                      <dynamicDefinitionTabWidget
                        v-if="isDefinitionGenerator"
                        :definitionId="definitionSelected._id || ''"
                        :showDefinitionFlatList="showDefinitionFlatList"
                        :nodeSelected="nodeSelected"
                        :show-change-column="slotData.name !== 'Online'"
                      />
                    </TabPanel>
                    <TabPanel :disabled="isStation">
                      <div
                        :style="{
                          height: showDefinitionFlatList ? '35rem' : '37rem',
                          marginTop: showDefinitionFlatList ? '0' : '3rem',
                        }"
                      >
                        <stationGraphic
                          v-if="tabMenuPSList[tabMenuPSActive] === 'Graphics' && isStation"
                          :nodeSelected="nodeSelected"
                        ></stationGraphic>
                      </div>
                    </TabPanel>
                  </TabView>
                </div>
              </template>
            </Card>
          </SplitterPanel>
        </Splitter>
      </TabPanel>

      <!-- tab compare -->

      <TabPanel>
        <div v-if="isLoadingContainer" class="relative" style="padding-top: 10rem">
          <div>
            <LoadingContainer />
          </div>
        </div>

        <compareTabWidget v-else :disabled="slotData.name === 'Online'" :data="compareData" />
      </TabPanel>

      <!-- tab version  -->
      <TabPanel>
        <versionTabWidget :canChange="slotData.name !== 'Online'" />
      </TabPanel>
    </TabView>
  </div>

  <createPsDialog
    :visible="createPsVisibleDialog"
    :parameterFilter="definitionList"
    :nodeSelected="nodeSelected"
    :definitionSelected="definitionSelected"
    @unvisible="createPsVisibleDialog = false"
    @reloadPsParameter="reloadPsParameter"
  />

  <createEmsDialog
    :visible="createEmsVisibleDialog"
    :parameterFilter="definitionList"
    :nodeSelected="nodeSelected"
    :emsFilterSelected="emsFilterSelected"
    @unvisible="createEmsVisibleDialog = false"
    @reloadPsEms="reloadPsEms"
  />
  <!-- pole dialog -->
  <Dialog v-model:visible="createPoleVisibleDialog" :style="{ width: '36rem' }" header="Add Pole" :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Add Pole</span>
      </div>
    </template>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="powersystemName" class="font-semibold w-12rem"> Power System</label>
      <InputText
        id="powersystemName"
        v-model="createPoleData.powersystemName"
        disabled
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-12rem"> Name</label>
      <InputText id="name" v-model="createPoleData.name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="poleOrder" class="font-semibold w-12rem"> Order</label>
      <InputNumber
        id="poleOrder"
        v-model="createPoleData.poleOrder"
        :maxFractionDigits="5"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Longitude" class="font-semibold w-12rem"> Longitude</label>
      <InputNumber id="Longitude" v-model="createPoleData.Longitude" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Latitude" class="font-semibold w-12rem"> Latitude</label>
      <InputNumber id="Latitude" v-model="createPoleData.Latitude" class="flex-auto" autocomplete="off" />
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createPoleVisibleDialog = false"></Button>
      <Button type="button" label="Save" severity="primary" @click="createPole()"></Button>
    </template>
  </Dialog>

  <!-- compare dialog -->

  <Dialog v-model:visible="saveUploadVisibleDialog" :style="{ width: '80vw' }" maximizable modal>
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold text-lg white-space-nowrap"> File Uploaded </span>
      </div>
    </template>

    <compareTabWidget :data="compareData" />

    <template #footer>
      <div
        v-if="Object.keys(compareData.psd_diff).length > 0 || Object.keys(compareData.ems_diff).length > 0"
        class="p-3 w-full flex align-items-center justify-content-between gap-3"
      >
        <div>
          <countDownWidget @timeout="showTimeOutAndlearEmsFile" />
        </div>
        <div class="flex align-items-center justify-content-end gap-3">
          <Button type="button" label="Cancel" severity="secondary" @click="confirmCloseCompareUpload"></Button>
          <Button type="button" label="Save" severity="primary" @click="saveUploadEmsFile"></Button>
        </div>
      </div>
    </template>
  </Dialog>
  <!-- import dialog  -->
  <Dialog
    v-model:visible="importVisibleDialog"
    :style="{ width: '50rem' }"
    header="Upload Power System File"
    :modal="true"
  >
    <TabView id="import-tab-view">
      <TabPanel header="EMS">
        <uploadEmsFile @uploadFile="loadEmsFile" />
      </TabPanel>
      <TabPanel header="Dynamic Model">
        <uploadDynamicFile @uploadFile="loadDynamicFile" />
      </TabPanel>
    </TabView>
  </Dialog>

  <!-- export dialog  -->
  <Dialog
    v-model:visible="exportVisibleDialog"
    :style="{ width: '50rem' }"
    header="Export Power System File"
    :modal="true"
  >
    <div class="flex gap-4 justify-content-start align-items-center py-3">
      <Button type="button" label="EMS" icon="pi pi-download" severity="primary" @click="exportEmsFile"></Button>
      <Button
        type="button"
        label="Dynamic Model"
        icon="pi pi-download"
        severity="primary"
        @click="exportDynamicFile"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';

import * as api from '@/views/PowerSystem/api';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import SplitButton from 'primevue/splitbutton';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import uploadEmsFile from './uploadEmsFile.vue';
import uploadDynamicFile from '../dynamicModelDefault/uploadDynamicFile.vue';
import compareTabWidget from './compareTableWidget.vue';
import versionTabWidget from './versionTabWidget.vue';

import flatListFilterWidget from './menuLeftWidget/flatListFilterWidget.vue';
import hierarchicalListWidget from './menuLeftWidget/hierarchicalListWidget.vue';
import scadaInfoTabWidget from './parameterTableTabWidget/scadaInfoTabWidget.vue';
import parameterTabWidget from './parameterTableTabWidget/parameterTabWidget.vue';
import poleTableWidget from './parameterTableTabWidget/poleTableWidget.vue';

import emsTabWidget from './emsTabWidget.vue';
import dynamicDefinitionTabWidget from './dynamicDefinitionTabWidget.vue';

import createPsDialog from './createPsDialog.vue';
import createEmsDialog from './createEmsDialog.vue';
import countDownWidget from './countDownWidget.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import router from '@/router';

import { DynamicModelApi, ApiCompare } from './api';
// graphic
import stationGraphic from '@/components/station_graphics/stationGraphic.vue';

import { useCommonStore } from '@/store';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();

const commonStore = useCommonStore();
const { slotData } = storeToRefs(commonStore);

const toast = useToast();
const isLoadingProgress = ref(false);
const isLoadingContainer = ref(false);

onMounted(async () => {
  await loadAllData();
});

onUnmounted(() => {});

// tab menu
const tabMenuOnTopActive = ref(0);
const tabMenuOnTopList = ref(['Power System', 'History', 'Snapshot']);
const tabMenuPSActive = ref(0);
const tabMenuPSList = ref(['Parameter', 'EMS', 'PSSE', 'Scada', 'Dynamic', 'Graphics']);
const showDefinitionFlatList = ref(false);

const loadAllData = async () => {
  await getDefinitionList();
  // await getComparePSD();
  tabMenuPSActive.value = 0;
  await getEmsfilterList();
};

//  -- Flat List - definition list
const definitionList = ref([]);
const definitionSelected = ref({});
const parameterDefinitionData = ref({});
const isDefinitionGenerator = ref(false);
const isStation = ref(false);
watch(isDefinitionGenerator, (newStatus) => {
  const isDynamicTab = tabMenuPSList.value[tabMenuPSActive.value] === 'Dynamic';

  if (!newStatus && isDynamicTab) {
    tabMenuPSActive.value = 0;
  }
});

watch(isStation, (newStatus) => {
  const isGraphicsTab = tabMenuPSList.value[tabMenuPSActive.value] === 'Graphics';

  if (!newStatus && isGraphicsTab) {
    tabMenuPSActive.value = 0;
  }
});
watch(showDefinitionFlatList, () => {
  tabMenuPSActive.value = 0;
});

const getDefinitionList = async () => {
  try {
    const res = await api.DefinitionListApi.getParameterDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    // toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
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

  await getEmsfilterList(definition.name);
};

const getParameterDefinitionData = async (id) => {
  try {
    const res = await api.DefinitionListApi.getDefinitionData(id);
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
    const res = await api.DefinitionListApi.getDefinitionData(id);
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
  const isDynamicTab = tabMenuPSList.value[tabMenuPSActive.value] === 'Dynamic';

  if (isDynamicTab) {
    return false;
  }
  return showDefinitionFlatList.value;
});
const flatListFilter = ref({});

// ems - filter
const emsFilterList = ref([]);
const emsFilterSelected = ref();

const emsFilterFollowDefinition = ref({
  'Transformers 3Winding': ['EmsBranch', 'EmsTrans'],
  'Transformers 2Winding': ['EmsBranch', 'EmsTrans'],
  Winding: ['EmsBranch'],
  'Series Impedances': ['EmsBranch'],
  Line: ['EmsBranch'],
  Generator: ['EmsGener'],
  Shunt: ['EmsShunt'],
  Load: ['EmsLoad'],
  Station: ['EmsStation'],
  Switch: ['EmsBreaker'],
});
const getEmsfilterList = async (definitionName = '') => {
  try {
    const res = await api.DefinitionListApi.getEmsList();
    const opts = [];
    const emsFilterName = emsFilterFollowDefinition.value[definitionName];
    if (emsFilterName) {
      // get with definition Name
      for (const item of res.data) {
        if (emsFilterName.indexOf(item.name) !== -1) {
          const name = item.name.replace('Ems', '');
          item.name = opts.push({
            label: name,
            _id: item._id,
            disabled: emsFilterName.length <= 1,
            command: (event) => {
              console.log(event, event);
              emsFilterSelected.value = {
                label: name,
                _id: item._id,
                name: item.name,
              };
            },
          });
        }
      }
    } else {
      // get all
      for (const item of res.data) {
        const name = item.name.replace('Ems', '');
        opts.push({
          label: name,
          _id: item._id,

          command: () => {
            emsFilterSelected.value = {
              label: name,
              _id: item._id,
              name: item.name,
            };
          },
        });
      }
    }

    emsFilterList.value = opts;
    if (opts.length > 0) {
      if (emsFilterList.value.filter((item) => item.label === 'Station').length > 0) {
        emsFilterSelected.value = emsFilterList.value.filter((item) => item.label === 'Station')[0];
      } else {
        emsFilterSelected.value = opts[0];
      }
    }
  } catch (error) {
    console.log('getEmsfilterList: error ', error);
    // toast.add({ severity: 'error', summary: 'EMS List', detail: error.data.detail, life: 3000 });
  }
};

//  tree - powersy
//  tree - powersystem edit
const treedefinitionFilter = ref(['Station', 'Area', 'Zone', 'Owner', 'Substation_kVBase', 'SubstationType']);
const treeDefinitionFilterOpts = computed(() => {
  const opts = [];
  for (let index = 0; index < definitionList.value.length; index++) {
    const item = definitionList.value[index];
    if (treedefinitionFilter.value.indexOf(item.name) !== -1) {
      if (item.name === 'Substation_kVBase') {
        opts.push({
          name: 'kV',
          _id: item._id,
        });
      } else if (item.name === 'SubstationType') {
        opts.push({
          name: 'Type',
          _id: item._id,
        });
      } else {
        opts.push({
          name: item.name,
          _id: item._id,
        });
      }
    }
  }

  return opts;
});

const nodeSelected = ref();
const isSublineNode = ref(false);
const tabParameterMenuActive = ref(0);
const psIdSelected = ref();

const onNodeSelect = async (node) => {
  console.log(node, 'node');
  isDefinitionGenerator.value = node.label === 'Generator';
  isStation.value = node.engineLabel === 'Station';
  nodeSelected.value = node;
  isLoadingContainer.value = true;
  psIdSelected.value = node._id;
  psParameterCurrentPage.value = 1;
  await getPsParameterWithTree(true);
  await getPsEmsWithTree(true);
  await getEmsfilterList(node.definitionName);
  isSublineNode.value = node.engineLabel === 'Sub_Line';
  isLoadingContainer.value = false;
};

watch(isSublineNode, async (newStatus) => {
  if (newStatus) {
    await getSublineData();
    if (tabMenuPSList.value[tabMenuPSActive.value] === 'EMS') {
      tabMenuPSActive.value = tabMenuPSList.value.indexOf('Parameter');
    }
  }
});
const sublineData = ref();
const isLoadingsubline = ref(false);
const sublineTotal = ref();
const sublineCurrentPage = ref(1);
const sublinePaginatorOffset = computed(() => pageRowNumber.value * sublineCurrentPage.value - 1);

const onSublinePageChange = async (event) => {
  isLoadingsubline.value = true;
  sublineCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getSublineData();
  isLoadingsubline.value = false;
};
const getSublineData = async () => {
  try {
    const res = await api.SubLineApi.getData(nodeSelected.value._id, sublineCurrentPage.value);
    sublineData.value = res.data.items;
    sublineTotal.value = res.data.total;
  } catch (error) {
    console.log('getSublineData: error ', error);
    sublineData.value = undefined;
    sublineTotal.value = 0;

    toast.add({ severity: 'error', summary: 'Subline', detail: error.data.detail, life: 3000 });
  }
};
// get PS data

const psParameterData = ref([]);
const psParameterTotal = ref();
const psParameterCurrentPage = ref(1);
const pageRowNumber = ref(10);
const isLoadingPsParameterData = ref(false);
const psParameterPaginatorOffset = computed(() => pageRowNumber.value * psParameterCurrentPage.value - 1);

// Parameter
const onPsParameterPageChange = async (event) => {
  isLoadingPsParameterData.value = true;
  psParameterCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await reloadPsParameter();
  isLoadingPsParameterData.value = false;
};
const reloadPsParameter = async () => {
  if (showDefinitionFlatList.value && definitionSelected.value.name) {
    await getPsParametertWithDefinition(psParameterCurrentPage.value);
  }
  if (!showDefinitionFlatList.value && psIdSelected.value) {
    await getPsParameterWithTree();
  }
};

const getPsParametertWithDefinition = async (page = 1) => {
  let filter = {};
  if (canUseDefinitionFilter.value) {
    filter = JSON.parse(JSON.stringify(flatListFilter.value));
    // --without Station
    if (definitionSelected.value.name === 'Station') {
      delete filter.station;
    }
  } else {
    // -- only station
    filter = { station: flatListFilter.value.station };
  }
  const res = await api.PowerSystemParameterApi.getPsDataWithDefinition(definitionSelected.value._id, filter, page);

  psParameterData.value = res.data.items;
  psParameterTotal.value = res.data.total;
};

const getPsParameterWithTree = async (getHeader = false) => {
  let nodeParentId;
  if (nodeSelected.value.engineClassId === 'middleParent') {
    nodeParentId = nodeSelected.value.parentId;
  }
  try {
    const res = await api.PowerSystemParameterApi.getPsDataWithTree(
      psIdSelected.value,
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
  if (!showDefinitionFlatList.value && psIdSelected.value) {
    await getPsEmsWithTree(getHeader);
  }
};

const getPsEmstWithDefinition = async (page = 1, getHeader = false) => {
  let filter = {};
  if (canUseDefinitionFilter.value) {
    filter = JSON.parse(JSON.stringify(flatListFilter.value));
    // --without Station
    if (definitionSelected.value.name === 'Station') {
      delete filter.station;
    }
  } else {
    // -- only station
    filter = { station: flatListFilter.value.station };
  }
  if (emsFilterSelected.value) {
    filter['ems_definition_id'] = emsFilterSelected.value._id;
  }
  const res = await api.PowerSystemEmsApi.getPsDataWithDefinition(definitionSelected.value._id, filter, page);

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
    const res = await api.PowerSystemEmsApi.getPsDataWithTree(
      psIdSelected.value,
      nodeParentId,
      emsFilterSelected.value ? emsFilterSelected.value._id : undefined,
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

const createPsVisibleDialog = ref(false);
const createEmsVisibleDialog = ref(false);

const createPoleVisibleDialog = ref(false);

const exportVisibleDialog = ref(false);
const importVisibleDialog = ref(false);

const menuImportExport = ref();
const itemsMenuImportExport = computed(() => {
  return [
    {
      label: 'Import/Export',
      items: [
        {
          label: 'Export',
          icon: 'pi pi-download',
          command: () => {
            exportVisibleDialog.value = true;
          },
        },
        {
          label: 'Import',
          icon: 'pi pi-upload',
          disabled: slotData.value.name === 'Online',
          command: () => {
            importVisibleDialog.value = true;
          },
        },
      ],
    },
    {
      label: 'Create',
      items: [
        {
          label: 'Parameter',
          icon: 'pi pi-plus',
          disabled: slotData.value.name === 'Online' || definitionList.value.length === 0,
          command: () => {
            createPsVisibleDialog.value = true;
          },
        },
        {
          label: 'ATS Standard',
          icon: 'pi pi-plus',
          disabled: slotData.value.name === 'Online' || definitionList.value.length === 0,
          command: () => {
            createEmsVisibleDialog.value = true;
          },
        },
        {
          label: 'Pole',
          icon: 'pi pi-plus',
          disabled: slotData.value.name === 'Online' || !isSublineNode.value,
          command: () => {
            handleCreatePole();
          },
        },
      ],
    },
  ];
});

const toggleMenuConfig = (event) => {
  menuImportExport.value.toggle(event);
};

const emsImportFormdata = ref();
const compareData = ref();
const saveUploadVisibleDialog = ref(false);
const loadEmsFile = async (formData, callback) => {
  try {
    isLoadingProgress.value = true;
    emsImportFormdata.value = formData;
    const res = await ApiCompare.uploadAndGetCompare(formData);
    compareData.value = res.data;

    // // this is for test
    // compareData.value = {
    //   message: 'Data is too large to return via API. It has been stored in Redis.',
    //   psd_diff_key: 'psd_diff:673aae04e9e2f92fe6e376f5:672f888274165faaf2e4244c',
    //   ems_diff_key: 'ems_diff:673aae04e9e2f92fe6e376f5:672f888274165faaf2e4244c',
    // };
    // // end test
    importVisibleDialog.value = false;
    saveUploadVisibleDialog.value = true;
    toast.add({ severity: 'success', summary: 'EMS', detail: 'Import Successfully', life: 3000 });
    isLoadingProgress.value = false;
    callback();
  } catch (error) {
    toast.add({ severity: 'danger', summary: 'EMS', detail: error, life: 3000 });
    isLoadingProgress.value = false;
  }
};

const dynamicImportFormdata = ref();
const loadDynamicFile = async (formData, callback) => {
  try {
    isLoadingProgress.value = true;
    dynamicImportFormdata.value = formData;
    console.log('load Dynamic file', formData);
    await DynamicModelApi.importDynamicModel(formData);
    toast.add({ severity: 'success', summary: 'Dynamic Model', detail: 'Import Successfully', life: 3000 });
    isLoadingProgress.value = false;
    importVisibleDialog.value = false;
    await loadAllData();

    callback();
  } catch (error) {
    toast.add({ severity: 'danger', summary: 'Dynamic Model', detail: error, life: 3000 });
    isLoadingProgress.value = false;
  }
};

function delayImportExport(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const exportEmsFile = async () => {
  isLoadingProgress.value = true;
  await delayImportExport();
  toast.add({ severity: 'success', summary: 'EMS Model', detail: 'Export Successfully', life: 3000 });
  exportVisibleDialog.value = false;
  isLoadingProgress.value = false;
};

const exportDynamicFile = async () => {
  isLoadingProgress.value = true;
  await delayImportExport();
  toast.add({ severity: 'success', summary: 'Dynamic Model', detail: 'Export Successfully', life: 3000 });
  exportVisibleDialog.value = false;
  isLoadingProgress.value = false;
};
// create

const createPoleData = ref({});

const handleCreatePole = () => {
  createPoleData.value = {
    powersystemId: nodeSelected.value._id,
    powersystemName: nodeSelected.value.label,
    name: '',
    poleOrder: 0,
    Longitude: 0,
    Latitude: 0,
  };
  createPoleVisibleDialog.value = true;
};

const createPole = async () => {
  try {
    const createData = JSON.parse(JSON.stringify(createPoleData.value));
    delete createData.powersystemName;
    await api.SubLineApi.create(createPoleData.value);
    getSublineData();
    createPoleVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Pole', detail: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('create pole error', error);
    toast.add({ severity: 'error', summary: 'Create Power System - Pole', detail: error.data.detail, life: 3000 });
  }
};

// Edit
const updatePsParameter = async (pseUpdate) => {
  try {
    await api.PowerSystemParameterApi.update(pseUpdate);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    await reloadPsParameter();
  } catch (error) {
    console.log('editPS: error ', error);
    toast.add({ severity: 'error', summary: 'Updated Power System', detail: error.data.detail, life: 3000 });
  }
};

const updatePsEms = async (pseUpdate) => {
  try {
    await api.PowerSystemEmsApi.update(pseUpdate);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    await reloadPsEms();
  } catch (error) {
    console.log('editPS: error ', error);
    toast.add({ severity: 'error', summary: 'Updated EMS', detail: error.data.detail, life: 3000 });
  }
};

// Delete
const deletePSParameter = async (pseId) => {
  try {
    await api.PowerSystemParameterApi.delete(pseId);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    reloadPsParameter();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Power System', detail: error.data.detail, life: 3000 });
  }
};

const deletePsEms = async (pseId) => {
  try {
    await api.PowerSystemEmsApi.delete(pseId);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    reloadPsEms();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Delete EMS', detail: error.data.detail, life: 3000 });
  }
};

// compare

const tabCompareClick = async () => {
  tabMenuOnTopActive.value = tabMenuOnTopList.value.indexOf('History');
  await getComparePSD();
};

const getComparePSD = async () => {
  isLoadingContainer.value = true;
  try {
    const res = await ApiCompare.getLastestCompare();
    compareData.value = res.data;
  } catch (error) {
    compareData.value = {};
  }
  isLoadingContainer.value = false;
};

const confirmCloseCompareUpload = () => {
  confirm.require({
    header: 'Confirmation',
    message: 'Save your Upload File before closing?',
    icon: 'pi pi-save',
    rejectProps: {
      label: "Don't Save",
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Save',
      severity: 'primary',
    },

    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: "Don't Save",
    acceptLabel: 'Save',
    accept: async () => {
      await saveUploadEmsFile();
    },
    reject: () => {
      clearEmsFile();
    },
  });
};

const showTimeOutAndlearEmsFile = () => {
  toast.add({ severity: 'warn', summary: ' Time Out', detail: 'PowerSystem Data is removed!', life: 3000 });
  clearEmsFile();
};
const clearEmsFile = () => {
  saveUploadVisibleDialog.value = false;
  compareData.value = {};
};

const saveUploadEmsFile = async () => {
  isLoadingProgress.value = true;

  try {
    await ApiCompare.saveUploadFile();
    clearEmsFile();
    toast.add({
      severity: 'success',
      summary: ' Upload File Saved Successfully',
      life: 3000,
    });
  } catch (error) {
    toast.add({ severity: 'error', summary: ' Upload File Save Failed', detail: error.data.detail, life: 3000 });
  }
  isLoadingProgress.value = false;
};
</script>

<style>
#ps-tab-view > .p-tabview-nav-container > .p-tabview-nav-content > ul.p-tabview-nav,
#on-top-tab-view > .p-tabview-nav-container > .p-tabview-nav-content > ul.p-tabview-nav,
#parameter-pole-tab-view > .p-tabview-nav-container > .p-tabview-nav-content > ul.p-tabview-nav {
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
  height: 3.1rem;
}
</style>

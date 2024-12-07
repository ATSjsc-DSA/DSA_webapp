<template>
  <div class="card h-full">
    <ConfirmDialog group="dialog"></ConfirmDialog>
    <Splitter style="height: 100%">
      <SplitterPanel
        class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
        :size="20"
        :minSize="10"
      >
        <div class="h-full w-full p-4 flex flex-column">
          <div class="py-4 flex justify-content-between align-items-center">
            <span class="text-xl font-semibold"> List Sub System</span>
            <Button icon="pi pi-plus" text rounded aria-label="Filter" @click="handlerCreate" />
          </div>
          <DataView
            :value="listSubSystem"
            class="w-full flex-1"
            style="height: 43rem; overflow-y: auto; overflow-x: hidden; margin-right: -1rem"
          >
            <template #list="slotProps">
              <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                  <div
                    class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                    :class="{
                      'border-top-1 surface-border': index !== 0,
                      'selected-item': selectedItem && selectedItem.name === item.name,
                    }"
                    @click="handleRowClick(item)"
                  >
                    <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1 ml-2">
                      <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2">
                        <i class="pi pi-folder text-yellow-400"></i>{{ item.name }}
                      </div>
                      <Button
                        class="item-button"
                        icon="pi pi-trash"
                        text
                        size="small"
                        rounded
                        severity="danger"
                        @click="(event) => confirmDeleteThis(item._id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex h-full w-full align-items-center justify-content-center" :size="80">
        <TabView class="h-full w-full">
          <TabPanel header="Common">
            <div class="p-fluid p-2">
              <div class="field">
                <label for="name" class="font-semibold">Name</label>
                <InputText id="name" v-model="selectedItem.name" class="flex-auto" autocomplete="off" />
              </div>
              <div class="flex align-items-center gap-3 mb-5">
                <label for="active" class="font-semibold">Active</label>
                <InputSwitch id="active" v-model="selectedItem.active" />
              </div>
            </div>
            <div class="card flex justify-content-end">
              <Button label="Update" :disabled="!selectedItem.name" @click="confirmUpdate($event)" />
            </div>
          </TabPanel>
          <TabPanel header="List Power System">
            <Splitter style="height: 100%">
              <SplitterPanel
                class="flex flex-column h-full w-full align-items-start justify-content-start overflow-y-auto px-3"
                :size="20"
                :minSize="10"
              >
                <filterSubSystemView
                  :current-filter="selectedItem.filterConditions"
                  @changeFilter="changeFilter"
                  @saveFilter="saveFilter"
                />
              </SplitterPanel>
              <SplitterPanel
                class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
                :size="20"
                :minSize="20"
              >
                <div class="w-full mb-5 px-3 mt-1 flex justify-content-between align-items-center">
                  <span class="text-xl font-semibold"> Power System</span>
                  <div class="flex align-items-center justify-content-end gap-2">
                    <MultiSelect
                      v-model="stationSearchSelected"
                      :options="psStationList"
                      optionLabel="name"
                      :maxSelectedLabels="3"
                      class="w-full md:w-20rem"
                      placeholder="Search Station"
                    />
                    <Button severity="primary" icon="pi pi-search" @click="changeStationFilter" />
                  </div>
                </div>
                <div class="w-full pl-3" style="height: 46rem">
                  <DataTable
                    id="subsystemTable"
                    :value="parameterData"
                    dataKey="_id"
                    :lazy="true"
                    :sortOrder="1"
                    rowHover
                    showGridlines
                    :loading="isParameterLoading"
                  >
                    <Column field="generalInfo.uniqueId" frozen header="Unique Id" style="text-wrap: nowrap">
                      <template #body="slotProps">
                        <div class="font-bold" style="min-width: 6rem">
                          {{ slotProps.data.generalInfo.uniqueId }}
                        </div>
                      </template>
                    </Column>
                    <Column field="generalInfo.name" header="Name" style="text-wrap: nowrap"></Column>

                    <Column
                      field="generalInfo.operationName"
                      header="Operation Name"
                      style="text-wrap: nowrap"
                    ></Column>
                    <Column field="stationName" header="Station" style="text-wrap: nowrap"></Column>

                    <template #empty> No Data </template>
                  </DataTable>
                </div>
                <!-- ps table - Paginator -->
                <div class="flex w-full justify-content-end align-items-center px-3">
                  <Paginator
                    v-if="parameterTotal > pageRowNumber"
                    v-model:first="parameterTotalPaginatorOffset"
                    class="flex-grow-1"
                    :rows="pageRowNumber"
                    :totalRecords="parameterTotal"
                    :page="parameterCurrentPage"
                    @page="onParameterPageChange"
                  ></Paginator>
                  <div class="mr-3">Total: {{ parameterTotal }}</div>
                </div>
              </SplitterPanel>
            </Splitter>
          </TabPanel>
        </TabView>
      </SplitterPanel>
    </Splitter>
    <!-- dialog   -->
    <Dialog v-model:visible="visible" modal header="Create Sub System" :style="{ width: '25rem' }">
      <div class="p-fluid">
        <div class="field">
          <label for="name" class="font-semibold">Name</label>
          <InputText id="name" v-model="formItemCreate.name" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="active" class="font-semibold">Active</label>
          <InputSwitch id="active" v-model="formItemCreate.active" />
        </div>

        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Save" @click="createSubsystem()"></Button>
        </div>
      </div>
    </Dialog>
    <confirmUpdateDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import confirmUpdateDialog from '@/components/confirmUpdateDialog.vue';

import MultiSelect from 'primevue/multiselect';

import filterSubSystemView from './filterSubSystemView.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { ApiSubsystem } from './api';
import { PowerSystemParameterApi } from '../PowerSystem/api';
const visible = ref(false);
const toast = useToast();
const confirm = useConfirm();

onMounted(async () => {
  await getListSubSystem();
});

const listSubSystem = ref([]);
const getListSubSystem = async () => {
  try {
    const res = await ApiSubsystem.getListSubsystemOnlyName();
    listSubSystem.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const selectedItem = ref({});

const handleRowClick = async (item) => {
  if (item._id === selectedItem.value._id) {
    return;
  }
  try {
    const res = await ApiSubsystem.getSubsystemData(item._id);
    selectedItem.value = res.data;
    selectedItem.value._id = item._id;

    const { filterConditions } = selectedItem.value;
    const newFilter = {
      area: {
        value: filterConditions.area.value.map((item) => item._id),
        type: filterConditions.area.type.map((item) => item._id),
      },
      zone: {
        value: filterConditions.zone.value.map((item) => item._id),
        type: filterConditions.zone.type.map((item) => item._id),
      },
      owner: {
        value: filterConditions.owner.value.map((item) => item._id),
        type: filterConditions.owner.type.map((item) => item._id),
      },
      kV: {
        value: filterConditions.kV.value.map((item) => item._id),
        type: filterConditions.kV.type.map((item) => item._id),
      },
      station: {
        value: filterConditions.station.value.map((item) => item._id),
        type: filterConditions.station.type.map((item) => item._id),
      },
      powersystem: filterConditions.powerSystem.map((item) => item._id),

      filtering: filterConditions.filtering,
      stationSort: [],
    };

    await changeFilter(newFilter);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmUpdate = async (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'updateDialog',
    header: 'Update Sub System',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Update',
    accept: async () => {
      await updateSubsytem();
    },
  });
};
const updateSubsytemItem = (newVal) => {
  listSubSystem.value = listSubSystem.value.map((item) => {
    if (item._id === newVal._id) {
      return newVal;
    } else {
      return item;
    }
  });
};

const updateSubsytem = async () => {
  try {
    await ApiSubsystem.updateSubsystemData(selectedItem.value._id, selectedItem.value);
    updateSubsytemItem(selectedItem.value);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Update successfully', life: 3000 });
  } catch (error) {
    console.log(error);

    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const saveFilter = async (newfilter) => {
  try {
    await ApiSubsystem.updateSubsystemData(selectedItem.value._id, {
      name: selectedItem.value.name,
      filterConditions: newfilter,
      active: selectedItem.value.active,
    });
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Saved successfully', life: 3000 });
  } catch (error) {
    console.log(error);

    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const formItemCreate = ref({
  name: '',
  active: false,
});

const handlerCreate = () => {
  formItemCreate.value = {
    name: '',
    active: false,
  };
  visible.value = true;
};

const createSubsystem = async () => {
  try {
    const res = await ApiSubsystem.createSubsystem(formItemCreate.value);
    listSubSystem.value.push(res.data);
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// --- ps Data - parameter

const filterData = ref([]);

const changeFilter = async (newfilter) => {
  filterData.value = newfilter;
  stationSearchSelected.value = [];
  await getParameterList();
  await getStationList();
};

const pageRowNumber = ref(10);
const parameterData = ref([]);
const parameterTotal = ref(0);
const parameterCurrentPage = ref(1);
const parameterTotalPaginatorOffset = computed(() => pageRowNumber.value * parameterCurrentPage.value - 1);
const isParameterLoading = ref(false);
const onParameterPageChange = async (event) => {
  parameterCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getParameterList();
};
const getParameterList = async () => {
  isParameterLoading.value = true;
  try {
    const res = await PowerSystemParameterApi.getPsDataWithSubsystem(filterData.value, parameterCurrentPage.value);
    parameterData.value = res.data.items;
    parameterTotal.value = res.data.total;
  } catch (error) {
    parameterData.value = [];
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
  isParameterLoading.value = false;
};

const confirmDeleteThis = (id) => {
  confirm.require({
    message: 'Do you want to delete this sub-system?',
    group: 'dialog',
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteThis(id);
    },
    reject: () => {},
  });
};
const deleteThis = async (id) => {
  try {
    await ApiSubsystem.deleteSubsystem(id);
    // getListSubSystem();
    listSubSystem.value = listSubSystem.value.filter((item) => item._id != id);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// search station name
const stationSearchSelected = ref([]);
const psStationList = ref([]);
const getStationList = async () => {
  try {
    const res = await PowerSystemParameterApi.getStationListFollowSubsystemFilter(filterData.value);
    psStationList.value = res.data;
  } catch (error) {
    psStationList.value = [];
    console.warn('getStationListFollowSubsystemFilter err', error);
  }
};

const changeStationFilter = async () => {
  filterData.value.stationSort = stationSearchSelected.value.map((item) => item._id);
  await getParameterList();
};
</script>

<style lang="scss" scoped>
.item-data:hover {
  cursor: pointer;
  background-color: var(--surface-hover);
}

.selected-item {
  background-color: var(--highlight-bg) !important;
}
.item-button:hover {
  transform: scale(1.3);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}
</style>

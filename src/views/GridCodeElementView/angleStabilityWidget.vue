<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Angle Stability</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateAngleStability" />
      </div>

      <ScrollPanel style="width: 100%; height: 46rem">
        <DataView
          :value="angleStabilityList"
          class="w-full flex-1"
          :class="{ 'px-3': angleStabilityList.length === 0 }"
        >
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': index === angleStabilityKeySelected,
                  }"
                  @click="angleStabilityClick(index)"
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
                      @click="confirmDeleteAngleStability($event, item, index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </ScrollPanel>
    </SplitterPanel>

    <SplitterPanel class="h-full" :size="75">
      <TabView>
        <TabPanel header="Common">
          <div v-if="angleStabilityData._id" class="p-3">
            <angleStabilityForm v-model:formData="angleStabilityData" />

            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Update" @click="updateAngleStability"></Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Angle Restore Time">
          <div style="height: 41rem">
            <DataTable
              id="gridcodeTable"
              class="w-full h-full"
              :value="restoreTimeList"
              showGridlines
              :loading="isLoadingRestoreTime"
            >
              <template #header>
                <div class="flex justify-content-between align-items-center gap-3">
                  <div class="font-semibold white-space-nowrap text-xl">Restore Time</div>
                  <Button
                    type="button"
                    icon="pi pi-plus"
                    text
                    :disabled="!angleStabilityData._id"
                    @click="handleCreateRestoreTime"
                  />
                </div>
              </template>

              <ColumnGroup type="header">
                <Row>
                  <Column header="Name" :rowspan="2" />
                  <Column header="Active" :rowspan="2" />
                  <Column header="Unit" :rowspan="2" />
                  <Column header="Damping Requirement" :rowspan="2" />
                  <Column header="Restore Time" :rowspan="2" />

                  <Column :colspan="2">
                    <template #header>
                      <div class="block w-full text-center">Instantaneous</div>
                    </template>
                  </Column>
                  <Column :colspan="2">
                    <template #header>
                      <div class="block w-full text-center">Frequency Oscillation</div>
                    </template>
                  </Column>

                  <Column :colspan="2">
                    <template #header>
                      <div class="block w-full text-center">Stable</div>
                    </template>
                  </Column>
                  <Column :rowspan="2" />
                </Row>
                <Row>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Min</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Max</div>
                    </template>
                  </Column>

                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Lower</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Upper</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Lower</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Upper</div>
                    </template>
                  </Column>
                </Row>
              </ColumnGroup>
              <Column header="Name" field="name" class="capitalize">
                <template #body="{ data }">
                  <div style="min-width: 6rem">{{ data.name }}</div>
                </template>
              </Column>
              <Column field="active" header="Active">
                <template #body="{ data }">
                  <Tag
                    :severity="data.active ? 'primary' : 'secondary'"
                    class="capitalize"
                    :value="String(data.active)"
                  ></Tag>
                </template>
              </Column>
              <Column field="unit" header="Unit" style="text-wrap: nowrap" />
              <Column field="dampingRequirement" header="Damping Requirement" style="text-wrap: nowrap" />
              <Column field="restoreTime" header="Restore Time" style="text-wrap: nowrap" />

              <Column field="InstantaneousMin" header="Instantaneous Min" style="text-wrap: nowrap" />
              <Column field="InstantaneousMax" header="Instantaneous Max" style="text-wrap: nowrap" />

              <Column field="freqOscillationLower" header="Frequency Oscillation Lower" style="text-wrap: nowrap" />
              <Column field="freqOscillationUpper" header="Frequency Oscillation Upper" style="text-wrap: nowrap" />

              <Column field="stableLower" header="Stable Lower" style="text-wrap: nowrap" />
              <Column field="stableUpper" header="Stable Upper" style="text-wrap: nowrap" />
              <Column style="width: 4rem; padding-top: 0; padding-bottom: 0">
                <template #body="{ data }">
                  <div class="flex w-full justify-content-between align-items-center">
                    <Button
                      icon="pi pi-pencil"
                      severity="success"
                      text
                      rounded
                      @click="handleUpdateRestoreTime(data)"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      @click="confirmDeleteRestoreTime($event, data)"
                    />
                  </div>
                </template>
              </Column>
              <template #empty> No data </template>
            </DataTable>
          </div>
          <div class="flex justify-content-end align-items-center mt-3">
            <Paginator
              v-if="totalRestoreTimeRecord > pageRowNumber"
              v-model:first="paginatorOffsetRestoreTime"
              class="flex-grow-1"
              :rows="pageRowNumber"
              :totalRecords="totalRestoreTimeRecord"
              :page="currentRestoreTimePage"
              @page="onRestoreTimePageChange"
            ></Paginator>
            <div class="mr-3">Total: {{ totalRestoreTimeRecord }}</div>
          </div>
        </TabPanel>
      </TabView>
    </SplitterPanel>
  </Splitter>

  <Dialog
    v-model:visible="createAngleStabilityVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Angle Stability</span>
      </div>
    </template>

    <angleStabilityForm v-model:formData="newAngleStability" />

    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="createAngleStabilityVisibleDialog = false"
      ></Button>
      <Button type="button" label="Save" :disabled="!newAngleStability.name" @click="createAngleStability"></Button>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="createRestoreTimeVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Angle Restore Time</span>
      </div>
    </template>

    <angleRestoreTimeForm v-model:formData="newRestoreTime" />
    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="createRestoreTimeVisibleDialog = false"
      ></Button>
      <Button type="button" label="Save" :disabled="!newRestoreTime.name" @click="createRestoreTime"></Button>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="updateRestoreTimeVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Angle Restore Time</span>
      </div>
    </template>

    <angleRestoreTimeForm v-model:formData="editRestoreTime" />
    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="updateRestoreTimeVisibleDialog = false"
      ></Button>
      <Button type="button" label="Save" :disabled="!editRestoreTime.name" @click="updateRestoreTime"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ScrollPanel from 'primevue/scrollpanel';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import angleRestoreTimeForm from './angleRestoreTimeForm.vue';
import angleStabilityForm from './angleStabilityForm.vue';
import { ApiAngleStability } from './api';
import { onMounted } from 'vue';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  gridcodeId: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  await getAngleStabilityList();
});
const angleStabilityList = ref([]);

const getAngleStabilityList = async () => {
  try {
    const res = await ApiAngleStability.getAngleStabilityList(props.gridcodeId);
    angleStabilityList.value = res.data;
  } catch (error) {
    angleStabilityList.value = [];
    console.log('getVsaCaseList error', error);
  }
};

const angleStabilityKeySelected = ref();
const angleStabilityData = ref({});
const angleStabilityClick = async (index) => {
  angleStabilityKeySelected.value = index;
  await getAngleStabilityData();
  await getAngleRestoreTimeList();
};
// -- angleStability- crud

const getAngleStabilityData = async () => {
  try {
    const res = await ApiAngleStability.getAngleStabilityById(
      angleStabilityList.value[angleStabilityKeySelected.value]._id,
    );
    angleStabilityData.value = res.data;
  } catch (error) {
    angleStabilityData.value = {};
    console.log('getAngleStabilityData error', error);
  }
};
const newAngleStability = ref();
const createAngleStabilityVisibleDialog = ref(false);

const handlerCreateAngleStability = () => {
  newAngleStability.value = {
    active: true,
    instantaneousMax: 1,
    instantaneousMin: -1,
    unitType: 3,
    name: '',
  };
  createAngleStabilityVisibleDialog.value = true;
};

const createAngleStability = async () => {
  try {
    const res = await ApiAngleStability.createAngleStability(props.gridcodeId, newAngleStability.value);
    // await getAngleStabilityList();
    angleStabilityList.value.push(res.data);
    angleStabilityKeySelected.value = angleStabilityList.value.length - 1;
    angleStabilityData.value = res.data;

    createAngleStabilityVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const updateAngleStability = async () => {
  try {
    await ApiAngleStability.updateAngleStability(angleStabilityData.value._id, angleStabilityData.value);
    await getAngleStabilityList();
    await getAngleStabilityData();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateVsaCase error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteAngleStability = (event, angleStability, index) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Angle Stability - ' + angleStability.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteAngleStabilityData(angleStability._id, index);
    },
    reject: () => {},
  });
};

const deleteAngleStabilityData = async (angleStabilityId, delIndex) => {
  try {
    await ApiAngleStability.deleteAngleStability(angleStabilityId);
    // await getAngleStabilityList();
    angleStabilityList.value.splice(delIndex, 1);
    angleStabilityKeySelected.value = undefined;
    angleStabilityData.value = {};
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};

// Angle Restore Time

const restoreTimeList = ref();
const isLoadingRestoreTime = ref(false);
const pageRowNumber = ref(10);
const currentRestoreTimePage = ref(1);
const totalRestoreTimeRecord = ref(0);
const paginatorOffsetRestoreTime = computed(() => pageRowNumber.value * currentRestoreTimePage.value - 1);
const onRestoreTimePageChange = async (event) => {
  currentRestoreTimePage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getAngleRestoreTimeList();
};
const getAngleRestoreTimeList = async () => {
  try {
    const res = await ApiAngleStability.getAngleRestoreTimeList(
      angleStabilityData.value._id,
      currentRestoreTimePage.value,
    );
    restoreTimeList.value = res.data.items;
    totalRestoreTimeRecord.value = res.data.total;
  } catch (error) {
    restoreTimeList.value = [];
    totalRestoreTimeRecord.value = 0;
    console.log('getVsaCaseList error', error);
  }
};
const newRestoreTime = ref();
const createRestoreTimeVisibleDialog = ref(false);

const handleCreateRestoreTime = () => {
  newRestoreTime.value = {
    name: '',
    active: true,
    InstantaneousMax: 1,
    InstantaneousMin: -1,
    dampingRequirement: 0.5,
    freqOscillationLower: 0.5,
    freqOscillationUpper: 1.5,
    restoreTime: 5,
    stableLower: -1,
    stableUpper: 1,
    unit: 1,
  };
  createRestoreTimeVisibleDialog.value = true;
};

const createRestoreTime = async () => {
  try {
    await ApiAngleStability.createAngleRestoreTime(angleStabilityData.value._id, newRestoreTime.value);
    await getAngleRestoreTimeList();
    createRestoreTimeVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const editRestoreTime = ref();
const updateRestoreTimeVisibleDialog = ref(false);
const handleUpdateRestoreTime = (data) => {
  editRestoreTime.value = JSON.parse(JSON.stringify(data));
  updateRestoreTimeVisibleDialog.value = true;
};
const updateRestoreTime = async () => {
  try {
    await ApiAngleStability.updateAngleRestoreTime(editRestoreTime.value._id, editRestoreTime.value);
    await getAngleRestoreTimeList();
    updateRestoreTimeVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateVsaCase error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteRestoreTime = (event, restoreTime) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Angle Restore Time - ' + restoreTime.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteRestoreTime(restoreTime._id);
    },
    reject: () => {},
  });
};

const deleteRestoreTime = async (id) => {
  try {
    await ApiAngleStability.deleteAngleRestoreTime(id);
    await getAngleRestoreTimeList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};
</script>

<style>
.item-data:hover {
  cursor: pointer;
  background-color: var(--highlight-bg);
}

.selected-item {
  background-color: var(--highlight-bg);
}
</style>

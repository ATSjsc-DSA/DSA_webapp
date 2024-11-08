<template>
  <ConfirmDialog />
  <Toast />
  <div class="card layout-content min-h-full">
    <div style="height: 52rem">
      <DataTable id="gridcodeTable" class="w-full h-full" :value="gridCodeList" :loading="isLoading">
        <template #header>
          <div class="flex justify-content-between gap-3">
            <div class="font-semibold white-space-nowrap text-xl">Grid Code</div>
            <Button type="button" label="Create " icon="pi pi-plus" text @click="handleCreate" />
          </div>
        </template>

        <Column header="Name" field="name" class="capitalize" />
        <Column field="active" header="Active">
          <template #body="{ data }">
            <Tag
              :severity="data.active ? 'primary' : 'secondary'"
              class="capitalize"
              :value="String(data.active)"
            ></Tag>
          </template>
        </Column>
        <Column field="startTimestamp" header="Start Timestamp" style="text-wrap: nowrap">
          <template #body="{ data }">
            <span>{{ convertDateTimeToString(data.startTimestamp) }}</span>
          </template>
        </Column>
        <Column field="endTimestamp" header="End Timestamp" style="text-wrap: nowrap">
          <template #body="{ data }">
            <span>{{ convertDateTimeToString(data.endTimestamp) }}</span>
          </template>
        </Column>
        <Column style="width: 1%; min-width: 5rem">
          <template #body="{ data }">
            <div class="flex justify-content-between">
              <Button icon="pi pi-pencil" severity="success" text rounded @click="handleUpdate(data)" />

              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete($event, data)" />
              <router-link :to="`/gridcode/element/${data._id}`">
                <Button icon="pi pi-caret-right" text rounded />
              </router-link>
            </div>
          </template>
        </Column>

        <template #empty> No data </template>
      </DataTable>
    </div>
    <div class="flex justify-content-end align-items-center mt-3">
      <Paginator
        v-if="totalRecord > pageRowNumber"
        v-model:first="paginatorOffset"
        class="flex-grow-1"
        :rows="pageRowNumber"
        :totalRecords="totalRecord"
        :page="currentPage"
        @page="onPageChange"
      ></Paginator>
      <div class="mr-3">Total: {{ totalRecord }}</div>
    </div>
  </div>

  <Dialog v-model:visible="changeVisibleDialog" :style="{ width: '48rem' }" header="Change Dialog " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code</span>
      </div>
    </template>
    <div class="grid align-items-center">
      <div class="col-8">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="areaname" class="font-semibold w-6rem"> Name</label>
          <InputText id="areaname" v-model="changeData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="changeData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="startTimestamp" class="font-semibold"> Start Timestamp </label>
          <Calendar v-model="changeData.startTimestamp" showTime showIcon showButtonBar showSeconds />
        </div>
      </div>

      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="endTimestamp" class="font-semibold"> End Timestamp </label>
          <Calendar
            v-model="changeData.endTimestamp"
            :minDate="changeData.startTimestamp"
            showTime
            showIcon
            showButtonBar
            showSeconds
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeVisibleDialog = false"></Button>
      <Button
        v-if="changeMode === 'Create'"
        type="button"
        label="Save"
        :disabled="!changeData.name"
        @click="createGridCode"
      ></Button>
      <Button
        v-if="changeMode === 'Update'"
        type="button"
        label="Update"
        severity="info"
        :disabled="!changeData.name"
        @click="updateGridCode"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Toast from 'primevue/toast';
import Calendar from 'primevue/calendar';

import { useToast } from 'primevue/usetoast';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import { Api } from './api';

const confirm = useConfirm();

const toast = useToast();

onMounted(async () => {
  await getGridCodeList();
  // await getDynamicMappingList();
});

const gridCodeList = ref([]);
const isLoading = ref(false);
const pageRowNumber = ref(10);
const currentPage = ref(1);
const totalRecord = ref();
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);
const onPageChange = async (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getGridCodeList();
};

const getGridCodeList = async () => {
  isLoading.value = true;
  try {
    const res = await Api.getGridCodeList(currentPage.value);
    gridCodeList.value = res.data.items;
    totalRecord.value = res.data.total;
  } catch (error) {
    gridCodeList.value = [];
    totalRecord.value = 0;
    console.error('setGlobaldefinitionList error', error);
  }
  isLoading.value = false;
};

// --- crud
const changeVisibleDialog = ref(false);
const changeMode = ref();
const changeData = ref({
  active: true,
  name: '',
  endTimestamp: new Date(),
  startTimestamp: new Date(),
});
const handleCreate = () => {
  changeMode.value = 'Create';
  changeData.value = {
    active: true,
    name: '',
    endTimestamp: new Date(),
    startTimestamp: new Date(),
  };
  changeVisibleDialog.value = true;
};
const getChangeData = () => {
  return {
    name: changeData.value.name,
    active: changeData.value.active,
    endTimestamp: new Date(changeData.value.startTimestamp).getTime(),
    startTimestamp: new Date(changeData.value.endTimestamp).getTime(),
  };
};
const createGridCode = async () => {
  try {
    await Api.createGridCode(getChangeData());
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    changeData.value = false;
    await getGridCodeList();
    changeVisibleDialog.value = false;
  } catch (error) {
    console.error('getDependencyList: error ', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
const handleUpdate = (data) => {
  changeMode.value = 'Update';
  const oldData = JSON.parse(JSON.stringify(data));
  oldData.startTimestamp = new Date(oldData.startTimestamp);
  oldData.endTimestamp = new Date(oldData.endTimestamp);
  changeData.value = oldData;
  changeVisibleDialog.value = true;
};
const updateGridCode = async () => {
  try {
    await Api.updateGridCode(changeData.value._id, getChangeData());
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
    changeData.value = false;
    await getGridCodeList();
    changeVisibleDialog.value = false;
  } catch (error) {
    console.error('getDependencyList: error ', error);
    toast.add({ severity: 'error', summary: 'Update Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDelete = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Grid Code',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteGridCode(data._id);
    },
  });
};
const deleteGridCode = async (id) => {
  try {
    await Api.deleteGridcode(id);
    await getGridCodeList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.error('deleteDependency: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

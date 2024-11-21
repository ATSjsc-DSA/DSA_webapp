<template>
  <div style="height: 42rem">
    <DataTable :value="dependencyList" tableStyle="min-width: 50rem" size="small">
      <template #header>
        <div class="flex justify-content-end">
          <Button type="button" icon="pi pi-plus" size="small" text @click="createVisibleDialog = true" />
        </div>
      </template>
      <Column field="name" header="Name" frozen style="width: 15%; text-wrap: nowrap"> </Column>
      <Column field="active" header="Active">
        <template #body="{ data }">
          <Tag :severity="data.active ? 'primary' : 'secondary'" :value="String(data.active)"></Tag>
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
      <Column field="rateAbnormal" header="Rate Abnormal" style="text-wrap: nowrap" />
      <Column field="rateCritical1" header="Rate Critical 1" style="text-wrap: nowrap" />
      <Column field="rateCritical2" header="Rate Critical 2" style="text-wrap: nowrap" />
      <Column field="rateCritical3" header="Rate Critical 3" style="text-wrap: nowrap" />
      <Column style="width: 1%; min-width: 5rem">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdateDependency(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDeleteDependency($event, data)" />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
  </div>
  <div class="flex justify-content-end align-items-center">
    <Paginator
      v-if="dependencyTotal > pageRowNumber"
      v-model:first="paginatorOffset"
      class="flex-grow-1"
      :rows="pageRowNumber"
      :totalRecords="dependencyTotal"
      :page="currentPage"
      @page="onPageChange"
    ></Paginator>
    <div class="mr-3">Total: {{ dependencyTotal }}</div>
  </div>
  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Offline Plan</span>
      </div>
    </template>
    <div class="grid">
      <div class="col-8">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="areaname" class="font-semibold w-6rem"> Name</label>
          <InputText id="areaname" v-model="newData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="newData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="startTimestamp" class="font-semibold"> Start Timestamp </label>
          <Calendar v-model="newData.startTimestamp" showTime showIcon showSeconds />
        </div>
      </div>

      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="endTimestamp" class="font-semibold"> End Timestamp </label>
          <Calendar v-model="newData.endTimestamp" :minDate="newData.startTimestamp" showTime showIcon showSeconds />
        </div>
      </div>

      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateAbnormal" class="font-semibold"> Rate Abnormal </label>
          <InputNumber
            id="rateAbnormal"
            v-model="newData.rateAbnormal"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical1" class="font-semibold"> Rate Critical1 </label>
          <InputNumber
            id="rateCritical1"
            v-model="newData.rateCritical1"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical2" class="font-semibold"> Rate Critical2 </label>
          <InputNumber
            id="rateCritical2"
            v-model="newData.rateCritical2"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical3" class="font-semibold"> Rate Critical3 </label>
          <InputNumber
            id="rateCritical3"
            v-model="newData.rateCritical3"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newData.name" @click="createDependency"></Button>
    </template>
  </Dialog>
  <!-- update dialog data -->
  <Dialog v-model:visible="updateVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Offline Plan</span>
      </div>
    </template>
    <div class="grid">
      <div class="col-8">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="areaname" class="font-semibold w-6rem"> Name</label>
          <InputText id="areaname" v-model="updateData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="updateData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="startTimestamp" class="font-semibold"> Start Timestamp </label>
          <Calendar v-model="updateData.startTimestamp" showTime showIcon showSeconds />
        </div>
      </div>

      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="endTimestamp" class="font-semibold"> End Timestamp </label>
          <Calendar v-model="updateData.endTimestamp" showTime showIcon showSeconds />
        </div>
      </div>

      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateAbnormal" class="font-semibold"> Rate Abnormal </label>
          <InputNumber
            id="rateAbnormal"
            v-model="updateData.rateAbnormal"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical1" class="font-semibold"> Rate Critical1 </label>
          <InputNumber
            id="rateCritical1"
            v-model="updateData.rateCritical1"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical2" class="font-semibold"> Rate Critical2 </label>
          <InputNumber
            id="rateCritical2"
            v-model="updateData.rateCritical2"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="rateCritical3" class="font-semibold"> Rate Critical3 </label>
          <InputNumber
            id="rateCritical3"
            v-model="updateData.rateCritical3"
            :maxFractionDigits="5"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="updateVisibleDialog = false"></Button>
      <Button type="button" label="Update" @click="updateDependency"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
const toast = useToast();
const confirm = useConfirm();
import { ApiDsa } from './api';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

const props = defineProps({
  dependencyId: {
    type: String,
    default: '',
  },
});
onMounted(async () => {
  await getDependencyList();
});

watch(
  () => props.dependencyId,
  async () => {
    await getDependencyList();
  },
);

const pageRowNumber = ref(10);
const dependencyTotal = ref(0);
const currentPage = ref(1);
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getDependencyList();
};
const dependencyList = ref();
const getDependencyList = async () => {
  try {
    const res = await ApiDsa.getDependencyList(props.dependencyId, currentPage.value);
    dependencyList.value = res.data.items;
    dependencyTotal.value = res.data.total;
  } catch (error) {
    dependencyList.value = [];
    dependencyTotal.value = 0;
    console.error('getDependencyList: error ', error);
  }
};
const createVisibleDialog = ref(false);
const newData = ref({
  name: '',
  startTimestamp: new Date(),
  endTimestamp: new Date(),
  rateAbnormal: 0,
  rateCritical1: 0,
  rateCritical2: 0,
  rateCritical3: 0,
  active: true,
});

const createDependency = async () => {
  const data = JSON.parse(JSON.stringify(newData.value));
  data.startTimestamp = parseInt(new Date(data.startTimestamp).getTime() / 1000);
  data.endTimestamp = parseInt(new Date(data.endTimestamp).getTime() / 1000);
  try {
    await ApiDsa.createDependency(props.dependencyId, data);
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    createVisibleDialog.value = false;
    await getDependencyList();
  } catch (error) {
    console.error('getDependencyList: error ', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
const updateVisibleDialog = ref(false);
const updateData = ref();
const handleUpdateDependency = (data) => {
  const rawData = JSON.parse(JSON.stringify(data));
  rawData.startTimestamp = new Date(rawData.startTimestamp * 1000);
  rawData.endTimestamp = new Date(rawData.endTimestamp * 1000);
  updateData.value = rawData;
  updateVisibleDialog.value = true;
};
const updateDependency = async () => {
  const data = JSON.parse(JSON.stringify(updateData.value));
  data.startTimestamp = parseInt(new Date(data.startTimestamp).getTime() / 1000);
  data.endTimestamp = parseInt(new Date(data.endTimestamp).getTime() / 1000);
  try {
    await ApiDsa.updateDependency(data._id, data);
    await getDependencyList();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
    updateVisibleDialog.value = false;
  } catch (error) {
    console.error('deleteDependency: error ', error);
    toast.add({ severity: 'error', summary: 'Update Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteDependency = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Dependency',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    data: data,
    accept: async () => {
      await deleteDependency(data._id);
    },
  });
};
const deleteDependency = async (id) => {
  try {
    await ApiDsa.delDependency(id);
    await getDependencyList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.error('deleteDependency: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<template>
  <div>
    <DataTable :value="data" stripedRows showGridlines size="small" scrollable scrollHeight="20rem">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <div class="fonts-semibold text-lg">Disturbance list ({{ recordTotal }})</div>

          <Button type="button" icon="pi pi-plus" size="small" text @click="handleCreate" />
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="powerSystemId" header="Power System">
        <template #body="{ data }">
          <div>
            <span> {{ data.powerSystemId.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="disturbanceEvenType" header="Event Type">
        <template #body="{ data }">
          <Chip :label="getDisturbanceEventType(data.disturbanceEvenType)" />
        </template>
      </Column>
      <Column field="startTimestamp" header="Start Time" sortable style="width: 18%"> </Column>
      <Column field="endTimestamp" header="End Time" sortable style="width: 18%" />
      <Column field="eventValue" header="Event Value">
        <template #body="{ data }">
          <Chip :label="getEventValue(data.eventValue)" />
        </template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" rounded text class="mr-2" @click="handlerUpdate(data)" />
          <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete($event, data)" />
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
    <div class="flex justify-content-end align-items-center pt-1">
      <Paginator
        v-if="recordTotal > pageRowNumber"
        v-model:first="paginatorOffset"
        class="flex-grow-1"
        :rows="pageRowNumber"
        :totalRecords="recordTotal"
        :page="currentPage"
        @page="onPageChange"
      ></Paginator>
    </div>
  </div>
  <Dialog v-model:visible="changeVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Disturbance</span>
      </div>
    </template>
    <div class="grid align-items-start">
      <div class="col-10">
        <div class="flex flex-column gap-2 mb-3">
          <label for="caseName" class="font-semibold"> Name </label>
          <InputText id="caseName" v-model="disturbanceData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-2">
        <div class="flex flex-column align-items-start gap-3 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="disturbanceData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <searchPsWidget v-model="psSelected" />
      </div>
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="disturbanceType" class="font-semibold">Disturbance Type</label>
          <Dropdown
            v-model="disturbanceType"
            :options="listDisturbanceType"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Type"
            class="w-full"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="disturbanceEvenType" class="font-semibold">Disturbance Event Type</label>
          <Dropdown
            v-model="disturbanceData.disturbanceEvenType"
            :options="disturbanceType === 0 ? listDisturbanceEventTypeSC : listDisturbanceEventTypeSwitch"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Event"
            class="w-full"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="eventValue" class="font-semibold">Event Value</label>
          <Dropdown
            v-model="disturbanceData.eventValue"
            :options="listEventValue"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Value"
            class="w-full"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="startTimestamp" class="font-semibold"> Start Timestamp </label>
          <Calendar v-model="disturbanceData.startTimestamp" showTime showIcon showSeconds />
        </div>
      </div>

      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="endTimestamp" class="font-semibold"> End Timestamp </label>
          <Calendar
            v-model="disturbanceData.endTimestamp"
            :minDate="disturbanceData.startTimestamp"
            showTime
            showIcon
            showSeconds
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeVisibleDialog = false"></Button>
      <Button v-if="modeChange === 'Create'" type="button" label="Save" @click="createDisturbance"></Button>
      <Button v-if="modeChange === 'Update'" type="button" label="Update" @click="updateDisturbance"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { ApiDisturbance } from '@/views/SystemEvents/api';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
import searchPsWidget from '../PowerSystem/searchPsWidget.vue';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  await getDisturbanceList();
});

const data = ref([]);
// ----- Disturbance
const pageRowNumber = ref(10);
const recordTotal = ref(0);
const currentPage = ref(1);
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getDisturbanceList();
};
const getDisturbanceList = async () => {
  try {
    const res = await ApiDisturbance.getDisturbanceList(props.caseId, currentPage.value);
    data.value = res.data.items;
    recordTotal.value = res.data.total;
  } catch (error) {
    console.log('getScadaList: error ', error);
  }
};

// Disturbance - CRUD
const modeChange = ref();
const changeVisibleDialog = ref(false);
const disturbanceData = ref();
const handleCreate = () => {
  modeChange.value = 'Create';
  psSelected.value = {};
  disturbanceData.value = {
    active: true,
    name: '',
    powerSystemId: '',
    startTimestamp: new Date(),
    endTimestamp: new Date(),
    disturbanceEvenType: 0,
    eventValue: 0,
  };
  changeVisibleDialog.value = true;
};
const psSelected = ref();

const createDisturbance = async () => {
  const data = JSON.parse(JSON.stringify(disturbanceData.value));
  data.startTimestamp = new Date(data.startTimestamp).getTime();
  data.endTimestamp = new Date(data.endTimestamp).getTime();
  data.powerSystemId = psSelected.value._id;
  try {
    await ApiDisturbance.createDisturbance(props.caseId, data);
    await getDisturbanceList();
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('getScadaList: error ', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const handlerUpdate = (data) => {
  modeChange.value = 'Update';
  const updateData = JSON.parse(JSON.stringify(data));
  updateData.startTimestamp = new Date(data.startTimestamp);
  updateData.endTimestamp = new Date(data.endTimestamp);
  psSelected.value = {
    _id: data.powerSystemId._id,
    name: data.powerSystemId.name,
  };
  disturbanceData.value = updateData;
  changeVisibleDialog.value = true;
};

const updateDisturbance = async () => {
  try {
    const data = JSON.parse(JSON.stringify(disturbanceData.value));
    data.startTimestamp = new Date(data.startTimestamp).getTime();
    data.endTimestamp = new Date(data.endTimestamp).getTime();
    data.powerSystemId = psSelected.value._id;
    await ApiDisturbance.updateDisturbanceData(data._id, data);
    await getDisturbanceList();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('getScadaList: error ', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDelete = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Disturbance',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteDisturbance(data);
    },
  });
};
const deleteDisturbance = async (data) => {
  try {
    await ApiDisturbance.deleteDisturbance(data._id);
    await getDisturbanceList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('deleteDisturbance: error ', error);
    toast.add({ severity: 'error', summary: 'Deleted Message', detail: error.data.detail, life: 3000 });
  }
};
const disturbanceType = ref(0);

const listDisturbanceType = [
  { name: 'Short Circuit', value: 0 },
  { name: 'Switch', value: 1 },
];

const getDisturbanceEventType = (value) => {
  switch (value) {
    case 0:
      return 'Three Phase Short Circuit';
    case 1:
      return 'Two Phase Short Circuit';
    case 2:
      return 'Single Phase To Ground Fault';
    case 3:
      return 'Two Phase To Ground Fault';
    case 4:
      return 'Clear Short Circuit';
    case 5:
      return 'One Phase To Neutral';
    case 6:
      return 'One Phase Neutral To Ground';
    case 7:
      return 'Two Phase Neutral To Ground';
    case 8:
      return 'Two Phase To Neutral';
    case 9:
      return 'Three Phase Neutral To Ground';
    case 10:
      return 'Three Phase To Neutral';
    case 11:
      return 'All Phases';
    case 12:
      return 'Phase A';
    case 13:
      return 'Phase B';
    case 14:
      return 'Phase C';
    case 15:
      return 'Phase A Phase B';
    case 16:
      return 'Phase A Phase C';
    case 17:
      return 'Phase B Phase C';
    default:
      return 'Unknown';
  }
};
const listDisturbanceEventTypeSC = [
  { name: 'Three Phase Short Circuit', value: 0 },
  { name: 'Two Phase Short Circuit', value: 1 },
  { name: 'Single Phase To Ground Fault', value: 2 },
  { name: 'Two Phase To Ground Fault', value: 3 },
  { name: 'Clear Short Circuit', value: 4 },
  { name: 'One Phase To Neutral', value: 5 },
  { name: 'One Phase Neutral To Ground', value: 6 },
  { name: 'Two Phase Neutral To Ground', value: 7 },
  { name: 'Two Phase To Neutral', value: 8 },
  { name: 'Three Phase Neutral To Ground', value: 9 },
  { name: 'Three Phase To Neutral', value: 10 },
];

const listDisturbanceEventTypeSwitch = [
  { name: 'All Phases', value: 11 },
  { name: 'Phase A', value: 12 },
  { name: 'Phase B', value: 13 },
  { name: 'Phase C', value: 14 },
  { name: 'Phase A Phase B', value: 15 },
  { name: 'Phase A Phase C', value: 16 },
];

const getEventValue = (value) => {
  switch (value) {
    case 0:
      return 'ON';
    case 1:
      return 'OFF';
    default:
      return 'ON';
  }
};
const listEventValue = [
  { name: 'ON', value: 0 },
  { name: 'OFF', value: 1 },
];
</script>

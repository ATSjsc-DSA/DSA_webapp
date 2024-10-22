<template>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
  <div class="card">
    <DataTable
      :value="disturbances"
      paginator
      :rows="10"
      :totalRecords="totalList"
      rowGroupMode="rowspan"
      sortMode="single"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      @page="onPageChange"
      :sortOrder="1"
      rowHover
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List Disturbance</span>
          <Button icon="pi pi-plus" rounded text raised @click="handlerCreateThis()" />
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
      <Column :exportable="false" style="width: 8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded text class="mr-2" @click="handlerEditThis(slotProps.data)" />
          <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete($event, slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <!-- Dialog -->

    <Dialog v-model:visible="visible" modal :header="headerDialog + ' Disturbance'" :style="{ width: '35rem' }">
      <span class="p-text-secondary block mb-5">{{ disturbanceModelData.name }}</span>
      <div class="p-fluid">
        <div class="field">
          <label for="name" class="font-semibold">Name</label>
          <InputText id="name" class="flex-auto" autocomplete="off" v-model="disturbanceModelData.name" />
        </div>
        <div class="field">
          <div class="grid">
            <div class="col-12 md:col-8">
              <label for="name" class="font-semibold">Power System</label>
              <AutoComplete
                v-model="autoCompleteValue"
                completeOnFocus
                optionLabel="name"
                :suggestions="items"
                @complete="search"
              />
            </div>
            <div class="col-12 md:col-4">
              <label for="name" class="font-semibold">Definition</label>
              <Dropdown
                v-model="selectedDefinition"
                :options="listDefinition"
                optionLabel="name"
                optionValue="_id"
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div class="field">
          <label for="email" class="font-semibold">Disturbance Type</label>
          <Dropdown
            v-model="disturbanceType"
            :options="listDisturbanceType"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Type"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="disturbanceEvenType" class="font-semibold">Disturbance Event Type</label>
          <Dropdown
            v-model="disturbanceModelData.disturbanceEvenType"
            :options="disturbanceType === 0 ? listDisturbanceEventTypeSC : listDisturbanceEventTypeSwitch"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Event"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="eventValue" class="font-semibold">Event Value</label>
          <Dropdown
            v-model="disturbanceModelData.eventValue"
            :options="listEventValue"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Value"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="startTimestamp" class="font-semibold">Start Time</label>
          <InputNumber
            v-model="disturbanceModelData.startTimestamp"
            inputId="minmaxfraction"
            :minFractionDigits="0"
            :maxFractionDigits="2"
          />
        </div>
        <div class="field">
          <label for="endTimestamp" class="font-semibold">End Time</label>
          <InputNumber
            v-model="disturbanceModelData.endTimestamp"
            inputId="minmaxfraction"
            :minFractionDigits="0"
            :maxFractionDigits="2"
          />
        </div>

        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Save" @click="headerDialog === 'Create' ? createThis() : editThis()"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiDisturbance, commonApi } from './api';
import { DefinitionListApi, PowerSystemParameterApi } from '@/views/PowerSystem/api';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import chartComposable from '@/combosables/chartData';
import Calendar from 'primevue/calendar';

const { convertDateTimeToString } = chartComposable();

const props = defineProps({
  itemActive: Object,
});

onMounted(() => {
  getDefiniton();
  getListDisturbance();
});

const popupButton = ref(null); // Để gắn popup vào nút

const itemActive = computed(() => props.itemActive._id);

watch(
  () => props.itemActive,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      console.log('def');

      getListDisturbance();
    }
  },
);

const visible = ref(false);
const toast = useToast();
const confirm = useConfirm();
const disturbanceType = ref(0);
const disturbanceModelData = ref({
  _id: '',
  name: '',
  startTimestamp: 0,
  endTimestamp: 0,
  powerSystemId: '',
  disturbanceEvenType: 0,
  eventValue: 0,
});
const headerDialog = ref('Edit');

const dataDefault = {
  _id: '',
  name: '',
  startTimestamp: 0,
  endTimestamp: 0,
  powerSystemId: '',
  disturbanceEvenType: 0,
  eventValue: 0,
};

const autoCompleteValue = ref({});

const items = ref([]);

const disturbances = ref();
const totalList = ref();
const currentPage = ref(1);
const listDefinition = ref();
const selectedDefinition = ref();

const getDefiniton = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    listDefinition.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getListDisturbance();
};

const getListDisturbance = async () => {
  try {
    const res = await ApiDisturbance.getListDisturbance(itemActive.value, { page: currentPage.value });
    disturbances.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const search = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs(
      '66decf1dcff005199529524b',
      selectedDefinition.value ? [selectedDefinition.value] : [],
      query,
    );
    items.value = res.data;
  } catch (error) {
    console.log('searchPsdQueryFilter: error ', error);
  }
};
// ---------------- data --------------------

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
  }
};
const listEventValue = [
  { name: 'ON', value: 0 },
  { name: 'OFF', value: 1 },
];
// -------------------------------------------------
const confirmDelete = async (event, data) => {
  console.log();
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this Disturbance?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteThis(data);
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
const handlerCreateThis = async () => {
  disturbanceModelData.value = dataDefault;
  visible.value = true;
  headerDialog.value = 'Create';
  autoCompleteValue.value = {};
  // datetimeAsDateStart =
};
const createThis = async () => {
  try {
    console.log(disturbanceModelData.value, 'GISS');

    await ApiDisturbance.createDisturbance(itemActive.value, disturbanceModelData.value);
    getListDisturbance();
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handlerEditThis = async (data) => {
  disturbanceModelData.value = JSON.parse(JSON.stringify(data)); // Tạo bản sao của data
  visible.value = true;
  headerDialog.value = 'Edit';
  const { definitionId, ...rest } = disturbanceModelData.value.powerSystemId;
  autoCompleteValue.value = rest;
  selectedDefinition.value = definitionId;
};

const editThis = async () => {
  try {
    const { _id, ...dataToUpdate } = disturbanceModelData.value;
    await ApiDisturbance.updateDisturbanceData(_id, dataToUpdate);
    getListDisturbance();
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Update successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const deleteThis = async (data) => {
  try {
    await ApiDisturbance.deleteDisturbance(data._id);
    getListDisturbance();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

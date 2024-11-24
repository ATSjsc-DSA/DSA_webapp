<template>
  <div>
    <DataTable :value="data" stripedRows showGridlines size="small" scrollable scrollHeight="20rem">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <div class="fonts-semibold text-lg">Disturbance list ({{ recordTotal }})</div>

          <Button type="button" icon="pi pi-plus" size="small" text @click="handleCreate" />
        </div>
      </template>

      <ColumnGroup type="header">
        <Row>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Name</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Power System</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Start Time</div>
            </template>
          </Column>

          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Event Type</div>
            </template>
          </Column>

          <Column :colspan="3">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Short Circuit</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Switch</div>
            </template>
          </Column>
          <Column :rowspan="2"> </Column>
        </Row>
        <Row>
          <Column>
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Fault</div>
            </template>
          </Column>
          <Column>
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Resistance</div>
            </template>
          </Column>
          <Column>
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Reactance</div>
            </template>
          </Column>
        </Row>
      </ColumnGroup>

      <Column field="name" header="Name"></Column>
      <Column field="powerSystemId" header="Power System">
        <template #body="{ data }">
          <div>
            <span> {{ data.powerSystemId.name }}</span>
          </div>
        </template>
      </Column>

      <Column field="startTimestamp" header="Start Time" sortable style="width: 18%"> </Column>
      <Column field="disturbanceEvenType" header="Event Type">
        <template #body="{ data }">
          <Chip :label="getDisturbanceEventType(data.disturbanceEvenType)" />
        </template>
      </Column>

      <Column field="shcLocation" header="Fault">
        <template #body="{ data }">
          <div v-if="data.disturbanceEvenType <= 10">
            {{ data.shcLocation }}
          </div>
        </template>
      </Column>
      <Column field="resistance" header="Resistance">
        <template #body="{ data }">
          <div v-if="data.disturbanceEvenType <= 10">
            {{ data.resistance }}
          </div>
        </template>
      </Column>
      <Column field="reactance" header="Reactance">
        <template #body="{ data }">
          <div v-if="data.disturbanceEvenType <= 10">
            {{ data.reactance }}
          </div>
        </template>
      </Column>
      <Column field="action" header="Action">
        <template #body="{ data }">
          <div class="flex align-items-center justify-content-center w-full">
            <Chip v-if="data.disturbanceEvenType > 10" :label="getEventValue(data.action)" />
          </div>
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
        <div class="grid align-items-center">
          <div class="col-4">
            <div class="flex flex-column align-items-start gap-3 mb-3">
              <label for="psdSelected" class="font-semibold">Type Element</label>
              <MultiSelect
                v-model="selectedDefinition"
                display="chip"
                :options="listDefinition"
                optionLabel="name"
                class="w-full psFilterAutoComplete"
              />
            </div>
          </div>
          <div class="col-8">
            <searchPsWidget
              v-model="psSelected"
              label="Element"
              :definitionId="selectedDefinition.map((item) => item._id)"
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="startTimestamp" class="font-semibold"> Start Timestamp </label>
          <InputNumber v-model="disturbanceData.startTimestamp" :maxFractionDigits="5" />
        </div>
      </div>

      <div class="col-12">
        <span class="p-text-secondary block"> Type Configuration</span>
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
      <!-- Short Circuit -->
      <template v-if="disturbanceType === 0">
        <div class="col-6">
          <div class="flex flex-column gap-2 mb-3">
            <label for="shcLocation" class="font-semibold">Fault </label>
            <InputNumber v-model="disturbanceData.shcLocation" suffix=" %" :maxFractionDigits="5" />
          </div>
        </div>
        <div class="col-12">
          <span class="p-text-secondary block"> Fault Impedance</span>
        </div>

        <div class="col-6">
          <div class="flex flex-column gap-2 mb-3">
            <label for="resistance" class="font-semibold"> Resistance </label>
            <InputNumber v-model="disturbanceData.resistance" suffix=" Ohm" :maxFractionDigits="5" />
          </div>
        </div>
        <div class="col-6">
          <div class="flex flex-column gap-2 mb-3">
            <label for="reactance" class="font-semibold">Reactance </label>
            <InputNumber v-model="disturbanceData.reactance" suffix=" Ohm" :maxFractionDigits="5" />
          </div>
        </div>
      </template>

      <!-- Switch -->
      <div v-else class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="action" class="font-semibold">Action</label>
          <Dropdown
            v-model="disturbanceData.action"
            :options="listEventValue"
            optionLabel="name"
            option-value="value"
            placeholder="Select a Value"
            class="w-full"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeVisibleDialog = false"></Button>
      <Button
        v-if="modeChange === 'Create'"
        type="button"
        :disabled="disturbanceData.name === '' || !psSelected || disturbanceData.disturbanceEvenType === undefined"
        label="Save"
        @click="createDisturbance"
      ></Button>

      <Button
        v-if="modeChange === 'Update'"
        :disabled="disturbanceData.name === '' || !psSelected || disturbanceData.disturbanceEvenType === undefined"
        type="button"
        label="Update"
        @click="updateDisturbance"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { DefinitionListApi } from '@/views/PowerSystem/api';

import { ApiDisturbance } from '@/views/SystemEvents/api';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
import searchPsWidget from '../PowerSystem/searchPsWidget.vue';
import InputNumber from 'primevue/inputnumber';
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
  await getDefiniton();
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
  psSelected.value = undefined;
  disturbanceData.value = {
    active: true,
    name: '',
    powerSystemId: '',
    startTimestamp: 0,
    disturbanceEvenType: 0, // 0: Short Circuit, 1:Switch

    action: 0,
    reactance: 0,
    resistance: 0,
    shcLocation: 0,
  };
  selectedDefinition.value = listDefinition.value;

  changeVisibleDialog.value = true;
};
const psSelected = ref();
const createDisturbance = async () => {
  const data = JSON.parse(JSON.stringify(disturbanceData.value));
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

watch(disturbanceType, (newVal) => {
  if (newVal === 0) {
    disturbanceData.value.disturbanceEvenType = listDisturbanceEventTypeSC[0].value;
  } else {
    disturbanceData.value.disturbanceEvenType = listDisturbanceEventTypeSwitch[0].value;
  }
});
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
    case 1:
      return 'OPEN';
    case 0:
      return 'CLOSE';
    default:
      return 'OPEN';
  }
};
const listEventValue = [
  { name: 'OPEN', value: 1 },
  { name: 'CLOSE', value: 0 },
];

const listDefinition = ref();
const selectedDefinition = ref([]);

const getDefiniton = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    listDefinition.value = res.data;
    selectedDefinition.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
</script>

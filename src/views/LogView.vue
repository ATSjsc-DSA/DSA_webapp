<template>
  <div class="card layout-content m-4">
    <DataTable :value="logList" scrollable scroll-height="46rem" :loading="isLoading">
      <template #header>
        <div class="grid align-items-center">
          <div class="col-4">
            <div class="font-semibold text-lg">Log table ({{ totalRecord }})</div>
          </div>
          <div class="col">
            <div class="flex gap-3 justify-content-end align-items-center">
              <div class="flex-grow-1">
                <div class="flex flex-column gap-2 mb-3">
                  <label for="startTimeLog" class="font-semibold"> Start Time </label>
                  <Calendar v-model="startTime" showTime showIcon showButtonBar showSeconds />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="flex flex-column gap-2 mb-3">
                  <label for="endTimeLog" class="font-semibold"> End Time </label>
                  <Calendar v-model="endTime" showTime showIcon showButtonBar showSeconds />
                </div>
              </div>
              <Button type="button" label="Submit" severity="primary" class="mt-2" @click="getLogList"></Button>
            </div>
          </div>
        </div>
      </template>

      <Column field="createdTimestamp" sortable header="Timestamp">
        <template #body="{ data }">
          <div class="">
            {{ `${convertDateTimeToString(data.createdTimestamp)}` }}
          </div>
        </template>
      </Column>
      <Column field="userName" sortable header="User">
        <template #body="{ data }">
          <div class="">
            <div class="">{{ data.userName ? `[${data.userName}] ` : '' }}</div>
          </div>
        </template>
      </Column>

      <Column field="label" sortable header="Type">
        <template #body="{ data }">
          <div class="" :style="getLabelSeverityStyle(data.severity)">
            {{ getLabelLogsType(data.label) }}
          </div>
        </template>
      </Column>
      <Column field="message" header="Message">
        <template #body="{ data }">
          <div class="">
            {{ data.message }}
          </div>
        </template>
      </Column>
      <Column field="detail" header="Detail">
        <template #body="{ data }">
          <DataTable
            v-if="data.detail"
            show-gridlines
            :value="detailTable.table"
            tableStyle="min-width: 50rem"
            size="small"
          >
            <Column field="Station" header="Station" />
            <Column field="Generator" header="Generator" />
            <Column field="Transf3W" header="Transf3W" />
            <Column field="Transf2W" header="Transf2W" />
            <Column field="Load" header="Load" />
            <Column field="Line" header="Line" />
            <Column field="Breaker" header="Breaker" />
            <Column field="Shunt" header="Shunt" />
            <Column field="Series Impedances" header="Series Impedances" />
          </DataTable>
        </template>
      </Column>
      <template #empty> <div class="text-xs">No data</div> </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import Calendar from 'primevue/calendar';

import { CommonApi } from './DashboardView/api';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
onMounted(async () => {
  await getLogList();
});
const today = new Date();
const endTime = ref(new Date());
const startTime = ref(new Date(today.setDate(today.getDate() - 3)));
const logList = ref([]);
const totalRecord = ref(0);
const isLoading = ref(false);
const getLogList = async () => {
  try {
    isLoading.value = true;
    const res = await CommonApi.getLogsInTime(startTime.value / 1000, endTime.value / 1000);
    const tableData = [];
    res.data.items.forEach((item) => {
      if (item.detail) {
        item.detailTable = getDetailTable(item);
      }
      tableData.push(item);
    });
    logList.value = tableData;

    totalRecord.value = res.data.total;
    isLoading.value = false;
  } catch (error) {
    logList.value = [];
    totalRecord.value = 0;
    console.log('getLogs error', error);
    isLoading.value = false;
  }
};

const LabelLogsType = {
  Alarm: 0, // Log for alarm when values violate thresholds
  'User Config': 1, // Log for changes in user configuration
  'Grid Code': 2, // Log for changes in grid codes
  'Core System': 3, // Logs for core computation system
  Security: 4, // Consolidated logs for security and audit events
  General: 5, // Generic logs for miscellaneous purposes
  Custom: 7,
  PowerSystem: 8,
};

const getLabelLogsType = (typeLabel) => {
  const label = Object.keys(LabelLogsType).filter((label) => LabelLogsType[label] === typeLabel);
  return label.length > 0 ? label[0] : typeLabel;
};
const SeverityLogsType = {
  Information: 0,
  Warning: 1,
  Error: 2,
  Critical: 3,
  Failure: 4,
};

const getLabelSeverityStyle = (severity) => {
  switch (severity) {
    case 0:
      return { color: 'var(--blue-400)' };
    case 1:
      return { color: 'var(--orange-400)' };
    case 2:
      return { color: 'var(--orange-600)' };
    case 3:
      return { color: 'var(--red-400)' };
    case 4:
      return { color: 'var(--red-600)' };
    default:
      return { color: 'var(--text-color)' };
  }
};

const detailTable = ref({});
const detailTableHeader = [
  'Station',
  'Generator',
  'Transf3W',
  'Transf2W',
  'Load',
  'Line',
  'Breaker',
  'Shunt',
  'Series Impedances',
];
const getDetailTable = (item) => {
  const tableData = [];
  for (const stationData of item.detail) {
    const rowData = {};
    for (let index = 0; index < detailTableHeader.length; index++) {
      rowData[detailTableHeader[index]] = stationData[index];
    }
    tableData.push(rowData);
  }

  detailTable.value = { ...item, table: tableData };
};
</script>

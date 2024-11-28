<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div>
          <div><i class="pi pi-credit-card pr-3"></i>Logs</div>
          <div class="text-xs pt-1" style="color: var(--text-color-secondary)">
            {{ convertDateTimeToString(lastUpdate / 1000) }}
          </div>
        </div>
        <div class="flex justify-content-end align-items-center">
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            aria-controls="overlay_panel_log_config"
            text
            @click="toggleMenuConfigLogs"
          />
          <OverlayPanel id="overlay_panel_log_config" ref="menuconfigLog">
            <div class="flex flex-column gap-2 mb-3">
              <label for="timeInterval" class="font-semibold">Time Reload </label>
              <InputNumber v-model="intervalTimeChange" suffix=" s" />
            </div>

            <div class="flex flex-column gap-2 mb-3">
              <label for="limitLog" class="font-semibold">Number Of Logs </label>
              <InputNumber v-model="limitLogChange" suffix=" logs" />
            </div>
            <div class="flex justify-content-end align-items-center">
              <Button type="button" label="Cancel" severity="secondary" @click="closeMenuConfigLogs"></Button>
              <Button type="button" :disabled="!limitLogChange" label="Submit" @click="changeConfig"></Button>
            </div>
          </OverlayPanel>
          <Button icon="pi pi-refresh" text severity="secondary" title="Reload Logs" @click="getLogList(false)" />
          <Button icon="pi pi-times" text severity="secondary" title="Close Logs" @click="onRemoveWidget" />
        </div>
      </div>
    </template>
    <template #content>
      <template v-if="alarmLog._id">
        <Fieldset legend="Alarm" class="mb-3">
          <template #legend>
            <div class="flex align-items-center pl-2">
              Alarm
              <span v-if="isShowAlarmDot" id="dashbordAlarmBadge" v-badge.danger></span>
            </div>
          </template>
          <span class="text-semibold">
            {{ `[${convertDateTimeToString(alarmLog.createdTimestamp)}] ` }}
          </span>
          <span :style="getLabelSeverityStyle(alarmLog.severity)">
            {{ getLabelLogsType(alarmLog.label) + ': ' }}
          </span>
          <span>
            {{ alarmLog.message }}
          </span>
        </Fieldset>
      </template>
      <DataTable
        class="logTable"
        :value="otherLogList"
        size="small"
        scrollable
        :scroll-height="alarmLog._id ? '44rem' : '51rem'"
      >
        <Column field="createdTimestamp" header="Timestamp" style="padding-right: 0.5rem; padding-left: 0">
          <template #body="{ data }">
            <div class="font-semibold text-xs">
              {{ `${convertDateTimeToString(data.createdTimestamp)}` }}
            </div>
          </template>
        </Column>
        <Column field="userName" header="User" style="padding-right: 0.5rem; padding-left: 0">
          <template #body="{ data }">
            <div class="text-xs">
              <div class="">{{ `[${data.userName}] ` }}</div>
            </div>
          </template>
        </Column>

        <Column field="label" header="Type" style="padding-right: 0.5rem; padding-left: 0">
          <template #body="{ data }">
            <div class="font-semibold text-xs" :style="getLabelSeverityStyle(data.severity)">
              {{ getLabelLogsType(data.label) }}
            </div>
          </template>
        </Column>
        <Column field="message" header="Message" style="width: 50%; padding-right: 0.5rem; padding-left: 0">
          <template #body="{ data }">
            <div class="text-xs">
              {{ data.message }}
            </div>
          </template>
        </Column>
        <Column field="detail" style="padding: 0">
          <template #body="{ data }">
            <div v-if="data.detail" class="">
              <Button
                text
                severity="secondary"
                icon="pi pi-ellipsis-h"
                class="text-xs"
                @click="openDetailTable(data)"
              />
            </div>
          </template>
        </Column>
        <template #empty> <div class="text-xs">No data</div> </template>
      </DataTable>
    </template>
  </Card>

  <Dialog v-model:visible="detailTableVisible" modal header=" Measurement Logs Info" :style="{ width: '72rem' }">
    <DataTable v-if="detailTable._id" show-gridlines :value="detailTable.table" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2 py-3">
          <span class="font-semibold">
            <span class="text-semibold">
              {{ `[${convertDateTimeToString(detailTable.createdTimestamp)}] ` }}
            </span>
            <span v-if="detailTable.userName"> {{ `[${detailTable.userName}] ` }} </span>
            <span :style="getLabelSeverityStyle(detailTable.severity)">
              {{ getLabelLogsType(detailTable.label) + ': ' }}
            </span>
            <span>
              {{ detailTable.message }}
            </span>
          </span>
        </div>
      </template>
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
    <div class="flex justify-content-end gap-2 mt-3">
      <Button type="button" label="Close" severity="secondary" @click="detailTableVisible = false"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CommonApi } from './api';

import Fieldset from 'primevue/fieldset';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
onMounted(async () => {
  await getLogList();
  let logConfig = localStorage.getItem('logConfig');
  if (logConfig) {
    logConfig = JSON.parse(logConfig);
    intervalTime.value = logConfig.intervalTime;
    limitLog.value = logConfig.limitLog;

    intervalTimeChange.value = logConfig.intervalTime / 1000;
    limitLogChange.value = logConfig.limitLog;
  }
});
onUnmounted(() => {
  clearTimeout(reloadGetLog.value);
});
const props = defineProps({
  intervalTime: { type: Number, default: 5 * 1000 },
  limitLog: { type: Number, default: 100 },
});
const emit = defineEmits(['onRemoveWidget', 'saveLogConfig']);

const onRemoveWidget = () => {
  clearTimeout(reloadGetLog.value);
  emit('onRemoveWidget');
};
const lastUpdate = ref(new Date());
const otherLogList = ref([]);
const alarmLog = ref({});

const intervalTime = ref(props.intervalTime);
const limitLog = ref(props.limitLog);
const reloadGetLog = ref();
const isShowAlarmDot = ref(false);
const getLogList = async (isAutoReload = true) => {
  try {
    const res = await CommonApi.getLogs();

    const alarmLogs = res.data.filter((item) => item.label === 0);
    const otherLogs = res.data.filter((item) => item.label !== 0);

    if (alarmLogs.length > 0) {
      alarmLog.value = alarmLogs[0];
      playAlarmSound();
      isShowAlarmDot.value = true;
      setTimeout(() => (isShowAlarmDot.value = false), 1000);
    }
    const otherLogsNotExist = otherLogs.filter(
      (item) => otherLogList.value.map((item) => item._id).indexOf(item._id) === -1,
    );
    otherLogList.value = otherLogsNotExist.concat(otherLogList.value).slice(0, limitLog.value);

    lastUpdate.value = new Date();
    if (isAutoReload) {
      reloadGetLog.value = setTimeout(async () => {
        await getLogList();
      }, intervalTime.value);
    }
  } catch (error) {
    console.log('getLogs error', error);
  }
};

const playAlarmSound = () => {
  const audio = new Audio('/img/SoundBible.mp3');
  audio.play();
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
      return { color: 'var(--text-color)' };
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

const intervalTimeChange = ref(intervalTime.value / 1000);
const limitLogChange = ref(limitLog.value);
const menuconfigLog = ref(null);

const toggleMenuConfigLogs = (event) => {
  menuconfigLog.value.toggle(event);
};
const closeMenuConfigLogs = () => {
  menuconfigLog.value.hide();
};
const changeConfig = async () => {
  intervalTime.value = intervalTimeChange.value * 1000;
  limitLog.value = limitLogChange.value;
  closeMenuConfigLogs();
  otherLogList.value = [];
  await getLogList(false);
  emit('saveLogConfig', {
    intervalTime: intervalTime.value,
    limitLog: limitLog.value,
  });
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
const detailTableVisible = ref(false);
const openDetailTable = (item) => {
  const tableData = [];
  for (const stationData of item.detail) {
    const rowData = {};
    for (let index = 0; index < detailTableHeader.length; index++) {
      rowData[detailTableHeader[index]] = stationData[index];
    }
    tableData.push(rowData);
  }

  detailTable.value = { ...item, table: tableData };
  detailTableVisible.value = true;
};
</script>
<style>
.logTable .p-column-title {
  font-size: 0.8rem;
}
.logTable td {
  font-size: 1rem;
}

#dashbordAlarmBadge .p-badge-dot {
  padding: 0 0 0.5rem 0;
}
</style>

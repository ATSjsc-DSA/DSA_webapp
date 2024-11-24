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
          <Button icon="pi pi-refresh" text severity="secondary" title="Reload Logs" @click="getLogList" />
          <Button icon="pi pi-times" text severity="secondary" title="Close Logs" @click="onRemoveWidget" />
        </div>
      </div>
    </template>
    <template #content>
      <ScrollPanel style="width: 100%; height: 100%">
        <DataView v-if="logList.length > 0" :value="logList">
          <template #list="slotProps">
            <div v-for="(item, index) in slotProps.items" :key="index" class="py-3">
              <div class="flex gap-3" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                <Tag
                  :value="getLabelLogsType(item.label)"
                  :style="getLabelSeverityStyle(item.severity)"
                  style="width: 20%; min-width: 5rem; text-align: left"
                />
                <div class="flex-grow-1">
                  <div class="text-semibold capitalize">
                    {{ item.message }}
                  </div>
                  <div class="text-xs pt-1" style="color: var(--text-color-secondary)">
                    {{ convertDateTimeToString(item.createdTimestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
        <div v-else>No data</div>
      </ScrollPanel>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CommonApi } from './api';
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
const logList = ref([]);
const intervalTime = ref(props.intervalTime);
const limitLog = ref(props.limitLog);
const reloadGetLog = ref();
const getLogList = async () => {
  try {
    const res = await CommonApi.getLogs();
    const logsNotExist = res.data.filter((item) => logList.value.map((item) => item._id).indexOf(item._id) === -1);
    logList.value = logsNotExist.concat(logList.value).slice(0, limitLog.value);
    lastUpdate.value = new Date();
    reloadGetLog.value = setTimeout(async () => {
      await getLogList();
    }, intervalTime.value);
  } catch (error) {
    console.log('getLogs error', error);
  }
};
const LabelLogsType = {
  Application: 0,
  Security: 1,
  System: 2,
  Setup: 3,
  'Forwarded Events': 4,
  Audit: 5,
  'Security Incident': 6,
  Custom: 7,
  'PowerSystem Change': 8,
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
      return 'backgroundColor:var(--blue-100);color:var(--text-color)';
    case 1:
      return 'backgroundColor:var(--orange-100);color:var(--text-color)';
    case 2:
      return 'backgroundColor:var(--red-200);color:var(--text-color)';
    case 3:
      return 'backgroundColor:var(--red-400);color:white';
    case 4:
      return 'backgroundColor:var(--red-600); color:white';
    default:
      return 'backgroundColor:var(--gray-100);color:var(--text-color)';
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
  logList.value = [];
  await getLogList();
  emit('saveLogConfig', {
    intervalTime: intervalTime.value,
    limitLog: limitLog.value,
  });
};
</script>

<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div>{{ chartTitle }}</div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">{{ modificationTime }}</div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">
            {{ rangeTimeOfTimeSeriesChart }}
          </div>
        </div>
        <div class="flex justify-content-between align-items-center">
          <!-- choose label for radar chart  -->
          <div>
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              aria-haspopup="true"
              aria-controls="overlay_panel_timeSeriesChart"
              text
              @click="toggleMenuSelectRangeTimeSeriesChart"
            />
            <OverlayPanel id="overlay_panel_timeSeriesChart" ref="menuSelectRangTime">
              <div class="font-semibold text-lg mb-2">{{ chartTitle }}: Choose Range Time</div>
              <Divider />
              <div class="grid px-3 mt-3">
                <div class="col-6">
                  <div class="flex flex-column gap-2 mb-3">
                    <label for="startTimeSeries" class="font-semibold"> Start Timestamp </label>
                    <Calendar v-model="startTimeSeries" showTime showIcon showButtonBar showSeconds />
                  </div>
                </div>
                <div class="col-6">
                  <div class="flex flex-column gap-2 mb-3">
                    <label for="endTimeSeries" class="font-semibold"> End Timestamp </label>
                    <Calendar v-model="endTimeSeries" showTime showIcon showButtonBar showSeconds />
                  </div>
                </div>
                <div class="col-12">
                  <div class="flex justify-content-end my-3">
                    <Button label="Submit" @click="changeRangeTimeOfSeriesChart" />
                  </div>
                </div>
              </div>
            </OverlayPanel>
          </div>
          <Button v-if="!gridLock" icon="pi pi-trash " title="Reset Data" severity="danger" text @click="resetChart" />
          <Button icon="pi pi-refresh " title="Refresh chart" severity="secondary" text @click="reloaData" />
          <Button
            v-if="!gridLock"
            icon="pi pi-times"
            text
            severity="secondary"
            title="Remove chart"
            @click="onRemoveWidget"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div
        :id="`${chartId}ChartWrap`"
        class="w-full h-full"
        @dragleave.prevent="canDropNode = false"
        @dragenter.prevent
        @dragover.prevent="onDragoverComponent"
        @drop.prevent="onDropComponent"
      >
        <appTimeSerieschartWidget :data="chartData" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, onUnmounted, onMounted, watch } from 'vue';
import Calendar from 'primevue/calendar';

import appTimeSerieschartWidget from './appTimeSerieschartWidget.vue';
import { ApplicationApi } from './api';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { measInfo_automatic, measInfoActive } = storeToRefs(commonStore);

const props = defineProps({
  nodeDrag: {
    type: Object,
    required: true,
  },

  chartId: {
    type: String,
    default: 'chartId',
  },

  muiltiSelect: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['onRemoveWidget']);
const nodeSelected = defineModel('nodeSelected');
const gridLoc = defineModel('gridLock');

const interval = ref(null);
const intervalTime = 5 * 1000;
onMounted(() => {
  chartTitle.value = 'Time Series';

  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    chartTitle.value = nodeSelected.value.title;
    setInitRangeTimeOfSeriesChart();
    getChartData();
  }
});

onUnmounted(() => {
  clearTimeout(interval.value);
});
watch(measInfo_automatic, async (isActive) => {
  if (!isActive) {
    clearTimeout(interval.value);
  }
});

watch(measInfoActive, async (newVal, oldVal) => {
  if (newVal._id) {
    await getChartData();
  }
});

const onRemoveWidget = () => {
  resetChart();
  emit('onRemoveWidget');
};

const menuSelectDataKey = ref(null);

const toggleMenuSelectKeyRadarChart = (event) => {
  menuSelectDataKey.value.toggle(event);
};

const startTimeSeries = ref(new Date());
const endTimeSeries = ref(new Date());
const rangeTimeOfTimeSeriesChart = ref('Choose a Range Time');
const menuSelectRangTime = ref();
const toggleMenuSelectRangeTimeSeriesChart = (event) => {
  menuSelectRangTime.value.toggle(event);
};

const changeRangeTimeOfSeriesChart = async () => {
  menuSelectRangTime.value.hide();
  await getChartData();
  rangeTimeOfTimeSeriesChart.value =
    convertDateTimeToString(startTimeSeries.value / 1000) + ' - ' + convertDateTimeToString(endTimeSeries.value / 1000);
  nodeSelected.value.startTimeSeries = startTimeSeries.value.getTime();
  nodeSelected.value.endTimeSeries = endTimeSeries.value.getTime();
};

const setInitRangeTimeOfSeriesChart = () => {
  startTimeSeries.value = new Date(nodeSelected.value.startTimeSeries);
  endTimeSeries.value = new Date(nodeSelected.value.endTimeSeries);
  if (startTimeSeries.value !== undefined && endTimeSeries.value !== undefined) {
    rangeTimeOfTimeSeriesChart.value =
      convertDateTimeToString(startTimeSeries.value / 1000) +
      ' - ' +
      convertDateTimeToString(endTimeSeries.value / 1000);
  } else {
    startTimeSeries.value = new Date();
    endTimeSeries.value = new Date();
  }
};

const typeChartCanDrop = ref(['Application']);

const chartTitle = ref('Time Series');

//  Drop Application - bar

const nodeSelectedInChart = ref(props.muiltiSelect ? [] : undefined);
const nodeKeySelected = ref(props.muiltiSelect ? [] : undefined);
const canDropNode = ref(false);

const onDragoverComponent = () => {
  if (typeChartCanDrop.value.includes(props.nodeDrag.type) && nodeSelectedInChart.value !== props.nodeDrag._id) {
    canDropNode.value = true;
  } else {
    canDropNode.value = false;
  }
};
const onDropComponent = async () => {
  if (typeChartCanDrop.value.includes(props.nodeDrag.type) && nodeSelectedInChart.value !== props.nodeDrag._id) {
    resetChart();
    chartTitle.value = props.nodeDrag.label;
    nodeSelectedInChart.value = props.nodeDrag._id;
    nodeKeySelected.value = props.nodeDrag.key;
  }

  nodeSelected.value = {
    title: props.nodeDrag.label,
    data: nodeSelectedInChart.value,
    startTimeSeries: 0,
    endTimeSeries: 0,
  };

  await getChartData();
  canDropNode.value = false;
};

const chartRadarDataKey = ref();
watch(chartRadarDataKey, (keyArr) => {
  nodeSelected.value.dataKey = keyArr;
});

const chartData = ref({});
const modificationTime = ref();

const getChartData = async () => {
  try {
    let res = {};
    res = await ApplicationApi.getBarTimeSeriesChartData(
      nodeSelectedInChart.value,
      new Date(startTimeSeries.value).getTime() / 1000,
      new Date(endTimeSeries.value).getTime() / 1000,
    );

    if (res.data) {
      chartData.value = res.data;
      modificationTime.value = res.data.modificationTime
        ? convertDateTimeToString(res.data.modificationTime)
        : undefined;
    } else {
      chartData.value = {};
      modificationTime.value = undefined;
    }

    if (measInfo_automatic.value) {
      interval.value = setTimeout(async () => {
        await getChartData();
      }, intervalTime);
    }
  } catch (error) {
    // console.log('get chart data: error ', props.typeChart, error);
    chartData.value = {};
    modificationTime.value = undefined;
  }
};
const reloaData = async () => {
  chartData.value = [];
  await getChartData();
};

const resetChart = async () => {
  clearTimeout(interval.value);
  chartData.value = {};
  chartTitle.value = 'Time Series';

  startTimeSeries.value = new Date();
  endTimeSeries.value = new Date();
  rangeTimeOfTimeSeriesChart.value = 'Choose a Range Time';
  nodeSelected.value = props.muiltiSelect ? {} : undefined;
  nodeSelectedInChart.value = props.muiltiSelect ? [] : undefined;
};
</script>

<style>
.p-card-body {
  height: 100% !important;
}
.p-card-content {
  height: 90% !important;
}
</style>

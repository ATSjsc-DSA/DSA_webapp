<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div class="">
            {{ chartTitle }}
          </div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">{{ modificationTime }}</div>
        </div>
        <div class="flex gap-2 justify-content-between align-items-center">
          <!-- choose label for radar chart  -->
          <div v-if="chartData.Key">
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              aria-haspopup="true"
              aria-controls="overlay_panel_radarchart"
              text
              @click="toggleMenuSelectKeyRadarChart"
            />
            <OverlayPanel id="overlay_panel_radarchart" ref="menuSelectDataKey">
              <div class="font-semibold text-lg mb-2">{{ chartTitle }}: Select Keys</div>
              <Divider />
              <div class="flex flex-column gap-3 p-2">
                <div v-for="item in chartData.Key" :key="item" class="flex align-items-center">
                  <Checkbox
                    v-model="chartRadarDataKey"
                    :inputId="item"
                    :name="item"
                    :value="item"
                    :disabled="chartData.Key.length < 8"
                  />
                  <label :for="item" class="ml-2"> {{ item }} </label>
                </div>
              </div>
            </OverlayPanel>
          </div>

          <Button
            v-if="!gridLock"
            v-tooltip.bottom="'Reset Data'"
            icon="pi pi-trash "
            severity="danger"
            text
            @click="resetChart"
          />
          <Button
            v-tooltip.bottom="'Refresh chart'"
            icon="pi pi-refresh "
            severity="secondary"
            text
            @click="reloaData"
          />
          <Button
            v-if="!gridLock"
            v-tooltip.bottom="'Remove Widget'"
            icon="pi pi-times"
            text
            severity="secondary"
            @click="onRemoveWidget"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div
        :id="`${typeChart}ChartWrap`"
        class="w-full h-full"
        @dragleave.prevent="canDropNode = false"
        @dragenter.prevent
        @dragover.prevent="onDragoverComponent"
        @drop.prevent="onDropComponent"
      >
        <appBarchartWidget v-if="typeChart === 'appBar'" :data="chartData" :width="width" />

        <appRadarChartWidget
          v-if="typeChart === 'appRadar'"
          :data="chartData"
          :width="width"
          :dataKey="chartRadarDataKey"
        />
        <projectRadarChartWidget
          v-if="typeChart === 'projectRadar'"
          :data="chartData"
          :width="width"
          :dataKey="chartRadarDataKey"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, onUnmounted, onMounted, watch } from 'vue';

import appBarchartWidget from './appBarchartWidget.vue';
import appRadarChartWidget from './appRadarChartWidget.vue';
import projectRadarChartWidget from './projectRadarChartWidget.vue';
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
  typeChart: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['onRemoveWidget']);
const nodeSelected = defineModel('nodeSelected');
const gridLock = defineModel('gridLock');
const width = defineModel('width');

const interval = ref(null);
const intervalTime = 5 * 1000;
onMounted(() => {
  setInitTitle();
  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    getChartData();
    chartRadarDataKey.value = nodeSelected.value.dataKey;
  } else {
    setInitTitle();
  }
  if (props.typeChart === 'projectRadar') {
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

const typeChartCanDrop = ref(['Application']);

const chartTitle = ref('');

const setInitTitle = () => {
  if (props.typeChart === 'appRadar') {
    chartTitle.value = 'Radar';
  }
  if (props.typeChart === 'appBar') {
    chartTitle.value = 'Application';
  }

  if (props.typeChart === 'projectRadar') {
    chartTitle.value = 'Project';
  }
};
//  Drop Application - bar

const nodeSelectedInChart = ref(undefined);
const nodeKeySelected = ref(undefined);
const canDropNode = ref(false);

const onDragoverComponent = () => {
  if (props.typeChart === 'projectRadar') {
    return false;
  }
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

    nodeSelected.value = {
      title: props.nodeDrag.label,
      data: nodeSelectedInChart.value,
      dataKey: [],
    };

    await getChartData();
    canDropNode.value = false;
  }
};

const chartRadarDataKey = ref();
watch(chartRadarDataKey, (keyArr) => {
  nodeSelected.value.dataKey = keyArr;
});

const chartData = ref([]);
const modificationTime = ref();

const getChartData = async () => {
  try {
    let res = {};
    if (props.typeChart === 'appBar') {
      res = await ApplicationApi.getBarChartData(nodeSelectedInChart.value);
    }
    if (props.typeChart === 'appRadar') {
      res = await ApplicationApi.getRadarChartData(nodeSelectedInChart.value);
      if (!chartRadarDataKey.value) {
        chartRadarDataKey.value = res.data.Key.slice(0, 8);
      }
    }
    if (props.typeChart === 'projectRadar') {
      res = await ApplicationApi.getRadarProjectChartData();

      if (!chartRadarDataKey.value) {
        chartRadarDataKey.value = res.data.Key.slice(0, 8);
      }
    }

    if (res.data) {
      chartData.value = res.data;
      modificationTime.value = res.data.modificationTime
        ? convertDateTimeToString(res.data.modificationTime)
        : undefined;
    } else {
      chartData.value = [];
      modificationTime.value = undefined;
    }

    if (measInfo_automatic.value) {
      interval.value = setTimeout(async () => {
        await getChartData();
      }, intervalTime);
    }
  } catch (error) {
    // console.log('get chart data: error ', props.typeChart, error);
    chartData.value = [];
    modificationTime.value = undefined;
  }
};
const reloaData = async () => {
  chartData.value = [];
  await getChartData();
};

const resetChart = async () => {
  clearTimeout(interval.value);
  chartData.value = [];
  setInitTitle();
  nodeSelected.value = undefined;
  nodeSelectedInChart.value = undefined;
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

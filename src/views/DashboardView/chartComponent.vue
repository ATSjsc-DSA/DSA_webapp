<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div><i class="pi pi-folder-open pr-3"></i>{{ chartTitle }}</div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">{{ modificationTime }}</div>
        </div>
        <div>
          <Button
            icon="pi pi-trash "
            title="Reset Data"
            severity="danger"
            text
            :disabled="!nodeDrag._id"
            @click="resetChart"
          />
          <Button
            icon="pi pi-refresh "
            title="Refresh chart"
            severity="secondary"
            text
            :disabled="!nodeDrag._id"
            @click="getChartData"
          />
          <Button icon="pi pi-times" text severity="secondary" title="Remove chart" @click="onRemoveWidget" />
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
        <appBarchartWidget v-if="typeChart === 'appBar'" :data="chartData" />
        <curveLinechartWidget v-if="typeChart === 'vsa' || typeChart === 'tsa'" :data="chartData" />
        <appRadarChartWidget v-if="typeChart === 'appRadar'" :data="chartData" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, onUnmounted, onMounted } from 'vue';
import appBarchartWidget from './appBarchartWidget.vue';
import curveLinechartWidget from './curveLinechartWidget.vue';
import appRadarChartWidget from './appRadarChartWidget.vue';
import { VsaApi, TsaApi, ApplicationApi } from './api';
import { intervalTime } from '@/Constants/';
import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

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
  muiltiSelect: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['onRemoveWidget']);

const interval = ref(null);

onMounted(() => {
  setInitTitle();
});
onUnmounted(() => {
  clearInterval(interval.value);
});
const onRemoveWidget = () => {
  resetChart();
  emit('onRemoveWidget');
};

const typeChartCanDrop = computed(() => {
  if (props.typeChart === 'appRadar' || props.typeChart === 'appBar') {
    return 'Application';
  }

  if (props.typeChart === 'vsa') {
    return 'VsaCurve';
  }
  if (props.typeChart === 'tsa') {
    return 'TsaCurve';
  }
  return '';
});

const chartTitle = ref('');

const setInitTitle = () => {
  if (props.typeChart === 'appRadar') {
    chartTitle.value = 'Radar';
  }
  if (props.typeChart === 'appBar') {
    chartTitle.value = 'Application';
  }

  if (props.typeChart === 'vsa') {
    chartTitle.value = 'Vsa';
  }
  if (props.typeChart === 'tsa') {
    chartTitle.value = 'Tsa';
  }
};
//  Drop Application - bar
const nodeSelected = ref(props.muiltiSelect ? [] : undefined);
const nodeKeySelected = ref(props.muiltiSelect ? [] : undefined);
const canDropNode = ref(false);

const onDragoverComponent = () => {
  if (props.nodeDrag.type === typeChartCanDrop.value && nodeSelected.value !== props.nodeDrag._id) {
    canDropNode.value = true;
  } else {
    canDropNode.value = false;
  }
};
const onDropComponent = async () => {
  if (props.nodeDrag.type === typeChartCanDrop.value && nodeSelected.value !== props.nodeDrag._id) {
    if (props.muiltiSelect) {
      nodeKeySelected.value.push(props.nodeDrag.key);
      if (props.typeChart === 'vsa') {
        nodeSelected.value.push({
          curveInfoId: props.nodeDrag._id,
          curveType: props.nodeDrag.curveType,
          caseInfoId: props.nodeDrag.caseInfoId,
          moduleInfoId: props.nodeDrag.moduleInfoId,
        });
      }
      if (props.typeChart === 'tsa') {
        nodeSelected.value.push(props.nodeDrag.label);
      }
    } else {
      chartTitle.value = props.nodeDrag.label;
      resetChart();
      nodeSelected.value = props.nodeDrag._id;
      nodeKeySelected.value = props.nodeDrag.key;
    }

    await getChartData();
    canDropNode.value = false;

    interval.value = setInterval(() => {
      getChartData();
    }, intervalTime);
    // emit('addNodeTreeSelectd', props.nodeDrag.key);
  }
};

const chartData = ref([]);
const modificationTime = ref();
const getChartData = async () => {
  try {
    let res = {};

    if (props.typeChart === 'appBar') {
      res = await ApplicationApi.getBarChartData(nodeSelected.value);
    }
    if (props.typeChart === 'appRadar') {
      res = await ApplicationApi.getRadarChartData(nodeSelected.value);
    }
    if (props.typeChart === 'vsa') {
      res = await VsaApi.getChartData(nodeSelected.value);
    }
    if (props.typeChart === 'tsa') {
      res = await TsaApi.getChartData(nodeSelected.value);
    }
    console.log('adfasdf', res.data);

    if (res.data) {
      chartData.value = res.data;
      modificationTime.value = res.data.modificationTime
        ? convertDateTimeToString(res.data.modificationTime)
        : undefined;
    } else {
      chartData.value = [];
      modificationTime.value = undefined;
    }
  } catch (error) {
    console.log('getAppliactionChartData: error ', error);
    chartData.value = [];
    modificationTime.value = undefined;
  }
};

const resetChart = () => {
  chartData.value = [];
  setInitTitle();
  nodeSelected.value = props.muiltiSelect ? [] : undefined;
  clearInterval(interval.value);
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

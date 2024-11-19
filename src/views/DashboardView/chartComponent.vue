<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div><i class="pi pi-folder-open pr-3"></i>{{ chartTitle }}</div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">{{ modificationTime }}</div>
        </div>
        <div class="flex justify-content-between align-items-center">
          <div v-if="chartData.Key">
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              aria-haspopup="true"
              aria-controls="overlay_panel"
              text
              @click="toggleMenu"
            />
            <OverlayPanel id="overlay_panel" ref="menuSelectDataKey">
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
          <Button icon="pi pi-trash " title="Reset Data" severity="danger" text @click="resetChart" />
          <Button icon="pi pi-refresh " title="Refresh chart" severity="secondary" text @click="getChartData" />
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
        <appRadarChartWidget v-if="typeChart === 'appRadar'" :data="chartData" :dataKey="chartRadarDataKey" />
        <projectRadarChartWidget v-if="typeChart === 'projectRadar'" :data="chartData" :dataKey="chartRadarDataKey" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, onUnmounted, onMounted, watch } from 'vue';

import appBarchartWidget from './appBarchartWidget.vue';
import curveLinechartWidget from './curveLinechartWidget.vue';
import appRadarChartWidget from './appRadarChartWidget.vue';
import projectRadarChartWidget from './projectRadarChartWidget.vue';
import { VsaApi, TsaApi, ApplicationApi, CommonApi } from './api';
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
const nodeSelected = defineModel('nodeSelected');
const stopReloadChartData = defineModel('stopReloadChartData');
const autoreloadChartData = ref(!stopReloadChartData.value);
const interval = ref(null);
const intervalTime = 5 * 1000;
onMounted(() => {
  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    if (!props.muiltiSelect) {
      chartTitle.value = nodeSelected.value.title;
    } else {
      setInitTitle();
    }
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
  autoreloadChartData.value = false;
});
watch(stopReloadChartData, (newStt) => {
  autoreloadChartData.value = !newStt;
  getChartData();
});

const onRemoveWidget = () => {
  resetChart();
  emit('onRemoveWidget');
};

const menuSelectDataKey = ref(null);

const toggleMenu = (event) => {
  menuSelectDataKey.value.toggle(event);
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
  if (props.typeChart === 'projectRadar') {
    chartTitle.value = 'Project';
  }
  if (props.typeChart === 'vsa') {
    chartTitle.value = 'Vsa';
  }
  if (props.typeChart === 'tsa') {
    chartTitle.value = 'Tsa';
  }
};
//  Drop Application - bar

const nodeSelectedInChart = ref(props.muiltiSelect ? [] : undefined);
const nodeKeySelected = ref(props.muiltiSelect ? [] : undefined);
const canDropNode = ref(false);

const onDragoverComponent = () => {
  if (props.typeChart === 'projectRadar') {
    return false;
  }
  if (props.nodeDrag.type === typeChartCanDrop.value && nodeSelectedInChart.value !== props.nodeDrag._id) {
    canDropNode.value = true;
  } else {
    canDropNode.value = false;
  }
};
const onDropComponent = async () => {
  if (props.nodeDrag.type === typeChartCanDrop.value && nodeSelectedInChart.value !== props.nodeDrag._id) {
    if (props.muiltiSelect) {
      nodeKeySelected.value.push(props.nodeDrag.key);
      if (props.typeChart === 'vsa') {
        nodeSelectedInChart.value.push({
          curveInfoId: props.nodeDrag._id,
          curveType: props.nodeDrag.curveType,
          caseInfoId: props.nodeDrag.caseInfoId,
          moduleInfoId: props.nodeDrag.moduleInfoId,
        });
      }
      if (props.typeChart === 'tsa') {
        nodeSelectedInChart.value.push({
          curveInfoId: props.nodeDrag._id,
          curveType: props.nodeDrag.curveType,
          subCaseInfoId: props.nodeDrag.subCaseInfo,
          caseInfoId: props.nodeDrag.caseInfoId,
          moduleInfoId: props.nodeDrag.moduleInfoId,
        });
      }
    } else {
      resetChart();
      chartTitle.value = props.nodeDrag.label;
      nodeSelectedInChart.value = props.nodeDrag._id;
      nodeKeySelected.value = props.nodeDrag.key;
    }

    nodeSelected.value = {
      title: props.nodeDrag.label,
      data: nodeSelectedInChart.value,
      dataKey: [],
    };

    await getChartData();
    canDropNode.value = false;

    // interval.value = setInterval(async () => {
    //   await getChartData();
    // }, intervalTime);
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
      res = await ApplicationApi.getRadarChartData('67063c04c8dfd984e9fe1f2e');

      // res = await CommonApi.getProjectRadarChartData();
      if (!chartRadarDataKey.value) {
        chartRadarDataKey.value = res.data.Key.slice(0, 8);
      }
    }
    if (props.typeChart === 'vsa') {
      res = await VsaApi.getChartData(nodeSelectedInChart.value);
    }
    if (props.typeChart === 'tsa') {
      res = await TsaApi.getChartData(nodeSelectedInChart.value);
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

    if (autoreloadChartData.value) {
      interval.value = setTimeout(async () => {
        await getChartData();
      }, intervalTime);
    }
  } catch (error) {
    console.log('get chart data: error ', error);
    chartData.value = [];
    modificationTime.value = undefined;
  }
};

const resetChart = async () => {
  clearTimeout(interval.value);
  chartData.value = [];
  setInitTitle();
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

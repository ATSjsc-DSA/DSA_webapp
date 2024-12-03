<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div>TSA</div>
          <div style="font-size: 0.7rem; padding-top: 0.5rem">{{ modificationTime }}</div>
        </div>
        <div class="flex justify-content-between align-items-center">
          <ToggleButton
            v-model="showAnnotations"
            :disabled="chartData.length !== 1"
            onLabel="Standard"
            offLabel="Curve Only"
            onIcon="pi pi-chart-bar"
            offIcon="pi pi-chart-line"
            @change="changeConfig"
          />
          <Button icon="pi pi-trash " title="Reset Data" severity="danger" text @click="resetChart" />
          <Button icon="pi pi-refresh " title="Refresh chart" severity="secondary" text @click="reloaData" />
          <Button icon="pi pi-times" text severity="secondary" title="Remove chart" @click="onRemoveWidget" />
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
        <tsaCurveLinechartWidget :data="chartData" :showAnnotations="showAnnotations" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, onUnmounted, onMounted, watch } from 'vue';
import ToggleButton from 'primevue/togglebutton';
import tsaCurveLinechartWidget from './tsaCurveLinechartWidget.vue';
import { TsaApi } from './api';
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
});

const emit = defineEmits(['onRemoveWidget']);

const nodeSelected = defineModel('nodeSelected');
const interval = ref(null);
const intervalTime = 5 * 1000;
onMounted(() => {
  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    showAnnotations.value = nodeSelected.value.showAnnotations;
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

const typeChartCanDrop = ref(['TsaCurve', 'TsaCurveType']);
const hiddenDatasets = ref([]);
const nodeSelectedInChart = ref([]);
const nodeKeySelected = ref([]);
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
    if (props.nodeDrag.type === 'TsaCurve') {
      nodeKeySelected.value.push(props.nodeDrag.key);
      nodeSelectedInChart.value.push({
        curveInfoId: props.nodeDrag._id,
        curveType: props.nodeDrag.curveType,
        subCaseInfoId: props.nodeDrag.subCaseInfo,
        caseInfoId: props.nodeDrag.caseInfoId,
        moduleInfoId: props.nodeDrag.moduleInfoId,
      });
    }
    if (props.nodeDrag.type === 'TsaCurveType') {
      const tsaCurveData = JSON.parse(props.nodeDrag.data);
      nodeKeySelected.value.push(props.nodeDrag.key);
      tsaCurveData.forEach((curveId) => {
        nodeSelectedInChart.value.push({
          curveInfoId: curveId,
          curveType: props.nodeDrag.curveType,
          subCaseInfoId: props.nodeDrag.subCaseInfo,
          caseInfoId: props.nodeDrag.caseInfoId,
          moduleInfoId: props.nodeDrag.moduleInfoId,
        });
      });
    }

    nodeSelected.value = {
      data: nodeSelectedInChart.value,
      showAnnotations: showAnnotations.value,
    };
    await getChartData();
    canDropNode.value = false;
  }
};

const chartData = ref([]);
const modificationTime = ref();

const getChartData = async () => {
  try {
    const res = await TsaApi.getChartData(nodeSelectedInChart.value);
    if (res.data) {
      chartData.value = res.data;
      modificationTime.value = res.data.modificationTime
        ? convertDateTimeToString(res.data.modificationTime)
        : undefined;
      getCurveNameOpts(res.data);
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
    console.log('get chart data: error ', error);
    chartData.value = [];
    modificationTime.value = undefined;
  }
};

const standardSelected = ref([]);
const otherSelected = ref([]);

const curveNameOpts = ref([]);
const getCurveNameOpts = (data) => {
  const moduleNameObj = {};
  for (let curveIndex = 0; curveIndex < data.length; curveIndex++) {
    moduleNameObj[data[curveIndex].moduleName] = { items: [] };
  }
  for (let curveIndex = 0; curveIndex < data.length; curveIndex++) {
    moduleNameObj[data[curveIndex].moduleName].items.push(data[curveIndex].curveName);
  }

  curveNameOpts.value = Object.keys(moduleNameObj).map((moduleName) => ({
    label: moduleName,
    items: moduleNameObj[moduleName].items,
  }));
};
const reloaData = async () => {
  chartData.value = [];
  await getChartData();
};

const resetChart = async () => {
  clearTimeout(interval.value);
  chartData.value = [];
  nodeSelected.value = [];
  nodeSelectedInChart.value = [];
  showAnnotations.value = true;
  curveNameOpts.value = [];
  standardSelected.value = [];
  otherSelected.value = [];
  hiddenDatasets.value = [];
};
const showAnnotations = ref(false);
const changeConfig = () => {
  showAnnotations.value = !showAnnotations.value;
  nodeSelected.value.showAnnotations = showAnnotations.value;
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

<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div
            v-tooltip.bottom="{
              value: title != 'TSA' ? title : '',
              pt: {
                text: {
                  style: {
                    width: '40rem',
                  },
                },
              },
            }"
            class="truncate-title"
            :style="{ maxWidth: (width / 3) * 10 + 5 + 'rem' }"
          >
            {{ title }}
          </div>
        </div>
        <div class="hidden md:flex gap-2 justify-content-between align-items-center">
          <div>
            <Button
              v-if="nodeSelectedInChart.length > 1 && !gridLock"
              v-tooltip.bottom="'Open Curve Tree'"
              type="button"
              severity="secondary"
              icon="pi pi-sitemap"
              @click="openTreeSelectedCurve"
            />
          </div>

          <Button
            v-if="chartData.length === 1"
            v-model="showAnnotations"
            v-tooltip.bottom="showAnnotations ? 'Curve Only' : 'Show Standard'"
            severity="secondary"
            :icon="showAnnotations ? 'pi pi-chart-line' : 'pi pi-chart-bar'"
            @click="changeConfigAnnotation"
          />
          <Button
            v-model="showLegend"
            v-tooltip.bottom="showLegend ? 'Hide Legend' : 'Show Legend'"
            :disabled="chartData.length === 0"
            :icon="showLegend ? 'pi pi-eye-slash' : 'pi pi-eye'"
            severity="secondary"
            @click="changeConfigLegend"
          />
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
        :id="`${chartId}ChartWrap`"
        class="w-full h-full"
        @dragleave.prevent="canDropNode = false"
        @dragenter.prevent
        @dragover.prevent="onDragoverComponent"
        @drop.prevent="onDropComponent"
      >
        <tsaCurveLinechartWidget
          :data="chartData"
          :showAnnotations="showAnnotations"
          :showLegend="showLegend"
          :width="width"
        />
      </div>
    </template>
  </Card>
  <Dialog v-model:visible="showMenuSelectCurve" modal style="width: 56rem">
    <template #header>
      <div class="flex justify-content-between align-items-center w-full">
        <div>
          <div class="text-lg">Curves in Chart</div>
          <div v-if="deleteKey.length > 0" class="mt-1">
            <small>(Delete {{ deleteKey.length }} Curve)</small>
          </div>
        </div>
        <div class="flex justify-content-end align-items-center gap-3">
          <Button type="button" text icon="pi pi-plus" label="Expand All" @click="expandAll" />
          <Button type="button" icon="pi pi-minus " text label="Collapse All" @click="collapseAll" />
        </div>
      </div>
    </template>
    <Tree
      v-model:expandedKeys="expandedKeys"
      :selectionKeys="treeSelected"
      :value="curveTree"
      selectionMode="single"
      style="width: 50rem; height: 50vh"
      @node-select="onNodeSelect"
    >
      <template #default="slotProps">
        <div>
          {{ slotProps.node.label }}
        </div>
      </template>

      <template #curve="slotProps">
        <div class="flex justify-content-between align-items-center" @click="toogleDeleteStatus(slotProps.node)">
          <div :class="slotProps.node.isDeleted ? 'line-through text-orange-500' : 'text-primary'" class="">
            {{ slotProps.node.label }}
          </div>
          <Button :icon="slotProps.node.isDeleted ? 'pi pi-minus' : 'pi pi-minus'" text></Button>
        </div>
      </template>
    </Tree>
    <template #footer>
      <div class="flex justify-content-between align-items-center gap-3 w-full">
        <Button icon="pi pi-trash " label="Delete All" severity="danger" @click="resetChart" />
        <div class="flex justify-content-end align-items-center gap-3">
          <Button type="button" label="Cancel" severity="secondary" @click="cancelRemoveCurve" />
          <Button type="button" label="Submit" severity="primary" @click="submitRemoveCurve" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, onUnmounted, onMounted, watch } from 'vue';
import ToggleButton from 'primevue/togglebutton';
import tsaCurveLinechartWidget from './tsaCurveLinechartWidget.vue';
import { TsaApi } from './api';
import { smallChartSize } from './chartConfig';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
import { useCommonStore } from '@/store';
import Dialog from 'primevue/dialog';
import ScrollPanel from 'primevue/scrollpanel';
import Tree from 'primevue/tree';
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
const gridLock = defineModel('gridLock');
const width = defineModel('width');
const interval = ref(null);
const intervalTime = 5 * 1000;
onMounted(() => {
  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    showAnnotations.value = nodeSelected.value.showAnnotations;
    showLegend.value = nodeSelected.value.showLegend;
    curveTree.value = nodeSelected.value.curveTree;
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
const title = computed(() => {
  if (curveTree.value.length > 0) {
    const caseTitle = [];
    for (const tsaNode of curveTree.value) {
      if (tsaNode.children.length > 0) {
        for (let caseIndex = 0; caseIndex < tsaNode.children.length; caseIndex++) {
          const caseData = tsaNode.children[caseIndex];
          caseTitle.push(`${caseData.label}: ${caseData.children.map((subcase) => subcase.label).join(', ')}`);
        }
      }
    }
    return caseTitle.join('; ');
  }
  return 'TSA';
});
const onRemoveWidget = () => {
  resetChart();
  emit('onRemoveWidget');
};

const typeChartCanDrop = ref(['TsaCurve', 'TsaCurveType']);
const hiddenDatasets = ref([]);
const nodeSelectedInChart = ref([]);
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
      nodeSelectedInChart.value.push({
        curveInfoId: props.nodeDrag._id,
        curveType: props.nodeDrag.curveType,
        subCaseInfoId: props.nodeDrag.subCaseInfo,
        caseInfoId: props.nodeDrag.caseInfoId,
        moduleInfoId: props.nodeDrag.moduleInfoId,
      });
      addTsaCurveData(props.nodeDrag);
    }
    if (props.nodeDrag.type === 'TsaCurveType') {
      const tsaCurveData = JSON.parse(props.nodeDrag.data);
      tsaCurveData.forEach((curve) => {
        nodeSelectedInChart.value.push({
          curveInfoId: curve._id,
          curveType: props.nodeDrag.curveType,
          subCaseInfoId: props.nodeDrag.subCaseInfo,
          caseInfoId: props.nodeDrag.caseInfoId,
          moduleInfoId: props.nodeDrag.moduleInfoId,
        });
        addTsaCurveData({
          _id: curve._id,
          label: curve.label,
          curveType: props.nodeDrag.curveType,
          tsaName: props.nodeDrag.tsaName,
          caseName: props.nodeDrag.caseName,
          subCaseName: props.nodeDrag.subCaseName,
        });
      });
    }

    nodeSelected.value = {
      data: nodeSelectedInChart.value,
      showAnnotations: showAnnotations.value,
      curveTree: curveTree.value,
    };
    await getChartData();
    canDropNode.value = false;
  }
};

const chartData = ref([]);

const getChartData = async () => {
  try {
    const res = await TsaApi.getChartData(nodeSelectedInChart.value);
    if (res.data) {
      chartData.value = res.data;

      getCurveNameOpts(res.data);
    } else {
      chartData.value = [];
    }

    if (measInfo_automatic.value && deleteKey.value.length === 0) {
      interval.value = setTimeout(async () => {
        await getChartData();
      }, intervalTime);
    }
  } catch (error) {
    console.log('get chart data: error ', error);
    chartData.value = [];
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
  showLegend.value = true;
  curveNameOpts.value = [];
  standardSelected.value = [];
  otherSelected.value = [];
  hiddenDatasets.value = [];
  curveTree.value = [];
  showMenuSelectCurve.value = false;
};
const showAnnotations = ref(false);
const showLegend = ref(true);

const changeConfigAnnotation = () => {
  showAnnotations.value = !showAnnotations.value;
  nodeSelected.value.showAnnotations = showAnnotations.value;
};

const changeConfigLegend = () => {
  showLegend.value = !showLegend.value;
  nodeSelected.value.showLegend = showLegend.value;
};
const curveTree = ref([]);
const addTsaCurveData = (newNode) => {
  const curveType = getTsaCurveTypeValue(newNode.curveType);

  let tsaNode = curveTree.value.find((tsaNode) => tsaNode.key === newNode.tsaName);
  if (!tsaNode) {
    tsaNode = { key: newNode.tsaName, label: newNode.tsaName, children: [] };
    curveTree.value.push(tsaNode);
  }
  let caseNode = tsaNode.children.find((caseNode) => caseNode.key === newNode.caseName);
  if (!caseNode) {
    caseNode = { key: newNode.caseName, label: newNode.caseName, children: [] };
    tsaNode.children.push(caseNode);
  }

  let subCaseNode = caseNode.children.find((subCaseNode) => subCaseNode.key === newNode.subCaseName);
  if (!subCaseNode) {
    subCaseNode = { key: newNode.subCaseName, label: newNode.subCaseName, children: [] };
    caseNode.children.push(subCaseNode);
  }

  let typeNode = subCaseNode.children.find((typeNode) => typeNode.key === curveType);
  if (!typeNode) {
    typeNode = { key: curveType, label: curveType, children: [] };
    subCaseNode.children.push(typeNode);
  }
  typeNode.children.push({
    key: newNode._id,
    label: newNode.label,
    type: 'curve',
    curveType: newNode.curveType,
    tsaName: newNode.tsaName,
    caseName: newNode.caseName,
    subCaseName: newNode.subCaseName,
    isDeleted: false,
  });
};

const showMenuSelectCurve = ref(false);
const openTreeSelectedCurve = () => {
  showMenuSelectCurve.value = true;
  // expandAll();
};
const toogleDeleteStatus = (node) => {
  const tsaNode = curveTree.value.find((tsaNode) => tsaNode.key === node.tsaName);
  if (!tsaNode) return;
  const caseNode = tsaNode.children.find((caseNode) => caseNode.key === node.caseName);
  if (!caseNode) return;
  const subCaseNode = caseNode.children.find((subCaseNode) => subCaseNode.key === node.subCaseName);
  if (!subCaseNode) return;
  const curveType = getTsaCurveTypeValue(node.curveType);
  const typeNode = subCaseNode.children.find((typeNode) => typeNode.key === curveType);
  if (!typeNode) return;
  const index = typeNode.children.findIndex((child) => child.key === node.key);
  if (index !== -1) {
    if (node.isDeleted) {
      deleteKey.value.filter((item) => item.key !== node.key);
      typeNode.children[index].isDeleted = false;
    } else {
      deleteKey.value.push(node);
      typeNode.children[index].isDeleted = true;
    }
  }
};

const removeCurveNodeInTree = (node) => {
  const tsaNode = curveTree.value.find((tsaNode) => tsaNode.key === node.tsaName);
  if (!tsaNode) return;
  const caseNode = tsaNode.children.find((caseNode) => caseNode.key === node.caseName);
  if (!caseNode) return;
  const subCaseNode = caseNode.children.find((subCaseNode) => subCaseNode.key === node.subCaseName);
  if (!subCaseNode) return;
  const curveType = getTsaCurveTypeValue(node.curveType);
  const typeNode = subCaseNode.children.find((typeNode) => typeNode.key === curveType);
  if (!typeNode) return;
  const index = typeNode.children.findIndex((child) => child.key === node.key);
  if (index !== -1) {
    typeNode.children.splice(index, 1);
  }
};
const deleteKey = ref([]);

const submitRemoveCurve = async () => {
  deleteKey.value.forEach((node) => {
    const indexNodeInChart = nodeSelectedInChart.value.findIndex((nodeInChart) => nodeInChart.curveInfoId === node.key);
    if (indexNodeInChart !== -1) {
      nodeSelectedInChart.value.splice(indexNodeInChart, 1);
    }
    removeCurveNodeInTree(node);
  });
  deleteKey.value = [];

  await getChartData();
  nodeSelected.value = {
    data: nodeSelectedInChart.value,
    showAnnotations: showAnnotations.value,
    curveTree: curveTree.value,
  };
  showMenuSelectCurve.value = false;
};

const cancelRemoveCurve = () => {
  deleteKey.value.forEach((node) => {
    toogleDeleteStatus(node);
  });
  deleteKey.value = [];
  showMenuSelectCurve.value = false;
};

const collapseAll = () => {
  expandedKeys.value = {};
};
const expandedKeys = ref({});
const expandAll = () => {
  for (const node of curveTree.value) {
    expandNode(node);
  }

  expandedKeys.value = { ...expandedKeys.value };
};

const expandNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;

    for (const child of node.children) {
      expandNode(child);
    }
  }
};
const treeSelected = ref([]);
const onNodeSelect = (node) => {
  if (expandedKeys.value[node.key]) {
    delete expandedKeys.value[node.key];
  } else {
    expandedKeys.value[node.key] = true;
  }
};
const getTsaCurveTypeValue = (curveType) => {
  if (curveType === undefined) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'ActivePower';
    case 1:
      return 'ReactivePower';
    case 2:
      return 'Voltage';
    case 3:
      return 'Frequency';
    case 5:
      return 'Angle';
    case 6:
      return 'RotorAngle';
    case 7:
      return 'Elect P';
    case 8:
      return 'Elect Q';
    case 9:
      return 'Mech P';
    case 10:
      return 'Efd';
    default:
      return 'Unknown';
  }
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

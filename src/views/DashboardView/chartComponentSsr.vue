<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex flex-wrap justify-content-between align-items-center">
        <div class="flex flex-column justify-content-start align-items-start">
          <div
            v-tooltip.bottom="{
              value: title != 'SSR' ? title : '',
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
              type="button"
              severity="secondary"
              icon="pi pi-sitemap"
              :label="width > smallChartSize ? 'Curve Tree' : ''"
              @click="openTreeSelectedCurve"
            />
          </div>

          <ToggleButton
            v-model="showLegend"
            :disabled="chartData.length === 0"
            :onLabel="width > smallChartSize ? 'Show Label' : ''"
            :offLabel="width > smallChartSize ? 'Hide Label' : ''"
            onIcon="pi pi-eye"
            offIcon="pi pi-eye-slash"
            @change="changeConfig"
          />
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
        <ssrCaseLinechartWidget :data="chartData" :showLegend="showLegend" :width="width" />
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
import { SsrApi } from './api';
import { smallChartSize } from './chartConfig';
import ssrCaseLinechartWidget from './ssrCaseLinechartWidget.vue';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();
import { useCommonStore } from '@/store';
import Dialog from 'primevue/dialog';
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
onMounted(async () => {
  if (nodeSelected.value) {
    nodeSelectedInChart.value = nodeSelected.value.data;
    showLegend.value = nodeSelected.value.showLegend;
    curveTree.value = nodeSelected.value.curveTree;
    await getChartData();
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
const title = computed(() => {
  if (curveTree.value.length > 0) {
    return curveTree.value.map((ssrNode) => ssrNode.label).join('; ');
  } else {
    return 'SSR';
  }
});

const typeChartCanDrop = ref(['SsrCase', 'SSR']);
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
    if (props.nodeDrag.type === 'SsrCase') {
      nodeSelectedInChart.value.push({
        caseInfoId: props.nodeDrag._id,
        moduleInfoId: props.nodeDrag.moduleInfoId,
      });
      addSsrCurveData(props.nodeDrag);
    }
    if (props.nodeDrag.type === 'SSR') {
      const curveData = JSON.parse(props.nodeDrag.data);
      curveData.forEach((curve) => {
        nodeSelectedInChart.value.push({
          caseInfoId: curve._id,
          moduleInfoId: props.nodeDrag._id,
        });
        addSsrCurveData({
          _id: curve._id,
          label: curve.label,
          ssrName: props.nodeDrag.ssrName,
        });
      });
    }

    nodeSelected.value = {
      data: nodeSelectedInChart.value,
      curveTree: curveTree.value,
    };
    await getChartData();
    canDropNode.value = false;
  }
};

const chartData = ref([]);

const getChartData = async () => {
  try {
    const res = await SsrApi.getChartData(nodeSelectedInChart.value);
    chartData.value = res.data || [];

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

const reloaData = async () => {
  chartData.value = [];
  await getChartData();
};

const resetChart = async () => {
  clearTimeout(interval.value);
  chartData.value = [];
  nodeSelected.value = {};
  nodeSelectedInChart.value = [];
  showLegend.value = true;
  curveTree.value = [];
  showMenuSelectCurve.value = false;
};
const showLegend = ref(true);

const changeConfig = () => {
  nodeSelected.value.showLegend = showLegend.value;
};
const curveTree = ref([]);
const addSsrCurveData = (newNode) => {
  let ssrNode = curveTree.value.find((node) => node.key === newNode.ssrName);
  if (!ssrNode) {
    ssrNode = { key: newNode.ssrName, label: newNode.ssrName, children: [] };
    curveTree.value.push(ssrNode);
  }
  ssrNode.children.push({
    key: newNode._id,
    label: newNode.label,
    type: 'curve',
    ssrName: newNode.ssrName,
    isDeleted: false,
  });
};

const showMenuSelectCurve = ref(false);
const openTreeSelectedCurve = () => {
  showMenuSelectCurve.value = true;
  // expandAll();
};
const toogleDeleteStatus = (node) => {
  const ssrNode = curveTree.value.find((ssrNode) => ssrNode.key === node.ssrName);
  if (!ssrNode) return;
  const index = ssrNode.children.findIndex((child) => child.key === node.key);
  if (index !== -1) {
    if (node.isDeleted) {
      deleteKey.value.filter((item) => item.key !== node.key);
      ssrNode.children[index].isDeleted = false;
    } else {
      deleteKey.value.push(node);
      ssrNode.children[index].isDeleted = true;
    }
  }
};

const removeCurveNodeInTree = (node) => {
  const ssrNode = curveTree.value.find((ssrNode) => ssrNode.key === node.ssrName);
  if (!ssrNode) return;
  const index = ssrNode.children.findIndex((child) => child.key === node.key);
  if (index !== -1) {
    ssrNode.children.splice(index, 1);
  }
};
const deleteKey = ref([]);

const submitRemoveCurve = async () => {
  deleteKey.value.forEach((node) => {
    const indexNodeInChart = nodeSelectedInChart.value.findIndex((nodeInChart) => nodeInChart.caseInfoId === node.key);
    if (indexNodeInChart !== -1) {
      nodeSelectedInChart.value.splice(indexNodeInChart, 1);
    }
    removeCurveNodeInTree(node);
  });
  deleteKey.value = [];

  await getChartData();
  nodeSelected.value = {
    data: nodeSelectedInChart.value,
    curveTree: curveTree.value,
    showLegend: showLegend.value,
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
</script>

<style>
.p-card-body {
  height: 100% !important;
}
.p-card-content {
  height: 90% !important;
}
</style>

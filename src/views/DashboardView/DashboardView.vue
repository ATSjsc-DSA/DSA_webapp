<template>
  <div class="grid w-full h-full">
    <div class="col-3 h-full">
      <mapView />
    </div>
    <div class="col-3 h-full">
      <div class="flex flex-column gap-3 h-full">
        <Card class="flex-grow-1 w-full">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div><i class="pi pi-credit-card pr-3"></i>Project</div>
              <Button
                title="Collapse All"
                icon="pi pi-chevron-up "
                severity="secondary"
                text
                @click="treeExpandedKeys = {}"
              />
            </div>
          </template>
          <template #content>
            <ScrollPanel style="width: 100%; height: 52rem">
              <Tree
                v-if="treeData.length > 0"
                v-model:expandedKeys="treeExpandedKeys"
                :selectionKeys="treeSelected"
                :value="treeData"
                loadingMode="icon"
                selectionMode="single"
                class="w-full"
                :loading="treeloading"
                @node-expand="onNodeExpand"
                @node-select="onNodeSelect"
              >
                <template #default="slotProps">
                  <div :class="{ textUnActive: !slotProps.node.active }">
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #Application="slotProps">
                  <div
                    :id="slotProps.node.key"
                    :draggable="applicationDraggable"
                    class="w-full flex align-items-center justify-content-between"
                    :class="{ 'cursor-grap': applicationDraggable }"
                    @dragstart="onStartDragNode($event, slotProps.node)"
                  >
                    <div class="font-bold text-lg" :class="{ textUnActive: !slotProps.node.active }">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>
                <template #DSA="slotProps">
                  <div class="font-semibold" :class="{ textUnActive: !slotProps.node.active }">
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #VSA="slotProps">
                  <div class="w-full flex align-items-center justify-content-start gap-3">
                    <Tag value="VSA" severity="contrast" rounded />
                    <div :class="{ textUnActive: !slotProps.node.active }">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>

                <template #TSA="slotProps">
                  <div class="w-full flex align-items-center justify-content-start gap-3">
                    <Tag value="TSA" severity="contrast" rounded />
                    <div :class="{ textUnActive: !slotProps.node.active }">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>

                <template #VsaCase="slotProps">
                  <!-- <div class="w-full" :class="{ textUnActive: !slotProps.node.active }"></div> -->
                  <div
                    class="w-full flex align-items-center justify-content-start"
                    :class="{ textUnActive: !slotProps.node.active }"
                  >
                    <Tag
                      class="mr-1 w-2rem"
                      :value="getVsaCaseTypeValue(slotProps.node.caseType)"
                      :severity="getVsaCaseTypeSeverity(slotProps.node.caseType)"
                    />

                    <div>{{ slotProps.node.label }}</div>
                  </div>
                </template>

                <template #VsaCurve="slotProps">
                  <div
                    :id="slotProps.node.key"
                    :draggable="vsaCurveDraggable"
                    class="w-full flex align-items-center justify-content-start"
                    :class="{ 'cursor-grap': vsaCurveDraggable }"
                    @dragstart="onStartDragNode($event, slotProps.node)"
                  >
                    <Tag
                      class="mr-3"
                      :value="getVsaCurveTypeValue(slotProps.node.curveType)"
                      :severity="getVsaCurveTypeSeverity(slotProps.node.curveType)"
                    />

                    <div>{{ slotProps.node.label }}</div>
                  </div>
                </template>
                <template #TsaCurve="slotProps">
                  <div
                    :id="slotProps.node.key"
                    :draggable="tsaCurveDraggable"
                    class="w-full flex align-items-center justify-content-start"
                    :class="{ 'cursor-grap': tsaCurveDraggable }"
                    @dragstart="onStartDragNode($event, slotProps.node)"
                  >
                    <Tag
                      class="mr-3"
                      :value="getTsaCurveTypeValue(slotProps.node.curveType)"
                      :severity="getTsaCurveTypeSeverity(slotProps.node.curveType)"
                    />
                    <div>{{ slotProps.node.label }}</div>
                  </div>
                </template>
              </Tree>
              <div v-else>No data</div>
            </ScrollPanel>
          </template>
        </Card>
      </div>
    </div>
    <div class="col-6">
      <div class="w-full h-full flex gap-3">
        <div
          class="w-full h-full"
          :class="{ 'border-2 border-gray-300': chartComponentArr.length === 0 }"
          @dragleave.prevent="canDropChartComponent = false"
          @dragenter.prevent
          @dragover.prevent="dragOverChartComponent"
          @drop.prevent="onDropChartComponent"
        >
          <!-- <div ref="grid" class="grid-stack bg-blue-100"></div> -->
          <div class="grid-stack" style="margin: -0.7rem">
            <div
              v-if="chartComponentArr.length === 0"
              class="flex h-full justify-content-center align-items-center"
              :class="{ 'bg-white font-semibold': canDropChartComponent }"
            >
              Drag component at right to here !
            </div>
            <div
              v-for="w in chartComponentArr"
              :id="w.id"
              :key="w.id"
              class="grid-stack-item"
              :gs-x="w.x"
              :gs-y="w.y"
              :gs-w="w.w"
              :gs-h="w.h"
              :gs-id="w.id"
            >
              <div class="grid-stack-item-content">
                <chartComponent
                  :nodeDrag="nodeDrag"
                  :chartId="w.id"
                  :typeChart="w.typeChart"
                  :muiltiSelect="w.muiltiSelect"
                  @addNodeTreeSelectd="addNodeTreeSelectd"
                  @removeNodeTreeSelected="removeNodeTreeSelected"
                  @onRemoveWidget="onRemoveChartComponent(w)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="application-right-side-custom">
          <div class="flex flex-column gap-3 justify-content-center align-items-center sticky" style="top: 6rem">
            <div
              v-tooltip.left="'Compact Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-primary"
              :style="styleButtonComponents"
              placeholder="Left"
            >
              <i class="pi pi-sync" style="font-size: 1rem" @click="compactGrid" />
            </div>
            <Divider />
            <div
              v-tooltip.left="'Appplication Radar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('appRadar')"
            >
              <i class="pi pi-chart-pie" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">RADAR</div>
            </div>
            <div
              v-tooltip.left="'Appplication Bar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('appBar')"
            >
              <i class="pi pi-fw pi-chart-bar" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">BAR</div>
            </div>

            <div
              v-tooltip.left="'VSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('vsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">VSA</div>
            </div>
            <div
              v-tooltip.left="'TSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('tsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">TSA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, render } from 'vue';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';
import mapView from '@/components/mapView.vue';
import curveLinechartWidget from './curveLinechartWidget.vue';
import appBarchartWidget from './appBarchartWidget.vue';
import appBarChartDropWrap from './appBarChartDropWrap.vue';
import chartComponent from './chartComponent.vue';
import { VsaApi, TsaApi, ApplicationApi, CommonApi } from './api';

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const chartComponentGrid = ref(null);

onMounted(async () => {
  await getTreeData();

  chartComponentGrid.value = GridStack.init({
    float: false,
    cellHeight: '10rem',
    row: 6,
    // resizable: {
    //   handles: 'e, se, s, sw, w, nw, n, ne', // Enables all resize handles
    // },
    // draggable: {
    //   handle: '.grid-stack-item-content',
    // },
  });

  chartComponentGrid.value.on('change', onChangeChartComponent);
});

const styleButtonComponents = ref({
  textAlign: 'center',
  height: 'auto',
  backgroundColor: 'var(--surface-overlay)',
  color: 'var(--text-color)',
  border: '1px solid gray',
  width: '3rem',
});
const treeData = ref([]);
const treeloading = ref(false);
const treeExpandedKeys = ref({});
const treeSelected = ref({});

const getTreeData = async () => {
  treeloading.value = true;
  treeData.value = await getAppBranchData();
  treeloading.value = false;
};

const onNodeExpand = async (node) => {
  if (!node.children) {
    node.loading = true;
    if (node.type === 'Application') {
      node['children'] = await getDsaModuleBranchData(node);
    }
    if (node.type === 'DSA') {
      const vsaBranch = await getVsaBranchData(node);
      const tsaBranch = await getTsaBranchData(node);
      const branch = vsaBranch.concat(tsaBranch);
      if (branch.length === 0) {
        node.leaf = true;
      } else {
        node['children'] = branch;
      }
    }
    if (node.type === 'VSA') {
      node['children'] = await getVsaCaseBranchData(node);
    }
    if (node.type === 'VsaCase') {
      node['children'] = await getVsaCurveBranchData(node);
    }
    if (node.type === 'TSA') {
      node['children'] = await getTsaCaseBranchData(node);
    }
    if (node.type === 'TsaCase') {
      node['children'] = await getTsaSubCaseBranchData(node);
    }
    if (node.type === 'TsaSubCase') {
      node['children'] = await getTsaCurveBranchData(node);
    }
    node.loading = false;
  }
};

//   chỉ chọn Curve node, các node khác thì expand và load element con
const onNodeSelect = async (node) => {
  treeExpandedKeys.value[node.key] = true;
  await onNodeExpand(node);
};

// --- Application

const getAppBranchData = async () => {
  const branch = [];
  const appList = await getAppList();

  for (let appIndex = 0; appIndex < appList.length; appIndex++) {
    const app = appList[appIndex];
    branch.push({
      key: 'app_' + appIndex,
      label: app.name,
      _id: app._id,
      active: app.active,
      type: 'Application',
      icon: 'pi pi-folder-open',
      leaf: false,
    });
  }
  return branch;
};

const getAppList = async () => {
  try {
    const res = await CommonApi.getAppList();
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// ---- DSA module
const getDsaModuleBranchData = async (appNode) => {
  const branch = [];
  const dataList = await getDsaModuleList(appNode._id);
  if (dataList.length === 0) {
    appNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: appNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        appId: appNode._id,
        type: 'DSA',
        icon: 'pi pi-th-large',
        leaf: false,
        active: leafData.active,
      });
    }
  }
  return branch;
};

const getDsaModuleList = async (appId) => {
  try {
    const res = await CommonApi.getDsaModuleList(appId);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// --- VSA

const getVsaBranchData = async (dsaModuleNode) => {
  const branch = [];
  const dataList = await getVsaList(dsaModuleNode._id);
  if (dataList.length === 0) {
    dsaModuleNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: dsaModuleNode.key + '_' + 'vsa_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'VSA',
        leaf: false,
        active: leafData.active,
      });
    }
  }
  return branch;
};

const getVsaList = async (dsaId) => {
  try {
    const res = await VsaApi.getVsaList(dsaId);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getVsaCaseBranchData = async (vsaNode) => {
  const branch = [];
  const dataList = await getVsaCaseList(vsaNode._id);
  if (dataList.length === 0) {
    vsaNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: vsaNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'VsaCase',
        active: leafData.active,
        caseType: leafData.caseType,
        leaf: false,
        moduleInfoId: vsaNode._id,
      });
    }
  }
  return branch;
};

const getVsaCaseList = async (case_id) => {
  try {
    const res = await VsaApi.getCaseList(case_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getVsaCurveBranchData = async (caseNode) => {
  const branch = [];
  const dataList = await getVsaCurveList(caseNode.moduleInfoId, caseNode._id);
  if (dataList.length === 0) {
    caseNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: caseNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'VsaCurve',
        curveType: leafData.curveType,
        active: leafData.active,
        leaf: true,
        caseInfoId: caseNode._id,
        moduleInfoId: caseNode.moduleInfoId,
      });
    }
  }
  return branch;
};

const getVsaCurveList = async (vsa_info_id, case_info_id) => {
  try {
    const res = await VsaApi.getCurveList(vsa_info_id, case_info_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// --- TSA

const getTsaBranchData = async (dsaModuleNode) => {
  const branch = [];
  const dataList = await getTsaList(dsaModuleNode._id);
  if (dataList.length === 0) {
    dsaModuleNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: dsaModuleNode.key + '_' + 'tsa_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TSA',
        active: leafData.active,
        leaf: false,
      });
    }
  }
  return branch;
};

const getTsaList = async (dsaId) => {
  try {
    const res = await TsaApi.getTsaList(dsaId);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getTsaCaseBranchData = async (tsaNode) => {
  const branch = [];
  const dataList = await getTsaCaseList(tsaNode.label);
  if (dataList.length === 0) {
    tsaNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: tsaNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TsaCase',
        active: leafData.active,
        icon: 'pi pi-list',
        leaf: false,
      });
    }
  }
  return branch;
};

const getTsaCaseList = async (dsaName) => {
  try {
    const res = await TsaApi.getCaseList(dsaName);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};
const getTsaSubCaseBranchData = async (caseNode) => {
  const branch = [];
  const dataList = await getTsaSubCaseList(caseNode.label);
  if (dataList.length === 0) {
    caseNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: caseNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TsaSubCase',
        active: leafData.active,
        icon: 'pi pi-file',
        leaf: false,
      });
    }
  }
  return branch;
};

const getTsaSubCaseList = async (caseName) => {
  try {
    const res = await TsaApi.getSubCaseList(caseName);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getTsaCurveBranchData = async (subCaseNode) => {
  const branch = [];
  const dataList = await getTsaCurveList(subCaseNode.label);
  if (dataList.length === 0) {
    subCaseNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      branch.push({
        key: subCaseNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TsaCurve',
        curveType: leafData.curveType,
        leaf: true,
      });
    }
  }
  return branch;
};

const getTsaCurveList = async (subCaseName) => {
  try {
    const res = await TsaApi.getCurveList(subCaseName);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// -- drag drop ---
const nodeDrag = ref({});
const onStartDragNode = (evt, node) => {
  evt.dataTransfer.dropEffect = 'move';
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('itemDrag', node.label);
  nodeDrag.value = node;
};

// vsa caseType
const getVsaCaseTypeValue = (caseType) => {
  switch (caseType) {
    case 0:
      return 'N:1';
    case 1:
      return 'N:2';
    case 2:
      return 'Base';
    default:
      return caseType;
  }
};
const getVsaCaseTypeSeverity = (caseType) => {
  switch (caseType) {
    case 0:
      return 'info';
    case 1:
      return 'warning';
    case 2:
      return 'success';
    default:
      return '';
  }
};

// ---- tsa vsa type curve
const getVsaCurveTypeValue = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'P';
    case 1:
      return 'Q';
    case 2:
      return 'U';
    case 3:
      return 'I';
    default:
      return curveType;
  }
};
const getVsaCurveTypeSeverity = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'primary';
    case 1:
      return 'secondary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    default:
      return '';
  }
};

const getTsaCurveTypeValue = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'Voltage';
    case 1:
      return 'Frequency';
    case 2:
      return 'ASngle';
    case 3:
      return 'ActivePower';
    case 4:
      return 'ReactivePower';
    case 5:
      return 'RotorAngle';
    case 6:
      return 'Elect P';
    case 7:
      return 'Elect Q';
    case 8:
      return 'MechQ';
    case 9:
      return 'Efd';
    default:
      return curveType;
  }
};
const getTsaCurveTypeSeverity = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'primary';
    case 1:
      return 'secondary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    case 4:
      return 'contrast';
    case 5:
      return 'danger';
    case 6:
      return 'success';
    case 7:
      return 'success';
    case 8:
      return 'secondary';
    case 9:
      return 'info';
    default:
      return '';
  }
};
const addNodeTreeSelectd = (key) => {
  treeSelected.value[key] = true;
};
const removeNodeTreeSelected = (key) => {
  treeSelected.value[key] = false;
};
// ---  drag drop chart type

const canDropChartComponent = ref(false);
const typeChartDrag = ref();
const applicationDraggable = ref(false);
const vsaCurveDraggable = ref(false);
const tsaCurveDraggable = ref(false);

const compactGrid = () => {
  chartComponentGrid.value.compact();
};

const handleDragChartTypeStart = (typeChart) => {
  typeChartDrag.value = typeChart;
};
const dragOverChartComponent = () => {
  canDropChartComponent.value = true;
};
const onDropChartComponent = () => {
  canDropChartComponent.value = false;

  if (typeChartDrag.value === 'appBar') {
    applicationDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, false);
  }
  if (typeChartDrag.value === 'appRadar') {
    applicationDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, false);
  }
  if (typeChartDrag.value === 'vsa') {
    vsaCurveDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, true);
  }
  if (typeChartDrag.value === 'tsa') {
    tsaCurveDraggable.value = true;

    addNewChartComponent(typeChartDrag.value, true);
  }
  typeChartDrag.value = undefined;
};

// --- chart component
const chartComponentArr = ref([]);

const addNewChartComponent = async (typeChart, muiltiSelect) => {
  const node = {
    w: 6,
    h: 3,
    id: typeChart + '_' + chartComponentArr.value.length,
    typeChart: typeChart,
    muiltiSelect: muiltiSelect,
  };
  chartComponentArr.value.push(node);

  await nextTick(() => {
    chartComponentGrid.value.makeWidget(`#${node.id}`);
    chartComponentGrid.value.update(document.querySelector(`#${node.id}`), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
  });
};

const onRemoveChartComponent = (widget) => {
  const index = chartComponentArr.value.findIndex((w) => w.id == widget.id);
  chartComponentArr.value.splice(index, 1);
  const selector = `#${widget.id}`;
  chartComponentGrid.value.removeWidget(selector, false);
};
const onChangeChartComponent = (event, changeItems) => {
  changeItems.forEach((item) => {
    const widget = chartComponentArr.value.find((w) => w.id == item.id);
    if (!widget) {
      console.warn('Widget not found: ' + item.id);
      return;
    }
    widget.x = item.x;
    widget.y = item.y;
    widget.w = item.w;
    widget.h = item.h;
  });
};
</script>
<style>
@import 'gridstack/dist/gridstack.min.css';

.textUnActive {
  color: var(--surface-500);
}
.p-treenode-label {
  width: 100%;
}

.disabled-drag-item {
  opacity: 0.5;
  pointer-events: none;
}

.cursor-grap {
  cursor: -webkit-grab;
  cursor: grab;
}
/* Hide specific resize handles */
.ui-resizable-e,
.ui-resizable-se,
.ui-resizable-s,
.ui-resizable-sw,
.ui-resizable-w,
.ui-resizable-nw,
.ui-resizable-n,
.ui-resizable-ne {
  opacity: 0.5 !important;
}
</style>

<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div><i class="pi pi-credit-card pr-3"></i>Project</div>
        <div>
          <Button
            title="Collapse All"
            icon="pi pi-chevron-up "
            severity="secondary"
            text
            @click="treeExpandedKeys = {}"
          />
          <Button icon="pi pi-times" text severity="secondary" title="Remove Tree" @click="emit('onRemoveWidget')" />
        </div>
      </div>
    </template>
    <template #content>
      <ScrollPanel style="width: 100%; height: 100%">
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
</template>

<script setup>
import { onMounted, ref, render } from 'vue';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';
import { VsaApi, TsaApi, CommonApi } from './api';
const props = defineProps({
  applicationDraggable: {
    type: Boolean,
    default: false,
  },
  vsaCurveDraggable: {
    type: Boolean,
    default: false,
  },
  tsaCurveDraggable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['onStartDragNode', 'onRemoveWidget']);
const onStartDragNode = (evt, node) => {
  emit('onStartDragNode', evt, node);
};
onMounted(async () => {
  await getTreeData();
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
  const dataList = await getTsaCaseList(tsaNode._id);
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
// const nodeDrag = ref({});
// const onStartDragNode = (evt, node) => {
//   evt.dataTransfer.dropEffect = 'move';
//   evt.dataTransfer.effectAllowed = 'move';
//   evt.dataTransfer.setData('itemDrag', node.label);
//   nodeDrag.value = node;
// };

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
</script>

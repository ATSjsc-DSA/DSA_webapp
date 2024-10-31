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
                    draggable="true"
                    class="w-full flex align-items-center justify-content-between"
                    style="cursor: -webkit-grab; cursor: grab"
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
                    <Tag value="VSA" severity="success" rounded />
                    <div :class="{ textUnActive: !slotProps.node.active }">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>

                <template #TSA="slotProps">
                  <div class="w-full flex align-items-center justify-content-start gap-3">
                    <Tag value="TSA" severity="secondary" rounded />
                    <div :class="{ textUnActive: !slotProps.node.active }">
                      {{ slotProps.node.label }}
                    </div>
                  </div>
                </template>

                <template #Case="slotProps">
                  <div class="w-full" :class="{ textUnActive: !slotProps.node.active }">
                    {{ slotProps.node.label }}
                  </div>
                </template>

                <template #VsaCurve="slotProps">
                  <div
                    :id="slotProps.node.key"
                    draggable="true"
                    class="w-full flex align-items-center justify-content-start"
                    style="cursor: -webkit-grab; cursor: grab"
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
                    draggable="true"
                    class="w-full flex align-items-center justify-content-start"
                    style="cursor: -webkit-grab; cursor: grab"
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
    <div class="col-6 grid">
      <div class="col-6">
        <Card class="flex-grow-1 w-full h-full" :class="{ 'border-2': canDropApplication }">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div><i class="pi pi-folder-open pr-3"></i>Application Chart</div>
              <div>
                <Button
                  icon="pi pi-trash "
                  title="Reset Data"
                  severity="danger"
                  text
                  @click="resetApplicationSelected"
                />
                <Button
                  icon="pi pi-refresh "
                  title="Refresh chart"
                  severity="secondary"
                  text
                  @click="getAppliactionChartData"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              id="applicationSelected"
              class="w-full"
              style="height: 22rem"
              @dragleave.prevent="canDropApplication = false"
              @dragenter.prevent
              @dragover.prevent="onDragoverApplicationChart"
              @drop.prevent="onDropApplicationChart"
            >
              <appBarchartWidget :data="applicationChartData" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full h-full" :class="{ 'border-2': canDropVsa }">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div><i class="pi pi-clone pr-3"></i>VSA Chart</div>
              <div>
                <Button icon="pi pi-trash " title="Reset data" severity="danger" text @click="resetVsaSelected" />
                <Button
                  icon="pi pi-refresh "
                  title="Refresh chart"
                  severity="secondary"
                  text
                  @click="getVsaChartData"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              id="vsaCurveSelected"
              class="w-full"
              style="height: 22rem"
              @dragleave.prevent="canDropVsa = false"
              @dragenter.prevent
              @dragover.prevent="onDragOverVsaChart"
              @drop.prevent="onDropVsaChart"
            >
              <curveLinechartWidget :data="vsaChartData" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full h-full" :class="{ 'border-2': canDropLeftTsa }">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div><i class="pi pi-clone pr-3"></i>TSA Chart</div>
              <div>
                <Button icon="pi pi-trash " title="Reset data" severity="danger" text @click="resetLeftTsaSelected" />
                <Button
                  icon="pi pi-refresh "
                  title="Refresh chart"
                  severity="secondary"
                  text
                  @click="getTsaLeftChartData"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              id="vsaCurveChart1"
              class="w-full"
              style="height: 22rem"
              @dragleave.prevent="canDropLeftTsa = false"
              @dragenter.prevent
              @dragover.prevent="onDragoverTsaLeftChart"
              @drop.prevent="onDropTsaLeftChart"
            >
              <curveLinechartWidget :data="tsaLeftChartData" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full h-full" :class="{ 'border-2': canDropRightTsa }">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div><i class="pi pi-clone pr-3"></i>TSA Chart</div>
              <div>
                <Button icon="pi pi-trash " title="Reset data" severity="danger" text @click="resetRightTsaSelected" />
                <Button
                  icon="pi pi-refresh "
                  title="Refresh chart"
                  severity="secondary"
                  text
                  @click="getTsaRightChartData"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              id="vsaCurveChart1"
              class="w-full"
              style="height: 22rem"
              @dragleave.prevent="canDropRightTsa = false"
              @dragenter.prevent
              @dragover.prevent="onDragoverTsaRightChart"
              @drop.prevent="onDropTsaRightChart"
            >
              <curveLinechartWidget :data="tsaRightChartData" />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';

import mapView from '@/components/mapView.vue';
import curveLinechartWidget from './curveLinechartWidget.vue';
import appBarchartWidget from './appBarchartWidget.vue';
import { VsaApi, TsaApi, ApplicationApi as ApplicationHmiApi } from './api';
import { ApiApplication, ApiDsa } from '@/views/UserConfigurationView/api.js';

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
    const res = await ApiApplication.getList();
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
    const res = await ApiDsa.getList(appId);
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
        icon: 'pi pi-clone',
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
  const dataList = await getVsaCaseList(vsaNode.label);
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
        icon: 'pi pi-list',
        leaf: false,
      });
    }
  }
  return branch;
};

const getVsaCaseList = async (dsaName) => {
  try {
    const res = await VsaApi.getCaseList(dsaName);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getVsaCurveBranchData = async (caseNode) => {
  const branch = [];
  const dataList = await getVsaCurveList(caseNode.label);
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
      });
    }
  }
  return branch;
};

const getVsaCurveList = async (caseName) => {
  try {
    const res = await VsaApi.getCurveList(caseName);
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
        icon: 'pi pi-clone',
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
const nodeDrag = ref();
const onStartDragNode = (evt, node) => {
  evt.dataTransfer.dropEffect = 'move';
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('itemDrag', node.label);
  nodeDrag.value = node;
};

//  Drop Application
const applicationSelected = ref();
const applicationKeySelected = ref();
const canDropApplication = ref(false);

const onDragoverApplicationChart = () => {
  if (nodeDrag.value.type === 'Application' && applicationSelected.value !== nodeDrag.value._id) {
    canDropApplication.value = true;
  } else {
    canDropApplication.value = false;
  }
};
const onDropApplicationChart = async () => {
  if (nodeDrag.value.type === 'Application' && applicationSelected.value !== nodeDrag.value._id) {
    resetApplicationSelected();
    applicationSelected.value = nodeDrag.value._id;
    applicationKeySelected.value = nodeDrag.value.key;
    treeSelected.value[nodeDrag.value.key] = true;
    await getAppliactionChartData();
    canDropApplication.value = false;
  }
};

const applicationChartData = ref([]);
const getAppliactionChartData = async () => {
  try {
    const res = await ApplicationHmiApi.getChartData(applicationSelected.value);
    applicationChartData.value = res.data || [];
  } catch (error) {
    console.log('getVsaChartData: error ', error);
    applicationChartData.value = [];
  }
};

const resetApplicationSelected = () => {
  applicationChartData.value = [];
  applicationSelected.value = undefined;
  treeSelected.value[applicationKeySelected.value] = false;
};
// Drop VSA
const vsaCurveSelected = ref([]);
const canDropVsa = ref(false);

const onDragOverVsaChart = () => {
  if (nodeDrag.value.type === 'VsaCurve' && vsaCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    canDropVsa.value = true;
  } else {
    canDropVsa.value = false;
  }
};
const onDropVsaChart = async () => {
  if (nodeDrag.value.type === 'VsaCurve' && vsaCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    vsaCurveSelected.value.push(nodeDrag.value.label);
    treeSelected.value[nodeDrag.value.key] = true;
    await getVsaChartData();
    canDropVsa.value = false;
  }
};

const vsaChartData = ref([]);
const getVsaChartData = async () => {
  try {
    const res = await VsaApi.getChartData(vsaCurveSelected.value);
    vsaChartData.value = res.data;
  } catch (error) {
    console.log('getVsaChartData: error ', error);
    vsaChartData.value = [];
  }
};

const resetVsaSelected = async () => {
  vsaChartData.value = [];
  vsaCurveSelected.value = [];
  for (const key in treeSelected.value) {
    if (key.includes('vsa')) {
      treeSelected.value[key] = false;
    }
  }
};
// ---drop TSA - 1 - left chart
const tsaLeftCurveSelected = ref([]);
const tsaKeyLeftCurveSelected = ref([]);

const canDropLeftTsa = ref(false);
const onDragoverTsaLeftChart = () => {
  if (nodeDrag.value.type === 'TsaCurve' && tsaLeftCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    canDropLeftTsa.value = true;
  } else {
    canDropLeftTsa.value = false;
  }
};

const onDropTsaLeftChart = async () => {
  if (nodeDrag.value.type === 'TsaCurve' && tsaLeftCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    tsaLeftCurveSelected.value.push(nodeDrag.value.label);
    treeSelected.value[nodeDrag.value.key] = true;
    await getTsaLeftChartData();
    canDropLeftTsa.value = false;
    tsaKeyLeftCurveSelected.value.push(nodeDrag.value.key);
  }
};
const tsaLeftChartData = ref([]);
const getTsaLeftChartData = async () => {
  try {
    const res = await TsaApi.getChartData(tsaLeftCurveSelected.value);
    tsaLeftChartData.value = res.data;
  } catch (error) {
    console.log('getTsaLeftChartData: error ', error);
    tsaLeftChartData.value = [];
  }
};
const resetLeftTsaSelected = async () => {
  tsaLeftChartData.value = [];
  tsaLeftCurveSelected.value = [];
  for (const key in tsaKeyLeftCurveSelected.value) {
    treeSelected.value[key] = false;
  }
  tsaKeyLeftCurveSelected.value = [];
};
// ---drop TSA - 1 - right chart

const tsaRightCurveSelected = ref([]);
const tsaKeyRightCurveSelected = ref([]);

const canDropRightTsa = ref(false);

const onDragoverTsaRightChart = () => {
  if (nodeDrag.value.type === 'TsaCurve' && tsaRightCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    canDropRightTsa.value = true;
  } else {
    canDropRightTsa.value = false;
  }
};

const onDropTsaRightChart = async () => {
  if (nodeDrag.value.type === 'TsaCurve' && tsaRightCurveSelected.value.indexOf(nodeDrag.value.label) === -1) {
    tsaRightCurveSelected.value.push(nodeDrag.value.label);
    treeSelected.value[nodeDrag.value.key] = true;
    await getTsaRightChartData();
    canDropRightTsa.value = false;
    tsaKeyRightCurveSelected.value.push(nodeDrag.value.key);
  }
};
const tsaRightChartData = ref([]);
const getTsaRightChartData = async () => {
  try {
    const res = await TsaApi.getChartData(tsaRightCurveSelected.value);
    tsaRightChartData.value = res.data;
  } catch (error) {
    console.log('gettsaRightChartData: error ', error);
    tsaRightChartData.value = [];
  }
};
const resetRightTsaSelected = async () => {
  tsaRightChartData.value = [];
  tsaRightCurveSelected.value = [];
  for (const key in tsaKeyRightCurveSelected.value) {
    treeSelected.value[key] = false;
  }
  tsaKeyRightCurveSelected.value = [];
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
<style>
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
</style>

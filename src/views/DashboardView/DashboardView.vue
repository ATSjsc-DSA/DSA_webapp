<template>
  <div class="grid w-full h-full">
    <div class="col-3 h-full">
      <mapView />
    </div>
    <div class="col-3 h-full">
      <Card class="flex-grow-1 w-full">
        <template #title><i class="pi pi-credit-card pr-3"></i>Project</template>
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
              @node-unselect="onNodeUnSelect"
            >
              <template #Application="slotProps">
                <div class="w-full flex align-items-center justify-content-between">
                  <div class="font-bold text-lg">
                    {{ slotProps.node.label }}
                  </div>
                  <div class="ml-3">
                    <Tag v-if="slotProps.node.active" value="Active" severity="success" />
                  </div>
                </div>
              </template>
              <template #DSA="slotProps">
                <div class="font-semibold">
                  {{ slotProps.node.label }}
                </div>
              </template>

              <template #VSA="slotProps">
                <div class="w-full flex align-items-center justify-content-start gap-3">
                  <Tag value="VSA" severity="success" rounded />
                  <div>
                    {{ slotProps.node.label }}
                  </div>
                </div>
              </template>

              <template #TSA="slotProps">
                <div class="w-full flex align-items-center justify-content-start gap-3">
                  <Tag value="TSA" severity="secondary" rounded />
                  <div>
                    {{ slotProps.node.label }}
                  </div>
                </div>
              </template>

              <template #Case="slotProps">
                <div class="w-full">
                  {{ slotProps.node.label }}
                </div>
              </template>
            </Tree>
            <div v-else>No data</div>
          </ScrollPanel>
        </template>
      </Card>
    </div>
    <div class="col grid">
      <div class="col-6">
        <Card class="flex-grow-1 w-full">
          <template #title><i class="pi pi-credit-card pr-3"></i>TSA curve</template>
          <template #content>
            TSA curve --
            <pre>{{ tsaCurveSelected }} </pre>
            --
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full">
          <template #title><i class="pi pi-credit-card pr-3"></i>treeSelected</template>
          <template #content>
            treeSelected --
            <pre>{{ treeSelected }} </pre>
            --
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full">
          <template #title><i class="pi pi-credit-card pr-3"></i>treeData</template>
          <template #content>
            treeData --
            <pre>{{ treeData }} </pre>
            --
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="flex-grow-1 w-full">
          <template #title><i class="pi pi-credit-card pr-3"></i>vsaCurveSelected</template>
          <template #content>
            vsaCurveSelected --
            <pre>{{ vsaCurveSelected }} </pre>
            --
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';

import mapView from '@/components/mapView.vue';

import { VsaApi, TsaApi } from './api';
import { ApiApplication, ApiDsa } from '@/views/UserConfigurationView/api.js';

onMounted(async () => {
  await getTreeData();
});
const treeData = ref([]);
const treeloading = ref(false);
const treeExpandedKeys = ref({});
const treeSelected = ref({});
const tsaCurveSelected = ref([]);
const vsaCurveSelected = ref([]);

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
    node.loading = false;
  }
};

const onNodeSelect = async (node) => {
  console.log('node', node);
  if (node.type === 'VsaCurve') {
    treeSelected.value[node.key] = true;
    vsaCurveSelected.value.push(node.label);
  } else if (node.type === 'TsaCurve') {
    treeSelected.value[node.key] = true;
    tsaCurveSelected.value.push(node.label);
  } else {
    treeExpandedKeys.value[node.key] = true;
    await onNodeExpand(node);
  }
};

const onNodeUnSelect = async (node) => {
  if (node.type === 'VsaCurve') {
    treeSelected.value[node.key] = false;
    tsaCurveSelected.value = tsaCurveSelected.value.filter((item) => item != node.label);
  }
  if (node.type === 'TsaCurve') {
    treeSelected.value[node.key] = false;
    tsaCurveSelected.value = tsaCurveSelected.value.filter((item) => item != node.label);
  }
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
        icon: 'pi pi-list',
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
</script>
<style>
.p-treenode-label {
  width: 100%;
}
</style>

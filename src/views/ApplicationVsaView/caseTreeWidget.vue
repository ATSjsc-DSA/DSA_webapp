<template>
  <ScrollPanel style="width: 100%; height: 52rem">
    <Tree
      v-model:expandedKeys="caseTreeExpandedKeys"
      :selectionKeys="caseSelected"
      :value="caseTree"
      loadingMode="icon"
      selectionMode="single"
      class="w-full"
      :loading="caseTreeloading"
      @node-expand="onCaseNodeExpand"
      @node-select="onCaseNodeSelect"
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
      <template #VSA_TSA="slotProps">
        <div class="font-semibold">
          {{ slotProps.node.label }}
        </div>
      </template>

      <template #Case="slotProps">
        <div class="w-full">
          {{ slotProps.node.label }}
        </div>
      </template>
    </Tree>
  </ScrollPanel>
</template>
<script setup>
import { onMounted } from 'vue';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';

import { ApiApplication } from '../UserConfigurationView/api';
import { VsaApi, TsaApi } from './api';

const props = defineProps({
  typeModel: { type: String, default: 'VSA' },
});
onMounted(async () => {
  await getcaseTreeData();
});

const caseTree = ref([]);
const caseTreeloading = ref(false);
const caseTreeExpandedKeys = ref({});
const getcaseTreeData = async () => {
  const tree = [];
  caseTreeloading.value = true;
  const appList = await getAppList();
  for (let appIndex = 0; appIndex < appList.length; appIndex++) {
    const app = appList[appIndex];
    tree.push({
      key: 'app_' + appIndex,
      label: app.name,
      _id: app._id,
      active: app.active,
      type: 'Application',
      icon: 'pi pi-folder-open',
      leaf: false,
    });
  }
  caseTree.value = tree;
  caseTreeloading.value = false;
};
const onCaseNodeExpand = async (node) => {
  if (!node.children) {
    node.loading = true;
    if (node.type === 'Application') {
      node['children'] = await getVsaTsaBranchData(node);
    }
    if (node.type === 'VSA_TSA') {
      node['children'] = await getCaseBranchData(node);
    }
    node.loading = false;
  }
};
// ---- application

const getAppList = async () => {
  try {
    const res = await ApiApplication.getList();
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};
// -- VSA

const getVsaTsaBranchData = async (appNode) => {
  let vsaOrTsaList = [];
  if (props.typeModel === 'VSA') {
    vsaOrTsaList = await getVsaList(appNode._id);
  }
  if (props.typeModel === 'TSA') {
    vsaOrTsaList = await getTsaList(appNode._id);
  }
  const branch = [];
  if (vsaOrTsaList.length === 0) {
    appNode.leaf = true;
  } else {
    for (let index = 0; index < vsaOrTsaList.length; index++) {
      const newNodeData = vsaOrTsaList[index];
      branch.push({
        key: appNode.key + '_' + props.typeModel + '_' + index,
        label: newNodeData.name,
        _id: newNodeData._id,
        type: 'VSA_TSA',
        icon: 'pi pi pi-list',
        leaf: false,
      });
    }
  }
  return branch;
};
const getVsaList = async (appId) => {
  try {
    const res = await VsaApi.getVsaList(appId);
    return res.data;
  } catch (error) {
    console.log('getVsaList: error ', error);
  }
};
const getTsaList = async (appId) => {
  try {
    const res = await TsaApi.getTsaList(appId);
    return res.data;
  } catch (error) {
    console.log('getTsaList: error ', error);
  }
};
// -- Case

const getCaseBranchData = async (parentNode) => {
  let caseList = [];
  if (props.typeModel === 'VSA') {
    caseList = await getVsaCaseList(parentNode._id);
  }
  if (props.typeModel === 'TSA') {
    caseList = await getTsaCaseList(parentNode._id);
  }
  const caseBranch = [];
  if (caseList.length === 0) {
    parentNode.leaf = true;
  } else {
    for (let index = 0; index < caseList.length; index++) {
      const caseData = caseList[index];
      caseBranch.push({
        key: parentNode.key + '_' + index,
        label: caseData.name,
        _id: caseData._id,
        type: 'Case',
        leaf: true,
      });
    }
  }
  return caseBranch;
};

const getVsaCaseList = async (vsaId) => {
  try {
    const res = await VsaApi.getCaseList(vsaId);
    return res.data;
  } catch (error) {
    console.log('getCaseList: error ', error);
  }
};

const getTsaCaseList = async (tsaId) => {
  try {
    const res = await TsaApi.getCaseList(tsaId);
    return res.data;
  } catch (error) {
    console.log('getCaseList: error ', error);
  }
};

// --  on node select
const caseSelected = ref({});
const emits = defineEmits(['changeCase']);
const onCaseNodeSelect = async (node) => {
  if (node.type === 'Case') {
    caseSelected.value[node.key] = true;
    emits('changeCase', node);
  } else {
    caseTreeExpandedKeys.value[node.key] = true;
    await onCaseNodeExpand(node);
  }
};
</script>

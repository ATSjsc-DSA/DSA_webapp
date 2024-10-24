<template>
  <Tree
    v-model:expandedKeys="caseTreeExpandedKeys"
    :selectionKeys="caseSelected"
    :value="caseTree"
    loadingMode="icon"
    selectionMode="single"
    class="w-full"
    style="height: 52rem"
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
    <template #VSA="slotProps">
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
</template>
<script setup>
import { onMounted } from 'vue';

import Tree from 'primevue/tree';

import { ApiApplication } from '../UserConfigurationView/api';
import { api } from './api';
const projectVersionId = ref('66decf1dcff005199529524b');

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
      node['children'] = await getVsaBranchData(node);
    }
    if (node.type === 'VSA') {
      node['children'] = await getCaseBranchData(node);
    }
    node.loading = false;
  }
};
// ---- application

const getAppList = async () => {
  try {
    const res = await ApiApplication.getList(projectVersionId.value);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
  }
};
// -- VSA

const getVsaBranchData = async (appNode) => {
  const vsaList = await getVsaList(appNode._id);
  const vsaBranch = [];
  if (vsaList.length === 0) {
    appNode.leaf = true;
  } else {
    for (let index = 0; index < vsaList.length; index++) {
      const vsa = vsaList[index];
      vsaBranch.push({
        key: appNode.key + 'vsa_' + index,
        label: vsa.name,
        _id: vsa._id,
        type: 'VSA',
        icon: 'pi pi pi-list',
        leaf: false,
      });
    }
  }
  return vsaBranch;
};
const getVsaList = async (vsaId) => {
  try {
    const res = await api.GetVsaHmiWithApp(vsaId);
    return res.data;
  } catch (error) {
    console.log('GetVsaHmiWithApp: error ', error);
  }
};
// -- Case

const getCaseBranchData = async (vsaNode) => {
  const caseList = await getCaseList(vsaNode._id);
  const caseBranch = [];
  if (caseList.length === 0) {
    vsaNode.leaf = true;
  } else {
    for (let index = 0; index < caseList.length; index++) {
      const vsa = caseList[index];
      caseBranch.push({
        key: vsaNode.key + 'vsa_' + index,
        label: vsa.name,
        _id: vsa._id,
        type: 'Case',
        icon: 'pi pi-th-large',
        leaf: true,
      });
    }
  }
  return caseBranch;
};

const getCaseList = async (vsaId) => {
  try {
    const res = await api.GetCaseOnVsa(vsaId);
    return res.data;
  } catch (error) {
    console.log('GetCaseOnVsa: error ', error);
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

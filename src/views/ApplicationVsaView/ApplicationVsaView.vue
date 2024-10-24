<template>
  <div class="grid w-full h-full">
    <div class="col-3 flex flex-column gap-3">
      <Card class="h-full">
        <template #title> Case </template>
        <template #content>
          <caseTreeWidget @changeCase="changeCase" />
        </template>
      </Card>
    </div>
    <div class="col-3">
      <div class="flex flex-column gap-3 h-full">
        <!-- Monitor -->
        <Card class="flex-grow-1">
          <template #title>Monitor</template>
          <template #content>
            <Tree
              v-model:expandedKeys="monitorTreeExpandedKeys"
              :selectionKeys="monitorTypeSelected"
              :value="monitorTree"
              loadingMode="icon"
              selectionMode="multiple"
              class="w-full"
              :loading="monitorTreeLoading"
              @node-expand="onNodeExpand"
              @node-select="onMonitorNodeSelect"
            >
              <template #SubCase="slotProps">
                <div class="font-bold text-lg">
                  {{ slotProps.node.label }}
                </div>
              </template>
              <template #PowerSystem="slotProps">
                <div class="font-semibold">
                  {{ slotProps.node.label }}
                </div>
              </template>
              <template #Type="slotProps">
                <div class="w-full">
                  {{ slotProps.node.label }}
                </div>
              </template>
            </Tree>
          </template>
        </Card>
        <!-- Export -->
        <Card class="flex-grow-1">
          <template #title>Export</template>
          <template #content>
            <Tree
              v-model:expandedKeys="exportTreeExpandedKeys"
              :selectionKeys="exportTypeSelected"
              :value="exportTree"
              loadingMode="icon"
              selectionMode="multiple"
              class="w-full"
              :loading="exportTreeLoading"
              @node-expand="onNodeExpand"
              @node-select="onExportTypeNodeSelect"
            >
              <template #SubCase="slotProps">
                <div class="font-bold text-lg">
                  {{ slotProps.node.label }}
                </div>
              </template>
              <template #PowerSystem="slotProps">
                <div class="font-semibold">
                  {{ slotProps.node.label }}
                </div>
              </template>
              <template #Type="slotProps">
                <div class="w-full">
                  {{ slotProps.node.label }}
                </div>
              </template>
            </Tree>
          </template>
        </Card>
      </div>
    </div>
    <div class="col-6">
      <Card class="h-full">
        <template #content>
          <div class="w-full flex gap-6">
            <div>
              monitorTypeSelected
              <pre>{{ monitorTypeSelected }}</pre>
            </div>
            <div>
              exportTypeSelected
              <pre>{{ exportTypeSelected }}</pre>
            </div>
            <div>
              typeSelected
              <pre>{{ typeSelected }}</pre>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import Tree from 'primevue/tree';

import { ApiApplication } from '../UserConfigurationView/api';
import { api } from './api';

import caseTreeWidget from './caseTreeWidget.vue';
const projectVersionId = ref('66decf1dcff005199529524b');
const toast = useToast();

onMounted(async () => {});

const caseSelected = ref();
const changeCase = async (newCase) => {
  caseSelected.value = newCase;
  await getMonitorTree();
  await getExportTypeTree();
};

// ---monitor
const monitorTree = ref([]);
const monitorTreeLoading = ref(false);
const monitorTreeExpandedKeys = ref({});
const monitorTypeSelected = ref({});

const onMonitorNodeSelect = async (node) => {
  if (node.type === 'Type') {
    monitorTypeSelected.value[node.key] = true;
  } else {
    monitorTreeExpandedKeys.value[node.key] = true;
    await onNodeExpand(node);
  }
};

const getMonitorTree = async () => {
  const tree = [];
  monitorTreeLoading.value = true;
  const monitorList = await getMonitorList();
  for (let monitorIndex = 0; monitorIndex < monitorList.length; monitorIndex++) {
    const monitor = monitorList[monitorIndex];
    tree.push({
      key: 'monitor_' + monitorIndex,
      label: monitor.name,
      _id: monitor._id,
      type: 'SubCase',
      icon: 'pi pi-folder-open',
      leaf: false,
    });
  }
  monitorTree.value = tree;
  monitorTreeLoading.value = false;
};

const getMonitorList = async () => {
  try {
    const res = await api.GetMonitorList(caseSelected.value._id);
    return res.data;
  } catch (error) {
    console.log('GetMonitorList: error ', error);
    return [];
  }
};

// ---export
const exportTree = ref([]);
const exportTreeLoading = ref(false);
const exportTreeExpandedKeys = ref({});
const exportTypeSelected = ref({});
const typeSelected = computed(() => {
  const monitorType = Object.keys(monitorTypeSelected.value);
  const exportType = Object.keys(exportTypeSelected.value);
  return monitorType.concat(exportType);
});

const onExportTypeNodeSelect = async (node) => {
  if (node.type === 'Type') {
    exportTypeSelected.value[node.key] = true;
  } else {
    exportTreeExpandedKeys.value[node.key] = true;
    await onNodeExpand(node);
  }
};

const getExportTypeTree = async () => {
  const tree = [];
  exportTreeLoading.value = true;
  const exportList = await getCaseExportList();
  for (let exportIndex = 0; exportIndex < exportList.length; exportIndex++) {
    const caseExport = exportList[exportIndex];
    tree.push({
      key: 'export_' + exportIndex,
      label: caseExport.name,
      _id: caseExport._id,
      type: 'SubCase',
      icon: 'pi pi-folder-open',
      leaf: false,
    });
  }
  exportTree.value = tree;
  exportTreeLoading.value = false;
};

const getCaseExportList = async () => {
  try {
    const res = await api.GetExportList(caseSelected.value._id);
    return res.data;
  } catch (error) {
    console.log('GetExportList: error ', error);
    return [];
  }
};

// -- chung
const getCurveBranch = async (parentNode) => {
  const curveList = await getCurveList(parentNode._id);
  if (curveList.length === 0) {
    parentNode.leaf = true;
  } else {
    const curveBranch = [];
    for (let monitorIndex = 0; monitorIndex < curveList.length; monitorIndex++) {
      const curve = curveList[monitorIndex];
      curveBranch.push({
        key: parentNode.key + '_' + monitorIndex,
        label: curve.name,
        _id: curve._id,
        type: 'Curve',
        icon: 'pi pi-list',
        leaf: false,
        subcaseId: parentNode._id,
      });
    }
    return curveBranch;
  }
};

const onNodeExpand = async (node) => {
  if (!node.children) {
    node.loading = true;
    if (node.type === 'SubCase') {
      node['children'] = await getCurveBranch(node);
    }
    if (node.type === 'Curve') {
      node['children'] = await getTypeBranch(node);
    }
    node.loading = false;
  }
};

const getCurveList = async (subCaseId) => {
  try {
    const res = await api.GetCurveList(subCaseId);
    return res.data;
  } catch (error) {
    console.log('GetCurveList: error ', error);
    return [];
  }
};

const getTypeBranch = async (parentNode) => {
  const typeList = await getTypeList(parentNode.subcaseId, parentNode._id);
  if (typeList.length === 0) {
    parentNode.leaf = true;
  } else {
    const typeBranch = [];
    for (let monitorIndex = 0; monitorIndex < typeList.length; monitorIndex++) {
      const typeData = typeList[monitorIndex];
      typeBranch.push({
        key: parentNode.key + '_' + monitorIndex,
        label: typeData.name,
        _id: typeData._id,
        type: 'Type',
        icon: 'pi pi-th-large',
        leaf: true,
      });
    }
    return typeBranch;
  }
};

const getTypeList = async (subCaseId, curveId) => {
  try {
    const res = await api.GetTypeList(subCaseId, curveId);
    return res.data;
  } catch (error) {
    console.log('GetTypeList: error ', error);
    return [];
  }
};
</script>
<style>
.p-treenode-label {
  width: 100%;
}
</style>

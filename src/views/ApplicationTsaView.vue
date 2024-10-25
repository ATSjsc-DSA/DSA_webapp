<template>
  <div class="grid w-full h-full">
    <div class="col-3 flex flex-column gap-3">
      <Card class="h-full">
        <template #title><i class="pi pi-list pr-3"></i> Case </template>
        <template #content>
          <caseTreeWidget type-model="TSA" @changeCase="changeCase" />
        </template>
      </Card>
    </div>
    <div class="col-3">
      <div class="flex flex-column gap-3 h-full">
        <!-- SubCase -->
        <Card class="flex-grow-1">
          <template #title><i class="pi pi-credit-card pr-3"></i>SubCase</template>
          <template #content>
            <ScrollPanel style="width: 100%; height: 52rem">
              <div v-if="!caseSelected._id" class="h-full flex">
                <div class="m-auto">Choose a Case</div>
              </div>
              <Tree
                v-else
                v-model:expandedKeys="subCaseTreeExpandedKeys"
                :selectionKeys="subCaseSelected"
                :value="subCaseTree"
                loadingMode="icon"
                selectionMode="single"
                class="w-full"
                :loading="subCaseTreeLoading"
                @node-expand="onNodeExpand"
                @node-select="onSubCaseSelect"
              >
                <template #SubCase="slotProps">
                  <div class="font-bold text-lg">
                    {{ slotProps.node.label }}
                  </div>
                </template>
                <template #Curve="slotProps">
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
            </ScrollPanel>
          </template>
        </Card>
      </div>
    </div>
    <div class="col-6 flex flex-column gap-3 h-full">
      <Card class="h-full">
        <template #content>
          <div style="height: 23rem">
            <lineChartSpecialBase ChartStabe :chartData="chartData" labelChart="value" class="chart border-none" />
          </div>
          <div style="height: 23rem">
            <lineChartSpecialBase :chartData="chartData" labelChart="powertranfer" class="chart border-none" />
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
import ScrollPanel from 'primevue/scrollpanel';
import { TsaApi } from './ApplicationVsaView/api';
import caseTreeWidget from './ApplicationVsaView/caseTreeWidget.vue';
import TSA_api from '@/module/TSA/api/tsa_api';
import lineChartSpecialBase from '@/components/lineChartSpecialBase.vue';
const projectVersionId = ref('66decf1dcff005199529524b');
const toast = useToast();

onMounted(async () => {});

const typeSelected = ref();

// -- tree filter
const caseSelected = ref({});
const changeCase = async (newCase) => {
  caseSelected.value = newCase;
  await setInitData();
  await getsubCaseTree();
};

const setInitData = async () => {
  typeSelected.value = undefined;
  subCaseSelected.value = {};
  subCaseTreeExpandedKeys.value = {};
};
// ---monitor
const subCaseTree = ref([]);
const subCaseTreeLoading = ref(false);
const subCaseTreeExpandedKeys = ref({});
const subCaseSelected = ref({});

const onSubCaseSelect = async (node) => {
  if (node.type === 'Type') {
    subCaseSelected.value[node.key] = true;
    typeSelected.value = node;
    await getChartData();
  } else {
    subCaseTreeExpandedKeys.value[node.key] = true;
    await onNodeExpand(node);
  }
};

const getsubCaseTree = async () => {
  const tree = [];
  subCaseTreeLoading.value = true;
  const monitorList = await getSubcaseList();
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
  subCaseTree.value = tree;
  subCaseTreeLoading.value = false;
};

const getSubcaseList = async () => {
  try {
    const res = await TsaApi.getSubcaseList(caseSelected.value._id);
    return res.data;
  } catch (error) {
    console.log('getSubcaseList: error ', error);
    return [];
  }
};

const getCurveBranch = async (subcaseNode) => {
  const curveList = await getCurveList(subcaseNode._id);
  if (curveList.length === 0) {
    subcaseNode.leaf = true;
  } else {
    const curveBranch = [];
    for (let monitorIndex = 0; monitorIndex < curveList.length; monitorIndex++) {
      const curve = curveList[monitorIndex];
      curveBranch.push({
        key: subcaseNode.key + '_' + monitorIndex,
        label: curve.name,
        _id: curve._id,
        type: 'Curve',
        icon: 'pi pi-list',
        leaf: false,
        subcaseId: subcaseNode._id,
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
    const res = await TsaApi.getCurveList(subCaseId);
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
    const res = await TsaApi.getTypeList(subCaseId, curveId);
    return res.data;
  } catch (error) {
    console.log('GetTypeList: error ', error);
    return [];
  }
};

// -- chart

const baseValueChart = {
  type: String,
  load_scale: Number,
  PowerTranfer: Number,
  peak: Number,
  t_stablility: Number,
  stability: Number,
  time: [],
  value: [],
  powertranfer: [],
  modificationTime: null,
};

const chartData = ref(baseValueChart);
const getChartData = async () => {
  try {
    const res = await TsaApi.getChartData(caseSelected.value._id, typeSelected.value._id);
    chartData.value = res.data;
  } catch (error) {}
};
</script>
<style>
.p-treenode-label {
  width: 100%;
}
</style>

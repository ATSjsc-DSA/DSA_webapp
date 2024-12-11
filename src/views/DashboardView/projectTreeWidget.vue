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
            :disabled="treeloading"
            @click="treeExpandedKeys = {}"
          />
          <Button
            icon="pi pi-refresh"
            text
            severity="secondary"
            :disabled="treeloading"
            title="Reload Tree"
            @click="reloadTree"
          />

          <Button
            icon="pi pi-times"
            text
            severity="secondary"
            :disabled="treeloading"
            title="Close Tree"
            @click="emit('onRemoveWidget')"
          />
        </div>
      </div>
    </template>
    <template #content>
      <ScrollPanel style="width: 100%; height: 100%">
        <template v-if="treeloading"> <div>Loading ...</div> </template>
        <template v-else>
          <Tree
            v-if="treeData.length > 0"
            v-model:expandedKeys="treeExpandedKeys"
            :selectionKeys="treeSelected"
            :value="treeData"
            loadingMode="icon"
            selectionMode="single"
            class="w-full"
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
                <Tag value="TSA" severity="secondary" rounded />
                <div :class="{ textUnActive: !slotProps.node.active }">
                  {{ slotProps.node.label }}
                </div>
              </div>
            </template>

            <template #VsaCase="slotProps">
              <div
                class="w-full flex align-items-center justify-content-start"
                :class="{ textUnActive: !slotProps.node.active }"
                aria-haspopup="true"
                @contextmenu="onVsaCaseRightClick($event, slotProps.node)"
              >
                <Tag
                  class="mr-2 w-2rem"
                  :value="getVsaCaseTypeValue(slotProps.node.caseType)"
                  :severity="getVsaCaseTypeSeverity(slotProps.node.caseType)"
                />
                <div>{{ slotProps.node.label }}</div>
              </div>
              <ContextMenu ref="vsaCaseContextMenuRef" :model="vsaCaseContextMenu" />
            </template>

            <template #VsaCurveType="slotProps">
              <div class="subTree">
                <div
                  :id="slotProps.node.key"
                  :draggable="vsaCurveDraggable"
                  class="w-full flex align-items-center justify-content-start"
                  :class="{ 'cursor-grap': vsaCurveDraggable }"
                  @dragstart="onStartDragGroupNode($event, slotProps.node)"
                  @click="slotProps.node.showSubChildren = !slotProps.node.showSubChildren"
                >
                  <Button
                    :icon="slotProps.node.showSubChildren ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                    style="margin-left: -2rem"
                    text
                    severity="secondary"
                  />
                  <Tag
                    class="mr-3 px-3"
                    :value="getVsaCurveTypeValue(slotProps.node.curveType)"
                    :severity="getVsaCurveTypeSeverity(slotProps.node.curveType)"
                  />
                </div>
                <ScrollPanel
                  v-if="slotProps.node.showSubChildren && slotProps.node.subChildren"
                  class="mt-1"
                  :style="{ height: showLog ? '10rem' : '20rem' }"
                  style="width: 100%; margin-left: -0.5rem"
                >
                  <Tree :value="slotProps.node.subChildren" class="subTree">
                    <template #VsaCurve="slotProps">
                      <div
                        :id="slotProps.node.key"
                        :draggable="vsaCurveDraggable"
                        class="w-full flex align-items-center justify-content-start"
                        :class="{ 'cursor-grap': vsaCurveDraggable }"
                        @dragstart="onStartDragNode($event, slotProps.node)"
                      >
                        <div>{{ slotProps.node.label }}</div>
                      </div>
                    </template>
                  </Tree>
                </ScrollPanel>
              </div>
            </template>
            <!--  -->
            <template #TsaCase="slotProps">
              <div
                class="w-full flex align-items-center justify-content-start"
                :class="{ textUnActive: !slotProps.node.active }"
                :style="{ color: slotProps.node.highlight ? 'var( --blue-500)' : '' }"
                aria-haspopup="true"
                @contextmenu="onTsaCaseRightClick($event, slotProps.node)"
              >
                <div>{{ slotProps.node.label }}</div>
              </div>
              <ContextMenu ref="tsaCaseContextMenuRef" :model="tsaCaseContextMenu" />
            </template>

            <template #TsaSubCase="slotProps">
              <div
                class="w-full flex align-items-center justify-content-start"
                :style="{ color: slotProps.node.highlight ? 'var( --blue-500)' : '' }"
              >
                <div>{{ slotProps.node.label }}</div>
              </div>
            </template>

            <template #TsaCurveType="slotProps">
              <div class="subTree">
                <div
                  :id="slotProps.node.key"
                  :draggable="tsaCurveDraggable"
                  class="w-full flex align-items-center justify-content-start"
                  :class="{ 'cursor-grap': tsaCurveDraggable }"
                  @dragstart="onStartDragGroupNode($event, slotProps.node)"
                  @click="slotProps.node.showSubChildren = !slotProps.node.showSubChildren"
                >
                  <Button
                    :icon="slotProps.node.showSubChildren ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                    style="margin-left: -2rem"
                    text
                    severity="secondary"
                  />
                  <Tag
                    class="mr-3 px-3"
                    :value="getTsaCurveTypeValue(slotProps.node.curveType)"
                    :severity="getTsaCurveTypeSeverity(slotProps.node.curveType)"
                  />
                </div>
                <ScrollPanel
                  v-if="slotProps.node.showSubChildren && slotProps.node.subChildren"
                  class="mt-1"
                  :style="{ height: showLog ? '10rem' : '20rem' }"
                  style="width: 100%; margin-left: -0.5rem"
                >
                  <Tree :value="slotProps.node.subChildren" class="subTree">
                    <template #TsaCurve="slotProps">
                      <div
                        :id="slotProps.node.key"
                        :draggable="tsaCurveDraggable"
                        class="w-full flex align-items-center justify-content-start"
                        :class="{ 'cursor-grap': tsaCurveDraggable }"
                        @dragstart="onStartDragNode($event, slotProps.node)"
                      >
                        <div>{{ slotProps.node.label }}</div>
                      </div>
                    </template>
                  </Tree>
                </ScrollPanel>
              </div>
            </template>

            <template #SSR="slotProps">
              <div
                :id="slotProps.node.key"
                class="w-full flex align-items-center justify-content-start gap-3"
                :draggable="ssrCurveDraggable"
                @dragstart="onStartDragGroupNode($event, slotProps.node)"
              >
                <Tag value="SSR" severity="secondary" rounded />
                <div :class="{ textUnActive: !slotProps.node.active }">
                  {{ slotProps.node.label }}
                </div>
              </div>
            </template>
            <template #SsrCase="slotProps">
              <div
                :id="slotProps.node.key"
                :draggable="ssrCurveDraggable"
                class="w-full flex align-items-center justify-content-start"
                :class="{ 'cursor-grap': ssrCurveDraggable }"
                @dragstart="onStartDragNode($event, slotProps.node)"
              >
                <Tag
                  class="mr-1 w-4rem"
                  :value="getSsrTypeLabel(slotProps.node.caseType)"
                  :severity="getSeveritySsrType(slotProps.node.caseType)"
                />
                <div>{{ slotProps.node.label }}</div>
              </div>
            </template>
          </Tree>
          <div v-else>No data</div>
        </template>
      </ScrollPanel>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCommonStore } from '@/store';

import Tree from 'primevue/tree';
import ScrollPanel from 'primevue/scrollpanel';
import ContextMenu from 'primevue/contextmenu';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

import { VsaApi, TsaApi, SsrApi, CommonApi } from './api';
import { DSA_api } from '../DSASettingView/api';

const commonStore = useCommonStore();
const { measInfoActive } = storeToRefs(commonStore);
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
  ssrCurveDraggable: {
    type: Boolean,
    default: false,
  },
  showLog: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['onStartDragNode', 'onRemoveWidget']);
const onStartDragNode = (evt, node) => {
  emit('onStartDragNode', evt, node);
};
const onStartDragGroupNode = async (evt, node) => {
  await onNodeExpand(node);
  emit('onStartDragNode', evt, node);
};

onMounted(async () => {
  await getDsaService();
  await getTreeData();
});

watch(measInfoActive, async (newId, oldId) => {
  if (newId._id && newId !== oldId) {
    await reloadTree();
  }
});

const userConfigProfileId = ref('');
const reloadTree = async () => {
  await getDsaService();
  await getTreeData();
};
const getDsaService = async () => {
  try {
    const res = await DSA_api.getDsaService();
    userConfigProfileId.value = res.data.dataVersion.userConfigProfile._id;
  } catch (error) {
    console.log('getDsaService error', error);
  }
};
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
      const ssrBranch = await getSsrBranchData(node);
      const branch = vsaBranch.concat(tsaBranch, ssrBranch);
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

    if (node.type === 'SSR') {
      node['children'] = await getSsrCaseBranchData(node);
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
    const newNode = {
      key: 'app_' + appIndex,
      label: app.name,
      _id: app._id,
      active: app.active,
      type: 'Application',
      icon: 'pi pi-folder-open',
      leaf: false,
      loading: false,
    };
    branch.push(newNode);
    if (treeExpandedKeys.value['app_' + appIndex]) {
      await onNodeExpand(newNode);
    }
  }
  return branch;
};

const getAppList = async () => {
  try {
    const res = await CommonApi.getAppList(userConfigProfileId.value);
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
      const newNode = {
        key: appNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        appId: appNode._id,
        type: 'DSA',
        icon: 'pi pi-th-large',
        leaf: false,
        active: leafData.active,
        loading: false,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[appNode.key + '_' + index]) {
        await onNodeExpand(newNode);
      }
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
      const newNode = {
        key: dsaModuleNode.key + '_' + 'vsa_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'VSA',
        leaf: false,
        active: leafData.active,
        loading: false,
      };
      branch.push(newNode);

      if (treeExpandedKeys.value[dsaModuleNode.key + '_' + 'vsa_' + index]) {
        await onNodeExpand(newNode);
      }
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
      const newNode = {
        key: vsaNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'VsaCase',
        active: leafData.active,
        caseType: leafData.caseType,
        leaf: false,
        moduleInfoId: vsaNode._id,
        loading: false,
        vsaName: vsaNode.label,
      };
      branch.push(newNode);

      if (treeExpandedKeys.value[vsaNode.key + '_' + index]) {
        await onNodeExpand(newNode);
      }
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
  const curveList = await getVsaCurveList(caseNode.moduleInfoId, caseNode._id);
  if (curveList.length === 0) {
    caseNode.leaf = true;
  } else {
    let curveTypeList = curveList.map((item) => item.curveType);
    curveTypeList = [...new Set(curveTypeList)];
    curveTypeList.forEach((curveType) => {
      const curvesInType = curveList.filter((item) => item.curveType === curveType);
      const newNode = {
        key: caseNode.key + '_' + curveType,
        label: getVsaCurveTypeValue(curveType),
        data: JSON.stringify(curvesInType.map((leafData) => ({ _id: leafData._id, label: leafData.name }))),
        type: 'VsaCurveType',
        leaf: true,
        curveType: curveType,
        caseInfoId: caseNode._id,
        moduleInfoId: caseNode.moduleInfoId,
        caseName: caseNode.label,
        vsaName: caseNode.vsaName,
        loading: false,
        showSubChildren: false,
        subChildren: curvesInType.map((leafData, index) => ({
          key: caseNode.key + '_' + index,
          label: leafData.name,
          _id: leafData._id,
          type: 'VsaCurve',
          curveType: leafData.curveType,
          active: leafData.active,
          leaf: false,
          caseInfoId: caseNode._id,
          moduleInfoId: caseNode.moduleInfoId,
          loading: false,
          caseName: caseNode.label,
          vsaName: caseNode.vsaName,
        })),
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[caseNode.key + '_' + curveType]) {
        onNodeExpand(newNode);
      }
    });
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
      const newNode = {
        key: dsaModuleNode.key + '_' + 'tsa_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TSA',
        active: leafData.active,
        leaf: false,
        loading: false,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[dsaModuleNode.key + '_' + 'tsa_' + index]) {
        await onNodeExpand(newNode);
      }
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
      const newNode = {
        key: tsaNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TsaCase',
        active: leafData.active,
        icon: 'pi pi-list',
        leaf: false,
        highlight: leafData.attention,
        moduleInfoId: tsaNode._id,
        loading: false,
        tsaName: tsaNode.label,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[tsaNode.key + '_' + index]) {
        await onNodeExpand(newNode);
      }
    }
  }
  return branch;
};

const getTsaCaseList = async (case_id) => {
  try {
    const res = await TsaApi.getCaseList(case_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};
const getTsaSubCaseBranchData = async (caseNode) => {
  const branch = [];
  const dataList = await getTsaSubCaseList(caseNode.moduleInfoId, caseNode._id);
  if (dataList.length === 0) {
    caseNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      const newNode = {
        key: caseNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'TsaSubCase',
        active: leafData.active,
        icon: 'pi pi-file',
        leaf: false,
        caseInfoId: caseNode._id,
        caseName: caseNode.label,
        tsaName: caseNode.tsaName,

        highlight: leafData.attention,
        moduleInfoId: caseNode.moduleInfoId,
        loading: false,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[caseNode.key + '_' + index]) {
        await onNodeExpand(newNode);
      }
    }
  }
  return branch;
};

const getTsaSubCaseList = async (tsa_info_id, case_info_id) => {
  try {
    const res = await TsaApi.getSubCaseList(tsa_info_id, case_info_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getTsaCurveBranchData = async (subCaseNode) => {
  const branch = [];
  const curveList = await getTsaCurveList(subCaseNode._id);
  if (curveList.length === 0) {
    subCaseNode.leaf = true;
  } else {
    let curveTypeList = curveList.map((item) => item.curveType);
    curveTypeList = [...new Set(curveTypeList)];
    curveTypeList.forEach(async (curveType) => {
      const curvesInType = curveList.filter((item) => item.curveType === curveType);
      const newNode = {
        key: subCaseNode.key + '_' + curveType,
        label: getTsaCurveTypeValue(curveType),
        data: JSON.stringify(curvesInType.map((leafData) => ({ _id: leafData._id, label: leafData.name }))),
        type: 'TsaCurveType',
        leaf: true,
        showSubChildren: false,
        curveType: curveType,
        subCaseInfo: subCaseNode._id,
        caseInfoId: subCaseNode.caseInfoId,
        moduleInfoId: subCaseNode.moduleInfoId,

        tsaName: subCaseNode.tsaName,
        caseName: subCaseNode.caseName,
        subCaseName: subCaseNode.label,

        loading: false,
        subChildren: curvesInType.map((leafData, index) => ({
          key: subCaseNode.key + curveType + '_' + index,
          label: leafData.name,
          _id: leafData._id,
          type: 'TsaCurve',
          curveType: leafData.curveType,
          leaf: true,
          subCaseInfo: subCaseNode._id,
          caseInfoId: subCaseNode.caseInfoId,
          moduleInfoId: subCaseNode.moduleInfoId,

          tsaName: subCaseNode.tsaName,
          caseName: subCaseNode.caseName,
          subCaseName: subCaseNode.label,
          loading: false,
        })),
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[subCaseNode.key + '_' + curveType]) {
        onNodeExpand(newNode);
      }
    });
  }
  return branch;
};

const getTsaCurveList = async (subCase_id) => {
  try {
    const res = await TsaApi.getCurveList(subCase_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// --- Ssr

const getSsrBranchData = async (dsaModuleNode) => {
  const branch = [];
  const dataList = await getSsrList(dsaModuleNode._id);
  if (dataList.length === 0) {
    dsaModuleNode.leaf = true;
  } else {
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      const newNode = {
        key: dsaModuleNode.key + '_' + 'ssr_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'SSR',
        active: leafData.active,
        leaf: false,
        data: '[]',
        loading: false,
        ssrName: leafData.name,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[dsaModuleNode.key + '_' + 'ssr_' + index]) {
        await onNodeExpand(newNode);
      }
    }
  }
  return branch;
};

const getSsrList = async (dsaId) => {
  try {
    const res = await SsrApi.getSsrList(dsaId);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

const getSsrCaseBranchData = async (ssrNode) => {
  const branch = [];
  const dataList = await getSsrCaseList(ssrNode._id);
  if (dataList.length === 0) {
    ssrNode.leaf = true;
  } else {
    ssrNode.data = JSON.stringify(dataList.map((item) => ({ _id: item._id, label: item.name })));
    for (let index = 0; index < dataList.length; index++) {
      const leafData = dataList[index];
      const newNode = {
        key: ssrNode.key + '_' + index,
        label: leafData.name,
        _id: leafData._id,
        type: 'SsrCase',
        active: leafData.active,
        leaf: true,
        moduleInfoId: ssrNode._id,
        caseType: leafData.caseType,
        loading: false,
        ssrName: ssrNode.label,
      };
      branch.push(newNode);
      if (treeExpandedKeys.value[ssrNode.key + '_' + index]) {
        await onNodeExpand(newNode);
      }
    }
  }
  return branch;
};

const getSsrCaseList = async (case_id) => {
  try {
    const res = await SsrApi.getCaseList(case_id);
    return res.data;
  } catch (error) {
    console.log('getAppList: error ', error);
    return [];
  }
};

// -- right click to active/unactive
const vsaCaseContextMenuRef = ref();
const vsaCaseContextMenu = ref([]);
const onVsaCaseRightClick = async (event, node) => {
  if (node.active) {
    vsaCaseContextMenu.value = [
      {
        label: 'Unactive',
        icon: 'pi pi-times',
        command: async () => {
          await updateVsaCaseActiveStatus(node._id, false);
        },
      },
    ];
  } else {
    vsaCaseContextMenu.value = [
      {
        label: 'Active',
        icon: 'pi pi-check',
        command: async () => {
          await updateVsaCaseActiveStatus(node._id, true);
        },
      },
    ];
  }
  vsaCaseContextMenuRef.value.show(event);
};

const updateVsaCaseActiveStatus = async (vsaCaseId, newStatus) => {
  try {
    await VsaApi.updateVsaCase(vsaCaseId, { active: newStatus });
    toast.add({ severity: 'success', summary: 'Updated Active Status successfully', life: 3000 });
  } catch (error) {
    console.log('updateVsaCaseActiveStatus error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const tsaCaseContextMenuRef = ref();
const tsaCaseContextMenu = ref([]);
const onTsaCaseRightClick = async (event, node) => {
  if (node.active) {
    tsaCaseContextMenu.value = [
      {
        label: 'Unactive',
        icon: 'pi pi-times',
        command: async () => {
          await updateTsaCaseActiveStatus(node._id, false);
        },
      },
    ];
  } else {
    tsaCaseContextMenu.value = [
      {
        label: 'Active',
        icon: 'pi pi-check',
        command: async () => {
          await updateTsaCaseActiveStatus(node._id, true);
        },
      },
    ];
  }
  tsaCaseContextMenuRef.value.show(event);
};

const updateTsaCaseActiveStatus = async (tsaCaseId, newStatus) => {
  try {
    await TsaApi.updateTsaCase(tsaCaseId, { active: newStatus });
    toast.add({ severity: 'success', summary: 'Updated Active Status successfully', life: 3000 });
  } catch (error) {
    console.log('updateTsaCaseActiveStatus error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ----- for style

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
  if (curveType === undefined) {
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
  if (curveType === undefined) {
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
      return 'MechQ';
    case 10:
      return 'Efd';
    default:
      return 'Unknown';
  }
};
const getTsaCurveTypeSeverity = (curveType) => {
  if (curveType === undefined) {
    return '';
  }
  switch (curveType) {
    case 0:
      return isDarkTheme.value
        ? 'backgroundColor:var(--blue-500);color:var(--text-color)'
        : 'backgroundColor:var(--blue-300);color:var(--text-color)';
    case 1:
      return isDarkTheme.value
        ? 'backgroundColor:var(--blue-700);color:var(--text-color)'
        : 'backgroundColor:var(--blue-500);color:var(--text-color)';
    case 2:
      return isDarkTheme.value
        ? 'backgroundColor:var(--blue-900);color:white'
        : 'backgroundColor:var(--blue-600);color:var(--text-color)';
    case 3:
      return isDarkTheme.value
        ? 'backgroundColor:var(--teal-500);color:var(--text-color)'
        : 'backgroundColor:var(--teal-300);color:var(--text-color)';
    case 4:
      return isDarkTheme.value
        ? 'backgroundColor:var(--teal-700);color:var(--text-color)'
        : 'backgroundColor:var(--teal-500);color:var(--text-color)';
    case 5:
      return isDarkTheme.value
        ? 'backgroundColor:var(--teal-900));color:white'
        : 'backgroundColor:var(--teal-600);color:var(--text-color)';
    case 6:
      return isDarkTheme.value
        ? 'backgroundColor:var(--yellow-500);color:var(--text-color)'
        : 'backgroundColor:var(--yellow-300);color:var(--text-color)';
    case 7:
      return isDarkTheme.value
        ? 'backgroundColor:var(--yellow-700);color:var(--text-color)'
        : 'backgroundColor:var(--yellow-500);color:var(--text-color)';
    case 8:
      return isDarkTheme.value
        ? 'backgroundColor:var(--yellow-900);color:var(--text-color)'
        : 'backgroundColor:var(--yellow-600);color:var(--text-color)';
    case 9:
      return isDarkTheme.value
        ? 'backgroundColor:var(--primary-500);color:var(--text-color)'
        : 'backgroundColor:var(--primary-400);color:var(--text-color)';
    case 10:
      return isDarkTheme.value
        ? 'backgroundColor:var(--primary-700) ;color:var(--text-color)'
        : 'backgroundColor:var(--primary-500) ;color:var(--text-color)';
    default:
      return isDarkTheme.value
        ? 'backgroundColor:var(--graygray-600);color:var(--text-color)'
        : 'backgroundColor:var(--graygray-600);color:var(--text-color)';
  }
};

const getSsrTypeLabel = (typeValue) => {
  switch (Number(typeValue)) {
    case 0:
      return 'N-1';
    case 1:
      return 'N-2';
    case 2:
      return 'Base';
    default:
      return 'N-1';
  }
};

const getSeveritySsrType = (typeValue) => {
  switch (Number(typeValue)) {
    case 0:
      return 'primary';
    case 1:
      return 'info';
    case 2:
      return 'secondary';
    default:
      return 'primary';
  }
};
</script>

<style>
.subTree .p-tree-toggler {
  display: none;
}

.subTree .p-treenode-content {
  padding-bottom: 1rem;
}
.p-treenode-content.p-treenode-selectable {
  align-items: start;
}
</style>

<template>
  <div class="flex flex-column gap-3">
    <label for="definitionFilter">Definition</label>
    <Dropdown
      v-model="definitionSelected"
      :options="definitionFilter"
      optionLabel="name"
      optionValue="_id"
      placeholder="Select a Definition"
      class="w-full"
      :invalid="definitionSelectedInvalid"
      @change="definitionSelectedChange"
    />
  </div>
  <div class="flex flex-column gap-3 mt-3">
    <label for="psFilter">Power System</label>
    <AutoComplete
      v-model="psdSelected"
      optionLabel="name"
      optionValue="_id"
      class="w-full"
      dropdown
      :suggestions="psFilterSuggestions"
      :disabled="definitionSelected === 'can_not_filter'"
      @complete="searchPsQueryFilter"
    />
  </div>
  <div class="flex justify-content-center align-items-center w-full mt-3">
    <Button
      icon="pi pi-filter"
      class=""
      label="Get List"
      severity="primary"
      :disabled="!psdSelected || !definitionSelected"
      @click="getTree"
    />
  </div>

  <Divider />
  <div v-if="isLoadingTree" class="block relative w-full mt-3 h-12rem">
    <LoadingContainer v-show="isLoadingTree" />
  </div>
  <Tree
    v-else
    v-model:selectionKeys="nodeSelected"
    :value="treeData"
    loadingMode="icon"
    class="w-full md:w-[30rem]"
    style="height: 28rem; overflow: auto"
    selectionMode="single"
    @node-expand="onNodeExpand"
    @node-select="onNodeSelect"
  />
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted, version } from 'vue';

import Tree from 'primevue/tree';
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import api from './api';
import LoadingContainer from '@/components/LoadingContainer.vue';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, editVersionData } = storeToRefs(commonStore);

const toast = useToast();
const props = defineProps({
  versionId: { type: String, required: true },
  definitionFilter: { type: Array, default: () => [] },
});

const emit = defineEmits(['onNodeSelect']);
watch(
  () => props.definitionFilter,
  (newData) => {
    if (newData.filter((item) => item.name === 'Substation').length > 0) {
      definitionSelected.value = newData.filter((item) => item.name === 'Substation')[0]._id;
    }
  },
);

const definitionSelectedChange = () => {
  definitionSelectedInvalid.value = false;
  psFilterSuggestions.value = undefined;
  psdSelected.value = undefined;
};

// --- filter
const definitionSelected = ref();
const definitionSelectedInvalid = ref(false);
const psdSelected = ref();
const psFilterSuggestions = ref();
const searchPsQueryFilter = async (event) => {
  if (definitionSelected.value) {
    const query = event.query.trim();
    try {
      const res = await api.searchPs(props.versionId, definitionSelected.value, query);
      psFilterSuggestions.value = res.data;
      return res.data;
    } catch (error) {
      console.log('searchPsQueryFilter: error ', error);
    }
  } else {
    definitionSelectedInvalid.value = true;
  }
};

// ------ tree
const isLoadingTree = ref(false);
const treeData = ref([]);
const getTree = async () => {
  isLoadingTree.value = true;
  try {
    const childData = await api.getChildOnPs(props.versionId, {
      definition_id: definitionSelected.value,
      psd_id: psdSelected.value._id,
    });
    const data = [];
    for (let index = 0; index < childData.data.length; index++) {
      data.push({
        key: psdSelected.value._id + childData.data[index]._id,
        _id: childData.data[index]._id,
        label: childData.data[index].name,
        parentId: psdSelected.value._id,
        loading: false,
        leaf: !childData.data[index].childed,
        hasChilded: childData.data[index].childed,
        engineClassId: childData.data[index].engineClassId,
      });
    }
    treeData.value = data;
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    toast.add({ severity: 'error', summary: 'Child On Power System Edit', detail: error.data.detail, life: 3000 });
  }
  isLoadingTree.value = false;
};

const nodeSelected = ref();

const onNodeExpand = async (node) => {
  if (!node.children) {
    node.loading = true;
    node.children = await getLeaf(node);
    if (node.children || node.children.length == 0) {
      node.leaf = true;
    }
    node.loading = false;
  }
};

const getLeaf = async (node = {}) => {
  try {
    const childData = await api.getChildOnPs(props.versionId, {
      definition_id: definitionSelected.value,
      parent_id: node._id,
      ancestor_id: node.parentId,
    });
    const data = [];
    for (let index = 0; index < childData.data.length; index++) {
      data.push({
        key: node._id + childData.data[index]._id,
        _id: childData.data[index]._id,
        label: childData.data[index].name,
        parentId: node._id,
        loading: false,
        leaf: !childData.data[index].childed,
        hasChilded: childData.data[index].childed,
        engineClassId: childData.data[index].engineClassId,
      });
    }
    return data;
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    toast.add({ severity: 'error', summary: 'Child On Power System Edit', detail: error.data.detail, life: 3000 });
  }
};
const onNodeSelect = (node) => {
  console.log('node selected', node);
  emit('onNodeSelect', node);
};
</script>
<style>
.p-autocomplete-input {
  width: 100%;
}
</style>

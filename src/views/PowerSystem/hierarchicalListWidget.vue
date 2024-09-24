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
      completeOnFocus
      :suggestions="psFilterSuggestions"
      :disabled="definitionSelected === 'can_not_filter'"
      placeholder="Type Something to search ..."
      @complete="searchPsQueryFilter"
    />
  </div>
  <div class="flex justify-content-center align-items-center w-full mt-3">
    <Button icon="pi pi-filter" class="" label="Get List" severity="primary" @click="getTree" />
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
    style="height: 30rem; overflow: auto"
    selectionMode="single"
    @node-expand="onNodeExpand"
    @node-select="onNodeSelect"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import Tree from 'primevue/tree';
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';

import { useToast } from 'primevue/usetoast';

import api from './api';
import LoadingContainer from '@/components/LoadingContainer.vue';
const toast = useToast();

const props = defineProps({
  versionId: { type: String, required: true },
  definitionFilter: { type: Array, default: () => [] },
});

const emit = defineEmits(['onNodeSelect']);
onMounted(() => {
  if (props.definitionFilter.filter((item) => item.name === 'Substation').length > 0) {
    definitionSelected.value = props.definitionFilter.filter((item) => item.name === 'Substation')[0]._id;

    searchPsQueryFilter();
    getTree();
  }
});

onUnmounted(() => {
  clearInterval(treeDrawInterval.value);
  treeDrawInterval.value = undefined;
});
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
    const query = event ? event.query.trim() : '';
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
  clearInterval(treeDrawInterval.value);
  treeDrawInterval.value = undefined;
  treeData.value = [];
  const psdId = psdSelected.value ? psdSelected.value._id : undefined;
  try {
    const childData = await api.getChildOnPs(props.versionId, {
      definition_id: definitionSelected.value,
      psd_id: psdId,
    });
    treeRawData.value = childData.data;
    drawLeaf();
    treeDrawInterval.value = setInterval(() => {
      drawLeaf();
    }, 500);
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
  setTimeout(() => {
    isLoadingTree.value = false;
  }, 500);
};

const treeRawData = ref();
const treeDrawInterval = ref();

const drawLeaf = () => {
  if (treeRawData.value.length === 0) {
    clearInterval(treeDrawInterval.value);
    treeDrawInterval.value = undefined;
  }
  const treeLength = treeData.value.length;
  const data = [];
  const lengthGet = treeRawData.value.length > 20 ? 20 : treeRawData.value.length;
  for (let index = 0; index < lengthGet; index++) {
    data.push({
      key: treeLength + index + treeRawData.value[index]._id,
      _id: treeRawData.value[index]._id,
      label: treeRawData.value[index].name,
      parentId: '',
      parentName: '',
      loading: false,
      leaf: !treeRawData.value[index].childed,
      hasChilded: treeRawData.value[index].childed,
      engineClassId: treeRawData.value[index].engineClassId,
    });
  }
  treeData.value = treeData.value.concat(data);
  treeRawData.value = treeRawData.value.slice(100, treeRawData.value.length - 1);
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

// const tree;

const getLeaf = async (node = {}) => {
  try {
    const payload = {
      parent_id: node._id,
    };
    if (node.engineClassId === 'middleParent') {
      payload.ancestor_id = node.parentId;
    }

    const childData = await api.getChildOnPs(props.versionId, payload);

    const data = [];

    for (let index = 0; index < childData.data.length; index++) {
      data.push({
        key: node._id + childData.data[index]._id,
        _id: childData.data[index]._id,
        label: childData.data[index].name,
        parentId: node._id,
        parentName: node.label,
        loading: false,
        leaf: !childData.data[index].childed,
        hasChilded: childData.data[index].childed,
        engineClassId: childData.data[index].engineClassId,
      });
    }
    return data;
  } catch (error) {
    console.log('getFirstChildOnPSTree: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};
const onNodeSelect = (node) => {
  emit('onNodeSelect', node);
};
</script>
<style>
.p-autocomplete-input {
  width: 100%;
}
.psAutoComplete button {
  background-color: var(--gray-400);
  border-color: var(--gray-400);
}
</style>

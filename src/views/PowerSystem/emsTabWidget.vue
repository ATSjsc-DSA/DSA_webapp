<template>
  {{ definitionId }}
  emsFilter:{{ emsFilter }}--
  <br />
  filterSelected:{{ filterSelected }}--

  <DataTable
    :value="psData"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    showGridlines
    :loading="isLoading"
  >
    <template #header>
      <div class="flex justify-content-start gap-5">
        <div v-for="filter in emsFilter" :key="filter._id" class="flex align-items-center">
          <Checkbox v-model="filterSelected" inputId="filter._id" :name="filter._id" :value="filter._id" />
          <label for="ingredient2" class="ml-2"> {{ filter.name }} </label>
        </div>
      </div>
    </template>
    <template #empty> No Data </template>
  </DataTable>
</template>
<script setup>
import { ref, onMounted, watch, computed, onUnmounted, version } from 'vue';

import Checkbox from 'primevue/checkbox';

import { useToast } from 'primevue/usetoast';

import { DefinitionList } from './api';

const toast = useToast();

const props = defineProps({
  isShowingDefinitionList: { type: Boolean },
  nodeSelected: { type: Object },

  projectVersionId: { type: String, required: true },
  definitionId: { type: String, required: true },
});

onMounted(async () => {
  await getEmsDefinitionList();
});

// filter
const emsFilter = ref([]);
const filterSelected = ref([]);

const getEmsDefinitionList = async () => {
  try {
    const res = await DefinitionList.getEmsList({});
    emsFilter.value = res.data;
    filterSelected.value = emsFilter.value.map((item) => item._id);
  } catch (error) {
    console.log('getEmsDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

// -- PS data
const isLoading = ref(false);
const psData = ref([]);
</script>

<template>
  {{ definitionId }}
  emsFilter:{{ emsFilter }}--
  <br />
  filterSelected:{{ filterSelected }}--
  <br />
  psData:{{ psData }}
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
          <RadioButton v-model="filterSelected" :inputId="filter.key" name="dynamic" :value="filter.key" />
          <label :for="filter.key" class="ml-2">{{ filter.name }}</label>
        </div>
        <div class="flex gap-2">
          <Button severity="warning" text icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
          <Button severity="primary" icon="pi pi-filter" style="width: 32px" @click="getPsData" />
        </div>
      </div>
    </template>
    <template #empty> No Data </template>
  </DataTable>
</template>
<script setup>
import { ref, onMounted, watch, computed, onUnmounted, version } from 'vue';

import RadioButton from 'primevue/radiobutton';

import { useToast } from 'primevue/usetoast';

import { DefinitionList, PowerSystemEms } from './api';

const toast = useToast();

const props = defineProps({
  isShowingDefinitionList: { type: Boolean },
  nodeSelected: { type: Object },

  projectVersionId: { type: String, required: true },
  definitionId: { type: String, required: true },
});

onMounted(async () => {
  isLoading.value = true;
  await getPsData();
  isLoading.value = false;
});

// filter
const emsFilter = ref([
  { name: 'Station', key: 'station' },
  { name: 'Bus', key: 'bus' },
  { name: 'Branch', key: 'Branch' },
  { name: 'Generator', key: 'generator' },
  { name: 'Load', key: 'load' },
  { name: 'Breaker', key: 'breaker' },
  { name: 'Shunt', key: 'shunt' },
]);
const filterSelected = ref();

// -- PS data
const isLoading = ref(false);
const psData = ref([]);

const currentPage = ref(1);
const pageRowNumber = ref(10);

const clearFilterSelected = () => {
  filterSelected.value = undefined;
  getPsData();
};

const getPsData = async () => {
  if (props.isShowingDefinitionList) {
    const res = PowerSystemEms.getDataWithDefinition(props.definitionId, props.projectVersionId, currentPage.value);
  }
};
</script>

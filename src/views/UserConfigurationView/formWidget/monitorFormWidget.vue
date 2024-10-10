<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="monitorName" class="font-semibold"> Name </label>
    <InputText id="monitorName" v-model="data.name" class="flex-auto" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="monitorType" class="font-semibold"> Type </label>
    <Dropdown
      id="monitorType"
      v-model="data.monitorType"
      :options="typeOpts"
      optionLabel="name"
      optionValue="code"
      placeholder="Select a Type"
      class="w-full"
    />
  </div>

  <div class="flex flex-column gap-2 mb-3">
    <label for="priority" class="font-semibold"> Priority </label>

    <Dropdown
      id="monitorType"
      v-model="data.priority"
      :options="priorityOpts"
      optionLabel="name"
      optionValue="code"
      placeholder="Select a Priority"
      class="w-full"
    />
  </div>

  <div v-if="isCreateForm" class="flex flex-column gap-3 mb-3">
    <label for="psdSelected" class="font-semibold">Power System</label>
    <AutoComplete
      v-model="psdSelected"
      optionLabel="name"
      optionValue="_id"
      completeOnFocus
      class="w-full"
      :suggestions="psFilterSuggestions"
      placeholder="Type Something to search ..."
      name="psdSelected"
      @complete="searchPsQueryFilter"
    />
  </div>
  <div v-else class="flex flex-column gap-2 mb-3">
    <label for="ps" class="font-semibold"> Power System </label>
    <InputText id="ps" v-model="data.powersystemId" disabled class="flex-auto" autocomplete="off" />
  </div>

  <div v-if="isCreateForm" class="flex flex-column gap-3 mb-3">
    <label for="scadaMonitorPsSelected" class="font-semibold">Scada Monitor</label>
    <AutoComplete
      v-model="scadaMonitorPsSelected"
      optionLabel="name"
      optionValue="_id"
      completeOnFocus
      class="w-full"
      :suggestions="scadaMonitorPsFilterSuggestions"
      placeholder="Type Something to search ..."
      name="scadaMonitorPsSelected"
      @complete="searchScadaMonitorPsQueryFilter"
    />
  </div>

  <div v-else class="flex flex-column gap-2 mb-3">
    <label for="scadaMonitorPowerSytemId" class="font-semibold"> Scada Monitor </label>
    <InputText
      id="scadaMonitorPowerSytemId"
      v-model="data.scadaMonitorPowerSytemId"
      disabled
      class="flex-auto"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { PowerSystemParameterApi } from '@/views/PowerSystem/api';
import AutoComplete from 'primevue/autocomplete';
import Dropdown from 'primevue/dropdown';
import { watch } from 'vue';

const data = defineModel();
const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
  projectVersionId: { type: String, default: '' },
});

const typeOpts = ref([
  { name: 'Frequency', code: 1 },
  { name: 'Voltage', code: 2 },
  { name: 'Curent', code: 3 },
  { name: 'P', code: 4 },
  { name: 'Q', code: 5 },
  { name: 'Angle', code: 6 },
]);

const priorityOpts = ref([
  { name: '1', code: 0 },
  { name: '2', code: 1 },
  { name: '3', code: 2 },
  { name: '4', code: 3 },
]);

const psdSelected = ref();
const psFilterSuggestions = ref();
const searchPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, undefined, query);
    psFilterSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const scadaMonitorPsSelected = ref();
const scadaMonitorPsFilterSuggestions = ref();
const searchScadaMonitorPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, undefined, query);
    scadaMonitorPsFilterSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

watch(psdSelected, (newVal) => {
  if (props.isCreateForm) {
    data.value.powersystemId = newVal._id;
  }
});
watch(scadaMonitorPsSelected, (newVal) => {
  if (props.isCreateForm) {
    data.value.scadaMonitorPowerSytemId = newVal._id;
  }
});
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

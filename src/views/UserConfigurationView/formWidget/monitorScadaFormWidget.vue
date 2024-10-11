<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadaName" class="font-semibold"> Name </label>
    <InputText id="scadaName" v-model="data.name" :disabled="!isCreateForm" class="flex-auto" autocomplete="off" />
  </div>

  <div class="flex align-items-center gap-3 mb-3">
    <label for="scadaActive" class="font-semibold w-6rem"> Active</label>
    <InputSwitch id="scadaActive" v-model="data.active" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadakFactorCur" class="font-semibold"> K Factor Cur</label>
    <InputNumber id="scadakFactorCur" v-model="data.kFactorCur" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadakFactorPower" class="font-semibold"> K Factor Power</label>
    <InputNumber id="scadakFactorPower" v-model="data.kFactorPower" autocomplete="off" />
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
</template>

<script setup>
import { PowerSystemParameterApi } from '@/views/PowerSystem/api';
import AutoComplete from 'primevue/autocomplete';
import InputSwitch from 'primevue/inputswitch';

import { watch } from 'vue';

const data = defineModel();
const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
  projectVersionId: { type: String, default: '' },
});

const scadaMonitorPsSelected = ref();
const scadaMonitorPsFilterSuggestions = ref();
const searchScadaMonitorPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, undefined, query);
    scadaMonitorPsFilterSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchScadaMonitorPsQueryFilter: error ', error);
  }
};

watch(scadaMonitorPsSelected, (newVal) => {
  if (props.isCreateForm) {
    data.value.monitorScadaId = newVal._id;
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

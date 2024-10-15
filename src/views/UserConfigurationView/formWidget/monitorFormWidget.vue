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
    <div class="field grid">
      <AutoComplete
        v-model="psdSelectedCreate"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class=" col-12 md:col-8"
        :suggestions="psFilterSuggestions"
        placeholder="Type Something to search ..."
        name="psdSelected"
        @complete="searchPsQueryFilter"
      />
      <Dropdown  v-model="selectedDefinition" :options="listDefinition"  optionLabel="name" optionValue="_id" class="col-12 md:col-4" />
    </div>
  </div>
  <div v-else class="flex flex-column gap-2 mb-3">
    <label for="psdSelected" class="font-semibold">Power System</label>
    <div class="field grid">
      <AutoComplete
        v-model="psdSelected"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class=" col-12 md:col-8"
        :suggestions="psFilterSuggestions"
        placeholder="Type Something to search ..."
        name="psdSelected"
        @complete="searchPsQueryFilter"
      />
      <Dropdown  v-model="selectedDefinition" :options="listDefinition"  optionLabel="name" optionValue="_id" class="col-12 md:col-4" />
    </div>
  </div>

  <div  class="flex flex-column gap-3 mb-3">
    <label for="scadaMonitorPsSelected" class="font-semibold">Scada Monitor</label>
    <Dropdown v-model="data.scadaMonitorPowerSytemId" :options="listScadaMonitor" optionLabel="name"  optionValue="_id"  class="w-full" @focus="getScadaMonitor()" />
  </div>

  <!-- <div v-else class="flex flex-column gap-2 mb-3">
    <label for="scadaMonitorPowerSytemId" class="font-semibold"> Scada Monitor </label>
    <InputText
      id="scadaMonitorPowerSytemId"
      v-model="data.scadaMonitorPowerSytemId"
      disabled
      class="flex-auto"
      autocomplete="off"
    />
  </div> -->
</template>

<script setup>
import { PowerSystemParameterApi, DefinitionListApi } from '@/views/PowerSystem/api';
import AutoComplete from 'primevue/autocomplete';
import Dropdown from 'primevue/dropdown';
import { watch } from 'vue';

const data = defineModel();
const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
  projectVersionId: { type: String, default: '' },
  psdSelected: { type: Object, default: null },
  listScadaMonitor: { type: Array, default: null },

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
  { name: 'None', code: 0 },
  { name: 'SCADA', code: 1 },
  { name: 'PMU', code: 2 },
  { name: 'BOTH', code: 3 },
]);
onMounted( () => {
  getDefiniton();
});

const listDefinition = ref()
const selectedDefinition = ref()
const getDefiniton = async() => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    listDefinition.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};


// Define the emit event
const emit = defineEmits(['update:psdSelected']);

// Computed property for two-way binding
const psdSelected = computed({
  get: () => props.psdSelected,
  set: (value) => emit('update:psdSelected', value),
})
const psdSelectedCreate = ref()
const psFilterSuggestions = ref();
const searchPsQueryFilter = async (event) => {
  console.log(event, "event");
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, selectedDefinition.value, query);
    psFilterSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const listScadaMonitor = ref(props.listScadaMonitor)
watch(() => props.listScadaMonitor, (newVal) => {
  listScadaMonitor.value = newVal;
})
const getScadaMonitor = async() => {
  try {
    const res = await PowerSystemParameterApi.getPowersystemMonitor(psdSelectedCreate.value._id);
    listScadaMonitor.value = res.data.data;
  } catch (error) {
    console.log('getScadaMonitor: error ', error);
  }
};

watch(psdSelectedCreate, (newVal) => {
  if (props.isCreateForm) {
    data.value.powersystemId = newVal._id;
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

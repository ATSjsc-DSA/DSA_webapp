<template>
  <div class="grid">
    <div class="flex flex-column gap-2 mb-3 col-12 md:col-9">
      <label for="monitorName" class="font-semibold"> Name </label>
      <InputText id="monitorName" v-model="data.name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex flex-column align-items-center gap-3 mb-3 col-12 md:col-3">
      <label for="active"> Active</label>
      <InputSwitch id="active" v-model="data.active" autocomplete="off" />
    </div>
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="monitorType" class="font-semibold"> Monitor Type </label>
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

  <div class="grid m-0 p-0">
    <div class="col-12 md:col-4 flex flex-column gap-2 mb-3 pl-0">
      <label for="psdSelected" class="font-semibold">Type Element</label>
      <Dropdown
        v-model="selectedDefinition"
        :options="listDefinition"
        optionLabel="name"
        optionValue="_id"
        class="w-full"
      />
    </div>
    <div class="col-12 md:col-8 flex flex-column gap-2 mb-3 pr-0">
      <label for="psdSelected" class="font-semibold">Element</label>
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
  </div>
  <div class="flex flex-column gap-3 mb-3">
    <label for="scadaMonitorPsSelected" class="font-semibold">Scada Monitor</label>
    <Dropdown
      v-model="data.scadaMonitorPowerSytemId"
      :options="listScadaMonitor"
      optionLabel="name"
      optionValue="_id"
      class="w-full"
      :loading="isLoadingScadaMonitor"
      :emptyMessage="getScadaEmptyMessage()"
    />
  </div>
</template>

<script setup>
import { PowerSystemParameterApi, DefinitionListApi } from '@/views/PowerSystem/api';
import AutoComplete from 'primevue/autocomplete';
import Dropdown from 'primevue/dropdown';
import { watch } from 'vue';

const props = defineProps({
  data: { type: Object, default: null },
  isCreateForm: { type: Boolean, default: true },
  psdSelected: { type: Object, default: null },
  listScadaMonitor: { type: Array, default: null },
  definitionMonitor: { type: String, default: null },
});

const data = ref(props.data);
watch(
  () => props.data,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      nextTick(() => {
        data.value = newValue;
      });
    }
  },
);
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

const listDefinition = ref();
const selectedDefinition = ref(props.definitionMonitor);
watch(
  () => props.definitionMonitor,
  (newVal) => {
    selectedDefinition.value = newVal;
  },
);
const getDefiniton = async () => {
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
// const psdSelected = computed({
//   get: () => props.psdSelected,
//   set: (value) => emit('update:psdSelected', value),
// });
const psdSelected = ref(props.psdSelected);
watch(
  () => props.psdSelected,
  async (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      psdSelected.value = newValue;
    }
  },
);
// const psdSelectedCreate = ref();
const psFilterSuggestions = ref();
const searchPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(
      selectedDefinition.value ? [selectedDefinition.value] : [],
      query,
    );
    psFilterSuggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const listScadaMonitor = ref(props.listScadaMonitor);
watch(
  () => props.listScadaMonitor,
  (newVal) => {
    listScadaMonitor.value = newVal;
  },
);
const isLoadingScadaMonitor = ref(false);
const getScadaMonitor = async () => {
  isLoadingScadaMonitor.value = true;
  try {
    const res = await PowerSystemParameterApi.getPowersystemMonitor(psdSelected.value._id);
    listScadaMonitor.value = res.data.data;
    console.log(listScadaMonitor.value);
  } catch (error) {
    listScadaMonitor.value = [];
    console.log('getScadaMonitor: error ', error);
  }
  isLoadingScadaMonitor.value = false;
};

watch(listScadaMonitor, (newVal) => {
  if (newVal && props.isCreateForm) {
    data.value.listScadaMonitorId = newVal.map((item) => item._id);
  }
});
watch(psdSelected, async (newVal) => {
  if (newVal && props.isCreateForm) {
    data.value.powersystemId = newVal._id;
  }

  await getScadaMonitor();
});

const getScadaEmptyMessage = () => {
  if (!psdSelected || !selectedDefinition) {
    return 'Select a "Type Element" and "Element" to Continue';
  }
  if (!psdSelected) {
    return 'Select a "Element" to Continue';
  }
  if (!selectedDefinition) {
    return 'Select a "Type Element" to Continue';
  }
  return 'No available options';
};
onMounted(() => {
  getDefiniton();
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

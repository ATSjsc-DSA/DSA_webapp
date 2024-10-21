<template>
  <div class="w-full">
    <flatListFilterWidget
      :definitionList="definitionList"
      :projectVersionId="projectVersionId"
      :multipleSelection="true"
      :showTypeFilter="false"
      :init-data="initData"
      @handleFilter="changFilterData"
      @clearOtherFilterSelected="clearOtherFilterSelected"
    >
      <template #otherFilter>
        <div class="grid gap-2">
          <div class="col">
            <div class="flex flex-column align-items-start gap-1">
              <label for="type" class="text-sm"> Definition </label>
              <MultiSelect
                v-model="definitionSubsystemSelected"
                display="chip"
                :options="definitionSubsystemList"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Types"
                :max-selected-labels="1"
                class="w-full psFilterAutoComplete"
              />
            </div>
          </div>

          <div class="col">
            <div class="flex flex-column align-items-start gap-1">
              <label for="ps" class="text-sm"> Power System </label>
              <AutoComplete
                v-model="psSelected"
                inputId="ps"
                optionLabel="name"
                optionValue="_id"
                completeOnFocus
                class="w-full psFilterAutoComplete"
                :class="{ showMoreViaDot: psSelected.length > 1 }"
                :suggestions="psSuggestions"
                name="psFilter"
                multiple
                @complete="searchPsQueryFilter"
              />
            </div>
          </div>
        </div>
      </template>
    </flatListFilterWidget>
  </div>
  <div class="flex gap-4 justify-content-start align-items-center p-2">
    <div class="font-semibold text-lg">Area</div>
    <Dropdown
      v-model="areaZoneConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">Zone</div>
    <Dropdown
      v-model="zoneOwnerConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">Owner</div>
    <Dropdown
      v-model="ownerKvConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">kV</div>
    <Dropdown
      v-model="kVStationConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">Station</div>
    <Dropdown
      v-model="stationDefinitionConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">Definition</div>
    <Dropdown
      v-model="definitionPsConjunction"
      :options="conjunctionOpts"
      optionLabel="label"
      optionValue="value"
      class="w-7rem"
    />
    <div class="font-semibold text-lg">Power System</div>
  </div>
  <Divider />
</template>

<script setup>
import MultiSelect from 'primevue/multiselect';

import flatListFilterWidget from '@/views/PowerSystem/menuLeftWidget/flatListFilterWidget.vue';
import { DefinitionListApi, PowerSystemParameterApi } from '@/views/PowerSystem/api';
import { onMounted, watch } from 'vue';
import Divider from 'primevue/divider';

onMounted(async () => {
  await getDefinitionList();
  await getdefinitionSubsystemList();
});

const props = defineProps({
  currentFilter: { type: Object, default: () => {} },
  projectVersionId: { type: String, default: '' },
});
const emit = defineEmits(['changeFilter']);
watch(
  () => props.currentFilter,
  () => {
    definitionSubsystemSelected.value = props.currentFilter.definition.map((item) => item._id);
    psSelected.value = props.currentFilter.powerSystem;
    initData.value = props.currentFilter;
  },
);
const initData = ref();
const definitionList = ref();
const getDefinitionList = async () => {
  try {
    const res = await DefinitionListApi.getParameterDefinitionList();
    definitionList.value = res.data;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const changFilterData = (newFilter) => {
  newFilter.definitionList = definitionSubsystemSelected.value;
  newFilter.powersystem = psSelected.value ? psSelected.value.map((item) => item._id) : [];
  newFilter.filtering =
    `AREA ${areaZoneConjunction.value} ZONE ${zoneOwnerConjunction.value} OWNER ${ownerKvConjunction.value} kv ${kVStationConjunction.value} station ${stationDefinitionConjunction.value} definitionList ${definitionPsConjunction.value} powersystem`.toUpperCase();
  emit('changeFilter', newFilter);
};
const clearOtherFilterSelected = () => {
  definitionSubsystemSelected.value = [];
  psSelected.value = [];
};

const definitionSubsystemList = ref([]);
const definitionSubsystemSelected = ref([]);

watch(definitionSubsystemSelected, () => {
  psSelected.value = [];
});

const getdefinitionSubsystemList = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    definitionSubsystemList.value = res.data;
  } catch (error) {
    console.log('getdefinitionSubsystemList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};
const psSelected = ref([]);
const psSuggestions = ref([]);
const searchPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(
      props.projectVersionId,
      definitionSubsystemSelected.value,
      query,
    );
    psSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
// ---- and/or conjunction
const conjunctionOpts = ref([
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
]);
const areaZoneConjunction = ref('AND');
const zoneOwnerConjunction = ref('AND');
const ownerKvConjunction = ref('AND');
const kVStationConjunction = ref('AND');
const stationDefinitionConjunction = ref('AND');
const definitionPsConjunction = ref('AND');
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
.psFilterAutoComplete button {
  background-color: var(--gray-400);
  border-color: var(--gray-400);
}

.p-autocomplete-multiple-container {
  display: flex;
  flex-wrap: nowrap;
}

.p-autocomplete-input-token {
  flex-grow: 1;
}
.psFilterAutoComplete .p-autocomplete-token:nth-child(n + 2) {
  display: none;
}

.psFilterAutoComplete.showMoreViaDot .p-autocomplete-token:first-child::after {
  content: '...';
  position: relative;
  left: 2rem;
}
</style>

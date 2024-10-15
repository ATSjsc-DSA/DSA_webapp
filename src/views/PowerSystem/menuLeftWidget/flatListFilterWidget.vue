<template>
  <div class="flex gap-2 justify-content-start flex-wrap xl:flex-nowrap">
    <FloatLabel>
      <AutoComplete
        v-model="areaFilter"
        inputId="area"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionFilter"
        :suggestions="areaSuggestions"
        name="areaFilter"
        @complete="searchAreaQuery"
      />
      <label for="area" class="text-sm"> Area </label>
    </FloatLabel>

    <FloatLabel>
      <AutoComplete
        v-model="zoneFilter"
        inputId="Zone"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionFilter"
        :suggestions="zoneSuggestions"
        name="zoneFilter"
        @complete="searchZoneQuery"
      />
      <label for="Zone" class="text-sm"> Zone </label>
    </FloatLabel>

    <FloatLabel>
      <AutoComplete
        v-model="ownerFilter"
        inputId="Owner"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionFilter"
        :suggestions="ownerSuggestions"
        name="ownerFilter"
        @complete="searchOwnerQuery"
      />
      <label for="Owner" class="text-sm"> Owner </label>
    </FloatLabel>

    <FloatLabel>
      <AutoComplete
        v-model="typeFilter"
        inputId="Type"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionFilter"
        :suggestions="typeSuggestions"
        name="typeFilter"
        @complete="searchTypeQuery"
      />
      <label for="Type" class="text-sm"> Type </label>
    </FloatLabel>
    <FloatLabel>
      <AutoComplete
        v-model="kvFilter"
        inputId="kV"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionFilter"
        :suggestions="kvSuggestions"
        name="kvFilter"
        @complete="searchkvQuery"
      />
      <label for="kV" class="text-sm"> kV </label>
    </FloatLabel>

    <Divider layout="vertical" />

    <FloatLabel>
      <AutoComplete
        v-model="stationFilter"
        inputId="Station"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :disabled="!canUseDefinitionStationFilter"
        :suggestions="stationSuggestions"
        name="stationFilter"
        @complete="searchStationQuery"
      />
      <label for="Station" class="text-sm"> Station </label>
    </FloatLabel>

    <div class="flex gap-2">
      <Button severity="warning" icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
      <Button severity="primary" icon="pi pi-filter" style="width: 32px" @click="handleFilterClick" />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import AutoComplete from 'primevue/autocomplete';

import FloatLabel from 'primevue/floatlabel';

import { PowerSystemParameterApi } from '@/views/PowerSystem/api';

const props = defineProps({
  canUseDefinitionFilter: { type: Boolean },
  canUseDefinitionStationFilter: { type: Boolean },

  definitionList: { type: Array, default: () => [] },
  projectVersionId: { type: String },
});

const emits = defineEmits(['handleFilter']);

watch(
  () => props.definitionList,
  () => {
    if (props.definitionList && props.definitionList.length > 0) {
      clearFilterSelected();
    }
  },
);
const areaFilter = ref();
const areaSuggestions = ref([]);
const areaDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'Area')[0];
  return definitionData ? definitionData._id : '';
});
const searchAreaQuery = async (event) => {
  areaSuggestions.value = await searchPs(event, areaDefinitionId.value);
};

// --zone
const zoneFilter = ref();
const zoneSuggestions = ref([]);
const zoneDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'Zone')[0];
  return definitionData ? definitionData._id : '';
});
const searchZoneQuery = async (event) => {
  zoneSuggestions.value = await searchPs(event, zoneDefinitionId.value);
};

// --owner
const ownerFilter = ref();
const ownerSuggestions = ref([]);
const ownerDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'Owner')[0];
  return definitionData ? definitionData._id : '';
});
const searchOwnerQuery = async (event) => {
  ownerSuggestions.value = await searchPs(event, ownerDefinitionId.value);
};

// --type
const typeFilter = ref();
const typeSuggestions = ref([]);
const typeDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'SubstationType')[0];
  return definitionData ? definitionData._id : '';
});
const searchTypeQuery = async (event) => {
  typeSuggestions.value = await searchPs(event, typeDefinitionId.value);
};

// --kv
const kvFilter = ref();
const kvSuggestions = ref([]);
const kvDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'Substation_kVBase')[0];
  return definitionData ? definitionData._id : '';
});
const searchkvQuery = async (event) => {
  kvSuggestions.value = await searchPs(event, kvDefinitionId.value);
};

// --station
const stationFilter = ref();
const stationSuggestions = ref([]);
const stationDefinitionId = computed(() => {
  const definitionData = props.definitionList.filter((item) => item.name === 'Station')[0];
  return definitionData ? definitionData._id : '';
});
const searchStationQuery = async (event) => {
  stationSuggestions.value = await searchPs(event, stationDefinitionId.value);
};

const searchPs = async (event, definitionId) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, definitionId, query);
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const clearFilterSelected = () => {
  areaFilter.value = undefined;
  zoneFilter.value = undefined;
  ownerFilter.value = undefined;
  typeFilter.value = undefined;
  kvFilter.value = undefined;
  stationFilter.value = undefined;
};
const handleFilterClick = () => {
  const filterValue = {
    area: areaFilter.value ? areaFilter.value._id : null,
    zone: zoneFilter.value ? zoneFilter.value._id : null,
    owner: ownerFilter.value ? ownerFilter.value._id : null,
    type: typeFilter.value ? typeFilter.value._id : null,
    kv: kvFilter.value ? kvFilter.value._id : null,
    sub: stationFilter.value ? stationFilter.value._id : null,
  };

  emits('handleFilter', filterValue);
};
</script>

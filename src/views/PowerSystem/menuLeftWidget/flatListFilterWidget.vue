<template>
  <div class="grid justify-content-start align-items-center">
    <div :class="$slots.otherFilter ? 'col-3' : 'col'" class="">
      <div class="flex flex-column align-items-start gap-1">
        <label for="Area" class="text-sm"> Area </label>
        <AutoComplete
          v-model="areaFilter"
          inputId="area"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && areaFilter && areaFilter.length > 1 }"
          :disabled="!canUseDefinitionFilter"
          :suggestions="areaSuggestions"
          name="areaFilter"
          :multiple="multipleSelection"
          @complete="searchAreaQuery"
        />
      </div>
    </div>
    <div :class="$slots.otherFilter ? 'col-3' : 'col'">
      <div class="flex flex-column align-items-start gap-1">
        <label for="Zone" class="text-sm"> Zone </label>
        <AutoComplete
          v-model="zoneFilter"
          inputId="Zone"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && zoneFilter && zoneFilter.length > 1 }"
          :disabled="!canUseDefinitionFilter"
          :suggestions="zoneSuggestions"
          name="zoneFilter"
          :multiple="multipleSelection"
          @complete="searchZoneQuery"
        />
      </div>
    </div>
    <div :class="$slots.otherFilter ? 'col-3' : 'col'">
      <div class="flex flex-column align-items-start gap-1">
        <label for="Owner" class="text-sm"> Owner </label>
        <AutoComplete
          v-model="ownerFilter"
          inputId="Owner"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && ownerFilter && ownerFilter.length > 1 }"
          :disabled="!canUseDefinitionFilter"
          :suggestions="ownerSuggestions"
          name="ownerFilter"
          :multiple="multipleSelection"
          @complete="searchOwnerQuery"
        />
      </div>
    </div>
    <div v-if="showTypeFilter" :class="$slots.otherFilter ? 'col-3' : 'col'">
      <div class="flex flex-column align-items-start gap-1">
        <label for="Type" class="text-sm"> Type </label>
        <AutoComplete
          v-model="typeFilter"
          inputId="Type"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && typeFilter && typeFilter.length > 1 }"
          :disabled="!canUseDefinitionFilter"
          :suggestions="typeSuggestions"
          name="typeFilter"
          :multiple="multipleSelection"
          @complete="searchTypeQuery"
        />
      </div>
    </div>
    <div :class="$slots.otherFilter ? 'col-3' : 'col'">
      <div class="flex flex-column align-items-start gap-1">
        <label for="kV" class="text-sm"> kV </label>
        <AutoComplete
          v-model="kvFilter"
          inputId="kV"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && kvFilter && kvFilter.length > 1 }"
          :disabled="!canUseDefinitionFilter"
          :suggestions="kvSuggestions"
          name="kvFilter"
          :multiple="multipleSelection"
          @complete="searchkvQuery"
        />
      </div>
    </div>

    <div :class="$slots.otherFilter ? 'col-3' : 'col'" class="flex align-items-end">
      <Divider v-if="!$slots.otherFilter" layout="vertical" />
      <div class="flex-grow-1 flex flex-column align-items-start gap-1">
        <label for="Station" class="text-sm"> Station </label>
        <AutoComplete
          v-model="stationFilter"
          inputId="Station"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :class="{ showMoreViaDot: multipleSelection && stationFilter && stationFilter.length > 1 }"
          :disabled="!canUseDefinitionStationFilter"
          :suggestions="stationSuggestions"
          name="stationFilter"
          :multiple="multipleSelection"
          @complete="searchStationQuery"
        />
      </div>
    </div>
    <div v-if="$slots.otherFilter" class="col">
      <slot name="otherFilter" />
    </div>
    <div :class="$slots.otherFilter ? 'col-3' : 'col'">
      <div class="flex gap-2 align-items-center justify-content-end">
        <Button severity="warning" icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
        <Button severity="primary" icon="pi pi-filter" style="width: 32px" @click="handleFilterClick" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import { PowerSystemParameterApi } from '@/views/PowerSystem/api';

const props = defineProps({
  canUseDefinitionFilter: { type: Boolean, default: true },
  canUseDefinitionStationFilter: { type: Boolean, default: true },
  multipleSelection: { type: Boolean, default: false },
  showTypeFilter: { type: Boolean, default: true },
  definitionList: { type: Array, default: () => [] },
  projectVersionId: { type: String },
  initData: { type: Object, default: () => {} },
});

const emits = defineEmits(['handleFilter', 'clearOtherFilterSelected']);

watch(
  () => props.definitionList,
  () => {
    if (props.definitionList && props.definitionList.length > 0) {
      clearFilterSelected();
    }
  },
);

watch(
  () => props.initData,
  () => {
    areaFilter.value = props.initData.area;
    zoneFilter.value = props.initData.zone;
    ownerFilter.value = props.initData.owner;
    typeFilter.value = props.initData.type;
    kvFilter.value = props.initData.kV;
    stationFilter.value = props.initData.station;
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
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, [definitionId], query);
    return res.data;
  } catch (error) {
    console.error('searchPsQueryFilter: error ', error);
  }
};

const clearFilterSelected = () => {
  areaFilter.value = undefined;
  zoneFilter.value = undefined;
  ownerFilter.value = undefined;
  typeFilter.value = undefined;
  kvFilter.value = undefined;
  stationFilter.value = undefined;
  emits('clearOtherFilterSelected');
};
const handleFilterClick = () => {
  if (props.multipleSelection) {
    emits('handleFilter', {
      area: areaFilter.value ? areaFilter.value.map((item) => item._id) : [],
      zone: zoneFilter.value ? zoneFilter.value.map((item) => item._id) : [],
      owner: ownerFilter.value ? ownerFilter.value.map((item) => item._id) : [],
      type: typeFilter.value ? typeFilter.value.map((item) => item._id) : [],
      kv: kvFilter.value ? kvFilter.value.map((item) => item._id) : [],
      station: stationFilter.value ? stationFilter.value.map((item) => item._id) : [],
    });
  } else {
    emits('handleFilter', {
      area: areaFilter.value ? areaFilter.value._id : null,
      zone: zoneFilter.value ? zoneFilter.value._id : null,
      owner: ownerFilter.value ? ownerFilter.value._id : null,
      type: typeFilter.value ? typeFilter.value._id : null,
      kv: kvFilter.value ? kvFilter.value._id : null,
      station: stationFilter.value ? stationFilter.value._id : null,
    });
  }
};
</script>

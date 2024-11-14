<template>
  <div class="w-full mb-3 pl-3 mt-1 flex justify-content-between align-items-center">
    <span class="text-xl font-semibold"> Filter</span>
    <div class="flex gap-2 align-items-center justify-content-end">
      <Button severity="secondary" icon="pi pi-save" style="width: 32px" @click="saveFilter" />

      <Divider layout="vertical" />
      <Button severity="warning" icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
      <Button severity="primary" icon="pi pi-filter" style="width: 32px" @click="changFilter" />
    </div>
  </div>
  <ScrollPanel style="width: 100%; height: 46rem">
    <div class="flex flex-column gap-3 pl-1">
      <searchPsWidget
        v-model="areaSelected"
        label="Area"
        :definitionId="[areaDefinitionId]"
        :multipleSelection="true"
      />

      <searchPsWidget
        v-model="zoneSelected"
        label="Zone"
        :definitionId="[zoneDefinitionId]"
        :multipleSelection="true"
      />

      <searchPsWidget
        v-model="ownerSelected"
        label="Owner"
        :definitionId="[ownerDefinitionId]"
        :multipleSelection="true"
      />

      <searchPsWidget v-model="kVSelected" label="kV" :definitionId="[kVDefinitionId]" :multipleSelection="true" />

      <searchPsWidget
        v-model="stationSelected"
        label="Station"
        :definitionId="[stationDefinitionId]"
        :multipleSelection="true"
      />

      <div class="flex flex-column align-items-start gap-1">
        <label for="type" class="font-semibold"> Definition </label>
        <MultiSelect
          v-model="definitionSubsystemSelected"
          display="chip"
          :options="definitionSubsystemList"
          optionLabel="name"
          optionValue="_id"
          placeholder="Select Types"
          class="w-full psFilterAutoComplete"
        />
      </div>

      <div class="flex flex-column align-items-start gap-1">
        <label for="ps" class="font-semibold"> Power System </label>
        <div class="input-group">
          <Dropdown
            v-model="psDefinitionType"
            :options="definitionSubsystemList"
            optionLabel="name"
            optionValue="_id"
            class="w-20rem"
          />

          <searchPsWidget
            v-model="psSelected"
            label=""
            :definitionId="psDefinitionType ? [psDefinitionType] : []"
            :multipleSelection="true"
            :showViaDotAtTenChild="true"
          />
        </div>
      </div>
      <Divider />

      <div class="flex flex-column gap-2 mb-3">
        <label for="appName" class="font-semibold"> Conjunction </label>
        <Textarea id="filterConjunction" v-model="filterConjunction" class="flex-auto" autocomplete="off" />
        <small>Example: "Area and Zone or (kV and Station)"</small>
      </div>
    </div>
  </ScrollPanel>
</template>

<script setup>
import MultiSelect from 'primevue/multiselect';
import ScrollPanel from 'primevue/scrollpanel';

import { DefinitionListApi } from '@/views/PowerSystem/api';
import { nextTick, onMounted, watch } from 'vue';
import searchPsWidget from '../PowerSystem/searchPsWidget.vue';
onMounted(async () => {
  await getDefinitionList();
  await getdefinitionSubsystemList();
});

const props = defineProps({
  currentFilter: { type: Object, default: () => {} },
});
const emit = defineEmits(['changeFilter', 'saveFilter']);

const areaSelected = ref([]);
const areaDefinitionId = ref([]);

const zoneSelected = ref([]);
const zoneDefinitionId = ref([]);

const ownerSelected = ref([]);
const ownerDefinitionId = ref([]);

const kVSelected = ref([]);
const kVDefinitionId = ref([]);

const stationSelected = ref([]);
const stationDefinitionId = ref([]);

const psDefinitionType = ref();
const psSelected = ref([]);

const filterConjunction = ref('');
const changFilter = () => {
  const newFilter = {
    definition: definitionSubsystemSelected.value,
    area: areaSelected.value.map((item) => item._id),
    zone: zoneSelected.value.map((item) => item._id),
    owner: ownerSelected.value.map((item) => item._id),
    kv: kVSelected.value.map((item) => item._id),
    station: stationSelected.value.map((item) => item._id),
    powersystem: psSelected.value.map((item) => item._id),
    filtering: filterConjunction.value,
  };
  emit('changeFilter', newFilter);
};

const saveFilter = () => {
  const newFilter = {
    definition: definitionSubsystemSelected.value,
    area: areaSelected.value.map((item) => item._id),
    zone: zoneSelected.value.map((item) => item._id),
    owner: ownerSelected.value.map((item) => item._id),
    kv: kVSelected.value.map((item) => item._id),
    station: stationSelected.value.map((item) => item._id),
    powersystem: psSelected.value.map((item) => item._id),
    filtering: filterConjunction.value,
  };
  emit('saveFilter', newFilter);
};
const clearFilterSelected = () => {
  areaSelected.value = [];
  zoneSelected.value = [];
  ownerSelected.value = [];
  kVSelected.value = [];
  stationSelected.value = [];
  psSelected.value = [];
  definitionSubsystemSelected.value = [];
  filterConjunction.value = '';
  psDefinitionType.value = undefined;
};

// definiton List
const definitionList = ref();
const getDefinitionList = async () => {
  try {
    const res = await DefinitionListApi.getParameterDefinitionList();
    definitionList.value = res.data;
    setDefinitionfilterId();
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const setDefinitionfilterId = () => {
  areaDefinitionId.value = definitionList.value.filter((item) => item.name === 'Area')[0]._id;
  zoneDefinitionId.value = definitionList.value.filter((item) => item.name === 'Zone')[0]._id;
  ownerDefinitionId.value = definitionList.value.filter((item) => item.name === 'Owner')[0]._id;
  kVDefinitionId.value = definitionList.value.filter((item) => item.name === 'Substation_kVBase')[0]._id;
  stationDefinitionId.value = definitionList.value.filter((item) => item.name === 'Station')[0]._id;
};

const definitionSubsystemList = ref([]);
const definitionSubsystemSelected = ref([]);

const getdefinitionSubsystemList = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    definitionSubsystemList.value = res.data;
  } catch (error) {
    console.log('getdefinitionSubsystemList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

watch(
  () => props.currentFilter,
  async () => {
    await nextTick(() => {
      areaSelected.value = props.currentFilter.area;
      zoneSelected.value = props.currentFilter.zone;
      ownerSelected.value = props.currentFilter.owner;
      kVSelected.value = props.currentFilter.kV;
      stationSelected.value = props.currentFilter.station;
      definitionSubsystemSelected.value = props.currentFilter.definition;
      psSelected.value = props.currentFilter.powerSystem;

      filterConjunction.value = props.currentFilter.filter || '';
    });
  },
  { deep: true },
);

watch(psDefinitionType, () => {
  psSelected.value = [];
});
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>
<style scoped>
.input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  width: 100%;
}
</style>

<template>
  <div class="w-full mb-5 mt-1 flex justify-content-between align-items-center">
    <span class="text-xl font-semibold"> Filter</span>
    <div class="flex gap-2 align-items-center justify-content-end">
      <Button severity="secondary" label="Save Filter" icon="pi pi-save" @click="saveFilter" />

      <Divider layout="vertical" />
      <Button severity="warning" text icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
      <Button severity="primary" text icon="pi pi-filter" style="width: 32px" @click="changFilter" />
    </div>
  </div>
  <ScrollPanel style="width: 100%; height: 46rem">
    <div class="flex flex-column gap-3 pl-1">
      <div class="grid">
        <div class="col-8">
          <searchPsWidget
            v-model="areaSelected"
            label="Area"
            :definitionId="[areaDefinitionId]"
            :multipleSelection="true"
            :showViaDotAtTenChild="true"
          />
        </div>
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="areaDefinitionSelected"
              display="chip"
              :options="definitionSubsystemList"
              :disabled="areaSelected.length === 0"
              optionLabel="name"
              :placeholder="areaSelected.length === 0 ? 'Select Area' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-8">
          <searchPsWidget
            v-model="zoneSelected"
            label="Zone"
            :definitionId="[zoneDefinitionId]"
            :multipleSelection="true"
            :showViaDotAtTenChild="true"
          />
        </div>
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="zoneDefinitionSelected"
              display="chip"
              :options="definitionSubsystemList"
              :disabled="zoneSelected.length === 0"
              optionLabel="name"
              :placeholder="zoneSelected.length === 0 ? 'Select Zone' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-8">
          <searchPsWidget
            v-model="ownerSelected"
            label="Owner"
            :definitionId="[ownerDefinitionId]"
            :multipleSelection="true"
            :showViaDotAtTenChild="true"
          />
        </div>
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="ownerDefinitionSelected"
              display="chip"
              :options="definitionSubsystemList"
              :disabled="ownerSelected.length === 0"
              optionLabel="name"
              :placeholder="ownerSelected.length === 0 ? 'Select Owner' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-8">
          <searchPsWidget
            v-model="kVSelected"
            label="Station Voltage"
            :definitionId="[kVDefinitionId]"
            :multipleSelection="true"
          />
        </div>
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="kVDefinitionSelected"
              display="chip"
              :options="definitionSubsystemList"
              :disabled="kVSelected.length === 0"
              optionLabel="name"
              :placeholder="kVSelected.length === 0 ? 'Select kV' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-8">
          <searchPsWidget
            v-model="stationSelected"
            label="Station"
            :definitionId="[stationDefinitionId]"
            :multipleSelection="true"
            :showViaDotAtTenChild="true"
          />
        </div>
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="stationDefinitionSelected"
              display="chip"
              :options="definitionSubsystemList"
              :disabled="stationSelected.length === 0"
              optionLabel="name"
              :placeholder="stationSelected.length === 0 ? 'Select Station' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-4">
          <div class="flex flex-column align-items-start gap-1">
            <label for="type" class="font-semibold"> Element Type </label>
            <MultiSelect
              v-model="psDefinitionType"
              display="chip"
              :options="definitionSubsystemList"
              optionLabel="name"
              :placeholder="stationSelected.length === 0 ? 'Select Station' : 'Select Types'"
              class="w-full psFilterAutoComplete"
            />
          </div>
        </div>
        <div class="col-8">
          <div class="flex flex-column align-items-start gap-1">
            <searchPsWidget
              v-model="psSelected"
              label="Power System"
              :definitionId="psDefinitionType.map((item) => item._id)"
              :multipleSelection="true"
              :showViaDotAtTenChild="true"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 flex flex-column align-items-start gap-1">
          <label for="type" class="font-semibold"> Element Voltage</label>
          <MultiSelect
            v-model="elementKVSelected"
            display="chip"
            :options="elementVoltageList"
            optionLabel="name"
            placeholder="Select Element Voltage"
            class="w-full psFilterAutoComplete"
          />
        </div>
      </div>

      <Divider />

      <div class="flex flex-column gap-2 mb-3">
        <div class="flex align-items-center justify-content-between">
          <label for="appName" class="font-semibold"> Conjunction </label>
          <div class="flex align-items-center">
            <label for="conjunctionCanDuplicate" class="mr-2"> Duplicate </label>
            <Checkbox
              v-model="conjunctionCanDuplicate"
              inputId="conjunctionCanDuplicate"
              name="conjunctionCanDuplicate"
              :binary="true"
            />
          </div>
        </div>
        <conjunctionInputWidget
          v-model:filterConjunction="filterConjunction"
          v-model:canDuplicate="conjunctionCanDuplicate"
          :filter-name-selected="filterNameSelected"
        />
        <small>Example: "Area and Zone or (kV and Station) not PowerSystem"</small>
      </div>
    </div>
  </ScrollPanel>
</template>

<script setup>
import MultiSelect from 'primevue/multiselect';
import ScrollPanel from 'primevue/scrollpanel';
import conjunctionInputWidget from './conjunctionInputWidget.vue';
import { DefinitionListApi, PowerSystemParameterApi } from '@/views/PowerSystem/api';
import { nextTick, onMounted, watch } from 'vue';
import searchPsWidget from '../PowerSystem/searchPsWidget.vue';
onMounted(async () => {
  await getDefinitionList();
  await getdefinitionSubsystemList();
  await getPowersystemListVoltageLevel();
});

const props = defineProps({
  currentFilter: { type: Object, default: () => {} },
});
const emit = defineEmits(['changeFilter', 'saveFilter']);

const areaSelected = ref([]);
const areaDefinitionSelected = ref([]);
const areaDefinitionId = ref([]);

const zoneSelected = ref([]);
const zoneDefinitionSelected = ref([]);
const zoneDefinitionId = ref([]);

const ownerSelected = ref([]);
const ownerDefinitionSelected = ref([]);
const ownerDefinitionId = ref([]);

const kVSelected = ref([]);
const kVDefinitionSelected = ref([]);
const kVDefinitionId = ref([]);

const stationSelected = ref([]);
const stationDefinitionSelected = ref([]);
const stationDefinitionId = ref([]);

const psDefinitionType = ref([]);
const psSelected = ref([]);

const elementKVSelected = ref([]);

const filterConjunction = ref('');

const getFilterSelected = () => {
  return {
    area: {
      value: areaSelected.value.map((item) => item._id),
      type: areaSelected.value.length > 0 ? areaDefinitionSelected.value.map((item) => item._id) : [],
    },
    zone: {
      value: zoneSelected.value.map((item) => item._id),
      type: zoneSelected.value.length > 0 ? zoneDefinitionSelected.value.map((item) => item._id) : [],
    },
    owner: {
      value: ownerSelected.value.map((item) => item._id),
      type: ownerSelected.value.length > 0 ? ownerDefinitionSelected.value.map((item) => item._id) : [],
    },

    kV: {
      value: kVSelected.value.map((item) => item._id),
      type: kVSelected.value.length > 0 ? kVDefinitionSelected.value.map((item) => item._id) : [],
    },

    station: {
      value: stationSelected.value.map((item) => item._id),
      type: stationSelected.value.length > 0 ? stationDefinitionSelected.value.map((item) => item._id) : [],
    },
    // powerSystem: psSelected.value ? psSelected.value.map((item) => item._id) : [],
    powersystem: psSelected.value ? psSelected.value.map((item) => item._id) : [],
    kVElement: elementKVSelected.value ? elementKVSelected.value.map((item) => item.name) : [],
    filtering: filterNameSelected.value.length >= 2 ? filterConjunction.value : '',
  };
};
const changFilter = () => {
  emit('changeFilter', getFilterSelected());
};
const saveFilter = () => {
  emit('saveFilter', getFilterSelected());
};
const clearFilterSelected = () => {
  areaSelected.value = [];
  areaDefinitionSelected.value = [];

  zoneSelected.value = [];
  zoneDefinitionSelected.value = [];

  ownerSelected.value = [];
  ownerDefinitionSelected.value = [];

  kVSelected.value = [];
  kVDefinitionSelected.value = [];

  stationSelected.value = [];
  stationDefinitionSelected.value = [];

  psSelected.value = [];
  psDefinitionType.value = [];

  elementKVSelected.value = [];

  filterConjunction.value = '';
};

watch(filterConjunction, (newval, oldval) => {
  console.log('safas', 'newval', newval, 'oldval', oldval, '--');
});
// definiton List
const definitionList = ref();
const getDefinitionList = async () => {
  try {
    const res = await DefinitionListApi.getParameterDefinitionList();
    definitionList.value = res.data;
    setDefinitionfilterId();
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    // toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
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

const getdefinitionSubsystemList = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    definitionSubsystemList.value = res.data;
  } catch (error) {
    console.log('getdefinitionSubsystemList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const elementVoltageList = ref([]);
const getPowersystemListVoltageLevel = async () => {
  try {
    const res = await PowerSystemParameterApi.getPowersystemListVoltageLevel();
    elementVoltageList.value = res.data.map((item) => {
      // Kiểm tra nếu name có dấu chấm (số thập phân), thì chuyển thành float, nếu không thì chuyển thành int
      item.name = item.name.includes('.') ? parseFloat(item.name) : parseInt(item.name);
      return item;
    });
  } catch (error) {
    console.log('getdefinitionSubsystemList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};
watch(
  () => props.currentFilter,
  async () => {
    clearFilterSelected();

    await nextTick(() => {
      areaSelected.value = props.currentFilter.area.value;
      areaDefinitionSelected.value = props.currentFilter.area.type;

      zoneSelected.value = props.currentFilter.zone.value;
      zoneDefinitionSelected.value = props.currentFilter.zone.type;

      ownerSelected.value = props.currentFilter.owner.value;
      ownerDefinitionSelected.value = props.currentFilter.owner.type;

      kVSelected.value = props.currentFilter.kV.value;
      kVDefinitionSelected.value = props.currentFilter.kV.type;

      stationSelected.value = props.currentFilter.station.value;
      stationDefinitionSelected.value = props.currentFilter.station.type;

      psSelected.value = props.currentFilter.powerSystem;
      psDefinitionType.value = definitionSubsystemList.value;

      elementKVSelected.value = props.currentFilter.kVElement;

      filterConjunction.value = props.currentFilter.filtering || '';
    });
  },
  { deep: true },
);

const filterNameSelected = computed(() => {
  const suggestion = [];
  if (areaSelected.value.length > 0) {
    suggestion.push('area');
  }
  if (zoneSelected.value.length > 0) {
    suggestion.push('zone');
  }
  if (ownerSelected.value.length > 0) {
    suggestion.push('owner');
  }
  if (kVSelected.value.length > 0) {
    suggestion.push('kV');
  }
  if (stationSelected.value.length > 0) {
    suggestion.push('station');
  }
  if (psSelected.value && psSelected.value.length > 0) {
    suggestion.push('powerSystem');
  }

  if (elementKVSelected.value && elementKVSelected.value.length > 0) {
    suggestion.push('kVElement');
  }

  return suggestion;
});
const conjunctionCanDuplicate = ref(false);
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

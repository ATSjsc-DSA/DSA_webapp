<template>
  <div class="flex gap-2 justify-content-start flex-wrap 2xl:flex-nowrap psView-Filter">
    <FloatLabel v-for="(filterData, filterName) in filterList" :key="filterName" class="flex-grow-1">
      <label for="filter-area">{{ filterList[filterName].name }}</label>
      <Dropdown
        v-model="filterList[filterName].selected"
        :options="filterData.options"
        showClear
        :virtualScrollerOptions="{
          lazy: filterData.options.length > 0,
          onLazyLoad: onLazyLoadFilterWithoutStation,
          itemSize: pageRowNumber,
          loading: filterData.isLoading,
          delay: 250,
          showLoader: true,
        }"
        :disabled="!canUseDefinitionFilter"
        class="w-full"
        @click="filterClick = filterName"
      >
        <template #value="slotProps">
          <div class="flex align-items-center">
            <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
            <div v-else>{{ filterList[filterName].name }}</div>
          </div>
        </template>
        <template v-slot:option="slotProps">
          <div v-if="slotProps.option" class="flex align-items-center">
            <div class="py-6">{{ slotProps.option.label }}</div>
          </div>
        </template>

        <template v-slot:loader="{ options }">
          <div class="flex align-items-center p-1" style="height: 30px">
            <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
          </div>
        </template>
      </Dropdown>
    </FloatLabel>
    <Divider layout="vertical" />
    <FloatLabel class="flex-grow-1">
      <label for="filter-area">Station</label>
      <Dropdown
        v-model="stationSelected"
        :options="stationOptions"
        showClear
        :virtualScrollerOptions="{
          lazy: stationOptions.length > 0,
          onLazyLoad: onLazyLoadStation,
          itemSize: pageRowNumber,
          loading: stationIsLoading,
          delay: 250,
          showLoader: true,
        }"
        :disabled="!canUseDefinitionStationFilter"
        class="w-full"
      >
        <template #value="slotProps">
          <div class="flex align-items-center">
            <div v-if="slotProps.value">{{ slotProps.value.label }}</div>
            <div v-else>Station</div>
          </div>
        </template>
        <template v-slot:option="slotProps">
          <div v-if="slotProps.option" class="flex align-items-center">
            <div class="py-6">{{ slotProps.option.label }}</div>
          </div>
        </template>

        <template v-slot:loader="{ options }">
          <div class="flex align-items-center p-1" style="height: 30px">
            <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
          </div>
        </template>
      </Dropdown>
    </FloatLabel>
    <div class="flex gap-2">
      <Button severity="warning" icon="pi pi-times" style="width: 32px" @click="clearFilterSelected" />
      <Button severity="primary" icon="pi pi-filter" style="width: 32px" @click="handleFilterClick" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';

import { PowerSystemParameterApi } from '@/views/PowerSystem/api';

const props = defineProps({
  canUseDefinitionFilter: { type: Boolean },
  canUseDefinitionStationFilter: { type: Boolean },

  definitionList: { type: Array, default: () => [] },
  projectVersionId: { type: String },
});

const emits = defineEmits(['handleFilter']);

onMounted(async () => {
  if (props.definitionList && props.definitionList.length > 0) {
    await resetFilterList();
  }
});

watch(
  () => props.definitionList,
  async () => {
    if (props.definitionList && props.definitionList.length > 0) {
      await resetFilterList();
    }
  },
);
const filterClick = ref();
const filterList = reactive({
  area: {
    name: 'Area',
    definitionName: 'Area',
    selected: '',
    options: [],
    isLoading: false,
    definitionId: '',
  },
  zone: {
    name: 'Zone',
    definitionName: 'Zone',
    selected: '',
    options: [],
    isLoading: false,
    definitionId: '',
  },
  owner: {
    name: 'Owner',
    definitionName: 'Owner',
    selected: '',
    options: [],
    isLoading: false,
    definitionId: '',
  },
  type: {
    name: 'Type',
    definitionName: 'SubstationType',
    selected: '',
    options: [],
    isLoading: false,
    definitionId: '',
  },
  kV: {
    name: 'kV',
    definitionName: 'Substation_kVBase',
    selected: '',
    options: [],
    isLoading: false,
    definitionId: '',
  },
});
const filterSelectedWithoutStation = computed(() => {
  const dataFilter = {};
  for (const filterName in filterList) {
    if (filterList[filterName].selected) {
      dataFilter[filterName] = filterList[filterName].selected._id;
    }
  }
  return dataFilter;
});
const stationSelected = ref();
const stationOptions = ref([]);
const stationIsLoading = ref(false);
const stationDefinitionId = ref();

const pageRowNumber = ref(10);

const resetFilterList = async () => {
  for (const filterName in filterList) {
    const definitionData = props.definitionList.filter(
      (item) => item.name === filterList[filterName].definitionName,
    )[0];
    const sizeFilter = definitionData ? await getSizeFilter(definitionData._id) : 0;
    filterList[filterName].options = definitionData ? Array.from({ length: sizeFilter }) : [];
    filterList[filterName].definitionId = definitionData ? definitionData._id : '';
  }

  await updateSizeStationFilter();
};

const getSizeFilter = async (definitionId, dataFilter = {}) => {
  const res = await PowerSystemParameterApi.getPsDataWithDefinition(
    definitionId,
    props.projectVersionId,
    dataFilter,
    1,
  );
  return res.data.total || 0;
};

const onLazyLoadFilterWithoutStation = async (event) => {
  filterList[filterClick.value].isLoading = true;

  const { first, last } = event;
  const _items = [...filterList[filterClick.value].options];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;
    const resData = await PowerSystemParameterApi.getPsDataWithDefinition(
      filterList[filterClick.value].definitionId,
      props.projectVersionId,
      {},
      page,
    );
    if (!resData.data.items) {
      break;
    }
    for (let i = 0; i < resData.data.items.length; i++) {
      if (!resData.data.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.data.items[i].generalInfo.name, _id: resData.data.items[i]._id };
    }
  }

  filterList[filterClick.value].options = _items;
  filterList[filterClick.value].isLoading = false;
};

// ---- Station ---------

watch(filterSelectedWithoutStation, () => {
  updateSizeStationFilter();
});
const updateSizeStationFilter = async () => {
  stationSelected.value = undefined;
  const stationDefinition = props.definitionList.filter((item) => item.name === 'Station')[0];
  const sizeFilterStation = stationDefinition
    ? await getSizeFilter(stationDefinition._id, filterSelectedWithoutStation.value)
    : 0;
  stationOptions.value = stationDefinition ? Array.from({ length: sizeFilterStation }) : [];
  stationDefinitionId.value = stationDefinition ? stationDefinition._id : '';
};
const onLazyLoadStation = async (event) => {
  stationIsLoading.value = true;

  const { first, last } = event;
  const _items = [...stationOptions.value];
  for (let row = first; row < last; row += 10) {
    const page = Math.floor(row / 10) + 1;
    const resData = await PowerSystemParameterApi.getPsDataWithDefinition(
      stationDefinitionId.value,
      props.projectVersionId,
      {},
      page,
    );
    if (!resData.data.items) {
      break;
    }
    for (let i = 0; i < resData.data.items.length; i++) {
      if (!resData.data.items[i].generalInfo) {
        break;
      }
      _items[row + i] = { label: resData.data.items[i].generalInfo.name, _id: resData.data.items[i]._id };
    }
  }

  stationOptions.value = _items;
  stationIsLoading.value = false;
};

const clearFilterSelected = () => {
  for (const filterName in filterList) {
    filterList[filterName].selected = undefined;
  }
  stationSelected.value = undefined;
};
const handleFilterClick = () => {
  const filterValue = JSON.parse(JSON.stringify(filterSelectedWithoutStation.value));
  if (stationSelected.value) {
    filterValue['sub'] = stationSelected.value._id;
  }
  emits('handleFilter', filterValue);
};
</script>
<style>
.p-dropdown-item {
  min-height: 2rem;
}
.p-dropdown-panel {
  width: 16rem;
}
</style>

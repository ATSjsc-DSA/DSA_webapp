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
              <label for="type" class="text-sm"> Type </label>
              <MultiSelect
                v-model="deviceTypeSelected"
                display="chip"
                :options="deviceTypeList"
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
</template>

<script setup>
import MultiSelect from 'primevue/multiselect';

import flatListFilterWidget from '@/views/PowerSystem/menuLeftWidget/flatListFilterWidget.vue';
import { DefinitionListApi, PowerSystemParameterApi } from '@/views/PowerSystem/api';
import { onMounted, watch } from 'vue';

onMounted(async () => {
  await getDefinitionList();
  await getDeviceTypeList();
});

const props = defineProps({
  currentFilter: { type: Object, default: () => {} },
  projectVersionId: { type: String, default: '' },
});
const emit = defineEmits(['changeFilter']);
watch(
  () => props.currentFilter,
  () => {
    deviceTypeSelected.value = props.currentFilter.definition.map((item) => item._id);
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
  newFilter.definitionList = deviceTypeSelected.value;
  newFilter.powersystem = psSelected.value ? psSelected.value.map((item) => item._id) : [];
  emit('changeFilter', newFilter);
};

const deviceTypeList = ref([]);
const deviceTypeSelected = ref([]);

watch(deviceTypeSelected, () => {
  psSelected.value = [];
});

const getDeviceTypeList = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    deviceTypeList.value = res.data;
  } catch (error) {
    console.log('getDeviceTypeList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};
const psSelected = ref([]);
const psSuggestions = ref([]);
const searchPsQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, deviceTypeSelected.value, query);
    psSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const clearOtherFilterSelected = () => {
  deviceTypeSelected.value = [];
  psSelected.value = [];
};
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

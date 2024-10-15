<template>
  <div class="w-full">
    <flatListFilterWidget
      :definitionList="definitionList"
      :projectVersionId="projectVersionId"
      :multipleSelection="true"
      @handleFilter="changFilterData"
    />
  </div>
  <div class="p-3">
    filterData:
    <pre>{{ filterData }}</pre>
  </div>
</template>

<script setup>
import flatListFilterWidget from '@/views/PowerSystem/menuLeftWidget/flatListFilterWidget.vue';
import { DefinitionListApi } from '@/views/PowerSystem/api';
import { onMounted } from 'vue';

const projectVersionId = ref('66decf1dcff005199529524b');

onMounted(async () => {
  await getDefinitionList();
});
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

const filterData = ref();
const changFilterData = (newFilter) => {
  filterData.value = newFilter;
};
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

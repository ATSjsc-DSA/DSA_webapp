<template>
  <DataTable
    id="psDynamicTable"
    :value="tableData"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    showGridlines
    :loading="loading"
    rowGroupMode="rowspan"
    groupRowsBy="powerSystemDataUniqueId"
  >
    <Column
      field="powerSystemDataUniqueId"
      frozen
      header="Unique Id"
      class="first-column"
      style="text-wrap: nowrap"
      :rowspan="4"
    >
      <template #body="{ data }">
        <div class="font-bold w-6rem text-center">
          {{ data.powerSystemDataUniqueId }}
        </div>
      </template>
    </Column>
    <Column field="modelType" class="second-column" header="Type" style="text-wrap: nowrap" />
    <Column field="modelName" header="Model Name" style="text-wrap: nowrap" />

    <Column header="Values" field="modelData">
      <template #body="{ data }">
        <DataTable :value="data.modelData" tableStyle="min-width: 50rem" scrollable style="text-wrap: nowrap">
          <Column v-for="(val, col) in data.modelData[0]" :key="col" :field="col" :header="col"></Column>
        </DataTable>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { default as globalDynamicModelApi } from '@/views/GlobalDynamicModelView/api.js';
import api from './api';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  await getDynamicDefinitionList();
});
const pageRowNumber = ref(10);

const dynamicDefinition = ref();
const getDynamicDefinitionList = async () => {
  try {
    const res = await globalDynamicModelApi.getGlobalDynamicModelDefinitionList(1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await globalDynamicModelApi.getGlobalDynamicModelDefinitionList(page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicDefinition.value = data;
  } catch (error) {
    dynamicDefinition.value = undefined;
    console.error('getDynamicDefinitionList error', error);
  }
};

const getGlobalDynamicModelDefinitionById = (id) => dynamicDefinition.value.filter((item) => item._id === id)[0];
const tableData = computed(() => {
  const data = [];
  for (let index = 0; index < props.data.length; index++) {
    const items = props.data[index];

    const typeModel = items.modelDynamicType === 0 ? 'Traditional' : 'Renews';
    const typeModelArr = Object.values(globalDynamicModelApi.TypeGlobalDynamicModelDefinition[typeModel]);
    for (const type of typeModelArr) {
      const typeData = items.model.filter((model) => {
        return model.modelType === type;
      })[0];

      let dynamicModelDefinition = {};
      let modelData;
      if (typeData) {
        modelData = {};
        dynamicModelDefinition = getGlobalDynamicModelDefinitionById(typeData.modelId);
        for (let index = 0; index < dynamicModelDefinition.values.length; index++) {
          modelData[dynamicModelDefinition.values[index]] = typeData.values[index] || '';
        }
      }
      data.push({
        id: items.id,
        powerSystemDataId: items.powerSystemDataId,
        powerSystemDataUniqueId: items.powerSystemDataUniqueId,
        modelType: type,
        modelId: typeData ? typeData.modelId : undefined,
        modelName: dynamicModelDefinition.name,
        modelData: [modelData],
      });
    }
  }
  return data;
});
</script>
<style>
#psDynamicTable .first-column {
  position: sticky;
  left: 0;
  width: 8rem;
  z-index: 3;
  text-align: center;
}

#psDynamicTable .second-column {
  position: sticky;
  left: 8rem;
  min-width: 8rem;
  width: 8rem;
  z-index: 2;
  background: inherit;
}

#psDynamicTable th.first-column,
#psDynamicTable th.second-column {
  background-color: var(--surface-card);
}
</style>

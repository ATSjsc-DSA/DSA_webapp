<template>
  <DataTable
    :value="data"
    :totalRecords="data.length"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    :loading="loading"
  >
    <Column field="generalInfo.emsUniqueId" frozen header="Unique Id" style="text-wrap: nowrap">
      <template #body="slotProps">
        <div class="font-bold w-6rem">
          {{ slotProps.data.generalInfo.emsUniqueId }}
        </div>
      </template>
    </Column>
    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)" style="text-wrap: nowrap">
        <template #body="slotProps">
          <div class="flex justify-content-between align-items-center">
            {{ slotProps.data.engineInfo.values[engineIndex][col.index] }}
          </div>
        </template>
      </Column>
    </template>

    <template #empty> No Data </template>
  </DataTable>
</template>

<script setup>
import { ref, computed, compile } from 'vue';
import { VALUE_DATA_NAME } from './api'; // <= import it

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headerData: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  valueIndex: {
    type: String,
    default: 'EMS',
    validator(value) {
      return VALUE_DATA_NAME.includes(value);
    },
  },
});

const engineIndex = computed(() => VALUE_DATA_NAME.indexOf(props.valueIndex));
const columnList = computed(() => {
  if (props.headerData.inputAttributes) {
    const dataHeader = props.headerData.inputAttributes[engineIndex.value];
    const cols = [];
    for (let ind = 0; ind < dataHeader.length; ind++) {
      const data = dataHeader[ind];
      cols.push({ index: ind, header: data.name, visible: data.display });
    }
    return cols;
  }
  return [];
});

function capitalizeFirstLetter(string) {
  return string
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

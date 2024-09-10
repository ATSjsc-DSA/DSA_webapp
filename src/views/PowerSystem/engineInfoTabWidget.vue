<template>
  <DataTable
    :value="data"
    :totalRecords="data.length"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
  >
    <Column field="generalInfo.emsUniqueId" header="Unique Id" style="width: 15%">
      <template #body="slotProps">
        <div class="font-bold w-6rem">
          {{ slotProps.data.generalInfo.emsUniqueId }}
        </div>
      </template>
    </Column>
    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)" style="min-height: 57px">
        <template #body="slotProps">
          <div class="flex justify-content-between align-items-center" style="min-height: 35px">
            {{ slotProps.data.engineInfo.values[col.index] }}
          </div>
        </template>
      </Column>
    </template>

    <template #empty> No Data </template>
  </DataTable>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headerData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['editData', 'deleteData']);
const columnList = computed(() => {
  if (props.headerData.inputAttributes) {
    const cols = [];
    for (let ind = 0; ind < props.headerData.inputAttributes.length; ind++) {
      const data = props.headerData.inputAttributes[ind];
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

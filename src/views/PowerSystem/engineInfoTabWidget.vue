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
    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)">
        <template #body="slotProps">
          <div>{{ slotProps.data.engineInfo.values[col.index] }}</div>
        </template>
      </Column>
    </template>

    <Column style="width: 1%; min-width: 5rem">
      <template #body="slotProps">
        <div class="flex justify-content-between">
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
        </div>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>

  <Toast />
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  psdData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['editData', 'deleteData']);
const columnList = computed(() => {
  if (props.psdData) {
    const cols = [];
    for (let ind = 0; ind < props.psdData.inputAttributes.length; ind++) {
      const data = props.psdData.inputAttributes[ind];
      cols.push({ index: ind, header: data.name, visible: data.display });
    }
    return cols;
  }
  return [];
});

// Delete
const deleteVisibleDialog = ref(false);
const pseDelete = ref({});
const handleDeletePSE = (pseData) => {
  pseDelete.value = pseData;
  deleteVisibleDialog.value = true;
};

const deletePSE = async () => {
  emit('deleteData', pseDelete.value._id);
  deleteVisibleDialog.value = false;
};

function capitalizeFirstLetter(string) {
  return string
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

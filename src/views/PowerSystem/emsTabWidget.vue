<template>
  <DataTable
    :value="emsData"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    showGridlines
    :loading="loading"
  >
    <Column field="generalInfo.uniqueId" frozen header="Unique Id" >
      <template #body="slotProps">
        <div class="font-bold">
          {{ slotProps.data.generalInfo.uniqueId }}
        </div>
      </template>
    </Column>
    <Column field="generalInfo.name" header="Name" style="text-wrap: nowrap"></Column>

    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)" style="text-wrap: nowrap">
        <template #body="slotProps">
          <div class="flex justify-content-between align-items-center">
            {{ slotProps.data.engineInfo.values[col.index] }}
          </div>
        </template>
      </Column>
    </template>
    <Column frozen alignFrozen="right" style="width: 5rem" bodyClass="p-1">
      <template #body="slotProps">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPSE(slotProps.data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
        </div>
      </template>
    </Column>

    <template #empty> No Data </template>
  </DataTable>
</template>
<script setup>
const props = defineProps({
  emsData: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  headerData: {
    type: Object,
    required: true,
  },
});

const columnList = computed(() => {
  if (props.headerData.inputAttributes) {
    const dataHeader = props.headerData.inputAttributes;
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

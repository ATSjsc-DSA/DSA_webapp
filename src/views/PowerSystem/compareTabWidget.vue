<template>
  <div class="flex align-items-center justify-content-end gap-2 w-full my-3">
    <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="emit('getData')" />
  </div>
  <!-- Add  -->
  <Panel :toggleable="data.Add.length > 0">
    <template #header>
      <div class="my-3 text-green-500">New Power System ({{ data.Add.length }})</div>
    </template>
    <div class="pl-6">
      <DataTable
        :value="data.Add"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        <template #empty> No change. </template>
      </DataTable>
    </div>
  </Panel>
  <!-- Update  -->
  <Panel :toggleable="data.Update.length > 0">
    <template #header>
      <div class="my-3 text-yellow-500">Update Power System ({{ data.Update.length }})</div>
    </template>
    <div class="pl-6">
      <DataTable
        :value="data.Update"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        <template #empty> No change. </template>
      </DataTable>
    </div>
  </Panel>
  <!-- Delete  -->
  <Panel :toggleable="data.Delete.length > 0">
    <template #header>
      <div class="my-3 text-red-500">Delete Power System ({{ data.Delete.length }})</div>
    </template>
    <div class="pl-6">
      <DataTable
        :value="data.Delete"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        <template #empty> No change. </template>
      </DataTable>
    </div>
  </Panel>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['getData']);
const data = computed(() => {
  if (!props.data) {
    return {
      Add: [],
      Update: [],
      Delete: [],
    };
  }
  return props.data;
});
</script>

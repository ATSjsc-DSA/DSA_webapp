<template>
  <div class="flex align-items-center justify-content-end gap-2 w-full mb-3">
    <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="emit('getData', true)" />
  </div>
  <!-- Add  -->
  <Panel toggleable>
    <template #header>
      <div class="my-3 text-green-500">New Power System ({{ data.Add.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Add"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="emsName" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="operationName" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="softwareName" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="skey" field="scadaInfo.skey" />
            <Column header="scadaName" sortable field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>

        <Column header="name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="emsName" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="operationName" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="softwareName" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="skey" field="scadaInfo.skey" />
        <Column header="scadaName" sortable field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Update  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-yellow-500">Update Power System ({{ data.Update.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Update"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="emsName" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="operationName" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="softwareName" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="skey" field="scadaInfo.skey" />
            <Column header="scadaName" sortable field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>

        <Column header="name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="emsName" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="operationName" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="softwareName" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="skey" field="scadaInfo.skey" />
        <Column header="scadaName" sortable field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Delete  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-red-500">Delete Power System ({{ data.Delete.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Delete"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :rowClass="rowClass"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="emsName" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="operationName" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="softwareName" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="skey" field="scadaInfo.skey" />
            <Column header="scadaName" sortable field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>

        <Column header="name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="emsName" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="operationName" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="softwareName" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="skey" field="scadaInfo.skey" />
        <Column header="scadaName" sortable field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

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

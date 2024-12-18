<template>
  <DataTable
    :value="data"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    showGridlines
    scrollable
    scrollHeight="400px"
  >
    <ColumnGroup type="header">
      <Row>
        <Column header="Unique Id" style="width: 15%" :rowspan="2" />
        <Column header="General" :colspan="4" />
        <Column header="Scada" :colspan="3" />
      </Row>
      <Row>
        <Column header="Name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey" />
        <Column header="Scada Name" field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
      </Row>
    </ColumnGroup>
    <Column header="Unique Id" style="width: 15%">
      <template #body="slotProps">
        <div class="font-bold" style="min-width: 6rem">
          {{ slotProps.data.generalInfo.uniqueId }}
        </div>
      </template>
    </Column>
    <Column header="Name" field="generalInfo.name" />
    <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
    <Column header="Ems Name" field="generalInfo.emsName" />
    <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
    <Column header="Operation Name" field="generalInfo.operationName" />
    <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
    <Column header="Software Name" field="generalInfo.softwareName" />
    <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
    <Column header="Skey" field="scadaInfo.skey" />
    <Column header="Scada Name" field="scadaInfo.scadaName" />
    <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

    <template #empty> No change </template>
  </DataTable>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
</script>

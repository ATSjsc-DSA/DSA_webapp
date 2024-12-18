<template>
  <DataTable
    :value="tableData"
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
        <Column header="General" :colspan="2" />
        <Column header="Scada" :colspan="2" />
        <Column header="engineInfo" :colspan="2" />
      </Row>
      <Row>
        <Column header="Name" />
        <Column header="Operation Name" />

        <Column header="Skey" />
        <Column header="Scada Name" />

        <Column header="Definition" />
        <Column header="Value" />
      </Row>
    </ColumnGroup>

    <Column header="Unique Id" style="width: 15%">
      <template #body="{ data }">
        <div class="font-bold" style="min-width: 6rem">
          {{ data.old.generalInfo.uniqueId }}
        </div>
      </template>
    </Column>

    <Column header="Name">
      <template #body="{ data }">
        <div v-if="data.new.generalInfo.name !== data.old.generalInfo.name">
          <div class="text-orange-500">
            {{ data.new.generalInfo.name }}
          </div>
          <div>({{ data.old.generalInfo.name }})</div>
        </div>

        <div v-else>
          {{ data.new.generalInfo.name }}
        </div>
      </template>
    </Column>
    <Column header="Operation Name">
      <template #body="{ data }">
        <div v-if="data.new.generalInfo.operationName !== data.old.generalInfo.operationName">
          <div class="text-orange-500">
            {{ data.new.generalInfo.operationName }}
          </div>
          <div>({{ data.old.generalInfo.operationName }})</div>
        </div>

        <div v-else>
          {{ data.new.generalInfo.operationName }}
        </div>
      </template>
    </Column>

    <Column header="Skey">
      <template #body="{ data }">
        <div v-if="data.new.scadaInfo.skey !== data.old.scadaInfo.skey">
          <div class="text-orange-500">
            {{ data.new.scadaInfo.skey }}
          </div>
          <div>({{ data.old.scadaInfo.skey }})</div>
        </div>

        <div v-else>
          {{ data.new.scadaInfo.skey }}
        </div>
      </template>
    </Column>
    <Column header="Scada Name">
      <template #body="{ data }">
        <div v-if="data.new.scadaInfo.scadaName !== data.old.scadaInfo.scadaName">
          <div class="text-orange-500">
            {{ data.new.scadaInfo.scadaName }}
          </div>
          <div>({{ data.old.scadaInfo.scadaName }})</div>
        </div>

        <div v-else>
          {{ data.new.scadaInfo.scadaName }}
        </div>
      </template>
    </Column>
    <Column header="Definition">
      <template #body="{ data }">
        <div
          v-if="data.new.engineInfo.powerSystemDefinitionId.$oid !== data.old.engineInfo.powerSystemDefinitionId.$oid"
          class="text-orange-500"
          v-tooltip.bottom="data.old.engineInfo.powerSystemDefinitionId.$oid"
        >
          {{ data.new.engineInfo.powerSystemDefinitionId.$oid }}
        </div>

        <div v-else>
          {{ data.new.engineInfo.powerSystemDefinitionId.$oid }}
        </div>
      </template>
    </Column>
    <Column header="Value">
      <template #body="{ data }">
        <div v-for="(newVal, index) in data.new.engineInfo.values" :key="index">
          <div
            v-if="newVal !== data.old.engineInfo.values[index]"
            v-tooltip.bottom="data.old.engineInfo.values[index]"
            class="text-orange-500"
          >
            {{ newVal }}
          </div>

          <div v-else>
            {{ newVal }}
          </div>
        </div>
      </template>
    </Column>
    <template #empty> No change </template>
  </DataTable>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const tableData = computed(() => {
  if (props.data.length > 0) {
    return props.data.map((item) => ({ old: item[0], new: item[1] }));
  }
  return [];
});
</script>

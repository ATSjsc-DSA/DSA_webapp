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
        <Column header="General" :colspan="3" />
        <Column header="engineInfo" :colspan="2" />
      </Row>
      <Row>
        <Column header="Name" />
        <Column header="Power System Id" />

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
    <Column header="Power System Id">
      <template #body="{ data }">
        <div v-if="data.new.generalInfo.powersystemId.$oid !== data.old.generalInfo.powersystemId.$oid">
          <div class="text-orange-500">
            {{ data.new.generalInfo.powersystemId.$oid }}
          </div>
          <div>({{ data.old.generalInfo.powersystemId.$oid }})</div>
        </div>

        <div v-else>
          {{ data.new.generalInfo.powersystemId.$oid }}
        </div>
      </template>
    </Column>

    <Column header="Definition">
      <template #body="{ data }">
        <div
          v-if="data.new.engineInfo.powerSystemDefinitionId.$oid !== data.old.engineInfo.powerSystemDefinitionId.$oid"
          v-tooltip.bottom="data.old.engineInfo.powerSystemDefinitionId.$oid"
          class="text-orange-500"
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
            v-tooltip.bottom="data.old.engineInfo.values[index] ? data.old.engineInfo.values[index] : 'Null'"
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

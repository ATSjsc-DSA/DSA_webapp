<template>
  <div>
    <DataTable v-model:expandedRows="expandedRows" :value="listArea" dataKey="_id" tableStyle="min-width: 60rem">
      <template #header>
        <div class="flex flex-wrap justify-content-end gap-2">
          <Button
            severity="secondary"
            text
            icon="pi pi-download
"
            label="Download Template"
            @click="downloadFile()"
          />

          <Button severity="info" text icon="pi pi-upload" label="Upload Data" @click="uploadArea()" />
          <Button text icon="pi pi-plus" label="Create Area" @click="areaHandleCreate" />
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column header="Name">
        <template #body="slotProps">
          <img alt="flag" src="/img/global.jpg" width="32" style="vertical-align: middle" class="ml-2" />
          <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.name }}</span>
        </template>
      </Column>
      <Column :exportable="false" style="width: 8rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteArea(slotProps.data.name, slotProps.data._id)"
          />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-3 grid gap-4">
          <div class="col">
            <div class="flex justify-content-between">
              <h6>Gen List</h6>
              <div class="grid">
                <Button
                  size="small"
                  text
                  v-tooltip.top="{ value: 'Add Gen Area' }"
                  icon="pi pi-plus"
                  aria-label="Filter"
                  class="col"
                  @click="addDataTypeOnArea(slotProps.data._id, slotProps.data.gens_name, 'gen')"
                />
                <Button
                  size="small"
                  text
                  class="col"
                  v-tooltip.top="{ value: 'Delete Gen Active' }"
                  icon="pi pi-times"
                  severity="danger"
                  aria-label="Cancel"
                  @click="confirmRemoveDataOnArea($event, slotProps.data._id, slotProps.data.gens_name, 'gen')"
                />
              </div>
            </div>
            <ScrollPanel style="width: 100%; height: 200px">
              <ul class="values-list">
                <li
                  v-for="value in slotProps.data.gens_name"
                  :key="value.name"
                  :class="{ selected: value.selected }"
                  @click="
                    () => {
                      if (value.selected) {
                        value.selected = false;
                      } else {
                        value.selected = true;
                      }
                    }
                  "
                >
                  {{ value.name }}
                </li>
              </ul>
            </ScrollPanel>
          </div>
          <utilitiesTableExpand class="col" :dataPanel="slotProps.data.loads_name"></utilitiesTableExpand>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import utilitiesTableExpand from './utilitiesTableExpand.vue';
const props = defineProps({
  listArea: {
    type: Array,
  },
});

const emits = defineEmits();

// apiMethod

const downloadFile = () => {};
const areaHandleCreate = () => {};
const confirmDeleteArea = (name, id) => {};
const addDataTypeOnArea = (parent_id, name, type) => {};
const confirmRemoveDataOnArea = (event, parent_id, name, type) => {};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataProfile.TSA_SCE"
      editMode="row"
      dataKey="id"
      @row-edit-save="onRowEditSave"
      :pt="{
        table: { style: 'min-width: 50rem' },
      }"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List event</span>
          <Button
            icon="pi pi-plus"
            text
            raised
            rounded
            aria-label="Filter"
            v-tooltip.top="'Create new row'"
            @click="openDialog"
          />
        </div>
      </template>
      <Column field="mon" header="Monitor" style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.mon" severity="secondary" />
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listMonitor"
            optionLabel="name"
            optionValue="name"
            placeholder="Select a Monitor"
          >
          </Dropdown>
        </template>
      </Column>
      <Column field="time" header="Time" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="target" header="Target" style="width: 15%">
        <template #editor="{ data, field }">
          <AutoComplete completeOnFocus v-model="data[field]" :suggestions="listContingencies" @complete="search" />
        </template>
      </Column>
      <Column field="FL" header="Fault Location" style="width: 10%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="FT" header="Fault Type" style="width: 8%">
        <template #editor="{ data, field }">
          <Dropdown
            id="FT"
            v-model="data[field]"
            :options="FTs"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a FT"
            :class="{ 'p-invalid': submitted && !rowData.FT }"
          >
          </Dropdown>
        </template>
      </Column>
      <Column :rowEditor="true" style="width: 2%; min-width: 6rem" bodyStyle="text-align:center"></Column>
      <Column :exportable="false" style="width: 2%">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteData($event, slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    :style="{ width: '30vw' }"
    :breakpoints="{ '1199px': '65vw', '575px': '90vw' }"
    header="Row Details"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="mon">Monitor</label>
      <Dropdown
        id="mon"
        v-model.trim="rowData.mon"
        :options="listMonitor"
        optionLabel="name"
        optionValue="name"
        placeholder="Select a Monitor"
        :class="{ 'p-invalid': submitted && !rowData.mon }"
      >
      </Dropdown>
      <small class="p-error" v-if="submitted && !rowData.mon">Monitor is required.</small>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <label for="time">Time</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="time"
          v-model="rowData.time"
          :class="{ 'p-invalid': submitted && !rowData.time }"
        />
      </div>
      <div class="field col">
        <label for="FL">Fault Location</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="FL"
          v-model="rowData.FL"
          :class="{ 'p-invalid': submitted && !rowData.FL }"
        />
      </div>
    </div>
    <div class="field">
      <label for="target">Target</label>
      <AutoComplete completeOnFocus v-model="rowData.target" :suggestions="listContingencies" @complete="search" />
    </div>
    <div class="field">
      <label for="FT" class="mb-3">Fault Type</label>
      <Dropdown
        id="FT"
        v-model="rowData.FT"
        :options="FTs"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a FT"
        :class="{ 'p-invalid': submitted && !rowData.FT }"
      >
      </Dropdown>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveRowData" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDSAStore } from '@/store';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
const dsaStore = useDSAStore();
const { dataProfile, listContingencies, listMonitor } = storeToRefs(dsaStore);

//lazy Load
const items = ref(Array.from({ length: listContingencies.value.length }));
watch(
  listContingencies,
  (newVal) => {
    items.value = Array.from({ length: newVal.length });
  },
  { immediate: true },
);
const search = async (event) => {
  await dsaStore.getListContingencies(event.query);
};
//

const editingRows = ref([]);
const FTs = ref([
  { label: '3 phase', value: 0 },
  { label: '2 phase', value: 1 },
  { label: '1 phase with Earth fault', value: 2 },
  { label: '2 phase with Earth fault', value: 3 },
  { label: 'clear', value: 4 },
]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataProfile.value.TSA_SCE[index] = newData;
};
const confirmDeleteData = (event, dataCell) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this record?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      dataProfile.value.TSA_SCE = dataProfile.value.TSA_SCE.filter((item) => item.measurement !== dataCell.measurement);
    },
    reject: () => {},
  });
};

// Dialog
const submitted = ref(false);

const dialogVisible = ref(false);
const rowData = ref({});
const openDialog = () => {
  submitted.value = false;

  rowData.value = {};
  dialogVisible.value = true;
};
const hideDialog = () => {
  submitted.value = false;

  dialogVisible.value = false;
};
const saveRowData = () => {
  submitted.value = true;
  const requiredFields = ['case', 'time', 'target', 'FL', 'FT'];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataProfile.value.TSA_SCE.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

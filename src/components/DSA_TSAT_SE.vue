<template>
  <div class="p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataProfile.TSA_SE"
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
      <Column field="open" header="Open" style="width: 10%">
        <template #editor="{ data, field }"> <InputSwitch v-model="data[field]" /></template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.open)" :severity="getStatusLabel(slotProps.data.open)" />
        </template>
      </Column>
      <Column field="all_phase" header="All Phase" style="width: 10%">
        <template #editor="{ data, field }"> <InputSwitch v-model="data[field]" /></template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.all_phase)" :severity="getStatusLabel(slotProps.data.all_phase)" />
        </template>
      </Column>
      <Column field="phaseA" header="PhaseA" style="width: 10%">
        <template #editor="{ data, field }"> <InputSwitch v-model="data[field]" /></template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.phaseA)" :severity="getStatusLabel(slotProps.data.phaseA)" />
        </template>
      </Column>
      <Column field="phaseB" header="PhaseB" style="width: 10%">
        <template #editor="{ data, field }"> <InputSwitch v-model="data[field]" /></template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.phaseB)" :severity="getStatusLabel(slotProps.data.phaseB)" />
        </template>
      </Column>
      <Column field="phaseC" header="PhaseC" style="width: 10%">
        <template #editor="{ data, field }"> <InputSwitch v-model="data[field]" /></template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.phaseC)" :severity="getStatusLabel(slotProps.data.phaseC)" />
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
      <small class="p-error" v-if="submitted && !rowData.case">Monitor is required.</small>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <label for="target">Target</label>
        <AutoComplete completeOnFocus v-model="rowData.target" :suggestions="listContingencies" @complete="search" />
      </div>
      <div class="field col">
        <label for="open">Open</label>
        <Dropdown
          id="open"
          v-model="rowData.open"
          :options="Opens"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a value"
          :class="{ 'p-invalid': submitted && !rowData.open }"
        >
        </Dropdown>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="all_phase">All Phase</label>
        <div>
          <InputSwitch id="all_phase" v-model="rowData.all_phase" />
        </div>
      </div>
      <div class="field col">
        <label for="phaseA">Phase A</label>
        <div>
          <InputSwitch id="phaseA" v-model="rowData.phaseA" />
        </div>
      </div>
      <div class="field col">
        <label for="phaseB">Phase B</label>
        <div>
          <InputSwitch id="phaseB" v-model="rowData.phaseB" />
        </div>
      </div>
      <div class="field col">
        <label for="phaseC">Phase C</label>
        <div>
          <InputSwitch id="phaseC" v-model="rowData.phaseC" />
        </div>
      </div>
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

const editingRows = ref([]);
const Opens = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
]);

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

const getStatusLabel = (status) => {
  switch (status) {
    case true:
      return 'success';

    case false:
      return 'danger';

    default:
      return null;
  }
};
const getLabel = (status) => {
  switch (status) {
    case true:
      return 'True';

    case false:
      return 'False';

    default:
      return null;
  }
};
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataProfile.value.TSA_SE[index] = newData;
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
      dataProfile.value.TSA_SE = dataProfile.value.TSA_SE.filter((item) => item.measurement !== dataCell.measurement);
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
  const requiredFields = ['case', 'time', 'target', 'open', 'all_phase', 'phaseA', 'phaseB', 'phaseC'];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataProfile.value.TSA_SE.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataList"
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
      <Column field="time" header="Time" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="target" header="Target" style="width: 15%">
        <template #editor="{ data, field }">
          <AutoComplete completeOnFocus v-model="data[field]" :suggestions="listEquipment" @complete="search" />
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
    <div class="formgrid grid">
      <div class="field col">
        <label for="Id">Id</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Id"
          v-model="rowData.id"
          :class="{ 'p-invalid': submitted && !rowData.id }"
        />
      </div>
      <div class="field col">
        <label for="Time">Time</label>
        <InputNumber
          id="Time"
          :minFractionDigits="0"
          :maxFractionDigits="5"
          v-model="rowData.time"
          :class="{ 'p-invalid': submitted && !rowData.time }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="target">Target</label>
        <AutoComplete completeOnFocus v-model="rowData.target" :suggestions="listEquipment" @complete="search" />
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
const { dataProfile, listEquipment, listMonitor } = storeToRefs(dsaStore);
// props, emit, computed
const props = defineProps({
  dataList: {
    type: Array,
    default: [{ time: true, target: '', FL: 1, FT: 1 }],
  },
  dialogVisible: Boolean,
});
const emits = defineEmits(['deleteRow', 'createRow', 'update:dialogVisible']);
const dataList = computed(() => props.dataList);

const dialogVisible = computed({
  get: () => {
    return props.dialogVisible;
  },
  set: (v) => {
    emits('update:dialogVisible', v);
  },
});

//
const editingRows = ref([]);
const Opens = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
]);

//lazy Load
const items = ref(Array.from({ length: listEquipment.value.length }));
watch(
  listEquipment,
  (newVal) => {
    items.value = Array.from({ length: newVal.length });
  },
  { immediate: true },
);
const search = async (event) => {
  await dsaStore.getListEquipment(event.query);
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
  // dataProfile.value.TSA_SE[index] = newData;
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
      emits('deleteRow', dataCell);
    },
    reject: () => {},
  });
};

// Dialog
const submitted = ref(false);
const rowData = ref({});
const openDialog = () => {
  submitted.value = false;
  rowData.value = {
    target: '',
    open: false,
    all_phase: false,
    phaseA: false,
    phaseB: false,
    phaseC: false,
  };
  dialogVisible.value = true;
};
const hideDialog = () => {
  submitted.value = false;

  dialogVisible.value = false;
};
const saveRowData = () => {
  console.log('avbc');
  submitted.value = true;
  const requiredFields = ['id', 'time', 'target'];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    console.log(rowData.value, 'rowData.value');
    emits('createRow', rowData.value);
  }
};
</script>

<style lang="scss" scoped></style>

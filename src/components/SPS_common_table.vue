<template>
  <div class="card p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataTable"
      editMode="row"
      dataKey="name"
      @row-edit-save="onRowEditSave"
      scrollable
      scrollHeight="200px"
      :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem',
          }),
        },
      }"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-900 font-bold">{{ header }}</span>
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

      <Column field="name" header="Name" style="width: 48%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="Require" header="Require" style="width: 48%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
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
    :style="{ width: '20vw' }"
    :breakpoints="{ '1199px': '35vw', '575px': '65vw' }"
    header="Row Details"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="name">Name</label>
      <InputText
        id="name"
        v-model.trim="rowData.name"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !rowData.name }"
      />
      <small class="p-error" v-if="submitted && !rowData.name">Name is required.</small>
    </div>

    <div class="field col">
      <label for="Require">Require</label>
      <InputNumber
        :minFractionDigits="0"
        :maxFractionDigits="5"
        id="Require"
        v-model="rowData.Require"
        :class="{ 'p-invalid': submitted && !rowData.Require }"
      />
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveRowData" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
const props = defineProps({
  dataTable: {
    type: Array,
    requide: true,
  },
  header: String,
});

const emits = defineEmits(['onRowEditSave', 'onDeleteRow', 'createNewRow']);

const editingRows = ref([]);
const header = computed(() => props.header);
const dataTable = ref(props.dataTable);

watch(
  () => props.dataTable,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      dataTable.value = newValue;
    }
  },
);

const onRowEditSave = (event) => {
  emits('onRowEditSave', event);
};

const confirmDeleteData = (event, dataCell) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this row?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      emits('onDeleteRow', dataCell);
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

  const { name, Require } = rowData.value;
  if (name && Require != null) {
    emits('createNewRow', rowData.value);
    dialogVisible.value = false;
  }
};
</script>

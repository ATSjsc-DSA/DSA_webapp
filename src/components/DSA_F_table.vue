<template>
  <div class="card p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataSetting"
      editMode="row"
      dataKey="measurement"
      @row-edit-save="onRowEditSave"
      :pt="{
        table: { style: 'min-width: 50rem' },
      }"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">{{ props.name }}</span>
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
      <Column field="measurement" header="Measurement" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="enabled" header="Status" style="width: 20%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Status"
          >
            <template #option="slotProps">
              <Tag :value="getLabel(slotProps.option.value)" :severity="getStatusLabel(slotProps.option.value)" />
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Tag :value="getLabel(slotProps.data.enabled)" :severity="getStatusLabel(slotProps.data.enabled)" />
        </template>
      </Column>
      <Column v-if="props.name === 'F81'" field="F_Threshold" header="F Threshold" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>

      <Column v-if="props.name === 'F27'" field="V_Threshold" header="V Threshold" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>

      <Column field="T_Delay" header="Time Delay" style="width: 20%">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" />
        </template>
      </Column>
      <Column field="Trip" header="Trip" style="width: 20%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listContingencies"
            optionLabel="name"
            optionValue="_id"
            placeholder="Select a Contingencies"
          >
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Chip :label="getTripLabel(slotProps.data?.Trip)" />
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
    :style="{ width: '450px' }"
    header="Row Details"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="measurement">Measurement</label>
      <InputText
        id="measurement"
        v-model.trim="rowData.measurement"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !rowData.measurement }"
      />
      <small class="p-error" v-if="submitted && !rowData.measurement">Measurement is required.</small>
    </div>

    <div class="field">
      <label for="enabled" class="mb-3">Enabled</label>
      <Dropdown
        id="enabled"
        v-model="rowData.enabled"
        :options="statuses"
        optionValue="value"
        optionLabel="label"
        placeholder="Select a Status"
        :class="{ 'p-invalid': submitted && !rowData.enabled }"
      >
        <template #option="slotProps">
          <Tag :value="getLabel(slotProps.option.value)" :severity="getStatusLabel(slotProps.option.value)" />
        </template>
      </Dropdown>
    </div>

    <div class="formgrid grid">
      <div v-if="props.name === 'F81'" class="field col">
        <label for="F_Threshold">F_Threshold</label>
        <InputNumber
          id="F_Threshold"
          :minFractionDigits="0"
          :maxFractionDigits="5"
          v-model="rowData.F_Threshold"
          :class="{ 'p-invalid': submitted && !rowData.F_Threshold }"
        />
      </div>
      <div v-else class="field col">
        <label for="V_Threshold">V Threshold</label>
        <InputNumber
          id="V_Threshold"
          v-model="rowData.V_Threshold"
          :minFractionDigits="0"
          :maxFractionDigits="5"
          :class="{ 'p-invalid': submitted && !rowData.V_Threshold }"
        />
      </div>
      <div class="field col">
        <label for="T_Delay">Time Delay</label>
        <InputNumber
          id="T_Delay"
          v-model="rowData.T_Delay"
          integeronly
          :minFractionDigits="0"
          :maxFractionDigits="5"
          :class="{ 'p-invalid': submitted && !rowData.T_Delay }"
        />
      </div>
    </div>
    <div class="field">
      <label for="trips" class="mb-3">Trips</label>
      <Dropdown
        v-model="rowData.Trip"
        :options="listContingencies"
        optionLabel="name"
        optionValue="_id"
        placeholder="Select a Contingencies"
      ></Dropdown>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveRowData" />
    </template>
  </Dialog>
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';

import { ProductService } from '@/service/ProductService';
import { useDSAStore } from '@/store';
const dsaStore = useDSAStore();
const { listContingencies } = storeToRefs(dsaStore);
const confirm = useConfirm();

const props = defineProps({
  dataSetting: {
    type: Array,
    requide: true,
  },
  name: String,
});

const emits = defineEmits(['onRowEditSave', 'onDeleteRow', 'createNewRow']);

const editingRows = ref([]);
const statuses = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
]);

const dataSetting = ref(props.dataSetting);
watch(
  () => props.dataSetting,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      dataSetting.value = newValue;
    }
  },
);

onMounted(() => {});

const onRowEditSave = (event) => {
  emits('onRowEditSave', event);
};
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
const getTripLabel = (targetId) => {
  return listContingencies.value.find((item) => item._id === targetId)?.name;
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
      emits('onDeleteRow', dataCell);
    },
    reject: () => {},
  });
};

// Dialog
const submitted = ref(false);

const dialogVisible = ref(false);
// const rowData = ref({});
const openDialog = () => {
  rowData.value = {};
  submitted.value = false;
  dialogVisible.value = true;
};
const hideDialog = () => {
  submitted.value = false;
  dialogVisible.value = false;
};

const rowData = ref({
  measurement: null,
  enabled: null,
  V_Threshold: null,
});
const saveRowData = () => {
  submitted.value = true;

  const { measurement, enabled, F_Threshold, V_Threshold, T_Delay, Trip } = rowData.value;
  if (measurement && enabled != null && T_Delay && Trip && (V_Threshold || F_Threshold)) {
    emits('createNewRow', rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<template>
  <div class="card">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataProfile.Remedial"
      editMode="row"
      dataKey="gen"
      @row-edit-save="onRowEditSave"
      :pt="{
        table: { style: 'min-width: 50rem' },
      }"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List Gen</span>
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
      <Column field="name" header="Name" style="width: 15%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="optionsName"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Grid Code"
          >
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Chip :label="slotProps.data?.name" />
        </template>
      </Column>

      <Column field="level" header="Level" style="width: 15%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="optionsLevel"
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

      <Column field="solution" header="Solution" style="width: 50%">
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
    :breakpoints="{ '1199px': '45vw', '575px': '60vw' }"
    header="Row Details"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="name">Name</label>
      <Dropdown
        v-model="rowData.name"
        :options="optionsName"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a Grid Code"
      >
      </Dropdown>
    </div>
    <div class="field">
      <label for="open">Open</label>
      <Dropdown
        v-model="rowData.level"
        :options="optionsLevel"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a Status"
      />
    </div>

    <div class="field">
      <label for="solution">Solution</label>
      <InputText id="solution" v-model="rowData.solution" />
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
const { dataProfile, listContingencies, listEquipment } = storeToRefs(dsaStore);

//
const getTripLabel = (targetId) => {
  return listContingencies.value.find((item) => item._id === targetId)?.name;
};

const search = async (event, type) => {
  await dsaStore.getListEquipment(event.query, type);
};
onMounted(() => {});
const editingRows = ref([]);
const optionsLevel = ref([
  { label: 'Normal', value: 1 },
  { label: 'Abnormal', value: 2 },
  { label: 'Emergency', value: 2 },
]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataProfile.value.SSR_Gen[index] = newData;
};

const optionsName = [
  {
    label: 'Line Loading',
    value: 'Line Loading',
  },
  {
    label: 'Tranformer Loading',
    value: 'Tranformer Loading',
  },
  {
    label: 'Generator Loading',
    value: 'Generator Loading',
  },
  {
    label: 'Excitation Limiter',
    value: 'Excitation Limiter',
  },
  {
    label: 'Low/High Voltage',
    value: 'Low/High Voltage',
  },
  {
    label: 'VSA Module',
    value: 'VSA Module',
  },
  {
    label: 'TSA Module',
    value: 'TSA Module',
  },
  {
    label: 'SSR Module',
    value: 'SSR Module',
  },
];
const getLevel = (status) => {
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
      dataProfile.value.SSR_Gen = dataProfile.value.SSR_Gen.filter((item) => item.measurement !== dataCell.measurement);
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

  const requiredFields = ['name', 'level', 'solution'];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataProfile.value.Remedial.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

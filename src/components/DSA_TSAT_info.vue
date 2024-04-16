<template>
  <div class="p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataSetting.TSA_Case"
      editMode="row"
      dataKey="id"
      @row-edit-save="onRowEditSave"
      :pt="{
        table: { style: 'min-width: 50rem' },
      }"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List Case</span>
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
      <Column field="case" header="Case" style="width: 10%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="enabled" header="Status" style="width: 5%">
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
      <Column field="APD" header="APD" style="width: 8%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="APDs"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a APD"
          >
          </Dropdown>
        </template>
      </Column>
      <Column field="stop_time" header="Stop time" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="max_peak" header="Max peak" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="time_stability" header="Time stability" style="width: 10%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="num_steps" header="Num step" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="MW_scale" header="MW scale" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="gen_scale" header="Gen scale" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="load_scale" header="Load scale" style="width: 15%">
        <template #editor="{ data, field }">
          <MultiSelect
            v-model="data[field]"
            :options="listTrips"
            placeholder="Select trip"
            :maxSelectedLabels="3"
            class="w-full md:w-10rem"
          />
        </template>
        <template #body="slotProps">
          <span v-for="(item, index) in slotProps.data.load_scale.slice(0, 3)" :key="index">
            {{ item }}
            <span v-if="index === 2 && slotProps.data.load_scale.length > 3"> ...</span>
            <span v-else="index < 2 && index === slotProps.data.load_scale.length - 1">, </span>
          </span>
        </template>
      </Column>
      <Column field="lines" header="Lines" style="width: 18%">
        <template #editor="{ data, field }">
          <MultiSelect
            v-model="data[field]"
            :options="listContingencies"
            placeholder="Select Contingencies"
            :maxSelectedLabels="3"
            class="w-full md:w-10rem"
          />
        </template>
        <template #body="slotProps">
          <span v-for="(item, index) in slotProps.data.lines.slice(0, 3)" :key="index">
            {{ item }}
            <span v-if="index === 2 && slotProps.data.lines.length > 3"> ...</span>
            <span v-else="index < 2 && index === slotProps.data.lines.length - 1">, </span>
          </span>
        </template>
      </Column>
      <Column :rowEditor="true" style="width: 2%" bodyStyle="text-align:center"></Column>
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
      <label for="case">Case</label>
      <InputText
        id="case"
        v-model.trim="rowData.case"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !rowData.case }"
      />
      <small class="p-error" v-if="submitted && !rowData.case">Case is required.</small>
    </div>
    <div class="formgrid grid">
      <div class="field col">
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
      <div class="field col">
        <label for="APD" class="mb-3">APD</label>
        <Dropdown
          id="APD"
          v-model="rowData.APD"
          :options="APDs"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a APD"
          :class="{ 'p-invalid': submitted && !rowData.APD }"
        >
        </Dropdown>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="stop_time">Stop time</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="stop_time"
          v-model="rowData.stop_time"
          :class="{ 'p-invalid': submitted && !rowData.stop_time }"
        />
      </div>
      <div class="field col">
        <label for="max_peak">Max peak</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="max_peak"
          v-model="rowData.max_peak"
          :class="{ 'p-invalid': submitted && !rowData.max_peak }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="time_stability">Time stability</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="time_stability"
          v-model="rowData.time_stability"
          :class="{ 'p-invalid': submitted && !rowData.time_stability }"
        />
      </div>
      <div class="field col">
        <label for="num_steps">Num steps</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="num_steps"
          v-model="rowData.num_steps"
          :class="{ 'p-invalid': submitted && !rowData.num_steps }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="MW_scale">MW scale</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="MW_scale"
          v-model="rowData.MW_scale"
          :class="{ 'p-invalid': submitted && !rowData.MW_scale }"
        />
      </div>
      <div class="field col">
        <label for="gen_scale">Gen scale</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="gen_scale"
          v-model="rowData.gen_scale"
          :class="{ 'p-invalid': submitted && !rowData.gen_scale }"
        />
      </div>
    </div>
    <div class="field">
      <label for="load_scale" class="mb-3">Load scale</label>
      <MultiSelect
        v-model="rowData.load_scale"
        :options="listContingencies"
        placeholder="Select Contingencies"
        :maxSelectedLabels="3"
        class="w-full"
        :class="{ 'p-invalid': submitted && !rowData.load_scale }"
      />
    </div>
    <div class="field">
      <label for="lines" class="mb-3">Lines</label>
      <MultiSelect
        v-model="rowData.lines"
        :options="listTrips"
        placeholder="Select Trip"
        :maxSelectedLabels="3"
        class="w-full"
        :class="{ 'p-invalid': submitted && !rowData.lines }"
      />
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveRowData" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useDSAStore } from '@/store';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
const dsaStore = useDSAStore();
const { dataSetting } = storeToRefs(dsaStore);

const listContingencies = ref([]);
const listTrips = ref([]);

onMounted(() => {
  ProductService.getListTrip().then((data) => (listTrips.value = data));
  ProductService.getListContingencies().then((data) => (listContingencies.value = data));
});
const editingRows = ref([]);
const statuses = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
]);

const APDs = ref([
  { label: 'Rated', value: 'rated' },
  { label: 'Rransmit Capacity', value: 'cap' },
  { label: 'Merit Order', value: 'mo' },
  { label: 'User', value: 'user' },
]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataSetting.value.TSA_Case[index] = newData;
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
      dataSetting.value.TSA_Case = dataSetting.value.TSA_Case.filter(
        (item) => item.measurement !== dataCell.measurement,
      );
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
  const requiredFields = [
    'case',
    'stop_time',
    'max_peak',
    'time_stability',
    'load_scale',
    'MW_scale',
    'num_steps',
    'Td0_sub',
    'gen_scale',
    'lines',
    'APD',
  ];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataSetting.value.TSA_Case.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

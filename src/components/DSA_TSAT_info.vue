<template>
  <div class="p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="dataProfile.TSA_Case"
      editMode="row"
      dataKey="mon"
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
      <Column field="stop_time" header="Stop time" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="load_scale_pos" header="Load Pos" style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.load_scale_pos" severity="secondary" />
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listArea"
            optionLabel="name"
            optionValue="name"
            placeholder="Select a Area"
          >
          </Dropdown>
        </template>
      </Column>
      <Column field="gen_scale_pos" header="Gen Pos" style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.gen_scale_pos" severity="secondary" />
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listArea"
            optionLabel="name"
            optionValue="name"
            placeholder="Select a Area"
          >
          </Dropdown>
        </template>
      </Column>

      <Column field="MW_max_pos" header="MW Max Pos" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="load_scale_neg" header="Load Neg" style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.load_scale_neg" severity="secondary" />
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listArea"
            optionLabel="name"
            optionValue="name"
            placeholder="Select a Area"
          >
          </Dropdown>
        </template>
      </Column>
      <Column field="gen_scale_neg" header="Gen Neg" style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.gen_scale_neg" severity="secondary" />
        </template>
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listArea"
            optionLabel="name"
            optionValue="name"
            placeholder="Select a Area"
          >
          </Dropdown>
        </template>
      </Column>
      <Column field="MW_max_neg" header="MW Max Neg" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="MW_step" header="MW_step" style="width: 8%">
        <template #editor="{ data, field }">
          <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
        </template>
      </Column>
      <Column field="disturbances" header="Disturbances" style="width: 10%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="listDisturbances"
            optionLabel="name"
            optionValue="_id"
            placeholder="Select a disturbances"
          >
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Chip :label="getDisturbancesLabel(slotProps.data?.disturbances)" />
        </template>
      </Column>
      <Column field="contingencies" header="Contingencies" style="width: 10%">
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
          <Chip :label="getContingenciesLabel(slotProps.data?.contingencies)" />
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
      <label for="case">Monitor</label>
      <Dropdown
        v-model="rowData.mon_id"
        :options="listMonitor"
        optionLabel="name"
        optionValue="name"
        placeholder="Select a Monitor"
      >
      </Dropdown>
      <small class="p-error" v-if="submitted && !rowData.case">Case is required.</small>
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
        <label for="time_stability">MW Step</label>
        <InputNumber
          id="time_stability"
          v-model="rowData.MW_step"
          :class="{ 'p-invalid': submitted && !rowData.MW_step }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="MW_max_pos">MW Max Pos</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="MW_scale"
          v-model="rowData.MW_max_pos"
          :class="{ 'p-invalid': submitted && !rowData.MW_scale }"
        />
      </div>
      <div class="field col">
        <label for="MW_max_pos">MW Max Neg</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="MW_scale"
          v-model="rowData.MW_max_neg"
          :class="{ 'p-invalid': submitted && !rowData.MW_scale }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="gen_scale">Gen scale Pos</label>
        <Dropdown
          v-model="rowData.gen_scale_pos"
          :options="listArea"
          optionLabel="name"
          optionValue="name"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
      <div class="field col">
        <label for="load_scale">Load scale Pos</label>
        <Dropdown
          v-model="rowData.load_scale_pos"
          :options="listArea"
          optionLabel="name"
          optionValue="name"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <label for="gen_scale">Gen scale Neg</label>
        <Dropdown
          v-model="rowData.gen_scale_neg"
          :options="listArea"
          optionLabel="name"
          optionValue="name"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
      <div class="field col">
        <label for="load_scale">Load scale Neg</label>
        <Dropdown
          v-model="rowData.load_scale_neg"
          :options="listArea"
          optionLabel="name"
          optionValue="name"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="Contingencies"> Contingencies</label>
        <Dropdown
          id="Contingencies"
          v-model="rowData.contingencies"
          :options="listContingencies"
          optionLabel="name"
          optionValue="_id"
          placeholder="Select a Contingencies"
        ></Dropdown>
      </div>
      <div class="field col">
        <label for="Disturbances"> Disturbances</label>
        <Dropdown
          id="Disturbances"
          v-model="rowData.disturbances"
          :options="listDisturbances"
          optionLabel="name"
          optionValue="_id"
          placeholder="Select a Disturbances"
        ></Dropdown>
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
const { dataProfile, listArea, listMonitor, listContingencies, listDisturbances } = storeToRefs(dsaStore);

const editingRows = ref([]);

const getContingenciesLabel = (targetId) => {
  return listContingencies.value.find((item) => item._id === targetId)?.name;
};

const getDisturbancesLabel = (targetId) => {
  return listDisturbances.value.find((item) => item._id === targetId)?.name;
};
//
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataProfile.value.TSA_Case[index] = newData;
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
      dataProfile.value.TSA_Case = dataProfile.value.TSA_Case.filter(
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
    'mon_id',
    'stop_time',
    'max_peak',
    'time_stability',
    'gen_scale_pos',
    'load_scale_pos',
    'MW_max_pos',
    'MW_max_neg',
    'gen_scale_neg',
    'load_scale_neg',
  ];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataProfile.value.TSA_Case.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

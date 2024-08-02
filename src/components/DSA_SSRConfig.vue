<template>
  <div class="card">
    <Fieldset :toggleable="true">
      <template #legend>
        <div class="flex align-items-center pl-1">
          <i class="pi pi-cog"></i>
          <span class="font-bold">Common Setting</span>
        </div>
      </template>
      <div class="flex flex-wrap gap-6 p-fluid">
        <div class="flex-auto">
          <label for="fmin" class="font-bold block mb-2"> fmin </label>
          <InputNumber v-model="dataProfile.SSR_setting.f_min" inputId="fmin" suffix=" Hz" />
        </div>
        <div class="flex-auto">
          <label for="fmax" class="font-bold block mb-2"> fmax </label>
          <InputNumber v-model="dataProfile.SSR_setting.f_max" inputId="fmax" suffix=" Hz" />
        </div>
        <div class="flex-auto">
          <label for="step" class="font-bold block mb-2"> step </label>
          <InputNumber
            v-model="dataProfile.SSR_setting.step"
            inputId="step"
            :minFractionDigits="0"
            :maxFractionDigits="5"
          />
        </div>
      </div>
    </Fieldset>
    <Fieldset :toggleable="true">
      <template #legend>
        <div class="flex align-items-center pl-1">
          <i class="pi pi-list"></i>
          <span class="font-bold"> Gen table</span>
        </div>
      </template>
      <div class="p-fluid">
        <DataTable
          v-model:editingRows="editingRows"
          :value="dataProfile.SSR_Gen"
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
          <Column field="gen" header="Gen" style="width: 10%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.gen" severity="secondary" />
            </template>
            <template #editor="{ data, field }">
              <AutoComplete
                v-model="data[field]"
                completeOnFocus
                :suggestions="listEquipment"
                @complete="search($event, 'gen')"
              />
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

          <Column field="f" header="f" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>

          <Column field="dmin" header="dmin" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="dmax" header="dmax" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="MVA_Gen" header="MVA_Gen" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Xd_sub" header="Xd_Sub" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Xq_sub" header="Xq_Sub" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Td0_sub" header="Td0_Sub" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Tq0_sub" header="Tq0_Sub" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Rgen" header="Rgen" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
            </template>
          </Column>
          <Column field="Xgen" header="Xgen" style="width: 7%">
            <template #editor="{ data, field }">
              <InputNumber :minFractionDigits="0" :maxFractionDigits="5" v-model="data[field]" />
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
              <Chip :label="getTripLabel(slotProps.data?.contingencies)" />
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
    </Fieldset>
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
      <label for="gen">Gen</label>
      <AutoComplete
        v-model="rowData.gen"
        completeOnFocus
        :suggestions="listEquipment"
        @complete="search($event, 'gen')"
      />

      <small class="p-error" v-if="submitted && !rowData.gen">Measurement is required.</small>
    </div>
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

    <div class="formgrid grid">
      <div class="field col">
        <label for="dmin">dmin</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="dmin"
          v-model="rowData.dmin"
          :class="{ 'p-invalid': submitted && !rowData.dmin }"
        />
      </div>
      <div class="field col">
        <label for="dmax">dmax</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="dmax"
          v-model="rowData.dmax"
          :class="{ 'p-invalid': submitted && !rowData.dmax }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="MVA_Gen">MVA_Gen</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="MVA_Gen"
          v-model="rowData.MVA_Gen"
          :class="{ 'p-invalid': submitted && !rowData.MVA_Gen }"
        />
      </div>
      <div class="field col">
        <label for="f">f</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="f"
          v-model="rowData.f"
          :class="{ 'p-invalid': submitted && !rowData.f }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="Xd_sub">Xd_sub</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Xd_sub"
          v-model="rowData.Xd_sub"
          :class="{ 'p-invalid': submitted && !rowData.Xd_sub }"
        />
      </div>
      <div class="field col">
        <label for="Xq_sub">Xq_sub</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Xq_sub"
          v-model="rowData.Xq_sub"
          :class="{ 'p-invalid': submitted && !rowData.Xq_sub }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="Td0_sub">Td0_sub</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Td0_sub"
          v-model="rowData.Td0_sub"
          :class="{ 'p-invalid': submitted && !rowData.Td0_sub }"
        />
      </div>
      <div class="field col">
        <label for="Tq0_sub">Tq0_sub</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Tq0_sub"
          v-model="rowData.Tq0_sub"
          :class="{ 'p-invalid': submitted && !rowData.Tq0_sub }"
        />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label for="Rgen">Rgen</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Rgen"
          v-model="rowData.Rgen"
          :class="{ 'p-invalid': submitted && !rowData.Rgen }"
        />
      </div>
      <div class="field col">
        <label for="Xgen">Xgen</label>
        <InputNumber
          :minFractionDigits="0"
          :maxFractionDigits="5"
          id="Xgen"
          v-model="rowData.Xgen"
          :class="{ 'p-invalid': submitted && !rowData.Xgen }"
        />
      </div>
    </div>
    <div class="field">
      <label for="Contingencies" class="mb-3">Contingencies</label>
      <Dropdown
        v-model="rowData.contingencies"
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
const statuses = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  dataProfile.value.SSR_Gen[index] = newData;
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

  const requiredFields = [
    'gen',
    'enabled',
    'MVA_Gen',
    'f',
    'dmax',
    'dmin',
    'Xd_sub',
    'Xq_sub',
    'Td0_sub',
    'Rgen',
    'Xgen',
    'contingencies',
  ];

  const isValid = requiredFields.every((field) => rowData.value[field] != null);
  if (isValid) {
    dataProfile.value.SSR_Gen.push(rowData.value);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

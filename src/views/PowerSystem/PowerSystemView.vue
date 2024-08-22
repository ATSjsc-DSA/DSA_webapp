<template>
  <div class="card layout-content">
    totalList:{{ totalList }}

    <DataTable
      :value="powersystemData"
      paginator
      :rows="10"
      :totalRecords="totalList"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :rowClass="rowClass"
      :lazy="true"
      @page="onPageChange"
      :sortOrder="1"
      rowHover
    >
      <template #header>
        <div class="flex flex-wrap justify-content-end gap-2">
          <Button severity="secondary" text icon="pi pi-download" label="Download" @click="downloadFile()" />
          <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadTemplate" />
          <Button text icon="pi pi-plus" label="Create" @click="createVisibleDialog = true" />
        </div>
      </template>
      <template #body="{ field, data }">
        <div class="bg-red-300">{{ field }}</div>
        <div class="bg-green-300">{{ data }}</div>
      </template>

      <Column field="generalInfo.name" header="Name" style="width: 15%"></Column>
      <Column field="generalInfo.emsName" header="Ems Name" style="width: 15%"></Column>
      <Column field="generalInfo.emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
      <Column field="generalInfo.operationName" header="Operation Name" style="width: 15%"></Column>
      <Column field="generalInfo.softwareName" header="Software Name" style="width: 15%"></Column>
      <Column field="scadaInfo.scadaName" header="Scada Name" style="width: 15%"> </Column>

      <Column style="width: 1%; min-width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPSE(slotProps.data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- create dialog data -->
    <Dialog v-model:visible="createVisibleDialog" :style="{ width: '28rem' }" header="Create New " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Power Systwem</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">Power Systwem information.</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.generalInfo.name" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.generalInfo.emsName" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.generalInfo.emsUniqueId" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.generalInfo.operationName" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.generalInfo.softwareName" />
      </div>
      <span class="p-text-secondary block mt-5 mb-3">Scada information</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Scada Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.scadaInfo.scadaName" />
      </div>

      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
        <Button type="button" label="Submit" @click="createPS()"></Button>
      </template>
    </Dialog>

    <!-- Edit dialog data -->
    <Dialog v-model:visible="editVisibleDialog" :style="{ width: '28rem' }" header="Edit " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Update Power Systwem</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">Power Systwem information.</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.name" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.emsName" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.emsUniqueId" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.operationName" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.softwareName" />
      </div>
      <span class="p-text-secondary block mt-5 mb-3">Scada information</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="areaname" class="font-semibold w-12rem"> Scada Name</label>
        <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.scadaInfo.scadaName" />
      </div>

      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
        <Button type="button" label="Submit" @click="editPSE()"></Button>
      </template>
    </Dialog>

    <!-- Delete dialog data -->
    <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '28rem' }" header="Delete " :modal="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">Delete Power Systwem</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">Power Systwem information.</span>

      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Name</label>
        <InputText
          id="areaname"
          v-model="pseDelete.generalInfo.name"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>
      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
        <InputText
          id="areaname"
          v-model="pseDelete.generalInfo.emsName"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>
      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
        <InputText
          id="areaname"
          v-model="pseDelete.generalInfo.emsUniqueId"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>
      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
        <InputText
          id="areaname"
          v-model="pseDelete.generalInfo.operationName"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>
      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
        <InputText
          id="areaname"
          v-model="pseDelete.generalInfo.softwareName"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>
      <span class="p-text-secondary block mt-5 mb-3">Scada information</span>

      <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
        <label for="areaname" class="font-semibold w-12rem"> Scada Name</label>
        <InputText
          id="areaname"
          v-model="pseDelete.scadaInfo.scadaName"
          class="flex-auto"
          readonly="true"
          autocomplete="off"
        />
      </div>

      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="deleteVisibleDialog = false"></Button>
        <Button type="button" label="Submit" @click="deletePSE()"></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { projectId, psm_automatic, psm_active, psmList } = storeToRefs(commonStore);
const toast = useToast();

const listPSD = ref([]);
const totalList = ref(0);
const currentPage = ref(1);
const powersystemData = ref([]);
const powersystemCompareData = ref();

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getPSDEdit();
};

onMounted(() => {
  getPSDEdit();
});

const getPSDEdit = async () => {
  try {
    const res = await api.getPSDEdit({ page: currentPage.value });
    powersystemData.value = res.data[0];
    totalList.value = powersystemData.value.length;
  } catch (error) {
    console.log('getPSDEdit: error ', error);
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getComparePSD = async () => {
  try {
    const res = await api.getComparePSD();
    powersystemCompareData.value = res.data;
  } catch (error) {
    console.log('getComparePSD: error ', error);

    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: JSON.stringify(error), life: 3000 });
  }
};

// create
const createVisibleDialog = ref(false);
const psCreate = reactive({
  generalInfo: {
    name: 'test',
    emsName: 'test',
    emsUniqueId: 'test',
    operationName: 'test',
    softwareName: 'test',
  },
  scadaInfo: {
    scadaName: 'test',
  },
});

const createPS = async () => {
  try {
    const res = await api.createPS(psCreate);
    powersystemData.value.push(res.data);
    totalList.value = totalList.value + 1;
    createVisibleDialog.value = false;
  } catch (error) {
    console.log('handleCreatePS: error ', error);
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

// Edit
const editVisibleDialog = ref(false);
const pseEdit = ref({});
const handleEditPSE = (pseData) => {
  pseEdit.value = pseData;
  editVisibleDialog.value = true;
};

const editPSE = async () => {
  try {
    await api.editPSE(pseEdit.value);
    editVisibleDialog.value = false;
  } catch (error) {
    console.log('editPS: error ', error);
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: JSON.stringify(error), life: 3000 });
  }
};

// Delete
const deleteVisibleDialog = ref(false);
const pseDelete = ref({});
const handleDeletePSE = (pseData) => {
  pseDelete.value = pseData;
  deleteVisibleDialog.value = true;
};

const deletePSE = async () => {
  try {
    const res = await api.deletePSE(pseDelete.value._id);
    deleteVisibleDialog.value = false;
  } catch (error) {
    console.log('deletePSE: error ', error);
    // toast.add({ severity: 'error', summary: 'Error Message', detail: JSON.stringify(error), life: 3000 });
  }
};
</script>

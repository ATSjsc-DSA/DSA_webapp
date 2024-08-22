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

      <Column field="generalInfo.name" header="Name" style="width: 15%"> </Column>
      <Column field="generalInfo.emsName" header="Ems Name" style="width: 15%"> </Column>
      <Column field="generalInfo.emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
      <Column field="generalInfo.operationName" header="Operation Name" style="width: 15%"> </Column>
      <Column field="generalInfo.softwareName" header="Software Name" style="width: 15%"> </Column>
      <Column field="scadaInfo.scadaName" header="Scada Name" style="width: 15%"> </Column>

      <Column style="width: 1%; min-width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil            " severity="success" text rounded />
            <Button icon="pi pi-trash" severity="danger" text rounded />
            <Button icon="pi pi-caret-right" text rounded />
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
        <Button type="button" label="Submit" @click="handleCreatePS()"></Button>
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

const listPSD = ref([]);
const totalList = ref(0);
const currentPage = ref(1);
const powersystemData = ref();
const powersystemCompareData = ref();

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getComparePSD();
};

onMounted(() => {
  getComparePSD();
});

const getPSD = async () => {
  try {
    const res = await api.getPSD({ page: currentPage.value });
    powersystemData.value = res.data[0];
    totalList.value = res.data[1];
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getComparePSD = async () => {
  try {
    getPSD();
    const res = await api.getComparePSD();
    powersystemCompareData.value = res.data;
    if (res.data['Add'].length > 0) {
      powersystemData.value = powersystemData.value.concat(res.data['Add']);
      totalList.value = powersystemData.value.length;
    }
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
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

const handleCreatePS = async () => {
  try {
    await api.createPS(psCreate);
    getComparePSD();
    createVisibleDialog.value = false;
  } catch (error) {
    console.log('handleCreatePS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

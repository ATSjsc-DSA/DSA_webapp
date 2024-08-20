<template>
  <div class="card layout-content">
    <DataTable
      :value="listPSD"
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
          <Button text icon="pi pi-plus" label="Create" @click="handleCreateDevice" />
        </div>
      </template>

      <Column field="name" header="Name" style="width: 15%"> </Column>
      <Column field="emsName" header="Ems Name" style="width: 15%"> </Column>
      <Column field="emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
      <Column field="operationName" header="Operation Name" style="width: 15%"> </Column>
      <Column field="softwareName" header="Software Name" style="width: 15%"> </Column>

      <Column style="width: 1%; min-width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-content-between">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="deleteProject($event, slotProps.data._id)"
            />

            <Button icon="pi pi-caret-right" text rounded @click="runProject(slotProps.data._id)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';
import { useCommonStore } from '@/store';
const listPSD = ref([]);
const totalList = ref(0);
const currentPage = ref(1);
const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getListPSD();
};
onMounted(() => {
  getListPSD();
});

const getListPSD = async () => {
  try {
    const res = await api.getProjectList({ page: currentPage.value });
    listProject.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

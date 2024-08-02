<template>
  <div class="card h-full relative layout-content">
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>
    <listShowSpiliter
      type="monitor"
      :listDatatree="listMonitor"
      @deleteDevice="deleteMonitor"
      @createDevice="createMonitor"
      @downloadFile="downloadFileCon"
      @uploadFile="uploadMonitor"
      @removeDataOnDevice="removeDataOnDevice"
      @addDataOnDevice="addDataOnContingenciesGroup"
      @onHideDataOnDeviceDialog="onHideDataOnContingenciesGroupDialog"
      v-model:createDataOnDeviceDialog="createDataOnMonitor"
      v-model:deleteVisibleDialog="deleteMonitorDialog"
      v-model:createVisibleDialog="createMonitorDialog"
    ></listShowSpiliter>
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
  </div>
  <!-- upload -->
  <Dialog
    v-model:visible="uploadDialog"
    @hide="onHideUploadDialog"
    :style="{ width: '50rem' }"
    header="Upload File"
    :modal="true"
  >
    <uploadFileConfig @uploadFile="uploadFile"></uploadFileConfig>
  </Dialog>
  <Toast></Toast>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DSA_api from '@/api/dsa_api';
import uploadFileConfig from '../components/uploadFileConfig.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import listShowSpiliter from '@/components/listShowSplitter.vue';
import DSA_Common from '@/combosables/DSA_common';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';

const { downloadFile } = DSA_Common();

const items = ref([{ label: 'Branch Monitoring', route: '/DSA/Monitor' }]);

const progressSpinnerModal = ref(false);
const toast = useToast();

const listMonitor = ref();
const createDataOnMonitor = ref(false);
const deleteMonitorDialog = ref(false);
const createMonitorDialog = ref(false);
const uploadDialog = ref(false);
// onMounted and onUnMouted
onMounted(async () => {
  await getMonitor();
});
// apiMethod

const getMonitor = async () => {
  try {
    const res = await DSA_api.getMonitor();
    const convertedData = res.data.map((monitor) => ({
      ...monitor,
      branches_name: initializeData(monitor.branches_name),
    }));
    listMonitor.value = convertedData;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const initializeData = (dataArray) => {
  return dataArray.map((item) => ({ name: item.name, direction: item.direction, selected: false }));
};

const deleteMonitor = async (id) => {
  try {
    progressSpinnerModal.value = true;
    await DSA_api.deleteMonitor(id);
    await getMonitor();
    deleteMonitorDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const createMonitor = async (nameData) => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: nameData,
    };
    await DSA_api.createMonitor(formData);
    await getMonitor();
    createMonitorDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const downloadFileCon = () => downloadFile(DSA_api.downloadFileMonitor, 'Mon_List.csv');

const uploadMonitor = () => {
  uploadDialog.value = true;
};

const uploadFile = async (formData, callback) => {
  try {
    await DSA_api.putMonFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHideUploadDialog = () => {
  getMonitor();
};

const onHideDataOnContingenciesGroupDialog = () => {
  getMonitor();
  createMonitor.value = false;
};

const removeDataOnDevice = async (id, loadListData) => {
  try {
    await DSA_api.RemoveDataMonitor(id, {
      branches_name: loadListData,
    });

    getMonitor();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const addDataOnContingenciesGroup = async (id, name, type, dict) => {
  try {
    let dataLoad = {
      branches_name: [
        {
          name: name,
          direction: dict,
        },
      ],
    };

    await DSA_api.AddDataMonitor(id, dataLoad);
    getMonitor();

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

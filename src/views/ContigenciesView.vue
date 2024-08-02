<template>
  <div class="card h-full relative layout-content">
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>

    <listShowSpiliter
      type="contigencies"
      :listDatatree="listContingenciesGroup"
      @deleteDevice="deleteContingenciesGroup"
      @createDevice="createContingenciesGroup"
      @downloadFile="downloadFileCon"
      @uploadFile="uploadContingenciesGroup"
      @removeDataOnDevice="removeDataOnDevice"
      @addDataOnDevice="addDataOnContingenciesGroup"
      @onHideDataOnDeviceDialog="onHideDataOnContingenciesGroupDialog"
      v-model:createDataOnDeviceDialog="createDataOnContingenciesGroupDialog"
      v-model:deleteVisibleDialog="deleteContingenciesGroupDialog"
      v-model:createVisibleDialog="createContingenciesGroupDialog"
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
import { useDSAStore } from '@/store';
import listShowSpiliter from '@/components/listShowSplitter.vue';
import DSA_Common from '@/combosables/DSA_common';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';

const { downloadFile } = DSA_Common();

const dsaStore = useDSAStore();
const { listGen, listLoad, listBranch, totalSizeGen, totalSizeLoad, totalSizeBranch, listContingencies } =
  storeToRefs(dsaStore);

const progressSpinnerModal = ref(false);
const toast = useToast();

const listContingenciesGroup = ref();
const createDataOnContingenciesGroupDialog = ref(false);
const deleteContingenciesGroupDialog = ref(false);
const createContingenciesGroupDialog = ref(false);
const uploadDialog = ref(false);
// onMounted and onUnMouted
onMounted(async () => {
  await getGroupContingencies();
});
const items = ref([{ label: 'System Events' }, { label: 'Contingencies', route: '/DSA/SystemEvents/Contingencies' }]);

// apiMethod
//
const getGroupContingencies = async () => {
  try {
    const res = await DSA_api.getContingencies();
    console.log(res, 'ress');
    const convertedData = res.data.map((GroupContingencies) => ({
      ...GroupContingencies,
      equips_name: initializeData(GroupContingencies.equips_name),
    }));
    listContingenciesGroup.value = convertedData;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const initializeData = (dataArray) => {
  return dataArray.map((item) => ({ name: item, selected: false }));
};

const deleteContingenciesGroup = async (id) => {
  try {
    progressSpinnerModal.value = true;
    await DSA_api.deleteContingencies(id);
    await getGroupContingencies();
    deleteContingenciesGroupDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const createContingenciesGroup = async (nameData) => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: nameData,
    };
    await DSA_api.createContingencies(formData);
    await getGroupContingencies();
    createContingenciesGroupDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const downloadFileCon = () => downloadFile(DSA_api.downloadFileCon, 'Con_List.csv');

const uploadContingenciesGroup = () => {
  uploadDialog.value = true;
};

const uploadFile = async (formData, callback) => {
  try {
    await DSA_api.putConFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHideUploadDialog = () => {
  getGroupContingencies();
};

const onHideDataOnContingenciesGroupDialog = () => {
  getGroupContingencies();
  createContingenciesGroup.value = false;
};

const removeDataOnDevice = async (id, loadListData) => {
  try {
    await DSA_api.RemoveDataContingencies(id, {
      equips_name: loadListData,
    });

    getGroupContingencies();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const addDataOnContingenciesGroup = async (id, name) => {
  try {
    let dataLoad = {
      equips_name: [name],
    };

    await DSA_api.AddDataContingencies(id, dataLoad);
    getGroupContingencies();

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

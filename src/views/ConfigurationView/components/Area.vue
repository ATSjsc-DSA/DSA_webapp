<template>
  <div class="h-full relative layout-content w-full">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <listShowSpiliter
      :listDatatree="listArea"
      :dataSelect="dataSelect"
      @getDataSelect="getAreaData"
      @deleteDevice="deleteArea"
      @createDevice="createArea"
      @downloadFile="downloadFile"
      @uploadFile="uploadArea"
      @removeDataOnDevice="removeDataOnDevice"
      @addDataOnDevice="addDataOnArea"
      @onHideDataOnDeviceDialog="onHideDataOnAreaDialog"
      v-model:createDataOnDeviceDialog="createDataOnAreaDialog"
      v-model:deleteVisibleDialog="deleteAreaDialog"
      v-model:createVisibleDialog="createAreaDialog"
    ></listShowSpiliter>
  </div>

  <!-- upload file  -->
  <Dialog v-model:visible="uploadDialog" @hide="onHide" :style="{ width: '50rem' }" header="" :modal="true">
    <TabView>
      <TabPanel header="Gen File Upload">
        <uploadFileConfig @uploadFile="uploadGenFile"></uploadFileConfig>
      </TabPanel>
      <TabPanel header="Load File Upload">
        <uploadFileConfig @uploadFile="uploadLoadFile"></uploadFileConfig>
      </TabPanel>
      <TabPanel header="Branch File Upload">
        <uploadFileConfig @uploadFile="uploadBranchFile"></uploadFileConfig>
      </TabPanel>
    </TabView>
  </Dialog>

  <Toast />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DSA_api from '@/api/dsa_api';
import uploadFileConfig from '@/components/uploadFileConfig.vue';
import ListOnArea from '@/components/ListOnArea.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useDSAStore } from '@/store';
import listShowSpiliter from '@/components/listShowSplitter.vue';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';
import api from '../api';

const dsaStore = useDSAStore();
const { listGen, listLoad, listBranch, totalSizeGen, totalSizeLoad, totalSizeBranch, listContingencies } =
  storeToRefs(dsaStore);

const progressSpinnerModal = ref(false);
const listArea = ref();
const dataSelect = ref();
const expandedRows = ref({});
const toast = useToast();
const deleteAreaDialog = ref(false);
const idAreaActiveDelete = ref({});
const uploadDialog = ref(false);
const createAreaDialog = ref(false);
const createDataOnAreaDialog = ref(false);

onMounted(async () => {
  cleanup();
  await getListArea();
  dsaStore.getListGen();
  dsaStore.getListLoad();
  dsaStore.getListBranch();
});

onBeforeUnmount(() => {
  cleanup();
});

const itemsArea = ref([{ label: 'Data Initialize', route: '/DSA/Initialize' }]);

const cleanup = () => {
  //   progressSpinnerModal.value = false;
  //   listArea.value = [];
  //   expandedRows.value = {};
  //   deleteAreaDialog.value = false;
  //   idAreaActiveDelete.value = {};
  //   uploadDialog.value = false;
  //   createAreaDialog.value = false;
  //   createDataOnAreaDialog.value = false;
  //   areaNameCreate.value = '';
  //   listGen.value = [];
  //   listLoad.value = [];
  //   listBranch.value = [];
  //   area_id.value = '';
};
// get list area
const getListArea = async () => {
  try {
    const res = await api.getListArea();
    listArea.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// get detail area
const getAreaData = async (area) => {
  console.log(area, 'area');

  try {
    const res = await api.getDetailArea(area.name);
    dataSelect.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const deleteArea = async (id) => {
  try {
    progressSpinnerModal.value = true;
    await DSA_api.deleteArea(id);
    await getArea();
    deleteAreaDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//

const uploadArea = () => {
  uploadDialog.value = true;
};

const createArea = async (nameData) => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: nameData,
    };
    await DSA_api.createArea(formData);
    await getArea();
    createAreaDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHide = () => {
  getArea();
};

//get Data list
const initializeData = (dataArray) => {
  return dataArray.map((item) => ({ name: item, selected: false }));
};

// add Data on Area
const addDataOnArea = async (id, name, type) => {
  try {
    let dataLoad = {
      gens_name: [name],
    };
    if (type !== 'gen') {
      dataLoad = {
        loads_name: [name],
      };
    }
    await DSA_api.AddDataArea(id, dataLoad);

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHideDataOnAreaDialog = () => {
  getArea();
  createDataOnAreaDialog.value = false;
};

// Remove data on Area
const removeDataOnDevice = (id, dataList, type) => {
  if (type === 'gen') {
    removeGenOnArea(id, dataList);
  } else {
    removeLoadOnArea(id, dataList);
  }
};

const removeGenOnArea = async (id_Area, genlistArea) => {
  try {
    await DSA_api.RemoveDataArea(id_Area, {
      gens_name: genlistArea,
    });

    getArea();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const removeLoadOnArea = async (id_Area, loadlistArea) => {
  try {
    await DSA_api.RemoveDataArea(id_Area, {
      loads_name: loadlistArea,
    });

    getArea();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style scoped>
.values-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; /* Khoảng cách giữa các mục danh sách */
  list-style-type: none; /* Loại bỏ dấu chấm đầu dòng của danh sách */
  padding: 0;
  margin: 0;
}

.values-list li {
  background-color: var(--surface-ground); /* Màu nền */
  padding: 0.5rem; /* Khoảng cách bên trong mục */
  border-radius: 5px; /* Bo góc */
  text-align: center; /* Căn giữa văn bản */
}
.values-list li:hover {
  cursor: pointer;
}
.values-list li.selected {
  background-color: var(--highlight-bg); /* Màu nền */
}
.custom-tabview {
  /* flex: 1; */
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <TabView class="custom-tabview">
      <TabPanel header="Gen List">
        <ListOnArea
          :listData="listGen"
          :total="totalSizeGen"
          @getData="getListGenHandle"
          @deleteData="deleteGen"
          @deleteDatas="deleteGen"
          @createData="createGen"
        ></ListOnArea>
      </TabPanel>
      <TabPanel header="Load List">
        <ListOnArea
          :listData="listLoad"
          :total="totalSizeLoad"
          @getData="getListLoadHandle"
          @deleteData="deleteLoad"
          @deleteDatas="deleteLoad"
          @createData="createLoad"
        >
        </ListOnArea>
      </TabPanel>
      <TabPanel header="Branch List">
        <ListOnArea
          :listData="listBranch"
          :total="totalSizeBranch"
          @getData="getListBranchHandle"
          @deleteData="deleteBranch"
          @deleteDatas="deleteBranch"
          @createData="createBranch"
        ></ListOnArea>
      </TabPanel>
      <TabPanel header="Area">
        <listShowSpiliter
          :listDatatree="listArea"
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
      </TabPanel>
      <TabPanel header="Monitor">
        <BranchMoniterView></BranchMoniterView>
      </TabPanel>
      <TabPanel header="Contingencies">
        <ContigenciesView></ContigenciesView>
      </TabPanel>
    </TabView>
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
import uploadFileConfig from '../components/uploadFileConfig.vue';
import ListOnArea from '@/components/ListOnArea.vue';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useDSAStore } from '@/store';
import listShowSpiliter from '@/components/listShowSplitter.vue';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';
import BranchMoniterView from './BranchMoniterView.vue';
import ContigenciesView from './ContigenciesView.vue';
const dsaStore = useDSAStore();
const { listGen, listLoad, listBranch, totalSizeGen, totalSizeLoad, totalSizeBranch, listContingencies } =
  storeToRefs(dsaStore);

const progressSpinnerModal = ref(false);
const listArea = ref();
const expandedRows = ref({});
const toast = useToast();
const deleteAreaDialog = ref(false);
const idAreaActiveDelete = ref({});
const uploadDialog = ref(false);
const createAreaDialog = ref(false);
const createDataOnAreaDialog = ref(false);

onMounted(async () => {
  cleanup();
  await getArea();
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
//upload
const uploadGenFile = async (formData, callback) => {
  try {
    await DSA_api.putGenFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const uploadLoadFile = async (formData, callback) => {
  try {
    await DSA_api.putLoadFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const uploadBranchFile = async (formData, callback) => {
  try {
    await DSA_api.putBranchFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHide = () => {
  getArea();
  dsaStore.getListGen();
  dsaStore.getListLoad();
  dsaStore.getListBranch();
};

//download

const downloadFile = async () => {
  try {
    // Hàm để tải xuống tệp và tạo liên kết tải
    const downloadSingleFile = async (apiMethod, fileName) => {
      const response = await apiMethod();
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Thực hiện tải xuống song song
    await Promise.all([
      downloadSingleFile(DSA_api.downloadFileGen, 'Gen_List.csv'),
      downloadSingleFile(DSA_api.downloadFileLoad, 'Load_List.csv'),
      downloadSingleFile(DSA_api.downloadFileBranch, 'Branch_List.csv'),
    ]);
  } catch (error) {
    console.error('Error downloading the files', error);
  }
};

//get Data list
const initializeData = (dataArray) => {
  return dataArray.map((item) => ({ name: item, selected: false }));
};

const getArea = async () => {
  try {
    const res = await DSA_api.getArea();
    const convertedData = res.data.map((area) => ({
      ...area,
      gens_name: initializeData(area.gens_name),
      loads_name: initializeData(area.loads_name),
    }));

    listArea.value = convertedData;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Gen
const getListGenHandle = async (pageNumber = 1) => {
  dsaStore.getListGen(pageNumber);
};
const deleteGen = async (data, page) => {
  try {
    await DSA_api.deleteGen({
      names: data,
    });
    dsaStore.getListGen(page);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createGen = async (dataLoad) => {
  try {
    await DSA_api.createGen(dataLoad);
    dsaStore.getListGen();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
// Load
const getListLoadHandle = async (pageNumber = 1) => {
  dsaStore.getListLoad(pageNumber);
};
const deleteLoad = async (data, page) => {
  try {
    await DSA_api.deleteLoad({
      names: data,
    });
    dsaStore.getListLoad(page);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const createLoad = async (dataLoad) => {
  try {
    await DSA_api.createLoad(dataLoad);
    dsaStore.getListLoad();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//Branch
const getListBranchHandle = async (pageNumber = 1) => {
  dsaStore.getListBranch(pageNumber);
};

const deleteBranch = async (data, page) => {
  try {
    await DSA_api.deleteBranch({
      names: data,
    });
    dsaStore.getListBranch(page);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createBranch = async (dataLoad) => {
  try {
    await DSA_api.createBranch(dataLoad);
    dsaStore.getListBranch();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
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

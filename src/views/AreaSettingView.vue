<template>
  <div class="card h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <TabView class="custom-tabview">
      <TabPanel header="Area">
        <DataTable v-model:expandedRows="expandedRows" :value="listArea" dataKey="_id" tableStyle="min-width: 60rem">
          <template #header>
            <div class="flex flex-wrap justify-content-end gap-2">
              <Button
                severity="secondary"
                text
                icon="pi pi-download
"
                label="Download Template"
                @click="downloadFile()"
              />

              <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadArea()" />
              <Button text icon="pi pi-plus" label="Create" @click="areaHandleCreate" />
            </div>
          </template>
          <Column expander style="width: 5rem" />
          <Column header="Name">
            <template #body="slotProps">
              <img alt="flag" src="/img/global.jpg" width="32" style="vertical-align: middle" class="ml-2" />
              <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.name }}</span>
            </template>
          </Column>
          <Column :exportable="false" style="width: 8rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteArea(slotProps.data.name, slotProps.data._id)"
              />
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3 grid gap-4">
              <div class="col">
                <div class="flex justify-content-between">
                  <h6>Gen List</h6>
                  <div class="grid">
                    <Button
                      size="small"
                      text
                      v-tooltip.top="{ value: 'Add Gen Area' }"
                      icon="pi pi-plus"
                      aria-label="Filter"
                      class="col"
                      @click="addDataTypeOnArea(slotProps.data._id, slotProps.data.gens_name, 'gen')"
                    />
                    <Button
                      size="small"
                      text
                      class="col"
                      v-tooltip.top="{ value: 'Delete Gen Active' }"
                      icon="pi pi-times"
                      severity="danger"
                      aria-label="Cancel"
                      @click="confirmRemoveDataOnArea($event, slotProps.data._id, slotProps.data.gens_name, 'gen')"
                    />
                  </div>
                </div>
                <ScrollPanel style="width: 100%; height: 200px">
                  <ul class="values-list">
                    <li
                      v-for="value in slotProps.data.gens_name"
                      :key="value.name"
                      :class="{ selected: value.selected }"
                      @click="
                        () => {
                          if (value.selected) {
                            value.selected = false;
                          } else {
                            value.selected = true;
                          }
                        }
                      "
                    >
                      {{ value.name }}
                    </li>
                  </ul>
                </ScrollPanel>
              </div>
              <div class="col">
                <div class="flex justify-content-between">
                  <h6>Load List</h6>
                  <div class="grid">
                    <Button
                      size="small"
                      text
                      v-tooltip.top="{ value: 'Add Load Area' }"
                      icon="pi pi-plus"
                      aria-label="Filter"
                      class="col"
                      @click="addDataTypeOnArea(slotProps.data._id, slotProps.data.loads_name, 'load')"
                    />
                    <Button
                      size="small"
                      text
                      class="col"
                      v-tooltip.top="{ value: 'Delete Load Active' }"
                      icon="pi pi-times"
                      severity="danger"
                      aria-label="Cancel"
                      @click="confirmRemoveDataOnArea($event, slotProps.data._id, slotProps.data.loads_name, 'load')"
                    />
                  </div>
                </div>
                <ScrollPanel style="width: 100%; height: 200px">
                  <ul class="values-list">
                    <li
                      v-for="value in slotProps.data.loads_name"
                      :key="value.name"
                      :class="{ selected: value.selected }"
                      @click="
                        () => {
                          if (value.selected) {
                            value.selected = false;
                          } else {
                            value.selected = true;
                          }
                        }
                      "
                    >
                      {{ value.name }}
                    </li>
                  </ul>
                </ScrollPanel>
              </div>
            </div>
          </template>
        </DataTable>
      </TabPanel>

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
    </TabView>
  </div>
  <Dialog v-model:visible="deleteAreaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="idAreaActiveDelete"
        >Are you sure you want to delete <b>{{ idAreaActiveDelete.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteAreaDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteArea()" />
    </template>
  </Dialog>
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

  <Dialog v-model:visible="createAreaDialog" :style="{ width: '30rem' }" header="Create New Area" :modal="true">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem">Area Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="areaNameCreate" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createAreaDialog = false"></Button>
      <Button type="button" label="Submit" @click="createArea()"></Button>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="createDataOnAreaDialog"
    modal
    :header="headerDialogUpdate"
    @hide="onHideDataOnAreaDialog"
    :style="{ width: '25rem' }"
  >
    <div class="flex justify-content-center mb-6 mt-2">
      <AutoComplete
        completeOnFocus
        v-model="dataAddOnArea"
        forceSelection
        :suggestions="listContingencies"
        @complete="search"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createDataOnAreaDialog = false"></Button>
      <Button type="button" label="Submit" @click="addDataOnArea()"></Button>
    </div>
  </Dialog>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';

import { useToast } from 'primevue/usetoast';
import DSA_api from '@/api/dsa_api';
import uploadFileConfig from '../components/uploadFileConfig.vue';
import ListOnArea from '@/components/ListOnArea.vue';
import { useConfirm } from 'primevue/useconfirm';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useDSAStore } from '@/store';
const dsaStore = useDSAStore();
//
//
const { listGen, listLoad, listBranch, totalSizeGen, totalSizeLoad, totalSizeBranch, listContingencies } =
  storeToRefs(dsaStore);

const progressSpinnerModal = ref(false);
const confirm = useConfirm();
const listArea = ref();
const expandedRows = ref({});
const toast = useToast();
const deleteAreaDialog = ref(false);
const idAreaActiveDelete = ref({});
const uploadDialog = ref(false);
const createAreaDialog = ref(false);
const createDataOnAreaDialog = ref(false);
const typeUpdateArea = ref('gen');
const search = async (event) => {
  await dsaStore.getListContingencies(event.query, typeUpdateArea.value, datalistOnArea.value);
};

const confirmDeleteArea = (name, id) => {
  idAreaActiveDelete.value = {
    name: name,
    id: id,
  };
  deleteAreaDialog.value = true;
};

const deleteArea = async () => {
  try {
    progressSpinnerModal.value = true;
    await DSA_api.deleteArea(idAreaActiveDelete.value.id);
    await getArea();
    deleteAreaDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

onMounted(async () => {
  cleanup();
  await getArea();
  dsaStore.getListGen();
  dsaStore.getListLoad();
  dsaStore.getListBranch();
});

const cleanup = () => {
  progressSpinnerModal.value = false;
  listArea.value = [];
  expandedRows.value = {};
  deleteAreaDialog.value = false;
  idAreaActiveDelete.value = {};
  uploadDialog.value = false;
  createAreaDialog.value = false;
  createDataOnAreaDialog.value = false;
  areaNameCreate.value = '';
  listGen.value = [];
  listLoad.value = [];
  listBranch.value = [];
  area_id.value = '';
};

onBeforeUnmount(() => {
  cleanup();
});
const uploadArea = () => {
  uploadDialog.value = true;
};

const areaNameCreate = ref('');
const areaHandleCreate = () => {
  createAreaDialog.value = true;
};

const createArea = async () => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: areaNameCreate.value,
      // gens_name: [],
      // loads_name: [],
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
  dsaStore.getListGen();
  dsaStore.getListLoad();
  dsaStore.getListBranch();
};

const uploadGenFile = async (formData, callback) => {
  try {
    await DSA_api.putGenFile(formData);
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
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

const area_id = ref('');
const headerDialogUpdate = computed(() => 'Add ' + typeUpdateArea.value + ' on AREA');
const dataAddOnArea = ref([]);
const datalistOnArea = ref([]);
const addDataTypeOnArea = (id_Area, datalistArea, type) => {
  dataAddOnArea.value = '';
  area_id.value = id_Area;
  datalistOnArea.value = datalistArea;
  typeUpdateArea.value = type;
  createDataOnAreaDialog.value = true;
};

const addDataOnArea = async () => {
  try {
    let dataLoad = {
      gens_name: [dataAddOnArea.value],
    };
    if (typeUpdateArea.value !== 'gen') {
      dataLoad = {
        loads_name: [dataAddOnArea.value],
      };
    }
    await DSA_api.AddDataArea(area_id.value, dataLoad);

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    console.log(error, 'error');
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHideDataOnAreaDialog = () => {
  getArea();
  createDataOnAreaDialog.value = false;
};

const confirmRemoveDataOnArea = (event, id_Area, datalistArea, type) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      if (type === 'gen') {
        removeGenOnArea(id_Area, datalistArea);
      } else {
        removeLoadOnArea(id_Area, datalistArea);
      }
    },
    reject: () => {},
  });
};

const removeGenOnArea = async (id_Area, genlistArea) => {
  try {
    const selectedIds = genlistArea
      .filter((item) => item.selected) // Lọc các item có selected = true
      .map((item) => item.name); // Lấy giá trị _id của các item đã lọc
    await DSA_api.RemoveDataArea(id_Area, {
      gens_name: selectedIds,
    });

    getArea();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const removeLoadOnArea = async (id_Area, loadlistArea) => {
  try {
    const selectedIds = loadlistArea
      .filter((item) => item.selected) // Lọc các item có selected = true
      .map((item) => item.name); // Lấy giá trị _id của các item đã lọc
    await DSA_api.RemoveDataArea(id_Area, {
      loads_name: selectedIds,
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
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

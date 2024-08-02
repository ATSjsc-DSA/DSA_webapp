<template>
  <div class="card h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>

    <div class="card h-full">
      <div class="flex flex-wrap justify-content-end gap-2">
        <!-- <Button severity="secondary" text icon="pi pi-download" label="Download Template" @click="downloadFile()" />
  
        <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadTemplate" /> -->
        <Button text icon="pi pi-plus" label="Create" @click="handleCreateDevice" />
      </div>
      <Splitter style="height: 100%">
        <SplitterPanel
          class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
          :size="20"
          :minSize="10"
        >
          <DataView :value="listDatatree" class="w-full">
            <template #list="slotProps">
              <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                  <div
                    class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-3"
                    :class="{
                      'border-top-1 surface-border': index !== 0,
                      'selected-item': selectedItem && selectedItem.name === item.name,
                    }"
                    @click="handleRowClick(item)"
                  >
                    <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1">
                      <Chip :label="item.name" image="/img/global.jpg" />
                    </div>
                    <div class="flex flex-column md:align-items-end indexauto">
                      <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        severity="danger"
                        @click="(event) => confirmDeleteItem(event, item.name, item._id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </SplitterPanel>
        <SplitterPanel class="flex align-items-center justify-content-center" :size="80"
          ><div v-if="selectedItem._id" class="h-full w-full p-3">
            <TabView>
              <TabPanel header="Short-circuit event">
                <DSA_TSAT_SCE
                  v-model:dialogVisible="sceDialogCreate"
                  :dataList="selectedItem.sce_list"
                  @deleteRow="deleteRowSCE"
                  @createRow="createRowSCE"
                ></DSA_TSAT_SCE>
              </TabPanel>
              <TabPanel header="Switch event">
                <DSA_TSAT_SE
                  v-model:dialogVisible="seDialogCreate"
                  :dataList="selectedItem.se_list"
                  @deleteRow="deleteRowSE"
                  @createRow="createRowSE"
                ></DSA_TSAT_SE>
              </TabPanel>
            </TabView>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
  <ConfirmPopup></ConfirmPopup>
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="deviceActiveNameDelete !== ''"
        >Are you sure you want to delete <b>{{ deviceActiveNameDelete }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteVisibleDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteItem()" />
    </template>
  </Dialog>
  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '30rem' }" header="Create New " :modal="true">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="dataNameCreate" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="createDevice()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import ConfirmPopup from 'primevue/confirmpopup';
import { useDSAStore } from '@/store';
import DSA_api from '@/api/dsa_api';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import { useConfirm } from 'primevue/useconfirm';
import { watch } from 'vue';

import DSA_TSAT_SCE from '@/components/DSA_TSAT_SCE.vue';
import DSA_TSAT_SE from '@/components/DSA_TSAT_SE.vue';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';

// const confirm = useConfirm();
// const dsaStore = useDSAStore();
const toast = useToast();
const selectedItem = ref({
  sce_list: [],
  se_list: [],
});
const deviceActiveNameDelete = ref();
const deviceActiveIdDelete = ref();
const dataNameCreate = ref();
const deleteVisibleDialog = ref(false);
const progressSpinnerModal = ref(false);

const sceDialogCreate = ref(false);
const seDialogCreate = ref(false);
//
const items = ref([{ label: 'System Events' }, { label: 'Disturbances', route: '/DSA/SystemEvents/Disturbances' }]);

// const createDataOnDeviceDialog = ref(false);
const createVisibleDialog = ref(false);
const listDatatree = ref([]);
// onMounted and onUnMouted
onMounted(async () => {
  await getDisturbances();
});

watch(listDatatree, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    newValue.forEach((device) => {
      if (device._id === selectedItem.value._id) {
        selectedItem.value = device;
      }
    });
  }
});

// method

const getDisturbances = async () => {
  try {
    const res = await DSA_api.getDisturbances();
    listDatatree.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

///

const handleRowClick = (item) => {
  selectedItem.value = item;
};

const confirmDeleteItem = (event, name, id) => {
  deviceActiveNameDelete.value = name;
  deviceActiveIdDelete.value = id;

  deleteVisibleDialog.value = true;
};

const deleteItem = async () => {
  try {
    progressSpinnerModal.value = true;
    await DSA_api.deleteDisturbances(deviceActiveIdDelete.value);
    await getDisturbances();
    deleteVisibleDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handleCreateDevice = () => {
  dataNameCreate.value = '';
  createVisibleDialog.value = true;
};

const createDevice = async () => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: dataNameCreate.value,
    };
    await DSA_api.createDisturbances(formData);
    await getDisturbances();
    createVisibleDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handleRowAction = async (type, action, data) => {
  try {
    const requestBody = { [`${type}_list`]: action === 'create' ? [data] : [data.id] };
    const apiMethod = action === 'create' ? DSA_api.updateDataDisturbances : DSA_api.removeDataDisturbances;

    await apiMethod(selectedItem.value._id, requestBody);
    getDisturbances();
    if (action === 'create') {
      if (type === 'sce') {
        sceDialogCreate.value = false;
      } else {
        seDialogCreate.value = false;
      }
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: `${action} successfully`, life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Sử dụng các hàm tổng quát
const deleteRowSCE = (data) => handleRowAction('sce', 'delete', data);
const createRowSCE = (data) => handleRowAction('sce', 'create', data);
const deleteRowSE = (data) => handleRowAction('se', 'delete', data);
const createRowSE = (data) => handleRowAction('se', 'create', data);

// const downloadFile = () => {};

// const uploadTemplate = () => {};

// const dataAddOnArea = ref('');
// const typeUpdateArea = ref('gen');
// const datalistOnArea = ref([]);
// const addDataTypeOnDevice = (type) => {
//   dataAddOnArea.value = '';
//   typeUpdateArea.value = type;
//   switch (type) {
//     case 'gen':
//       datalistOnArea.value = selectedItem.value.gens_name;

//       break;
//     case 'load':
//       datalistOnArea.value = selectedItem.value.loads_name;
//       break;

//     case 'branch':
//       datalistOnArea.value = selectedItem.value.branches_name;
//       break;

//     default:
//       datalistOnArea.value = selectedItem.value.equips_name;
//       break;
//   }
//   createDataOnDeviceDialog.value = true;
// };

// const addDataOnDevice = () => {
//   emits(
//     'addDataOnDevice',
//     selectedItem.value._id,
//     dataAddOnArea.value,
//     typeUpdateArea.value,
//     dataDicAddOnMonitor.value,
//   );
//   dataAddOnArea.value = '';
// };

// const onHideDataOnDeviceDialog = () => {};

// const confirmRemoveDataOnDevice = (event, type) => {
//   confirm.require({
//     target: event.currentTarget,
//     message: 'Do you want to delete?',
//     icon: 'pi pi-info-circle',
//     rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
//     acceptClass: 'p-button-danger p-button-sm',
//     rejectLabel: 'Cancel',
//     acceptLabel: 'Delete',
//     accept: () => {},
//     reject: () => {},
//   });
// };

// const search = async (event) => {
//   await dsaStore.getListContingencies(event.query, typeUpdateArea.value, datalistOnArea.value);
// };
</script>
<style scoped>
.item-data:hover {
  cursor: pointer;
  background-color: var(--highlight-bg);
}

.selected-item {
  background-color: var(--highlight-bg);
}
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
.indexauto {
  z-index: 100;
}
</style>

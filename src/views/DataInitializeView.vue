<template>
  <div class="card h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>

    <div class="card h-full w-full">
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
          <DataView :value="listDatatree" class="w-full h-full">
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
        <SplitterPanel class="flex align-items-center justify-content-center" :size="80">
          <div v-if="selectedItem._id" class="h-full w-full p-3">
            <Group_DataImport v-if="selectedItem.name === 'Group 1'"></Group_DataImport>
            <AreaSettingView v-else></AreaSettingView>
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
import Group_DataImport from '@/components/Group_DataImport.vue';
import AreaSettingView from './AreaSettingView.vue';
// const confirm = useConfirm();
// const dsaStore = useDSAStore();
const toast = useToast();
const selectedItem = ref({});
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
  await getGroup();
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

const getGroup = async () => {
  try {
    const res = await DSA_api.getGroup();
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
    await DSA_api.deleteGroup(deviceActiveIdDelete.value);
    await getGroup();
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
    await DSA_api.createGroup(formData);
    await getGroup();
    createVisibleDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Sử dụng các hàm tổng quát
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

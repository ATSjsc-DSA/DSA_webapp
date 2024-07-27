<template>
  <div class="card h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <TabView class="custom-tabview">
      <TabPanel header="Monitor">
        <DataTable v-model:expandedRows="expandedRows" :value="listMonitor" dataKey="_id" tableStyle="min-width: 60rem">
          <template #header>
            <div class="flex flex-wrap justify-content-end gap-2">
              <Button
                severity="secondary"
                text
                icon="pi pi-download
"
                label="Download Template"
                @click="downloadFileMonitor()"
              />
              <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadFileHandle('mon')" />
              <Button text icon="pi pi-plus" label="Create" @click="DeviceHandleCreate" />
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
                @click="confirmDeleteDevice(slotProps.data.name, slotProps.data._id, 'mon')"
              />
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <div class="flex justify-content-between w-full">
                <h6>Branch List</h6>
                <div class="grid">
                  <Button
                    size="small"
                    text
                    v-tooltip.top="{ value: 'Add Branch Area' }"
                    icon="pi pi-plus"
                    aria-label="Filter"
                    class="col"
                    @click="addDataTypeOnDevice(slotProps.data._id, slotProps.data.branches_name, 'mon')"
                  />
                  <Button
                    size="small"
                    text
                    class="col"
                    v-tooltip.top="{ value: 'Delete Branch Active' }"
                    icon="pi pi-times"
                    severity="danger"
                    aria-label="Cancel"
                    @click="confirmRemoveDataOnDevice($event, slotProps.data._id, slotProps.data.branches_name, 'mon')"
                  />
                </div>
              </div>
              <ScrollPanel style="width: 100%; height: 200px">
                <ul class="values-list">
                  <li
                    v-for="value in slotProps.data.branches_name"
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
                    <div class="flex justify-content-around">
                      <span> {{ value.name }}</span>
                      <Tag icon="pi pi-directions" severity="info" :value="value.direction"></Tag>
                    </div>
                  </li>
                </ul>
              </ScrollPanel>
            </div>
          </template>
        </DataTable>
      </TabPanel>

      <TabPanel header="Contingencies">
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="listGroupContingencies"
          dataKey="_id"
          tableStyle="min-width: 60rem"
        >
          <template #header>
            <div class="flex flex-wrap justify-content-end gap-2">
              <Button
                severity="secondary"
                text
                icon="pi pi-download
"
                label="Download Template"
                @click="downloadFileCon()"
              />
              <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadFileHandle('con')" />
              <Button text icon="pi pi-plus" label="Create" @click="DeviceHandleCreate" />
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
                @click="confirmDeleteDevice(slotProps.data.name, slotProps.data._id, 'con')"
              />
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <div class="flex justify-content-between w-full">
                <h6>Equipment List</h6>
                <div class="grid">
                  <Button
                    size="small"
                    text
                    v-tooltip.top="{ value: 'Add Branch Area' }"
                    icon="pi pi-plus"
                    aria-label="Filter"
                    class="col"
                    @click="addDataTypeOnDevice(slotProps.data._id, slotProps.data.equips_name, 'const')"
                  />
                  <Button
                    size="small"
                    text
                    class="col"
                    v-tooltip.top="{ value: 'Delete Branch Active' }"
                    icon="pi pi-times"
                    severity="danger"
                    aria-label="Cancel"
                    @click="confirmRemoveDataOnDevice($event, slotProps.data._id, slotProps.data.equips_name, 'con')"
                  />
                </div>
              </div>
              <ScrollPanel style="width: 100%; height: 200px">
                <ul class="values-list">
                  <li
                    v-for="value in slotProps.data.equips_name"
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
                    <div class="flex justify-content-around">
                      <span> {{ value.name }}</span>
                    </div>
                  </li>
                </ul>
              </ScrollPanel>
            </div>
          </template>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>
  <!-- delete -->
  <Dialog v-model:visible="deleteDeviceDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="idSelectActiveDelete"
        >Are you sure you want to delete <b>{{ idSelectActiveDelete.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteDeviceDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteDevice()" />
    </template>
  </Dialog>
  <!-- upload -->
  <Dialog v-model:visible="uploadDialog" @hide="onHide" :style="{ width: '50rem' }" header="Upload File" :modal="true">
    <uploadFileConfig @uploadFile="uploadFile"></uploadFileConfig>
  </Dialog>
  <!-- create  -->
  <Dialog v-model:visible="createDialog" :style="{ width: '30rem' }" header="Create New Monitor" :modal="true">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="dataNameCreate" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createDialog = false"></Button>
      <Button type="button" label="Submit" @click="createDevice()"></Button>
    </div>
  </Dialog>
  <!-- createData -->
  <Dialog
    v-model:visible="createDataOnAreaDialog"
    @hide="onHideDataOnDevceDialog"
    modal
    header="Add Branch on Monitor"
    :style="{ width: '25rem' }"
  >
    <div class="p-fluid mb-4">
      <div class="field">
        <label for="branch">Name</label>
        <AutoComplete
          id="branch"
          completeOnFocus
          v-model="dataNameAddOnMonitor"
          :suggestions="listContingencies"
          @complete="search"
        />
      </div>
      <div class="field" v-if="tabDeviceActive === 'mon'">
        <label for="Direction">Direction</label>
        <Dropdown
          id="Direction"
          v-model="dataDicAddOnMonitor"
          :options="optionsDic"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
    </div>
    <div class="flex justify-content-end mt-2">
      <Button label="Submit" text raised @click="addDataOnDevice()" />
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
import { useConfirm } from 'primevue/useconfirm';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import { useDSAStore } from '@/store';

import DSA_Common from '@/combosables/DSA_common';

const dsaStore = useDSAStore();
const { listContingencies } = storeToRefs(dsaStore);
const { downloadFile } = DSA_Common();
const progressSpinnerModal = ref(false);
const confirm = useConfirm();
const listMonitor = ref();
const listGroupContingencies = ref();
const expandedRows = ref({});
const toast = useToast();
const deleteDeviceDialog = ref(false);
const idSelectActiveDelete = ref({});
const uploadDialog = ref(false);
const createDialog = ref(false);
const createDataOnAreaDialog = ref(false);

onMounted(async () => {
  await getMonitor();
  await getGroupContingencies();
});
const initializeData = (dataArray, type) => {
  if (type === 'mon') {
    return dataArray.map((item) => ({ name: item.name, direction: item.direction, selected: false }));
  } else {
    return dataArray.map((item) => ({ name: item, selected: false }));
  }
};

const cleanup = () => {
  progressSpinnerModal.value = false;
  listMonitor.value = [];
  listGroupContingencies.value = [];
  expandedRows.value = {};
  deleteDeviceDialog.value = false;
  idSelectActiveDelete.value = {};
  uploadDialog.value = false;
  createDialog.value = false;
  createDataOnAreaDialog.value = false;
  dataNameCreate.value = '';
  selectedCreateValues.value = [];
  id_DeviceActive.value = '';
};

onBeforeUnmount(() => {
  cleanup();
});
const tabDeviceActive = ref('mon');
const uploadFileHandle = (tabActive) => {
  tabDeviceActive.value = tabActive;
  uploadDialog.value = true;
};

const dataNameCreate = ref('');
const DeviceHandleCreate = (tabActive) => {
  tabDeviceActive.value = tabActive;
  createDialog.value = true;
};

const createDevice = async () => {
  try {
    progressSpinnerModal.value = true;
    const formData = {
      name: dataNameCreate.value,
    };
    if (tabDeviceActive.value === 'mon') {
      await DSA_api.createMonitor(formData);
      await getMonitor();
    } else {
      await DSA_api.createContingencies(formData);
      await getGroupContingencies();
    }
    createDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const downloadFileMonitor = () => downloadFile(DSA_api.downloadFileMonitor, 'Mon_List.csv');

const downloadFileCon = () => downloadFile(DSA_api.downloadFileCon, 'Con_List.csv');

const uploadFile = async (formData, callback) => {
  try {
    if (tabDeviceActive.value === 'mon') {
      await DSA_api.putMonFile(formData);
    } else {
      await DSA_api.putConFile(formData);
    }
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHide = () => {
  getMonitor();
  getGroupContingencies();
};

const confirmDeleteDevice = (name, id, tabActive) => {
  tabDeviceActive.value = tabActive;
  idSelectActiveDelete.value = {
    name: name,
    id: id,
  };
  deleteDeviceDialog.value = true;
};

const deleteDevice = async () => {
  try {
    progressSpinnerModal.value = true;
    if (tabDeviceActive.value === 'mon') {
      await DSA_api.deleteMonitor(idSelectActiveDelete.value.id);
      await getMonitor();
    } else {
      await DSA_api.deleteContingencies(idSelectActiveDelete.value.id);
      await getGroupContingencies();
    }
    deleteDeviceDialog.value = false;
    progressSpinnerModal.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getMonitor = async () => {
  try {
    const res = await DSA_api.getMonitor();
    const convertedData = res.data.map((monitor) => ({
      ...monitor,
      branches_name: initializeData(monitor.branches_name, 'mon'),
    }));
    listMonitor.value = convertedData;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getGroupContingencies = async () => {
  try {
    const res = await DSA_api.getContingencies();
    const convertedData = res.data.map((GroupContingencies) => ({
      ...GroupContingencies,
      equips_name: initializeData(GroupContingencies.equips_name, 'con'),
    }));
    listGroupContingencies.value = convertedData;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const dataNameAddOnMonitor = ref({});
const dataDicAddOnMonitor = ref(1);
const datalistOnMonitor = ref([]);

const selectedCreateValues = ref([]);
const id_DeviceActive = ref('');
const optionsDic = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '-1',
    value: -1,
  },
];

const search = async (event) => {
  await dsaStore.getListContingencies(
    event.query,
    tabDeviceActive.value === 'mon' ? 'branch' : '',
    datalistOnMonitor.value,
  );
};

const addDataTypeOnDevice = (id_Monitor, datalistMonitor, tabActive) => {
  tabDeviceActive.value = tabActive;
  dataNameAddOnMonitor.value = '';
  dataDicAddOnMonitor.value = 1;

  id_DeviceActive.value = id_Monitor;
  datalistOnMonitor.value = datalistMonitor;
  createDataOnAreaDialog.value = true;
};

const addDataOnDevice = async () => {
  try {
    if (tabDeviceActive.value === 'mon') {
      const dataLoad = {
        branches_name: [
          {
            name: dataNameAddOnMonitor.value,
            direction: dataDicAddOnMonitor.value,
          },
        ],
      };
      await DSA_api.AddDataMonitor(id_DeviceActive.value, dataLoad);
    } else {
      const dataLoad = {
        equips_name: [dataNameAddOnMonitor.value],
      };
      await DSA_api.AddDataContingencies(id_DeviceActive.value, dataLoad);
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onHideDataOnDevceDialog = () => {
  getMonitor();
  getGroupContingencies();
  createDataOnAreaDialog.value = false;
};

const confirmRemoveDataOnDevice = (event, id_Device, datalistDevice, tabActive) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      if (tabActive === 'mon') {
        removeDataOnMonitor(id_Device, datalistDevice);
      } else {
        removeDataOnContingencies(id_Device, datalistMonitor);
      }
    },
    reject: () => {},
  });
};

const removeDataOnMonitor = async (id_Monitor, branchListMonitor) => {
  try {
    const selectedIds = branchListMonitor
      .filter((item) => item.selected) // Lọc các item có selected = true
      .map((item) => item.name); // Lấy giá trị _id của các item đã lọc
    await DSA_api.RemoveDataMonitor(id_Monitor, {
      branches_name: selectedIds,
    });
    getMonitor();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const removeDataOnContingencies = async (id_Con, equipListConti) => {
  try {
    const selectedIds = equipListConti
      .filter((item) => item.selected) // Lọc các item có selected = true
      .map((item) => item.name); // Lấy giá trị _id của các item đã lọc
    await DSA_api.RemoveDataArea(id_Con, {
      equips_name: selectedIds,
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
  grid-template-columns: repeat(5, 1fr);
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

.values-list-direction {
  float: right;
}
.custom-tabview {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

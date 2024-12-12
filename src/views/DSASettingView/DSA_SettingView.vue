<template>
  <div class="card layout-content">
    <TabView>
      <TabPanel header="Setting">
        <div class="grid">
          <div class="col-6 p-3 mb-3" style="border-right: 1px solid var(--gray-200)">
            <div class="font-semibold">Manager Setting</div>

            <div class="grid p-3">
              <div class="col-12 -full">
                <div class="mb-3">Manager Mode</div>

                <InputText
                  id="manager_mode"
                  v-model="dataSettingDSA.manager.manager_mode"
                  :disabled="dataSettingDSA.manager.manager_mode === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                  fluid
                />
              </div>

              <div class="col-12">
                <div class="mb-3">Source Folder</div>
                <InputText
                  id="source_folder"
                  v-model="dataSettingDSA.manager.source_folder"
                  :disabled="dataSettingDSA.manager.source_folder === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>

              <div class="col-4">
                <div class="mb-3">SE Validate</div>
                <InputNumber
                  id="se_validate"
                  v-model="dataSettingDSA.manager.se_validate"
                  :disabled="dataSettingDSA.manager.se_validate === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>
              <div class="col-4">
                <div class="mb-3">LF Validate</div>
                <InputNumber
                  id="lf_validate"
                  v-model="dataSettingDSA.manager.lf_validate"
                  :disabled="dataSettingDSA.manager.lf_validate === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>
              <div class="col-4">
                <div class="mb-3">PSM Upgrade</div>
                <InputNumber
                  id="psm_upgrade"
                  v-model="dataSettingDSA.manager.psm_upgrade"
                  :disabled="dataSettingDSA.manager.psm_upgrade === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>

              <div class="col-6">
                <div class="mb-3">Calculate Timeout</div>
                <InputNumber
                  id="calculate_timeout"
                  v-model="dataSettingDSA.manager.calculate_timeout"
                  :disabled="dataSettingDSA.manager.calculate_timeout === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>
              <div class="col-6">
                <div class="mb-3">Terminate Task</div>
                <InputNumber
                  id="terminate_task"
                  v-model="dataSettingDSA.manager.terminate_task"
                  :disabled="dataSettingDSA.manager.terminate_task === undefined"
                  class="flex-auto w-full"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
          <div class="col-6 p-3 mb-3">
            <div class="font-semibold">DSA System Setting</div>
            <div class="p-3">
              <div class="mb-3">Power System Version</div>
              <Dropdown
                v-model="psVersionSelected"
                :options="psVersionList"
                optionLabel="name"
                placeholder="Select a Version"
                class="w-full"
              />
            </div>

            <div class="p-3">
              <div class="mb-3">Dynamic Model Version</div>
              <Dropdown
                v-model="dynamicVersionSelected"
                :options="dynamicVersionList"
                disabled
                optionLabel="name"
                placeholder="Select a Version"
                class="w-full"
              />
            </div>

            <div class="p-3">
              <div class="mb-3">Profile</div>
              <Dropdown
                v-model="profileSelected"
                :options="profileList"
                optionLabel="name"
                placeholder="Select a Profile"
                class="w-full"
              />
            </div>

            <div class="p-3">
              <div class="mb-3">Grid Code</div>
              <Dropdown
                v-model="gridCodeSelected"
                :options="gridCodeList"
                optionLabel="name"
                placeholder="Select a Config"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex w-full justify-content-end align-items-center px-5">
            <Button label="Submit" class="border-noround" @click="confirmUpdateDsaSystemSetting" />
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Engine">
        <DataTable :value="engineList" dataKey="_id" :sortOrder="1" rowHover>
          <template #header>
            <div class="flex justify-content-between">
              <div class="font-semibold white-space-nowrap text-xl">Engine</div>

              <Button type="button" label="Create" icon="pi pi-plus" size="small" text @click="handleCreateEngine" />
            </div>
          </template>

          <Column header="Name" field="name" class="capitalize" />
          <Column field="online" header="Online">
            <template #body="{ data }">
              <Tag
                :severity="data.online ? 'primary' : 'secondary'"
                class="capitalize"
                :value="String(data.online)"
              ></Tag>
            </template>
          </Column>
          <Column header="IP Address" field="ipAddress" class="capitalize" />

          <Column style="width: 1%; min-width: 5rem">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                <Button
                  v-tooltip="'Edit'"
                  icon="pi pi-pencil"
                  severity="success"
                  text
                  rounded
                  @click="handleUpdateEngine(data)"
                />

                <Button
                  v-tooltip="'Delete'"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="confirmDeleteEngine($event, data)"
                />
              </div>
            </template>
          </Column>
          <template #empty> No data </template>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>

  <Toast />

  <confirmUpdateDialog />
  <ConfirmDialog />
  <Dialog v-model:visible="changeEngineVisibleDialog" :style="{ width: '32rem' }" header="Change Dialog " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Engine</span>
      </div>
    </template>

    <div class="grid align-items-center">
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="engineFormData.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <!-- <div class="col-2">
        <div class="flex flex-column gap-2 mb-3 align-items-center">
          <label for="online" class="font-semibold mb-2"> Online</label>
          <InputSwitch id="online" v-model="engineFormData.online" disabled autocomplete="off" />
        </div>
      </div> -->

      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="ipAddress" class="font-semibold"> IP Address </label>
          <InputText id="ipAddress" v-model="engineFormData.ipAddress" class="flex-auto" autocomplete="off" />
        </div>
      </div>

      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="physicalEngine" class="font-semibold"> Physical Engine </label>
          <InputNumber
            id="physicalEngine"
            v-model="engineFormData.physicalEngine"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeEngineVisibleDialog = false"></Button>
      <Button v-if="engineFormMode === 'create'" type="button" label="Save" @click="createEngine"></Button>
      <Button
        v-if="engineFormMode === 'update'"
        severity="info"
        type="button"
        label="Update"
        @click="updateEngine"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { DSA_api, ApiEngine } from './api';
import { onMounted } from 'vue';
import Toast from 'primevue/toast';

import Dropdown from 'primevue/dropdown';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import confirmUpdateDialog from '@/components/confirmUpdateDialog.vue';

import { ApiVersion } from '../PowerSystem/api';
import { Api as ApiProfile } from '../ProfileView/api';
import { Api as ApiGridcode } from '../GridCodeView/api';
//
const toast = useToast();
const confirm = useConfirm();

const dataSettingDSA = ref({ manager: {} });
onMounted(async () => {
  await getDsaSystemSettingSelected();
  await getDsaSystemSettingOptions();
  await getEngineList();
});

const confirmUpdateDsaSystemSetting = (event) => {
  confirm.require({
    group: 'updateDialog',
    target: event.currentTarget,
    header: 'Update DSA Setting',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-success',
    rejectLabel: 'Cancel',
    acceptLabel: 'Submit',
    accept: async () => {
      await updateSettingDSA();
    },
  });
};
const updateSettingDSA = async () => {
  try {
    const dataUpdate = JSON.parse(JSON.stringify(dataSettingDSA.value));
    dataUpdate.dataVersion = {
      powersystemDataVersionId: psVersionSelected.value._id,
      powersystemDynVersionId: dynamicVersionSelected.value._id,
      userConfigProfileId: profileSelected.value._id,
      gridCodeId: gridCodeSelected.value._id,
    };
    const res = await DSA_api.updateDsaService(dataUpdate);
    await getDsaSystemSettingSelected();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'update setting successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getDsaSystemSettingSelected = async () => {
  try {
    const res = await DSA_api.getDsaService();
    dataSettingDSA.value = res.data;
    psVersionSelected.value = res.data.dataVersion.powersystemDataVersion;
    profileSelected.value = res.data.dataVersion.userConfigProfile;
    gridCodeSelected.value = res.data.dataVersion.gridCode;
    dynamicVersionSelected.value = res.data.dataVersion.powersystemDynVersion;
  } catch (error) {
    dataSettingDSA.value = { manager: {} };
    console.log('getDsaService error', error);
  }
};
const getDsaSystemSettingOptions = async () => {
  try {
    psVersionList.value = await getAllItemOfTable(ApiVersion.getList);
    profileList.value = await getAllItemOfTable(ApiProfile.getList);
    gridCodeList.value = await getAllItemOfTable(ApiGridcode.getGridCodeList);
    dynamicVersionList.value = [dynamicVersionSelected.value];
  } catch (error) {
    console.log('getDsaSystemSettingOptions error', error);
  }
};

const pageSize = ref(10);
const psVersionList = ref([]);
const psVersionSelected = ref({});

const profileList = ref([]);
const profileSelected = ref({});

const gridCodeList = ref([]);
const gridCodeSelected = ref({});
const dynamicVersionList = ref([]);
const dynamicVersionSelected = ref({});

const getAllItemOfTable = async (tableAPIFunc) => {
  let currentPage = 1;
  let totalPages = 1;
  const allItems = [];
  let totalItems = 0;
  while (currentPage <= totalPages) {
    const res = await tableAPIFunc({
      page: currentPage,
    });
    allItems.push(
      ...res.data.items.map((item) => ({
        _id: item._id,
        name: item.name,
      })),
    );
    if (currentPage === 1) {
      totalItems = res.data.total;
      totalPages = Math.ceil(totalItems / pageSize.value);
    }
    currentPage++;
  }
  return allItems;
};

const engineList = ref([]);
const getEngineList = async () => {
  try {
    const res = await ApiEngine.getList();
    engineList.value = res.data;
  } catch (error) {
    engineList.value = [];
  }
};

const engineFormData = ref({});
const engineFormMode = ref('');
const changeEngineVisibleDialog = ref(false);
const handleCreateEngine = () => {
  engineFormMode.value = 'create';
  engineFormData.value = {
    name: ' ',
    physicalEngine: 0,
    ipAddress: '',
    online: true,
  };

  changeEngineVisibleDialog.value = true;
};
const createEngine = async () => {
  try {
    const res = await ApiEngine.createEngine(engineFormData.value);
    toast.add({ severity: 'success', summary: 'Created Successfully', detail: res.message, life: 3000 });
    await getEngineList();
    changeEngineVisibleDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const handleUpdateEngine = (data) => {
  engineFormMode.value = 'update';
  engineFormData.value = JSON.parse(JSON.stringify(data));
  changeEngineVisibleDialog.value = true;
};

const updateEngine = async () => {
  try {
    const res = await ApiEngine.updateEngine(engineFormData.value._id, engineFormData.value);
    toast.add({ severity: 'success', summary: 'Updated Successfully', detail: res.message, life: 3000 });
    await getEngineList();
    changeEngineVisibleDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteEngine = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Engine',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteEngine(data._id);
    },
  });
};
const deleteEngine = async (id) => {
  try {
    await ApiEngine.deleteEngine(id);
    await getEngineList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Delete Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

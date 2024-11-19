<template>
  <div class="grid card layout-content">
    <div class="col-6 p-3 mb-3" style="border-right: 1px solid var(--gray-200)">
      <div class="font-semibold">Manager Setting</div>

      <template v-if="dataSettingDSA.manager">
        <div class="grid p-3">
          <div class="col-12 -full">
            <div class="mb-3">Manager Mode</div>

            <InputText
              id="manager_mode"
              v-model="dataSettingDSA.manager.manager_mode"
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
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>

          <div class="col-4">
            <div class="mb-3">SE Validate</div>
            <InputNumber
              id="se_validate"
              v-model="dataSettingDSA.manager.se_validate"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>
          <div class="col-4">
            <div class="mb-3">LF Validate</div>
            <InputNumber
              id="lf_validate"
              v-model="dataSettingDSA.manager.lf_validate"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>
          <div class="col-4">
            <div class="mb-3">PSM Upgrade</div>
            <InputNumber
              id="psm_upgrade"
              v-model="dataSettingDSA.manager.psm_upgrade"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>

          <div class="col-6">
            <div class="mb-3">Calculate Timeout</div>
            <InputNumber
              id="calculate_timeout"
              v-model="dataSettingDSA.manager.calculate_timeout"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>
          <div class="col-6">
            <div class="mb-3">Terminate Task</div>
            <InputNumber
              id="terminate_task"
              v-model="dataSettingDSA.manager.terminate_task"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>
        </div>
      </template>
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

  <Toast />

  <confirmUpdateDialog />
</template>

<script setup>
import { DSA_api } from './api';
import { onMounted } from 'vue';
import Toast from 'primevue/toast';

import Dropdown from 'primevue/dropdown';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';
//
import confirmUpdateDialog from '@/components/confirmUpdateDialog.vue';

import { ApiVersion } from '../PowerSystem/api';
import { Api as ApiProfile } from '../ProfileView/api';
import { Api as ApiGridcode } from '../GridCodeView/api';
const items = ref([{ label: 'Config DSA Device', route: '/DSA/Setting' }]);
//
const toast = useToast();
const confirm = useConfirm();

const dataSettingDSA = ref({});
onMounted(async () => {
  await getDsaSystemSettingSelected();
  await getDsaSystemSettingOptions();
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
</script>

<style lang="scss" scoped></style>

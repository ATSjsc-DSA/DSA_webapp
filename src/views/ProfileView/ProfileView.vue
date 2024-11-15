<template>
  <div class="card w-full h-full">
    <div style="height: 52rem">
      <DataTable
        id="profileList"
        :value="profileList"
        dataKey="_id"
        tableStyle="min-width: 50rem;"
        :lazy="true"
        :sortOrder="1"
        rowHover
        scrollable
        scrollHeight="38rem"
        showGridlines
        :loading="isLoadingData"
      >
        <template #header>
          <div class="flex align-items-center justify-content-between">
            <div class="font-semibold text-xl py-3">Profile</div>
            <div class="flex align-items-center justify-content-end">
              <Button type="button" label="Create" icon="pi pi-plus" text @click="handleCreate" />
            </div>
          </div>
        </template>
        <Column field="name" frozen header="Name" style="text-wrap: nowrap">
          <template #body="{ data }">
            <div class="font-bold min-w-8rem text-left">
              {{ data.name }}
            </div>
          </template>
        </Column>
        <Column field="runMode" header="Run">
          <template #body="{ data }">
            <Tag
              :severity="data.runMode ? 'primary' : 'secondary'"
              class="capitalize"
              :value="String(data.runMode)"
            ></Tag>
          </template>
        </Column>

        <Column field="desc" header="Description" style="text-wrap: nowrap" />
        <Column field="createdTimestamp" header="Created At">
          <template #body="{ data }">
            <div class="flex justify-content-between">
              {{ convertDateTimeToString(data.createdTimestamp) }}
            </div>
          </template>
        </Column>
        <Column field="createdUser" header="Created User" style="text-wrap: nowrap" />

        <Column field="modifiedTimestamp" header="Modified At">
          <template #body="{ data }">
            <div class="flex justify-content-between">
              {{ convertDateTimeToString(data.modifiedTimestamp) }}
            </div>
          </template>
        </Column>
        <Column field="modifiedUser" header="Modified User" style="text-wrap: nowrap" />

        <Column class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
          <template #body="{ data }">
            <div class="flex justify-content-between">
              <Button
                v-tooltip="'Copy and Run'"
                icon="pi pi-copy "
                severity="success"
                text
                rounded
                @click="confirmClone($event, data)"
              />
              <Button
                v-tooltip="'Edit'"
                icon="pi pi-pencil "
                severity="success"
                text
                rounded
                @click="handleUpdate(data)"
              />
              <Button
                v-tooltip="'Delete'"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDelete($event, data)"
              />
              <Button
                v-tooltip="'Setting User configuration'"
                severity="info"
                icon="pi pi-cog"
                text
                rounded
                @click="runProfile($event, data)"
              />
            </div>
          </template>
        </Column>
        <template #empty> No Data </template>
      </DataTable>
    </div>
    <div v-if="totalRecords > pageRowNumber" class="flex justify-content-end align-items-center">
      <Paginator
        :rows="pageRowNumber"
        :totalRecords="totalRecords"
        :page="currentPage"
        class="flex-grow-1"
        @page="onPageChange"
      ></Paginator>
      <div class="mr-3">Total: {{ totalRecords }}</div>
    </div>
  </div>

  <ConfirmDialog group="cloneProfileDialog">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: var(--primary-color)"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div>Create a Copy Profile and Open User Configuration.</div>
          <div class="font-semibold">Are you sure you want to Continue?</div>
        </div>
      </div>
    </template>
  </ConfirmDialog>

  <Dialog v-model:visible="changeVisibleDialog" :style="{ width: '48rem' }" header="Change Dialog " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Profile</span>
      </div>
    </template>

    <div class="grid align-items-center">
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="name" class="font-semibold"> Name</label>
          <InputText v-model="profileChangeData.name" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex flex-column gap-2 mb-3">
          <label for="desc" class="font-semibold"> Description</label>
          <InputText v-model="profileChangeData.desc" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeVisibleDialog = false"></Button>
      <Button
        v-if="changeMode === 'Create'"
        type="button"
        label="Save"
        :disabled="!profileChangeData.name"
        @click="createProfile"
      ></Button>
      <Button
        v-if="changeMode === 'Update'"
        severity="info"
        type="button"
        label="Update"
        :disabled="!profileChangeData.name"
        @click="updateProfile"
      ></Button>
    </template>
  </Dialog>

  <ConfirmDialog group="runProfileDialog">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: #fb923c"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div class="font-semibold">Every Action will affect the final calculation result.</div>
          <div class="text-orange-500 font-semibold">Are you sure you want to Continue?</div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <ConfirmDialog />
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import chartComposable from '@/combosables/chartData';
import { isNavigationFailure, NavigationFailureType } from 'vue-router';

import router from '@/router';
import { useCommonStore } from '@/store';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { Api } from './api';
const { convertDateTimeToString } = chartComposable();
const commonStore = useCommonStore();
const { profileData } = storeToRefs(commonStore);
const toast = useToast();
const confirm = useConfirm();

onMounted(async () => {
  await getList();
});

const profileList = ref([]);
const isLoadingData = ref(false);

const pageRowNumber = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const onPageChange = async (event) => {
  currentPage.value = event.page + 1;
  await getList();
};
const getList = async () => {
  isLoadingData.value = true;
  try {
    const res = await Api.getList(currentPage.value);
    profileList.value = res.data.items;
    totalRecords.value = res.data.total;
  } catch (error) {
    profileList.value = [];
    console.log('getList: error ', error);
  }
  isLoadingData.value = false;
};

const changeMode = ref('Create');
const changeVisibleDialog = ref(false);
const profileChangeData = ref({});

const handleCreate = () => {
  changeMode.value = 'Create';
  profileChangeData.value = {
    name: '',
    desc: '',
  };
  changeVisibleDialog.value = true;
};
const createProfile = async () => {
  try {
    await Api.createProfile(profileChangeData.value);
    await getList();

    changeVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleScreateProfiletability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmClone = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Clone Profile - ' + data.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-copy',
    group: 'cloneProfileDialog',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-success',
    rejectLabel: 'Cancel',
    acceptLabel: 'Copy and Run',
    accept: async () => {
      await cloneProfile(data);
    },
    reject: () => {},
  });
};

const cloneProfile = async (data) => {
  try {
    const res = await Api.cloneProfile(data._id);
    toast.add({ severity: 'success', summary: 'Cloned Successfully', life: 3000 });

    setTimeout(() => {
      saveProfileDataAndRedirect(res.data);
    }, 500);
  } catch (error) {
    console.log('updateProfile error', error);
    toast.add({ severity: 'error', summary: 'Cloned Message', detail: error.data.detail, life: 3000 });
  }
};

const handleUpdate = (data) => {
  changeMode.value = 'Update';
  profileChangeData.value = JSON.parse(JSON.stringify(data));
  changeVisibleDialog.value = true;
};
const updateProfile = async () => {
  try {
    await Api.updateProfileData(profileChangeData.value._id, {
      name: profileChangeData.value.name,
      desc: profileChangeData.value.desc,
    });
    await getList();

    changeVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateProfile error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDelete = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Profile - ' + data.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteProfile(data);
    },
    reject: () => {},
  });
};
const deleteProfile = async (data) => {
  try {
    await Api.delProfileData(data._id);
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
    await getList();
  } catch (error) {
    console.log('deleteProfile error', error);
    toast.add({ severity: 'error', summary: 'Deleted Message', detail: error.data.detail, life: 3000 });
  }
};

const runProfile = (event, data) => {
  if (data.runMode) {
    confirm.require({
      target: event.currentTarget,
      header: ' Profile - ' + data.name,
      group: 'runProfileDialog',
      data: data,
      message: 'Are you sure you want to Open this Profile?',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
      acceptClass: 'p-button-sm p-button-warning',
      rejectLabel: 'Cancel',
      acceptLabel: 'Open',
      accept: async () => {
        saveProfileDataAndRedirect(data);
      },
    });
  } else {
    saveProfileDataAndRedirect(data);
  }
};

const saveProfileDataAndRedirect = (newProfile) => {
  profileData.value = newProfile;
  localStorage.setItem('profileData', JSON.stringify(newProfile));
  router.push('/user_config/config').catch((failure) => {
    console.log('router.push failure', failure);
    if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
      // Handle the failure
      console.log('Navigation was redirected');
    }
  });
};
</script>

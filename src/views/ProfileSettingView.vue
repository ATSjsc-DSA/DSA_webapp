<template>
  <div class="card h-full relative layout-content pt-6">
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>
    <DataTable
      :value="listProfile"
      stateStorage="session"
      stateKey="dt-state-demo-session"
      paginator
      :rows="10"
      :totalRecords="totalList"
      filterDisplay="menu"
      selectionMode="single"
      dataKey="_id"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'status']"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-content-between">
          <div>
            <!-- <IconField iconPosition="left">
              <i class="pi pi-list" />
              <span class="font-bold"> Profile List</span>
            </IconField> -->
          </div>
          <div>
            <Button
              type="button"
              label="Create Profile"
              icon="pi pi-plus"
              @click="createNewProfileHandle()"
              size="small"
              text
            />
          </div>
        </div>
      </template>
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="profileName" header="Name" style="width: 25%"> </Column>
      <Column field="timestamp" header="Created Time" sortable>
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-clock" style="color: green"></i>

            <span>{{ convertDateTimeToString(data.timestamp) }}</span>
          </div>
        </template>
      </Column>

      <Column field="active" header="Active" filterMatchMode="equals" style="width: 20%">
        <template #body="{ data }">
          <Tag :value="data.active ? 'True' : 'False'" :severity="getSeverity(data.active)" />
        </template>
      </Column>
      <Column :exportable="false" style="width: 12rem">
        <template #body="slotProps">
          <Button
            text
            icon="pi pi-upload"
            class="mr-2"
            rounded
            @click="activeProfile(slotProps.data._id)"
            size="small"
          />
          <Button
            text
            icon="pi pi-external-link"
            class="mr-2"
            severity="info"
            rounded
            @click="viewProfile(slotProps.data._id)"
            size="small"
          />

          <Button
            text
            icon="pi pi-trash"
            rounded
            severity="danger"
            @click="confirmDeleteProfile($event, slotProps.data)"
            size="small"
          />
        </template>
      </Column>

      <template #empty> No customers found. </template>
    </DataTable>
  </div>
  <ConfirmPopup></ConfirmPopup>
  <Dialog
    ref="dialog"
    v-model:visible="visible"
    modal
    maximizable
    header="Header"
    :style="{ width: '100%', height: '100%' }"
    @show="maximizeDialog"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <i class="pi pi-file"></i>
        <InputText
          id="username"
          v-model="dataProfile.profileName"
          aria-describedby="username-help"
          class="input_profile"
        />
      </div>
    </template>
    <profileSettingCreate @createProfile="createProfile"></profileSettingCreate>
  </Dialog>
  <Toast></Toast>
  <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DSA_api from '@/api/dsa_api';
import chartComposable from '@/combosables/chartData';
import { useCommonStore } from '@/store';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useDSAStore } from '@/store';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';

import profileSettingCreate from './profileSettingCreate.vue';
import profile from '@/utils/profileInit';
const confirm = useConfirm();
const toast = useToast();
const dsaStore = useDSAStore();
const progressSpinnerModal = ref(false);

const commonStore = useCommonStore();
const { dataProfile } = storeToRefs(dsaStore);
const { convertDateTimeToString } = chartComposable();

const visible = ref(false);
//
const items = ref([{ label: 'Profile List', route: '/DSA/Profile' }]);
//
onMounted(async () => {
  await getProfileList();
  dsaStore.getContingenciesWithoutEquip();
  dsaStore.getListAreaWithoutEquip();
  dsaStore.getListMonitorWithoutEquip();
  dsaStore.getListDisturbanceWithoutData();
});
onUnmounted(() => {
  // dsaStore.dataProfile.value = {};
  // dsaStore.listContingencies.value = [];
});
const listProfile = ref([]);
const totalList = ref(0);
const getProfileList = async (pageNumber = 1) => {
  try {
    const res = await DSA_api.getProfile({ page: pageNumber });
    listProfile.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const dialog = ref(null);

const createNewProfileHandle = () => {
  progressSpinnerModal.value = true;
  dsaStore.dataProfile = profile;
  setTimeout(() => {
    progressSpinnerModal.value = false;
    visible.value = true;
  }, 1000);
};
const createProfile = async () => {
  const res = await dsaStore.createNewProfile();
  if (res.status !== 200) {
    toast.add({
      severity: 'error',
      summary: 'Success Message',
      detail: res.data.detail,
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: res.data.message,
      life: 3000,
    });
    getProfileList();
    visible.value = false;
  }
};
const getSeverity = (state) => {
  return state ? 'success' : 'danger';
};

const activeProfile = async (id) => {
  try {
    const res = await DSA_api.activeProfile(id);
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: res.data.message,
      life: 3000,
    });
    getProfileList();
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteProfile = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteProfile(data._id);
    },
    reject: () => {},
  });
};
const deleteProfile = async (id) => {
  try {
    const res = await DSA_api.deleteProfile(id);
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: res.data.message,
      life: 3000,
    });
    getProfileList();
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const maximizeDialog = () => {
  setTimeout(() => {
    if (dialog.value) {
      dialog.value.maximize();
    }
  }, 0);
};
watch(visible, (newVal) => {
  if (!newVal && dialog.value) {
    dialog.value.maximized = false; // Ensure it resets when closed
  }
});
const viewProfile = async (id) => {
  try {
    progressSpinnerModal.value = true;
    const res = await DSA_api.getProfileWithId(id);
    dsaStore.dataProfile = res.data;
    setTimeout(() => {
      progressSpinnerModal.value = false;
      visible.value = true;
    }, 1000);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>
<style scoped>
.p-stepper {
  flex-basis: 50rem;
}
.input_profile {
  border: 0;
  outline: 0;
  background-color: transparent;
  font-size: 1em;
  width: 100%;
  border-bottom: 2px solid var(--highlight-bg);
  border-radius: 0; /* Đảm bảo viền không bị bo tròn */
}
</style>

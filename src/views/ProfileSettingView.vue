<template>
  <div class="card layout-content">
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedCustomer"
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
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Global Search" />
          </IconField>
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
      <Column field="profileName" header="Name" style="width: 25%"> </Column>
      <Column field="timestamp" header="Created Time" sortable style="width: 40%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-clock" style="color: green"></i>

            <span>{{ convertDateTimeToString(data.timestamp) }}</span>
          </div>
        </template>
      </Column>

      <Column field="active" header="Active" filterMatchMode="equals" style="width: 25%">
        <template #body="{ data }">
          <Tag :value="data.active ? 'True' : 'False'" :severity="getSeverity(data.active)" />
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 6rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-upload"
            class="mr-2"
            outlined
            rounded
            @click="activeProfile(slotProps.data._id)"
            size="small"
          />
          <Button
            icon="pi pi-eye"
            class="mr-2"
            severity="info"
            outlined
            rounded
            @click="viewProfile(slotProps.data._id)"
            size="small"
          />

          <Button
            icon="pi pi-trash"
            outlined
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
    maximizable
    modal
    header="Header"
    :style="{ width: '100%', height: '100%' }"
  >
    <profileSettingCreate @createProfile="createProfile"></profileSettingCreate>
  </Dialog>
  <Toast></Toast>
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

import profileSettingCreate from './profileSettingCreate.vue';
const confirm = useConfirm();
const toast = useToast();
const dsaStore = useDSAStore();

const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
const { convertDateTimeToString } = chartComposable();

const selectedCustomer = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  'country.name': {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
});

const visible = ref(false);

onMounted(async () => {
  await getProfileList();
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

const hideButton = (command) => {
  console.log(command, 'command');
  const specialCommands = [20, 21, 22, 100];
  return specialCommands.includes(command);
};
const dialog = ref(null);

const createNewProfileHandle = () => {
  visible.value = true;
  // nextTick(() => {
  //   dialog.value.maximize();
  // });
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

const viewProfile = async () => {
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
</script>
<style scoped>
.p-stepper {
  flex-basis: 50rem;
}
</style>

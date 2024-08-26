<template>
  <DataTable
    :value="data"
    paginator
    :rows="10"
    :totalRecords="totalList"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :rowClass="rowClass"
    :lazy="true"
    :sortOrder="1"
    rowHover
    @page="emit('update:currentPage')"
  >
    <template #header>
      <div class="flex flex-wrap justify-content-end gap-2">
        <Button severity="secondary" text icon="pi pi-download" label="Download" disabled />
        <Button severity="info" text icon="pi pi-upload" label="Upload" disabled />
        <Button text icon="pi pi-plus" label="Create" @click="createVisibleDialog = true" />
      </div>
    </template>

    <Column field="generalInfo.name" header="Name" style="width: 15%"></Column>
    <Column field="generalInfo.emsName" header="Ems Name" style="width: 15%"></Column>
    <Column field="generalInfo.emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
    <Column field="generalInfo.operationName" header="Operation Name" style="width: 15%"></Column>
    <Column field="generalInfo.softwareName" header="Software Name" style="width: 15%"></Column>

    <Column style="width: 1%; min-width: 5rem">
      <template #body="slotProps">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPSE(slotProps.data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
        </div>
      </template>
    </Column>
  </DataTable>

  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '28rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.name" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.emsName" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
      <div class="pl-3">
        <InputText
          id="areaname"
          v-model="psCreate.emsUniqueId"
          class="flex-auto"
          autocomplete="off"
          :invalid="idExisted"
          @input="idExisted = false"
        />
        <div class="pt-2 pl-3">
          <small v-show="idExisted" id="areanameInvalidMsg" class="text-red-300"> Ems UniqueId already exists.</small>
        </div>
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.operationName" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="psCreate.softwareName" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="createPS()"></Button>
    </template>
  </Dialog>

  <!-- Edit dialog data -->
  <Dialog v-model:visible="editVisibleDialog" :style="{ width: '28rem' }" header="Edit " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Update Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.name" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.emsName" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
      <InputText
        id="areaname"
        class="flex-auto"
        autocomplete="off"
        disabled
        v-model="pseEdit.generalInfo.emsUniqueId"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.operationName" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="pseEdit.generalInfo.softwareName" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="editPSE()"></Button>
    </template>
  </Dialog>

  <!-- Delete dialog data -->
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '28rem' }" header="Delete " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Delete Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-12rem"> Name</label>
      <InputText id="areaname" v-model="pseDelete.generalInfo.name" class="flex-auto" disabled autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-12rem"> Ems Name</label>
      <InputText id="areaname" v-model="pseDelete.generalInfo.emsName" class="flex-auto" disabled autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-12rem"> Ems UniqueId</label>
      <InputText
        id="areaname"
        v-model="pseDelete.generalInfo.emsUniqueId"
        class="flex-auto"
        disabled
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-12rem"> Operation Name</label>
      <InputText
        id="areaname"
        v-model="pseDelete.generalInfo.operationName"
        class="flex-auto"
        disabled
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-12rem"> Software Name</label>
      <InputText
        id="areaname"
        v-model="pseDelete.generalInfo.softwareName"
        class="flex-auto"
        disabled
        autocomplete="off"
      />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="deleteVisibleDialog = false"></Button>
      <Button type="button" label="Submit" severity="danger" @click="deletePSE()"></Button>
    </template>
  </Dialog>
  <Toast />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import api from './api';
const toast = useToast();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(['getData', 'update:currentPage', 'editData', 'deleteData']);
const totalList = computed(() => {
  return props.data.length > 0 ? 'Yes' : 'No';
});
// create
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

const randomString = generateRandomString(10);
const createVisibleDialog = ref(false);
const psCreate = reactive({
  name: randomString,
  uniqueId: randomString,
  parrentId: randomString,
  emsName: randomString,
  emsUniqueId: randomString,
  operationName: randomString,
  operationUniqueId: randomString,
  softwareName: randomString,
  softwareUniqueId: randomString,
});

const idExisted = ref(false);

const createPS = async () => {
  try {
    await api.createGeneralPSE(psCreate);
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    emit('getData');
  } catch (error) {
    console.log('handleCreatePS: error ', error);
    if (error.data.detail.includes('duplicate key error')) {
      console.log('duplicate key error');
      idExisted.value = true;
    }

    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Edit
const editVisibleDialog = ref(false);
const pseEdit = ref({});
const handleEditPSE = (pseData) => {
  pseEdit.value = pseData;
  editVisibleDialog.value = true;
};

const editPSE = async () => {
  emit('editData', pseEdit.value);
  editVisibleDialog.value = false;
};

// Delete
const deleteVisibleDialog = ref(false);
const pseDelete = ref({});
const handleDeletePSE = (pseData) => {
  pseDelete.value = pseData;
  deleteVisibleDialog.value = true;
};

const deletePSE = async () => {
  emit('deleteData', pseDelete.value._id);
  deleteVisibleDialog.value = false;
  emit('getData');
};
</script>

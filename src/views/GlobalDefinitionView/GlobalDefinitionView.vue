<template>
  <div class="card layout-content m-4">
    <Toast />

    <DataTable
      :value="globaldefinitionList"
      paginator
      :rows="10"
      :totalRecords="globaldefinitionTotal"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      :sortOrder="1"
      rowHover
      @page="onPageChange"
    >
      <template #header>
        <div class="flex justify-content-end gap-3">
          <Button type="button" label="Create" icon="pi pi-plus" @click="createVisibleDialog = true" text />
        </div>
      </template>

      <Column field="name" header="Name"> </Column>

      <Column field="active" header="Active">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Tag :value="data.active ? 'True' : 'False'" :severity="data.active ? 'success' : 'secondary'" />
          </div>
        </template>
      </Column>
      <Column field="createdTimestamp" header="Created At">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.createdTimestamp) }}
          </div>
        </template>
      </Column>
      <Column field="modifiedTimestamp" header="Modified At">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.modifiedTimestamp) }}
          </div>
        </template>
      </Column>
      <Column style="width: 1%; min-width: 5rem">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil" severity="info" text rounded @click="handleEdit(data)" />
            <Button v-tooltip.bottom="'Active'" icon="pi pi-caret-right" text rounded @click="handleActive(data)" />
            <router-link :to="`/globaldefinition/${data._id}`" rel="globaldefinition">
              <Button  icon="pi pi-wrench" severity="warning"  text rounded />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDelete(data)" />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
  </div>

  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '28rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Global definition</span>
      </div>
    </template>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Name" class="font-semibold w-6rem"> Name</label>
      <InputText id="Name" v-model="createData.name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="active" class="font-semibold w-6rem"> Active</label>
      <InputSwitch id="active" v-model="createData.active" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Save" @click="createGlobaldefinition()"></Button>
    </template>
  </Dialog>

  <!-- edit dialog data -->
  <Dialog v-model:visible="editVisibleDialog" :style="{ width: '32rem' }" header="Update " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Update - Global definition</span>
      </div>
    </template>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Name" class="font-semibold w-8rem"> Name</label>
      <InputText id="Name" v-model="editData.name" class="flex-auto" autocomplete="off" />
    </div>
    <!-- <div class="flex align-items-center gap-3 mb-3">
      <label for="active" class="font-semibold w-8rem"> Active</label>
      <InputSwitch id="active" v-model="editData.active" />
    </div> -->

    <div class="flex align-items-center gap-3 py-3">
      <label for="modifiedTimestamp" class="font-semibold w-8rem"> Last Modified</label>
      <div>{{ convertDateTimeToString(editData.modifiedTimestamp) }}</div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Update" @click="editGlobaldefinition()"></Button>
    </template>
  </Dialog>

  <!-- delete dialog data -->
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '28rem' }" header="Delete " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Delete - Global definition</span>
      </div>
    </template>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Name" class="font-semibold w-6rem"> Name</label>
      <InputText id="Name" v-model="deleteData.name" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="active" class="font-semibold w-6rem"> Active</label>
      <InputSwitch id="active" v-model="deleteData.active" disabled />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="deleteVisibleDialog = false"></Button>
      <Button type="button" label="Delete" severity="danger" @click="deleteGlobaldefinition()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';

import InputSwitch from 'primevue/inputswitch';

import api from './api';
import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';
const toast = useToast();
const { convertDateTimeToString } = chartComposable();

onMounted(async () => {
  await getGlobaldefinitionList();
});

// --- globaldefinition List ---

const globaldefinitionList = ref([]);
const currentPage = ref(1);
const globaldefinitionTotal = ref(0);

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getGlobaldefinitionList();
};

const getGlobaldefinitionList = async () => {
  try {
    const res = await api.getList(currentPage.value);
    globaldefinitionList.value = res.data.items;
    globaldefinitionTotal.value = res.data.total;
  } catch (error) {
    console.error('setGlobaldefinitionList error', error);
  }
};

// --- CRUD ---
//  create
const createVisibleDialog = ref(false);
const createData = ref({
  name: '',
  active: false,
});
const createGlobaldefinition = async () => {
  try {
    const res = await api.createGlobaldefinition(createData.value);
    getGlobaldefinitionList();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });
    createVisibleDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//  edit

const editVisibleDialog = ref(false);
const editData = ref();

const handleEdit = (data) => {
  editData.value = data;
  editVisibleDialog.value = true;
};

const handleActive =async (data) => {
  try {
    const res = await api.activeGlobaldefinition(data._id);
    getGlobaldefinitionList();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const editGlobaldefinition = async () => {
  try {
    const res = await api.editGlobaldefinition(editData.value._id, {
      name: editData.value.name,
      active: editData.value.active,
    });
    getGlobaldefinitionList();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });
    editVisibleDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//  delete

const deleteVisibleDialog = ref(false);
const deleteData = ref();

const handleDelete = (data) => {
  deleteData.value = data;
  deleteVisibleDialog.value = true;
  console.log('deleteData.value', deleteData.value);
};
const deleteGlobaldefinition = async () => {
  try {
    const res = await api.deleteGlobaldefinition(deleteData.value._id);
    getGlobaldefinitionList();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });
    deleteVisibleDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

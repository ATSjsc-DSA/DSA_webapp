<template>
  <div class="card layout-content m-4">
    <DataTable
      :value="listProject"
      paginator
      :rows="10"
      :totalRecords="totalList"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      @page="onPageChange"
      :sortOrder="1"
      rowHover
    >
      <template #header>
        <div class="flex justify-content-end">
          <Button
            type="button"
            label="Create Project"
            icon="pi pi-plus"
            @click="handleCreateProject()"
            size="small"
            text
          />
        </div>
      </template>

      <Column field="name" header="Name" style="width: 15%"> </Column>

      <Column field="createdTime" header="Created Time" sortable style="width: 12%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-plus-circle" style="color: burlywood"></i>

            <span>{{ convertDateTimeToString(data.createdTimestamp) }}</span>
          </div>
        </template>
      </Column>
      <Column field="description" header="Description" style="width: 15%"> </Column>

      <Column field="createdUser" header="Created User" filterMatchMode="equals" style="width: 10%">
        <template #body="{ data }">
          <Chip :label="data.createdUser" />

          <!-- <Tag :value="getCommandType(data.commandType)" :severity="getCommandType(data.commandType)" /> -->
        </template>
      </Column>

      <Column style="width: 1%; min-width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-content-between">
            <Button
              icon="pi pi-pencil            "
              severity="success"
              text
              rounded
              @click="handleEditProject(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="deleteProject($event, slotProps.data._id)"
            />

            <Button icon="pi pi-caret-right" text rounded @click="runProject(slotProps.data._id)" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Toast />
    <ConfirmPopup></ConfirmPopup>
  </div>
  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '28rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Profile</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">profile information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="projectCreate.name" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Description</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="projectCreate.description" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="createProject()"></Button>
    </template>
  </Dialog>

  <!-- edit dialog data -->
  <Dialog v-model:visible="editVisibleDialog" :style="{ width: '28rem' }" header="Edit " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Profile</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">profile information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="projectEdit.name" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Description</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="projectEdit.description" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Update" @click="editProject()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';
import { useCommonStore } from '@/store';
import router from '@/router';

const { convertDateTimeToString } = chartComposable();
const toast = useToast();
const confirm = useConfirm();
const commonStore = useCommonStore();
const { projectId } = storeToRefs(commonStore);

onMounted(() => {
  getListProject();
});

const listProject = ref([]);
const totalList = ref(0);
const currentPage = ref(1);
const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getListProject();
};

const getListProject = async () => {
  try {
    const res = await api.getProjectList({ page: currentPage.value });
    listProject.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const createVisibleDialog = ref(false);
const editVisibleDialog = ref(false);

const projectCreate = ref({
  name: '',
  description: '',
});

const projectEdit = ref({
  _id: '',
  name: '',
  description: '',
});
const handleCreateProject = () => {
  createVisibleDialog.value = true;
};
const handleEditProject = (dataProject) => {
  projectEdit.value = {
    _id: dataProject._id,
    name: dataProject.name,
    description: dataProject.description,
  };
  editVisibleDialog.value = true;
};

const createProject = async () => {
  try {
    const res = await api.createProject(projectCreate.value);
    getListProject();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });

    createVisibleDialog.value = false;
  } catch (error) {
    // createVisibleDialog.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const editProject = async () => {
  try {
    const res = await api.editProject(projectEdit.value._id, {
      name: projectEdit.value.name,
      description: projectEdit.value.description,
    });
    getListProject();
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.message, life: 3000 });

    editVisibleDialog.value = false;
  } catch (error) {
    // createVisibleDialog.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const deleteProject = async (event, projectId) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Save',
    accept: async () => {
      try {
        const res = await api.deleteroject(projectId);
        getListProject();
        toast.add({ severity: 'success', summary: 'Success Message', detail: res.data.message, life: 3000 });

        createVisibleDialog.value = false;
      } catch (error) {
        progressSpinnerModal.value = false;
        toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
const runProject = (id) => {
  projectId.value = id;
  localStorage.setItem('projectId', projectId.value);
  router.push('/powersystem');
};
</script>

<style>
.custom-row-class {
  height: calc(calc(100vh - 18rem) / 10);
}
</style>

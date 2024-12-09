<template>
  <div class="card layout-content m-4">
    <DataTable
      :value="listProject"
      :paginator="totalList >= 10"
      :rows="10"
      :totalRecords="totalList"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      :sortOrder="1"
      rowHover
      @page="onPageChange"
    >
      <template #header>
        <div class="flex justify-content-between">
          <Button
            type="button"
            label="Create Project"
            icon="pi pi-plus"
            size="small"
            text
            @click="handleCreateProject()"
          />
          <Button v-tooltip.bottom="'Logout'" severity="secondary" icon="pi pi-sign-out" text @click="onLogout()" />
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
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil" severity="success" text rounded @click="handleEditProject(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="deleteProject($event, data._id)" />

            <Button icon="pi pi-caret-right" text rounded @click="handleRunProject(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Toast />
    <ConfirmPopup />
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
      <InputText id="areaname" v-model="projectCreate.name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Description</label>
      <InputText id="areaname" v-model="projectCreate.description" class="flex-auto" autocomplete="off" />
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
      <InputText id="areaname" v-model="projectEdit.name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Description</label>
      <InputText id="areaname" v-model="projectEdit.description" class="flex-auto" autocomplete="off" />
    </div>
    <template #empty> No Data </template>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Update" @click="editProject()"></Button>
    </template>
  </Dialog>

  <!-- choode online offline mode dialog  -->
  <Dialog
    v-model:visible="chooseModeVisibleDialog"
    :style="{ width: '48rem' }"
    header="chooseModeVisibleDialog"
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap text-xl">Run Project - {{ projectSelectedData.name }}</span>
      </div>
    </template>
    <div class="flex justify-content-between align-items-center gap-6 my-3">
      <div style="width: 20rem">
        <div class="text-lg font-semibold mb-3">Offline Mode</div>
        <div class="py-3">Full permission.</div>
        <div class="w-full flex justify-content-end">
          <Button
            class="float-right"
            icon="pi pi-play"
            type="button"
            severity="info"
            label="Run"
            @click="runOfflineMode"
          ></Button>
        </div>
      </div>
      <Divider layout="vertical" class="h-10rem flex" />
      <div style="width: 20rem">
        <div class="text-lg font-semibold mb-3">Online Mode</div>
        <div class="py-3">Only View.</div>
        <div class="w-full flex justify-content-end">
          <Button
            class="float-right"
            icon="pi pi-play"
            type="button"
            severity="success"
            label="Run"
            @click="runOnlineMode"
          ></Button>
        </div>
      </div>
    </div>
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
const { projectData, slotData } = storeToRefs(commonStore);

const onLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('gridStackComponentArr');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  router.push('/login');
};
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
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Submit',
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
  });
};

const projectSelectedData = ref({});
const chooseModeVisibleDialog = ref(false);
const handleRunProject = (project) => {
  projectSelectedData.value = project;
  chooseModeVisibleDialog.value = true;
};

const runOnlineMode = async () => {
  try {
    projectData.value = projectSelectedData.value;
    localStorage.setItem('projectData', JSON.stringify(projectSelectedData.value));

    const res = await api.getOnlineModeId();
    slotData.value = res.data;
    localStorage.setItem('slotData', JSON.stringify(res.data));
    setTimeout(() => {
      router.push('/');
    }, 500);
  } catch (error) {
    console.log('runOnlineMode error: ', error);
    toast.add({ severity: 'error', summary: 'Online Mode', detail: error.data.detail, life: 3000 });
  }
};
const runOfflineMode = () => {
  projectData.value = projectSelectedData.value;
  console.log('project', projectSelectedData.value);
  localStorage.setItem('projectData', JSON.stringify(projectSelectedData.value));
  router.push('/powersystem/slot');
};
</script>

<style>
.custom-row-class {
  height: calc(calc(100vh - 18rem) / 10);
}
</style>

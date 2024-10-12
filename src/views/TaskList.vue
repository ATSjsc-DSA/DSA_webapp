<template>
  <div class="card layout-content relative h-full pt-6">
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>

    <DataTable
      :value="listTask"
      paginator
      :rows="10"
      :totalRecords="totalList"
      rowGroupMode="rowspan"
      groupRowsBy="powerSystemModelDetails.name"
      sortMode="single"
      sortField="powerSystemModelDetails.name"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :rowClass="rowClass"
      :lazy="true"
      @page="onPageChange"
      :sortOrder="1"
      rowHover
    >
      <template #header>
        <div class="flex justify-content-between">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Global Search" size="sm" />
          </IconField>
          <div>
            <Button type="button" label="Add Task" icon="pi pi-plus" @click="addTask()" size="small" outlined />
          </div>
        </div>
      </template>
      <Column field="powerSystemModelDetails.name" header="PSM Name" style="width: 10%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span> {{ data.powerSystemModelDetails.name }}</span>
          </div>
        </template></Column
      >
      <Column field="name" header="Name" style="width: 15%"> </Column>

      <Column field="createdTime" header="Created Time" sortable style="width: 12%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-plus-circle" style="color: burlywood"></i>

            <span>{{ convertDateTimeToString(data.createdTime) }}</span>
          </div>
        </template>
      </Column>
      <Column field="assignedTime" header="Assigned Time" sortable style="width: 12%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-bookmark" style="color: yellow"></i>

            <span>{{ convertDateTimeToString(data.assignedTime) }}</span>
          </div>
        </template></Column
      >
      <Column field="finishedTime" header="Finished Time" sortable style="width: 12%">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-stopwatch" style="color: green"></i>

            <span>{{ convertDateTimeToString(data.finishedTime) }}</span>
          </div>
        </template></Column
      >
      <Column field="engineId" header="Engine Id" style="width: 5%; min-width: 3rem">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i v-badge.info="data.engineId" class="pi pi-desktop" style="font-size: 1.5rem" />
          </div>
        </template>
      </Column>
      <Column field="commandType" header="Command Type" filterMatchMode="equals" style="width: 10%">
        <template #body="{ data }">
          <Chip :label="getCommandType(data.commandType)" />
        </template>
      </Column>

      <Column field="state" header="State" filterMatchMode="equals" style="width: 8%; min-width: 6rem">
        <template #body="{ data }">
          <Tag :value="getState(data.state)" :severity="getSeverity(data.state)" />
        </template>
      </Column>
      <Column style="width: 1%; min-width: 3rem">
        <template #body="slotProps">
          <div v-if="hideButton(slotProps.data.commandType) && slotProps.data.state === 2">
            <Button icon="pi pi-external-link" outlined rounded @click="forwardView(slotProps.data)" />
          </div>
          <div v-else></div>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- create task  -->
  <Dialog v-model:visible="uploadDialog" @hide="onHide" :style="{ width: '50rem' }" header="" :modal="true">
    <TabView>
      <TabPanel header="Gen File Upload">
        <uploadFileConfig @uploadFile="uploadGenFile"></uploadFileConfig>
      </TabPanel>
      <TabPanel header="Load File Upload">
        <uploadFileConfig @uploadFile="uploadLoadFile"></uploadFileConfig>
      </TabPanel>
      <TabPanel header="Branch File Upload">
        <uploadFileConfig @uploadFile="uploadBranchFile"></uploadFileConfig>
      </TabPanel>
    </TabView>
  </Dialog>
</template>
<!-- && slotProps.data.state === 2 -->
<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DSA_api from '@/api/dsa_api';
import chartComposable from '@/combosables/chartData';
import { useCommonStore } from '@/store';
import { intervalTime } from '@/Constants/';
import { useRouter, useRoute } from 'vue-router';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';

const items = ref([{ label: 'Task List', route: '/DSA/Task' }]);

const router = useRouter();

const commonStore = useCommonStore();
const { psm_active, psm_automatic } = storeToRefs(commonStore);
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

const forwardView = (data) => {
  if (data.powerSystemModelDetails) {
    psm_automatic.value = false;
    psm_active.value = data.powerSystemModelDetails;
    switch (data.commandType) {
      case 20:
        router.push('/DSA/VSA');
        break;
      case 21:
        router.push('/DSA/SSR');
        break;
      case 22:
        router.push('/DSA/TSA');
        break;
      case 100:
        router.push('/');
        break;
    }
  }
};
const interval = ref(null);

onMounted(async () => {
  await getTaskList();
  interval.value = setInterval(() => {
    getTaskList();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
const listTask = ref([]);
const totalList = ref(0);
const currentPage = ref(1);

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getTaskList();
};
const getTaskList = async () => {
  try {
    const res = await DSA_api.getQueueTask({ page: currentPage.value });
    listTask.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    // progressSpinnerModal.value = false;
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const getState = (state) => {
  switch (state) {
    case 0:
      return 'CREATED';

    case 1:
      return 'ASSIGNED';

    case 2:
      return 'FINISHED';

    case 3:
      return 'ERROR';

    case 4:
      return 'CANCEL';

    case 6:
      return 'TIMEOUT';
  }
};

const getSeverity = (state) => {
  switch (state) {
    case 0:
      return 'info';

    case 1:
      return 'help';

    case 2:
      return 'success';

    case 3:
      return 'danger';

    case 4:
      return 'warning';

    case 6:
      return 'secondary';
  }
};

const getCommandType = (command) => {
  switch (command) {
    case 0:
      return 'SE';

    case 1:
      return 'LF';

    case 2:
      return 'SHC';

    case 3:
      return 'CA';

    case 4:
      return 'TOPO';

    case 5:
      return 'CAPO';

    case 6:
      return 'OPF';

    case 10:
      return 'CONVERGED_CHECK';

    case 20:
      return 'DSA_VSA';

    case 21:
      return 'DSA_SSR';

    case 22:
      return 'DSA_TSA';
    case 23:
      return 'DSA_OSL';

    case 100:
      return 'DSA_TASK_AUTOMATION';

    case 1000:
      return 'CANCEL_CURRENT_CALCULATION';
  }
};

const hideButton = (command) => {
  const specialCommands = [20, 21, 22, 100];
  return specialCommands.includes(command);
};
const addTask = () => {};

const rowClass = () => {
  return 'custom-row-task-class';
};
</script>

<style>
.custom-row-task-class {
  height: calc(calc(100vh - 21rem) / 10);
}
</style>

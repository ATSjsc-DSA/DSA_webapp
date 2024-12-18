<template>
  <div style="height: 46rem">
    <DataTable
      id="versionList"
      :value="versionList"
      dataKey="_id"
      tableStyle="min-width: 50rem;"
      :lazy="true"
      :sortOrder="1"
      rowHover
      showGridlines
      :rowStyle="rowStyle"
      :loading="isLoadingData"
    >
      <template #header>
        <div class="flex align-items-center justify-content-between">
          <div class="font-semibold text-xl py-3">Snapshot</div>
          <div v-if="canChange" class="flex align-items-center justify-content-end">
            <Button type="button" label="Save" icon="pi pi-save" text @click="handleCreateVersion" />
          </div>
        </div>
      </template>
      <Column field="name" frozen header="Name" style="text-wrap: nowrap">
        <template #body="{ data }">
          <div class="font-semibold text-left">
            {{ data.name }}
          </div>
        </template>
      </Column>
      <Column field="version" header="Version" style="text-wrap: nowrap" />
      <Column field="type" header="Type">
        <template #body="{ data }">
          <Tag :value="getTypeValue(data.type)" :severity="getTypeSeverity(data.type)" />
        </template>
      </Column>
      <Column field="state" header="State">
        <template #body="{ data }">
          <Tag :value="getStateValue(data.state)" :severity="getStateSeverity(data.state)" />
        </template>
      </Column>
      <Column field="createdUser" header="Created by" class="capitalize" style="text-wrap: nowrap" />

      <Column header="Created Time">
        <template #body="{ data }">
          {{ convertDateTimeToString(data.createdTimestamp) }}
        </template>
      </Column>
      <Column v-if="canChange" class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
        <template #body="{ data }">
          <Button
            v-tooltip.bottom="'Rollback'"
            icon="pi pi-backward"
            text
            rounded
            class="flex m-auto"
            @click="confirmRollbackVersion($event, data)"
          />
        </template>
      </Column>

      <template #empty> No Data </template>
    </DataTable>
  </div>
  <div class="flex justify-content-end align-items-center">
    <Paginator
      v-if="totalRecords > pageRowNumber"
      v-model:first="paginatorOffset"
      class="flex-grow-1"
      :rows="pageRowNumber"
      :totalRecords="totalRecords"
      :page="currentPage"
      @page="onPageChange"
    ></Paginator>
    <div class="mr-3">Total: {{ totalRecords }}</div>
  </div>

  <confirmUpdateDialog
    message="This action will clear all previous changes and change to This Snapshot."
    action="Continue"
  />

  <!-- create new Snapshot dialog  -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap"> Save Snapshot</span>
      </div>
    </template>

    <div class="my-3">
      <div class="flex flex-column gap-2 mb-3">
        <label for="newVersionDataname" class="font-semibold"> Name </label>
        <InputText id="newVersionDataname" v-model="newVersionData.name" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-column gap-2 mb-3">
        <label for="scheduledOperationTime" class="font-semibold"> Scheduled Operation Time</label>
        <Calendar
          id="scheduledOperationTime"
          v-model="newVersionData.scheduledOperationTime"
          showTime
          hourFormat="24"
        />
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Submit"
        :disabled="!newVersionData.name || !newVersionData.scheduledOperationTime"
        @click="createVersion"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import chartComposable from '@/combosables/chartData';
import confirmUpdateDialog from '@/components/confirmUpdateDialog.vue';
const { convertDateTimeToString } = chartComposable();

const toast = useToast();
const confirm = useConfirm();
import { ApiVersion } from './api';

const props = defineProps({
  canChange: { type: Boolean, default: false },
});
onMounted(async () => {
  await getList();
});

const versionCurrent = ref({});

const versionList = ref([]);
const isLoadingData = ref(false);

const pageRowNumber = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1;
  await getList();
};
const getList = async () => {
  isLoadingData.value = true;
  try {
    const res = await ApiVersion.getList(currentPage.value);
    versionList.value = res.data.items;
    totalRecords.value = res.data.total;
  } catch (error) {
    versionList.value = [];
    console.log('getList: error ', error);
  }
  isLoadingData.value = false;
};

const rowStyle = (data) => {
  if (data._id === versionCurrent.value._id) {
    return { fontWeight: 'bold', fontStyle: 'italic', backgroundColor: 'var( --highlight-bg)' };
  }
};
const getTypeValue = (type) => {
  return type === 0 ? 'Current' : 'Future';
};
const getTypeSeverity = (type) => {
  return type === 0 ? 'primary' : 'info';
};

const getStateValue = (state) => {
  switch (state) {
    case 0:
      return 'OLD';
    case 1:
      return 'EDIT';
    case 2:
      return 'RUN';
    default:
      return 'OLD';
  }
};

const getStateSeverity = (state) => {
  switch (state) {
    case 0:
      return 'secondary';

    case 1:
      return 'warning';

    case 2:
      return 'primary';
    default:
      return 'secondary';
  }
};

const createVisibleDialog = ref(false);

const newVersionData = ref();
const handleCreateVersion = () => {
  newVersionData.value = {
    name: '',
    scheduledOperationTime: new Date(),
  };
  createVisibleDialog.value = true;
};

const createVersion = async () => {
  isLoadingData.value = true;
  try {
    await ApiVersion.saveVersion({
      name: newVersionData.value.name,
      scheduledOperationTime: parseInt(newVersionData.value.scheduledOperationTime.getTime() / 1000),
    });
    toast.add({
      severity: 'success',
      summary: 'Save Snapshot',
      detail: 'Saveed Successfully',
      life: 3000,
    });
    createVisibleDialog.value = false;
    await getList();
  } catch (error) {
    versionList.value = [];
    console.log('getList: error ', error);
  }
  isLoadingData.value = false;
};
const confirmRollbackVersion = (event, data) => {
  confirm.require({
    group: 'updateDialog',
    target: event.currentTarget,
    header: 'Rollback Snapshot - ' + data.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Submit',
    accept: async () => {
      await rollbackVersion(data);
    },
  });
};

const rollbackVersion = async (data) => {
  isLoadingData.value = true;
  try {
    await ApiVersion.rollbackVersion(data._id);
    toast.add({
      severity: 'success',
      summary: 'Rollback Snapshot',
      detail: 'Rollbacked Successfully. Reloading data!',
      life: 3000,
    });
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    versionList.value = [];
    console.log('getList: error ', error);
  }
  isLoadingData.value = false;
};
</script>

<style>
#versionList,
.p-datatable-table {
  height: 100%;
}

#versionList tr.p-datatable-emptymessage {
  vertical-align: top;
}

#versionList tr {
  height: 4rem;
}
</style>

<template>
  <!-- <ScrollPanel style="height: 41rem"> -->
  <DataTable
    id="disturbanceCaseTable"
    v-model:expandedRows="caseExpandedRows"
    :value="caseList"
    tableStyle="min-width: 50rem"
    dataKey="_id"
    size="small"
    @rowExpand="onRowExpand"
    scrollable
    scrollHeight="40rem"
    :rowStyle="rowStyle"
  >
    <Column expander style="width: 5rem" />
    <Column field="name" header="Name" frozen style="width: 15%; text-wrap: nowrap"> </Column>
    <Column field="active" header="Active">
      <template #body="{ data }">
        <Tag :severity="data.active ? 'primary' : 'secondary'" :value="String(data.active)"></Tag>
      </template>
    </Column>
    <Column style="width: 8rem">
      <template #header>
        <Button
          class="flex justify-content-center w-full"
          type="button"
          icon="pi pi-plus"
          size="small"
          text
          @click="handleCaseCreate"
        />
      </template>
      <template #body="{ data }">
        <Button icon="pi pi-pencil" rounded text class="mr-2" @click="handlerUpdate(data)" />
        <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete($event, data)" />
      </template>
    </Column>
    <template #empty> No Data </template>
    <template #expansion="{ data }">
      <div class="p-3">
        <tsaDisturbanceWidget v-if="data.loadedData" :case-id="data._id" />
      </div>
    </template>
  </DataTable>
  <!-- </ScrollPanel> -->
  <div class="flex justify-content-end align-items-center mt-2">
    <Paginator
      v-if="recordTotal > pageRowNumber"
      v-model:first="paginatorOffset"
      class="flex-grow-1"
      :rows="pageRowNumber"
      :totalRecords="recordTotal"
      :page="currentPage"
      @page="onPageChange"
    ></Paginator>
    <div class="mr-3 mt-3">Total: {{ recordTotal }}</div>
  </div>

  <Dialog v-model:visible="changeVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Disturbance case</span>
      </div>
    </template>

    <div class="flex flex-column gap-2 mb-3">
      <label for="caseName" class="font-semibold"> Name </label>
      <InputText id="caseName" v-model="caseData.name" class="flex-auto" autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="caseActive" class="font-semibold w-6rem"> Active</label>
      <InputSwitch id="caseActive" v-model="caseData.active" autocomplete="off" />
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="changeVisibleDialog = false"></Button>
      <Button v-if="modeChange === 'Create'" type="button" label="Save" @click="createCase"></Button>
      <Button v-if="modeChange === 'Update'" type="button" label="Update" @click="updateCase"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import InputSwitch from 'primevue/inputswitch';

import ScrollPanel from 'primevue/scrollpanel';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ApiDisturbances, ApiDisturbance } from '@/views/SystemEvents/api';
import tsaDisturbanceWidget from './tsaDisturbanceWidget.vue';

const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  projectVersionId: {
    type: String,
    default: '',
  },
  tsaId: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  await getDisturbancesCaseList();
});

watch(
  () => props.tsaId,
  async (newVal, oldValue) => {
    console.log(newVal, oldValue);
    if (newVal !== oldValue) {
      await getDisturbancesCaseList();
    }
  },
);

// ----- Disturbances Case
const caseList = ref([]);
const pageRowNumber = ref(10);
const recordTotal = ref(0);
const currentPage = ref(1);
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getDisturbancesCaseList();
};
const getDisturbancesCaseList = async () => {
  try {
    const res = await ApiDisturbances.getList(props.tsaId, currentPage.value);
    caseList.value = res.data.items;
    recordTotal.value = res.data.total;
  } catch (error) {
    console.log('getScadaList: error ', error);
    caseList.value = [];
  }
};

const caseExpandedRows = ref({});
const onRowExpand = async (event) => {
  const expandRows = {};
  expandRows[event.data._id] = true;
  caseExpandedRows.value = expandRows;
  event.data.loadedData = true;
};

//  Disturbances Case - CRUD
const modeChange = ref();
const changeVisibleDialog = ref(false);
const caseData = ref({
  name: '',
  active: true,
});
const handleCaseCreate = () => {
  modeChange.value = 'Create';
  caseData.value = {
    name: '',
    active: true,
  };
  changeVisibleDialog.value = true;
};
const createCase = async () => {
  try {
    await ApiDisturbances.createDisturbances(props.tsaId, caseData.value);
    await getDisturbancesCaseList();
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('getScadaList: error ', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const handlerUpdate = (data) => {
  modeChange.value = 'Update';
  caseData.value = JSON.parse(JSON.stringify(data));
  changeVisibleDialog.value = true;
};
const updateCase = async () => {
  try {
    await ApiDisturbances.updateDisturbances(caseData.value._id, caseData.value);
    await getDisturbancesCaseList();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('getScadaList: error ', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDelete = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Disturbance Case',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteDisturbances(data);
    },
  });
};
const deleteDisturbances = async (data) => {
  try {
    await ApiDisturbances.deleteDisturbances(data._id);
    await getDisturbancesCaseList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
    changeVisibleDialog.value = false;
  } catch (error) {
    console.log('deleteDisturbances: error ', error);
    toast.add({ severity: 'error', summary: 'Deleted Message', detail: error.data.detail, life: 3000 });
  }
};
const rowStyle = (data) => {
  if (data._id === Object.keys(caseExpandedRows.value)[0]) {
    return { backgroundColor: 'var(--primary-300)' };
  }
};
</script>

<style>
.p-datatable-row-expansion {
  background-color: var(--primary-100);
}
#disturbanceCaseTable .p-column-title {
  font-size: 1.1rem;
  padding: 0.5rem 0;
}
</style>

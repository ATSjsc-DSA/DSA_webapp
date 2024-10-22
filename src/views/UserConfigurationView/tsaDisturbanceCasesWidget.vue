<template>
  <ScrollPanel style="height: 41rem">
    <DataTable
      id="disturbanceCaseTable"
      v-model:expandedRows="caseExpandedRows"
      :value="caseList"
      tableStyle="min-width: 50rem"
      dataKey="_id"
      size="small"
      @rowExpand="onRowExpand"
    >
      <template #header>
        <div class="flex justify-content-end">
          <Button type="button" icon="pi pi-plus" size="small" text @click="handleCaseCreate" />
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="name" header="Name" frozen style="width: 15%; text-wrap: nowrap"> </Column>
      <Column field="active" header="Active">
        <template #body="{ data }">
          <Tag :severity="data.active ? 'primary' : 'secondary'" :value="String(data.active)"></Tag>
        </template>
      </Column>
      <template #empty> No Data </template>
      <template #expansion="{ data }">
        <div class="p-3">
          <tsaDisturbanceWidget v-if="data.loadedData" :case-id="data._id" />
        </div>
      </template>
    </DataTable>
  </ScrollPanel>
  <div class="flex justify-content-end align-items-center">
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

  <Dialog v-model:visible="createCaseVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Disturbance case</span>
      </div>
    </template>

    <div class="flex flex-column gap-2 mb-3">
      <label for="caseName" class="font-semibold"> Name </label>
      <InputText id="caseName" v-model="newCaseData.name" class="flex-auto" autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="caseActive" class="font-semibold w-6rem"> Active</label>
      <InputSwitch id="caseActive" v-model="newCaseData.active" autocomplete="off" />
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createCaseVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="createCase"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import InputSwitch from 'primevue/inputswitch';

import ScrollPanel from 'primevue/scrollpanel';

import { useToast } from 'primevue/usetoast';
import { ApiDisturbances, ApiDisturbance } from '@/views/SystemEvents/api';
import tsaDisturbanceWidget from './tsaDisturbanceWidget.vue';

const toast = useToast();

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

const createCaseVisibleDialog = ref(false);
const newCaseData = ref();
const handleCaseCreate = () => {
  newCaseData.value = {
    name: '',
    active: true,
  };
  createCaseVisibleDialog.value = true;
};
const createCase = async () => {
  try {
    await ApiDisturbances.createDisturbances(props.tsaId, newCaseData.value);
    await getDisturbancesCaseList();
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    createCaseVisibleDialog.value = false;
  } catch (error) {
    console.log('getScadaList: error ', error);
    caseList.value = [];
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style>
.p-datatable-row-expansion {
  background-color: var(--surface-100);
}
#disturbanceCaseTable .p-column-title {
  font-size: 1.1rem;
  padding: 0.5rem 0;
}
</style>

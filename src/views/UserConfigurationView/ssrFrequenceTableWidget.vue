<template>
  <div style="height: 41rem">
    <DataTable :value="frequenceList" tableStyle="min-width: 50rem" size="small" :loading="isLoading">
      <template #header>
        <div class="flex justify-content-end">
          <Button type="button" icon="pi pi-plus" size="small" text @click="createVisibleDialog = true" />
        </div>
      </template>
      <Column field="name" header="Name" frozen style="width: 15%; text-wrap: nowrap"> </Column>
      <Column field="fMax" header="Max" style="text-wrap: nowrap" />
      <Column field="fMin" header="Min" style="text-wrap: nowrap" />
      <Column field="step" header="Step" style="text-wrap: nowrap" />
      <Column style="width: 1%; min-width: 5rem">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdate(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete($event, data)" />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
  </div>
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
    <div class="mr-3">Total: {{ recordTotal }}</div>
  </div>
  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Frequency</span>
      </div>
    </template>
    <div class="grid">
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="name" class="font-semibold w-6rem"> Name</label>
          <InputText id="name" v-model="newData.name" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="fMax" class="font-semibold w-6rem"> Max</label>
          <InputNumber id="fMax" v-model="newData.fMax" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="fMin" class="font-semibold w-6rem"> Min</label>
          <InputNumber id="fMin" v-model="newData.fMin" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="step" class="font-semibold w-6rem"> Step</label>
          <InputNumber id="step" v-model="newData.step" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newData.name" @click="createSsrFrequency"></Button>
    </template>
  </Dialog>
  <!-- update dialog data -->
  <Dialog v-model:visible="updateVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Frequency</span>
      </div>
    </template>
    <div class="grid">
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="areaname" class="font-semibold w-6rem"> Name</label>
          <InputText id="areaname" v-model="updateData.name" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="fMax" class="font-semibold w-6rem"> Max</label>
          <InputNumber id="fMax" v-model="updateData.fMax" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="fMin" class="font-semibold w-6rem"> Min</label>
          <InputNumber id="fMin" v-model="updateData.fMin" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
      <div class="col-12">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="step" class="font-semibold w-6rem"> Step</label>
          <InputNumber id="step" v-model="updateData.step" class="flex-auto w-full" autocomplete="off" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="updateVisibleDialog = false"></Button>
      <Button type="button" label="Update" @click="updateSsrFrequency"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
const toast = useToast();
const confirm = useConfirm();
import { ApiDsa } from './api';

const props = defineProps({
  ssrId: {
    type: String,
    default: '',
  },
  projectVersionId: {
    type: String,
    default: '',
  },
});
onMounted(async () => {
  await getfrequenceList();
});

watch(
  () => props.ssrId,
  async () => {
    await getfrequenceList();
  },
);

const isLoading = ref(false);
const pageRowNumber = ref(10);
const recordTotal = ref(0);
const currentPage = ref(1);
const paginatorOffset = computed(() => pageRowNumber.value * currentPage.value - 1);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getfrequenceList();
};
const frequenceList = ref();
const getfrequenceList = async () => {
  const loadLoading = setTimeout(() => {
    isLoading.value = true;
  }, 500);
  try {
    const res = await ApiDsa.getSsrFrequencyList(props.projectVersionId, props.ssrId, currentPage.value);
    frequenceList.value = res.data.items;
    recordTotal.value = res.data.total;
  } catch (error) {
    console.error('getfrequenceList: error ', error);
  }

  clearTimeout(loadLoading);
  isLoading.value = false;
};
const createVisibleDialog = ref(false);
const newData = ref({
  fMax: 0,
  fMin: 0,
  name: '',
  step: 0,
  // ssrInformationId: props.ssrId,
});

const createSsrFrequency = async () => {
  try {
    await ApiDsa.createSsrFrequency(props.projectVersionId, props.ssrId, newData.value);
    toast.add({ severity: 'success', summary: 'Created Successfully', life: 3000 });
    createVisibleDialog.value = false;
    await getfrequenceList();
  } catch (error) {
    console.error('getfrequenceList: error ', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
const updateVisibleDialog = ref(false);
const updateData = ref();
const handleUpdate = (data) => {
  updateData.value = JSON.parse(JSON.stringify(data));
  updateVisibleDialog.value = true;
};
const updateSsrFrequency = async () => {
  const data = JSON.parse(JSON.stringify(updateData.value));
  data.startTimestamp = new Date(data.startTimestamp).getTime();
  data.endTimestamp = new Date(data.endTimestamp).getTime();
  try {
    await ApiDsa.updateSsrFrequency(data._id, data);
    await getfrequenceList();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
    updateVisibleDialog.value = false;
  } catch (error) {
    console.error('updateSsrFrequency: error ', error);
    toast.add({ severity: 'error', summary: 'Update Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDelete = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Frequency',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    data: data,
    accept: async () => {
      await deleteSsrFrequency(data._id);
    },
  });
};
const deleteSsrFrequency = async (id) => {
  try {
    await ApiDsa.delSsrFrequency(id);
    await getfrequenceList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.error('deleteSsrFrequency: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

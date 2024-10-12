<template>
  <div class="card">
    <DataTable
      :value="contingencies"
      paginator
      :rows="10"
      :totalRecords="totalList"
      rowGroupMode="rowspan"
      sortMode="single"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      @page="onPageChange"
      :sortOrder="1"
      rowHover
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List Contingency</span>
          <Button icon="pi pi-plus" rounded text raised @click="createThis()" />
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="contingencyType" header="Type">
        <template #body="{ data }">
          <Chip :label="data.type === 0 ? 'N-1' : 'N-2'" />
        </template>
      </Column>
      <Column field="listPowerSystemId" header="List Powersystem">
        <template #body="{ data }">
          <div>
            <span v-for="(item, index) in data.listPowerSystemId" :key="index">
              {{ item.name }}<span v-if="index < data.listPowerSystemId.length - 1">, </span>
            </span>
          </div>
        </template>
      </Column>
      <Column field="active" header="Active">
        <template #body="{ data }">
          <Tag :value="data.active" :severity="data.active ? 'success' : 'danger'" /> </template
      ></Column>
      <Column :exportable="false" style="width: 8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded text class="mr-2" @click="handlerEditThis(slotProps.data)" />
          <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete($event, slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <!-- Dialog -->

    <Dialog v-model:visible="visible" modal header="Edit Contingency" :style="{ width: '35rem' }">
      <span class="p-text-secondary block mb-5">{{ contingencyModelData.name }}</span>
      <div class="p-fluid">
        <div class="field">
          <label for="name" class="font-semibold">Name</label>
          <InputText id="name" class="flex-auto" autocomplete="off" v-model="contingencyModelData.name" />
        </div>
        <div class="field">
          <label for="email" class="font-semibold">Contingency Type</label>
          <Dropdown
            v-model="contingencyModelData.contingencyType"
            :options="listType"
            optionLabel="name"
            option-value="value"
            placeholder="Select a City"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="name" class="font-semibold">List Contingency</label>
          <AutoComplete
            v-model="contingencyModelData.listPowerSystemId"
            completeOnFocus
            multiple
            optionLabel="name"
            :suggestions="items"
            @complete="search"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="active" class="font-semibold">Active</label>
          <InputSwitch id="active" v-model="contingencyModelData.active" />
        </div>

        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Save" @click="editThis()"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiContingency, commonApi } from './api';
onMounted(() => {
  getListContingency();
});
const visible = ref(false);
const listType = ref([
  { name: 'N-1', value: 0 },
  { name: 'N-2', value: 1 },
]);
const contingencyModelData = ref();
const dataDefault = {
  _id: '',
  name: '',
  contingencyType: 0,
  listPowerSystemId: [],
  active: true,
};
const items = ref([]);
const contingencies = ref();
const totalList = ref();
const currentPage = ref(1);
const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getListContingency();
};

const getListContingency = async () => {
  try {
    const res = await ApiContingency.getListContingency({ page: currentPage.value });
    contingencies.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const search = async (event) => {
  const query = event.query.trim();
  try {
    const res = await commonApi.searchPowerSystemData('', query);
    items.value = res.data;
  } catch (error) {
    console.log('searchPsdQueryFilter: error ', error);
  }
};

const confirmDelete = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this contingency?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteThis(data);
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
const createThis = async () => {
  contingencyModelData.value = dataDefault;
  visible.value = true;
};
const deleteThis = async (data) => {};
const handlerEditThis = async (data) => {
  console.log(data);
  contingencyModelData.value = JSON.parse(JSON.stringify(data)); // Tạo bản sao của data
  visible.value = true;
};

const editThis = async () => {
  try {
    const { _id, ...dataToUpdate } = contingencyModelData.value;
    const res = await ApiContingency.updateContingencyData(_id, dataToUpdate);
    contingencies.value = res.data.items;
    totalList.value = res.data.total;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

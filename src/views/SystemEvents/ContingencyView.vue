<template>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
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
          <Button icon="pi pi-plus" rounded text raised @click="handlerCreateThis()" />
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="contingencyType" header="Type">
        <template #body="{ data }">
          <Chip :label="data.contingencyType === 0 ? 'N-1' : 'N-2'" />
        </template>
      </Column>
      <Column field="listPowerSystemId" header="List Power System">
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

    <Dialog v-model:visible="visible" modal :header="headerDialog + ' Contingency'" :style="{ width: '35rem' }">
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
          <label for="name" class="font-semibold">Power System 1</label>
          <AutoComplete
            v-model="autoCompleteValue1"
            completeOnFocus
            optionLabel="name"
            :suggestions="items"
            @complete="search"
          />
        </div>

        <div class="field" v-if="contingencyModelData.contingencyType === 1">
          <label for="name" class="font-semibold">Power System 2</label>
          <AutoComplete
            v-model="autoCompleteValue2"
            completeOnFocus
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
          <Button type="button" label="Save" @click="headerDialog === 'Create' ? createThis() : editThis()"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiContingency, commonApi } from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
  contingenciesActive: Object,
});

const contingenciesActiveId = computed(() => props.contingenciesActive._id);

// onMounted(() => {
//   getListContingency();
// });

watch(contingenciesActiveId, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    getListContingency();
  }
});
const visible = ref(false);
const toast = useToast();
const confirm = useConfirm();

const contingencyModelData = ref({
  _id: '',
  name: '',
  contingencyType: 0,
  listPowerSystemId: [],
  active: true,
});
const headerDialog = ref('Edit');
const autoCompleteValue1 = ref({});
const autoCompleteValue2 = ref({});

watchEffect(() => {
  contingencyModelData.value.listPowerSystemId = [
    ...(autoCompleteValue1.value._id ? [autoCompleteValue1.value._id] : []),
    ...(autoCompleteValue2.value._id ? [autoCompleteValue2.value._id] : []),
  ];
});

const listType = ref([
  { name: 'N-1', value: 0 },
  { name: 'N-2', value: 1 },
]);
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
    const res = await ApiContingency.getListContingency(contingenciesActiveId.value, { page: currentPage.value });
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
  console.log();
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
const handlerCreateThis = async () => {
  contingencyModelData.value = dataDefault;
  autoCompleteValue1.value = {};
  autoCompleteValue2.value = {};
  visible.value = true;
  headerDialog.value = 'Create';
};
const createThis = async () => {
  try {
    await ApiContingency.createContingency(contingenciesActiveId.value, contingencyModelData.value);
    getListContingency();
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handlerEditThis = async (data) => {
  console.log(data);
  contingencyModelData.value = JSON.parse(JSON.stringify(data)); // Tạo bản sao của data
  visible.value = true;
  headerDialog.value = 'Edit';
  if (contingencyModelData.value.listPowerSystemId.length === 1) {
    autoCompleteValue1.value = contingencyModelData.value.listPowerSystemId[0];
  } else if (contingencyModelData.value.listPowerSystemId.length === 2) {
    autoCompleteValue1.value = contingencyModelData.value.listPowerSystemId[0];
    autoCompleteValue2.value = contingencyModelData.value.listPowerSystemId[1];
  }
};

const editThis = async () => {
  try {
    const { _id, ...dataToUpdate } = contingencyModelData.value;
    await ApiContingency.updateContingencyData(_id, dataToUpdate);
    getListContingency();
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Update successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const deleteThis = async (data) => {
  try {
    await ApiContingency.deleteContingency(data._id);
    getListContingency();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Delete successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

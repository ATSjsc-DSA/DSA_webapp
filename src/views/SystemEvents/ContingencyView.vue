<template>
  <Toast />
  <ConfirmPopup group="popup"></ConfirmPopup>
  <div class="card">
    <DataTable
      :value="contingencies"
      :paginator="totalList >= 10"
      :rows="10"
      :totalRecords="totalList"
      rowGroupMode="rowspan"
      sortMode="single"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      :sortOrder="1"
      rowHover
      @page="onPageChange"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">List Contingency</span>
          <Button icon="pi pi-plus" rounded text raised @click="handlerCreateThis()" />
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="contingencyType" header="Type" style="text-wrap: nowrap">
        <template #body="{ data }">
          <Chip :label="data.contingencyType === 0 ? 'N-1' : 'N-2'" />
        </template>
      </Column>
      <Column field="active" header="Active">
        <template #body="{ data }">
          <Tag :value="data.active" :severity="data.active ? 'success' : 'danger'" /> </template
      ></Column>
      <Column field="listPowerSystemId" header="List Power System">
        <template #body="{ data }">
          <div>
            <span v-for="(item, index) in data.listPowerSystemId" :key="index">
              {{ item.name }}<span v-if="index < data.listPowerSystemId.length - 1">, </span>
            </span>
          </div>
        </template>
      </Column>

      <Column :exportable="false" style="width: 8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded text class="mr-2" @click="confirmUpdateThis($event, slotProps.data)" />
          <Button
            ref="popupButton"
            icon="pi pi-trash"
            rounded
            text
            severity="danger"
            @click="confirmDelete($event, slotProps.data)"
          />
        </template>
      </Column>
      <template #empty> No data </template>
    </DataTable>
    <!-- Dialog -->

    <Dialog v-model:visible="visible" modal :header="headerDialog + ' Contingency'" :style="{ width: '48rem' }">
      <div class="grid">
        <div class="col-12 flex justify-content-between">
          <div class="flex flex-column gap-2 mb-3 flex-1">
            <label for="name" class="font-semibold"> Name </label>
            <InputText id="name" v-model="contingencyModelData.name" class="flex-auto w-full" autocomplete="off" />
          </div>
          <div class="flex flex-column gap-2 mb-3 align-items-center">
            <label for="active" class="font-semibold mb-2"> Active</label>
            <InputSwitch id="active" v-model="contingencyModelData.active" autocomplete="off" />
          </div>
        </div>
        <div class="col-12">
          <div class="flex flex-column gap-2 mb-3 flex-1">
            <label for="contingencyType" class="font-semibold">Contingency Type</label>
            <Dropdown
              v-model="contingencyModelData.contingencyType"
              :options="listType"
              optionLabel="name"
              option-value="value"
              placeholder="Select a Type"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="grid align-items-center">
            <div class="col-4">
              <div class="flex flex-column align-items-start gap-1">
                <label for="name" class="font-semibold"> Element Type 1</label>
                <MultiSelect
                  v-model="selectedDefinition1"
                  display="chip"
                  :options="listDefinition"
                  optionLabel="name"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-8">
              <searchPsWidget
                v-model="autoCompleteValue1"
                label="Element 1"
                :definitionId="selectedDefinition1.map((item) => item._id)"
              />
            </div>
          </div>
        </div>
        <template v-if="contingencyModelData.contingencyType === 1">
          <div class="col-4">
            <div class="flex flex-column align-items-start gap-1">
              <label for="name" class="font-semibold"> Element Type 2</label>
              <MultiSelect
                v-model="selectedDefinition2"
                display="chip"
                :options="listDefinition"
                optionLabel="name"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-8">
            <searchPsWidget
              v-model="autoCompleteValue2"
              label="Power System 2"
              :definitionId="selectedDefinition2.map((item) => item._id)"
            />
          </div>
        </template>
      </div>

      <div class="flex justify-content-end gap-2 mt-5">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Save" @click="headerDialog === 'Create' ? createThis() : editThis()"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiContingency } from './api';
import { DefinitionListApi } from '@/views/PowerSystem/api';
import searchPsWidget from '../PowerSystem/searchPsWidget.vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
  contingenciesActive: Object,
});
const popupButton = ref(null); // Để gắn popup vào nút

const contingenciesActiveId = computed(() => props.contingenciesActive._id);

onMounted(() => {
  getDefiniton();
});

watch(contingenciesActiveId, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    getListContingency();
  }
});
const visible = ref(false);
const toast = useToast();
const confirm = useConfirm();
const listDefinition = ref();

const getDefiniton = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionSubsystem();
    listDefinition.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

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
const selectedDefinition1 = ref([]);
const selectedDefinition2 = ref([]);
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

const confirmDelete = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    group: 'popup',
    message: 'Do you want to delete this contingency?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteThis(data);
    },
    reject: () => {},
  });
};
const handlerCreateThis = async () => {
  contingencyModelData.value = dataDefault;
  autoCompleteValue1.value = {};
  autoCompleteValue2.value = {};
  selectedDefinition1.value = listDefinition.value;
  selectedDefinition2.value = listDefinition.value;
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
const confirmUpdateThis = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    group: 'updateDialog',
    header: 'Update Contigency',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Update',
    accept: async () => {
      await handlerEditThis(data);
    },
  });
};
const handlerEditThis = async (data) => {
  contingencyModelData.value = JSON.parse(JSON.stringify(data)); // Tạo bản sao của data
  headerDialog.value = 'Edit';
  selectedDefinition1.value = listDefinition.value;
  selectedDefinition2.value = listDefinition.value;

  if (contingencyModelData.value.listPowerSystemId.length === 1) {
    const psData1 = contingencyModelData.value.listPowerSystemId[0];
    autoCompleteValue1.value = {
      _id: psData1._id,
      name: psData1.name,
    };
  } else if (contingencyModelData.value.listPowerSystemId.length === 2) {
    const psData1 = contingencyModelData.value.listPowerSystemId[0];
    autoCompleteValue1.value = {
      _id: psData1._id,
      name: psData1.name,
    };

    const psData2 = contingencyModelData.value.listPowerSystemId[1];
    autoCompleteValue2.value = {
      _id: psData2._id,
      name: psData2.name,
    };
  }
  visible.value = true;
};

const editThis = async () => {
  try {
    await ApiContingency.updateContingencyData(contingencyModelData.value._id, contingencyModelData.value);
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

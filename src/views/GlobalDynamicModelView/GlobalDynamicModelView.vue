<template>
  <div class="card layout-content m-4">
    <Toast />
    <div class="flex justify-content-end align-items-center flex-wrap 2xl:flex-nowrap">
      <button
        v-tooltip.left="'Global Definition'"
        class="p-link layout-topbar-button"
        type="text"
        @click="onGlobalDefinitionView()"
      >
        <i class="pi pi-sign-out"></i>
      </button>
    </div>
    <Divider />

    <DataTable id="globalDynamicModelDefinition" :value="dynamicDefinition" :loading="isLoadingDynamicData">
      <template #header>
        <div class="flex justify-content-end gap-3">
          <Button
            type="button"
            label="Import"
            icon="pi pi-upload"
            severity="secondary"
            @click="handleImportDefinitionFile()"
          />
          <Button
            type="button"
            label="Export"
            icon="pi pi-download"
            severity="secondary"
            @click="handleExportDefinitionFile()"
          />
          <Divider layout="vertical" />
          <Button type="button" label="Create " icon="pi pi-plus" text @click="handleCreateDynamicDefinition" />
        </div>
      </template>

      <Column field="name" header="Name" sortable></Column>
      <Column field="digsName" header="Digs Name" sortable></Column>
      <Column field="modelType" header="Type">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Tag :value="data.modelType" :severity="getSeverityModelType(data.modelType)" />
          </div>
        </template>
      </Column>

      <Column field="createdTimestamp" header="Created At" sortable>
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.createdTimestamp) }}
          </div>
        </template>
      </Column>
      <Column field="modifiedTimestamp" header="Modified At" sortable>
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.modifiedTimestamp) }}
          </div>
        </template>
      </Column>

      <Column style="width: 1%; min-width: 5rem">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil" severity="success" text rounded @click="handleUpdateDynamicDefinition(data)" />

            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="confirmDeleteDynamic(data, 'definition')"
            />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
    <div class="flex justify-content-end align-items-center mt-3">
      <Paginator
        v-if="definitionTotal > pageRowNumber"
        v-model:first="definitionPaginatorOffset"
        class="flex-grow-1"
        :rows="pageRowNumber"
        :totalRecords="definitionTotal"
        :page="definitionCurrentPage"
        @page="onDefinitionPageChange"
      ></Paginator>
      <div class="mr-3">Total: {{ definitionTotal }}</div>
    </div>
  </div>

  <!-- dynamicDefinition - create/Update dialog -->
  <Dialog v-model:visible="definitionVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Global Dynamic Model Definition</span>
      </div>
    </template>

    <div>
      <label for="Name" class="font-semibold"> Name</label>
      <InputText id="Name" v-model="definitionData.name" class="w-full my-3" autocomplete="off" />
    </div>

    <div>
      <label for="digsName" class="font-semibold"> Digs Name</label>
      <InputText id="digsName" v-model="definitionData.digsName" class="w-full my-3" autocomplete="off" />
    </div>

    <div class="mt-3">
      <label for="modelType" class="font-semibold"> Type</label>

      <Dropdown
        v-model="definitionData.modelType"
        :options="definitionTypeOptions"
        optionGroupLabel="label"
        optionGroupChildren="items"
        placeholder="Select a Type"
        class="w-full my-3"
      >
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div :style="{ color: slotProps.option.code == 'tra' ? '#38bdf8' : 'var(--primary-500)' }">
              {{ slotProps.option.label }}
            </div>
          </div>
        </template>

        <template #option="slotProps">
          <div class="flex align-items-center pl-3">
            <div>{{ slotProps.option }}</div>
          </div>
        </template>
      </Dropdown>
    </div>
    <div class="mt-3">
      <label for="values" class="font-semibold"> Values</label>
      <Chips id="values" v-model="definitionData.values" class="w-full mt-3" autocomplete="off" />
      <div class="p-1">
        <small>Press Enter to Add.</small>
      </div>
    </div>

    <div v-if="modeChange === 'create'" class="mt-3">
      <label for="mapOrder" class="font-semibold"> Map Order</label>
      <Chips id="mapOrder" v-model="definitionData.mapOrder" class="w-full mt-3" autocomplete="off" />
      <div class="p-1">
        <small>Press Enter to Add.</small>
      </div>
    </div>

    <div v-if="modeChange === 'create'" class="mt-3">
      <label for="mapMatrix" class="font-semibold"> Map Matrix</label>
      <Chips
        id="mapMatrix"
        v-model="definitionData.mapMatrix"
        class="w-full mt-3"
        autocomplete="off"
        :invalid="isMapMatrixInValid"
      >
        <template #chip="slotProps">
          <div v-if="isMatrixStringInvalid(slotProps.value)" class="text-red-500">
            <span>[{{ slotProps.value }},]</span>
          </div>
          <div v-else>
            <span>[{{ slotProps.value }}]</span>
          </div>
        </template>
      </Chips>
      <div class="p-1">
        <small>Example: "1,2". Press Enter to Add. </small>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="definitionVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Save"
        :disabled="isChangeDefinitionFormInValid"
        @click="handleChangeDefinition()"
      ></Button>
    </template>
  </Dialog>

  <!-- dynamicMapping - create/Update dialog -->
  <Dialog v-model:visible="mappingVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Global Dynamic Model Mapping</span>
      </div>
    </template>

    <div class="mt-3">
      <label for="globalDynamicModelDefinitionId" class="font-semibold"> Global Dynamic Model Definition </label>

      <div class="w-full my-3">
        <AutoComplete
          v-if="modeChange === 'create'"
          id="globalDynamicModelDefinitionData"
          v-model="mappingChangeData.globalDynamicModelDefinitionData"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="globalDynamicModelDefinitionDataAutocomplete"
          :suggestions="globalDynamicDefinitionSuggestions"
          @complete="searchGlobalDynamicModelDefinition"
        />

        <InputText
          v-else
          id="globalDynamicModelDefinitionName"
          v-model="mappingChangeData.globalDynamicModelDefinitionName"
          disabled
          class="w-full my-3"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="mt-3">
      <label for="values" class="font-semibold"> Values</label>
      <Chips id="values" v-model="mappingChangeData.mapOrder" class="w-full mt-3" autocomplete="off" />
      <div class="p-1">
        <small>Press Enter to Add.</small>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="mappingVisibleDialog = false"></Button>
      <Button type="button" label="Save" @click="handleChangeMapping()"></Button>
    </template>
  </Dialog>

  <ConfirmDialog group="deleteConfirm">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: #fb923c"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div>Do you want to delete this model ?</div>
          <div>Name: {{ slotProps.message.data.name }}</div>
          <div v-if="nameModel === 'definition'">
            Type:
            <Tag
              :value="slotProps.message.data.modelType"
              :severity="getSeverityModelType(slotProps.message.data.modelType)"
            />
          </div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!-- upload file  -->
  <Dialog
    v-model:visible="uploadDialogGlobalDynamicDefinition"
    :style="{ width: '50rem' }"
    header="Upload Dynamic Model Definition File"
    :modal="true"
    @hide="onHide"
  >
    <uploadDynamicModelFile @uploadFile="uploadGlobalDynamicModelFile" />
  </Dialog>
  <Dialog
    v-model:visible="uploadDialogGlobalDynamicMapping"
    :style="{ width: '50rem' }"
    header="Upload Dynamic Model Mapping File"
    :modal="true"
    @hide="onHide"
  >
    <uploadDynamicModelFile @uploadFile="uploadGlobalDynamicModelMappingFile" />
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';
import uploadFileConfig from '../../components/uploadFileConfig.vue';

import uploadDynamicModelFile from './uploadDynamicModelFile.vue';
import router from '@/router';

import { useRoute } from 'vue-router';
const route = useRoute();

import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();
const { convertDateTimeToString } = chartComposable();
const toast = useToast();

onMounted(async () => {
  await getDynamicDefinitionList();
  // await getDynamicMappingList();
});
const tabActice = ref(0);
watch(tabActice, async (newIndex) => {
  if (newIndex === 1 && !mappingData.value) {
    await getGlobalDynamicModelMappingList();
  }
});
watch(
  () => route.params.id,
  (newId, oldId) => {
    globaldefinitionId.value = newId;
  },
);
// --- Get data
const globaldefinitionId = ref(route.params.id);
const pageRowNumber = ref(10);

// dynamicDefinition
const dynamicDefinition = ref();
const isLoadingDynamicData = ref(false);
const definitionCurrentPage = ref(1);
const definitionTotal = ref();
const definitionPaginatorOffset = computed(() => pageRowNumber.value * definitionCurrentPage.value - 1);

const onDefinitionPageChange = async (event) => {
  definitionCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getDynamicDefinitionList();
};

const getDynamicDefinitionList = async () => {
  isLoadingDynamicData.value = true;
  try {
    const res = await api.getGlobalDynamicModelDefinitionList(definitionCurrentPage.value);
    dynamicDefinition.value = res.data.items;
    definitionTotal.value = res.data.total;
  } catch (error) {
    dynamicDefinition.value = [];
    definitionTotal.value = 0;
    console.error('setGlobaldefinitionList error', error);
  }
  isLoadingDynamicData.value = false;
};

// --- dynamicDefinition - CRUD ---

//  create
const definitionVisibleDialog = ref(false);
const definitionData = ref();
const modeChange = ref();

const handleChangeDefinition = async () => {
  if (modeChange.value === 'create') {
    await createDynamicDefinition();
  }
  if (modeChange.value === 'update') {
    await updateDynamicDefinition();
  }
};
const handleCreateDynamicDefinition = () => {
  definitionData.value = {
    name: '',
    modelType: '',
    values: [],
    digsName: '',
    mapMatrix: [],
    mapOrder: [],
    globalDefinitionId: globaldefinitionId.value,
  };
  definitionVisibleDialog.value = true;
  modeChange.value = 'create';
};

const definitionTypeOptions = computed(() => [
  {
    label: 'Traditional',
    code: 'tra',
    items: Object.values(api.TypeGlobalDynamicModelDefinition.Traditional),
  },
  {
    label: 'Renewable',
    code: 'Renewable',
    items: Object.values(api.TypeGlobalDynamicModelDefinition.Renewable),
  },
]);
const createDynamicDefinition = async () => {
  try {
    const data = JSON.parse(JSON.stringify(definitionData.value));
    data.mapMatrix = data.mapMatrix.map((item) => {
      const [firstVal, secondVal] = item.split(',');
      return [Number(firstVal), Number(secondVal)];
    });
    const res = await api.createGlobalDynamicModelDefinitionList(data);
    toast.add({ severity: 'success', summary: 'Created Successfully', detail: res.message, life: 3000 });
    definitionVisibleDialog.value = false;
    await getDynamicDefinitionList();
  } catch (error) {
    console.log('createDynamicDefinition error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//  edit

const handleUpdateDynamicDefinition = (data) => {
  definitionData.value = JSON.parse(JSON.stringify(data));
  definitionVisibleDialog.value = true;
  modeChange.value = 'update';
};
const updateDynamicDefinition = async () => {
  try {
    const res = await api.updateGlobalDynamicModelDefinition(definitionData.value._id, {
      name: definitionData.value.name,
      modelType: definitionData.value.modelType,
      values: definitionData.value.values,
    });
    toast.add({ severity: 'success', summary: 'Update Successfully', detail: res.message, life: 3000 });
    definitionVisibleDialog.value = false;
    await getDynamicDefinitionList();
  } catch (error) {
    console.log('updateDynamicDefinition error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteDynamic = (data, type = 'definition') => {
  confirm.require({
    group: 'deleteConfirm',
    data: data,
    header: type === 'definition' ? 'Global Dynamic Model Definition' : 'Global Dynamic Model Mapping',
    nameModel: type,
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      if (type === 'definition') {
        deleteDynamicDefinition(data._id);
      }
      if (type === 'mapping') {
        deleteDynamicMapping(data._id);
      }
    },
    reject: () => {},
  });
};

const deleteDynamicDefinition = async (dynamicDefinition_id) => {
  try {
    const res = await api.deleteGlobalDynamicModelDefinition(dynamicDefinition_id);
    toast.add({ severity: 'success', summary: 'Delete Successfully', detail: res.message, life: 3000 });
    await getDynamicDefinitionList();
  } catch (error) {
    console.log('deleteDynamicDefinition error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- dynamicMapping

const mappingData = ref();
const isLoadingmappingData = ref(false);

const mappingCurrentPage = ref(1);
const mappingTotal = ref();
const mappingPaginatorOffset = computed(() => pageRowNumber.value * mappingCurrentPage.value - 1);

const onMappingPageChange = async (event) => {
  mappingCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getGlobalDynamicModelMappingList();
};
const getGlobalDynamicModelMappingList = async () => {
  isLoadingmappingData.value = true;

  try {
    const res = await api.getGlobalDynamicModelMappingList(mappingCurrentPage.value);
    mappingTotal.value = res.data.total;
    for (let index = 0; index < res.data.items.length; index++) {
      const items = res.data.items[index];
      items.globalDynamicModelDefinitionName = await getGlobalDynamicModelDefinitionById(
        items.globalDynamicModelDefinitionId,
      );
    }
    mappingData.value = res.data.items;
  } catch (error) {
    mappingData.value = [];
    mappingTotal.value = 0;
    console.error('getDynamicMappingList error', error);
  }
  isLoadingmappingData.value = false;
};

const getGlobalDynamicModelDefinitionById = async (id) => {
  try {
    const res = await api.getGlobalDynamicModelDefinitionById(id);
    return res.data.name;
  } catch {
    return 'No Model';
  }
};

const getSeverityModelType = (type) => {
  const isTraditionalType = Object.entries(api.TypeGlobalDynamicModelDefinition.Traditional).find(
    ([key, value]) => value === type,
  )?.[0];
  return isTraditionalType ? 'info' : 'primary';
};

// ------- CRUD -  dynamicMapping
const mappingVisibleDialog = ref(false);
const mappingChangeData = ref();

const handleChangeMapping = async () => {
  if (modeChange.value === 'create') {
    await createDynamicMapping();
  }
  if (modeChange.value === 'update') {
    await updateDynamicMapping();
  }
};

const handleCreateDynamicMapping = () => {
  mappingChangeData.value = {
    name: '',
    globalDynamicModelDefinitionId: '',
    mapOrder: [],
    globalDynamicModelDefinitionData: {},
  };

  mappingVisibleDialog.value = true;
  modeChange.value = 'create';
};

const globalDynamicDefinitionSuggestions = ref();
const searchGlobalDynamicModelDefinition = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await api.searchGlobalDynamicModelDefinition(query);
    globalDynamicDefinitionSuggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
const createDynamicMapping = async () => {
  try {
    const res = await api.createGlobalDynamicModelMappingList({
      name: mappingChangeData.value.name,
      globalDynamicModelDefinitionId: mappingChangeData.value.globalDynamicModelDefinitionData._id,
      mapOrder: mappingChangeData.value.mapOrder,
    });
    await getGlobalDynamicModelMappingList();
    toast.add({ severity: 'success', summary: 'Created Successfully', detail: res.message, life: 3000 });
    mappingVisibleDialog.value = false;
  } catch (error) {
    console.log('createDynamicMapping error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handleUpdateDynamicMapping = (data) => {
  mappingChangeData.value = JSON.parse(JSON.stringify(data));

  mappingVisibleDialog.value = true;
  modeChange.value = 'update';
};
const updateDynamicMapping = async () => {
  try {
    const res = await api.updateGlobalDynamicModelMapping(mappingChangeData.value._id, {
      globalDynamicModelDefinitionId: mappingChangeData.value.globalDynamicModelDefinitionId,
      mapOrder: mappingChangeData.value.mapOrder,
    });
    toast.add({ severity: 'success', summary: 'Update Successfully', detail: res.message, life: 3000 });
    mappingVisibleDialog.value = false;
    await getGlobalDynamicModelMappingList();
  } catch (error) {
    console.log('updateDynamicMapping error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const deleteDynamicMapping = async (mapping_id) => {
  try {
    const res = await api.deleteGlobalDynamicModelMapping(mapping_id);
    toast.add({ severity: 'success', summary: 'Delete Successfully', detail: res.message, life: 3000 });
    getGlobalDynamicModelMappingList();
  } catch (error) {
    console.log('deleteDynamicMapping error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// import file

const uploadDialogGlobalDynamicDefinition = ref(false);
const uploadDialogGlobalDynamicMapping = ref(false);

const onHide = () => {
  getDynamicDefinitionList();
};
const handleImportDefinitionFile = () => {
  uploadDialogGlobalDynamicDefinition.value = true;
};
const handleImportMappingFile = () => {
  uploadDialogGlobalDynamicMapping.value = true;
};

const uploadGlobalDynamicModelFile = async (formData, callback) => {
  try {
    await api.uploadGlobalDynamicModelDefinitionFile(formData);
    await getDynamicDefinitionList();
    callback();
  } catch (error) {
    console.log('error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const uploadGlobalDynamicModelMappingFile = async (formData, callback) => {
  try {
    await api.uploadGlobalDynamicModelMappingFile(formData);
    await getGlobalDynamicModelMappingList();

    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
// export file
const handleExportDefinitionFile = async () => {
  try {
    const response = await api.exportGlobalDynamicModelDefinitionFile();
    // Tạo một Blob từ response (dữ liệu dạng file trả về từ API)
    const blob = new Blob([response.data], { type: 'text/csv' });

    // Tạo đường dẫn tạm thời để tải file
    const downloadUrl = window.URL.createObjectURL(blob);

    // Tạo một thẻ <a> để thực hiện việc tải file
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'export.csv'; // Tên file tải về
    document.body.appendChild(link);
    link.click();

    // Sau khi tải file xong thì xoá thẻ <a>
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl); // Hủy đối tượng URL tạm thời
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const handleExportMappingFile = async () => {
  try {
    const response = await api.exportGlobalDynamicModelMappingFile();
    // Tạo một Blob từ response (dữ liệu dạng file trả về từ API)
    const blob = new Blob([response.data], { type: 'text/csv' });

    // Tạo đường dẫn tạm thời để tải file
    const downloadUrl = window.URL.createObjectURL(blob);

    // Tạo một thẻ <a> để thực hiện việc tải file
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'export_dynamic_model_definition.csv';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl); // Hủy đối tượng URL tạm thời
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const onGlobalDefinitionView = () => {
  router.push({ name: 'Global Definition' });
};

const isChangeDefinitionFormInValid = computed(() => {
  if (!definitionData.value) {
    return true;
  }
  return (
    isMapMatrixInValid.value ||
    !definitionData.value.name ||
    !definitionData.value.digsName ||
    !definitionData.value.modelType
  );
});
const isMatrixStringInvalid = (str) => {
  if (!str.includes(',')) {
    return true;
  } else {
    const [firstVal, secondVal] = str.split(',');
    if (!firstVal || !secondVal) {
      return true;
    }
    if (isNaN(firstVal) || isNaN(secondVal)) {
      return true;
    }
  }
  return false;
};
const isMapMatrixInValid = computed(() => {
  let isInvalid = false;
  definitionData.value.mapMatrix.forEach((item) => {
    isInvalid = isMatrixStringInvalid(item);
  });
  return isInvalid;
});
</script>

<style>
.p-chips ul {
  width: 100%;
}
#tab-view ul.p-tabview-nav {
  display: none !important;
}

#globalDynamicModelDefinition tbody tr {
  height: 4.5rem;
}
.globalDynamicModelDefinitionDataAutocomplete,
.p-autocomplete-input {
  width: 100%;
}
</style>

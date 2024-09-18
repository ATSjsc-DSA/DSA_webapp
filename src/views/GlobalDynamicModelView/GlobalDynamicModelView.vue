<template>
  <div class="card layout-content w-full h-full">
    <Toast />

    <!-- this is for test  -->

    <!-- end test  -->

    <TabView>
      <TabPanel header=" Global Dynamic Model Definition">
        <DataTable :value="dynamicDefinition" tableStyle="min-width: 50rem" scrollable scrollHeight="80vh">
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
          <Column field="modeltype" header="Type">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                <Tag :value="data.modeltype" :severity="getSeverityModelType(data.modeltype)" />
              </div>
            </template>
          </Column>
          <Column style="width: 50%">
            <template #header>
              <div
                class="flex justify-content-start w-full gap-3 align-items-center"
                @click="isGroupedValueByFirstLetter = !isGroupedValueByFirstLetter"
              >
                <div>Values</div>
                <!-- <div>
                  <Button
                    type="button"
                    :icon="isGroupedValueByFirstLetter ? 'pi pi-sort-alt-slash' : 'pi pi-sort-alpha-down'"
                    :severity="isGroupedValueByFirstLetter ? 'secondary' : 'primary'"
                    text
                  />
                </div> -->
              </div>
            </template>

            <template #body="{ data }">
              <!-- <template v-if="isGroupedValueByFirstLetter">
                <div
                  v-for="(letterArr, key, index) in groupedByFirstLetter(data.values)"
                  :key="key"
                  class="py-2 m-1 border-round-sm"
                  :style="{ backgroundColor: index % 2 === 0 ? 'var(--surface-50)' : 'var(--surface-0)' }"
                >
                  {{ letterArr.join(', ') }}
                </div>
              </template> -->
              <!-- <template> -->
              <div class="flex flex-wrap">
                <div
                  v-for="(val, index) in data.values"
                  :key="val"
                  class="px-2 m-1 border-round-sm"
                  :style="{ backgroundColor: index % 2 === 0 ? 'var(--surface-50)' : 'var(--surface-0)' }"
                >
                  {{ val }}
                </div>
              </div>
              <!-- </template> -->
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
                <Button
                  icon="pi pi-pencil"
                  severity="success"
                  text
                  rounded
                  @click="handleUpdateDynamicDefinition(data)"
                />

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
        </DataTable>
      </TabPanel>

      <TabPanel header=" Global Dynamic Model Mapping">
        <DataTable :value="dynamicMapping" tableStyle="min-width: 50rem" scrollable scrollHeight="80vh">
          <template #header>
            <div class="flex justify-content-end gap-3">
              <Button
                type="button"
                label="Import"
                icon="pi pi-upload"
                severity="secondary"
                @click="handleImportMappingFile"
              />
              <Button
                type="button"
                label="Export"
                icon="pi pi-download"
                severity="secondary"
                @click="handleExportMappingFile()"
              />
              <Divider layout="vertical" />
              <Button type="button" label="Create " icon="pi pi-plus" text @click="handleCreateDynamicMapping" />
            </div>
          </template>
          <Column field="name" header="Name" sortable></Column>

          <Column field="globalDynamicModelDefinitionId" header=" Dynamic Definition">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                <Chip :label="getNameDynamicDefinitionFromId(data.globalDynamicModelDefinitionId)"></Chip>
              </div>
            </template>
          </Column>
          <Column header="Values">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                {{ data.mapOrder.join(', ') }}
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
                <Button icon="pi pi-pencil" severity="success" text rounded @click="handleUpdateDynamicMapping(data)" />

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="confirmDeleteDynamic(data, 'mapping')"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </TabPanel>
    </TabView>
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

    <div class="mt-3">
      <label for="modeltype" class="font-semibold"> Type</label>

      <Dropdown
        v-model="definitionData.modeltype"
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
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="definitionVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Save"
        :disabled="!(definitionData.name && definitionData.modeltype)"
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

    <div>
      <label for="Name" class="font-semibold"> Name</label>
      <InputText id="Name" v-model="mappingData.name" class="w-full my-3" autocomplete="off" />
    </div>

    <div class="mt-3">
      <label for="globalDynamicModelDefinitionId" class="font-semibold"> Global Dynamic Model Definition </label>

      <Dropdown
        v-model="mappingData.globalDynamicModelDefinitionId"
        :options="globalDynamicModelDefinitionOpts"
        optionValue="value"
        optionLabel="name"
        placeholder="Select a Model"
        class="w-full my-3"
      />
    </div>
    <div class="mt-3">
      <label for="values" class="font-semibold"> Values</label>
      <Chips id="values" v-model="mappingData.mapOrder" class="w-full mt-3" autocomplete="off" />
      <div class="p-1">
        <small>Press Enter to Add.</small>
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="mappingVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Save"
        :disabled="!(mappingData.name && mappingData.globalDynamicModelDefinitionId)"
        @click="handleChangeMapping()"
      ></Button>
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
              :value="slotProps.message.data.modeltype"
              :severity="getSeverityModelType(slotProps.message.data.modeltype)"
            />
          </div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!-- upload file  -->
  <Dialog
    v-model:visible="uploadDialogGlobalDynamicDefinition"
    @hide="onHide"
    :style="{ width: '50rem' }"
    header="Upload Dynamic Model Definition File"
    :modal="true"
  >
    <uploadFileConfig @uploadFile="uploadGlobalDynamicModelFile"></uploadFileConfig>
  </Dialog>
  <Dialog
    v-model:visible="uploadDialogGlobalDynamicMapping"
    @hide="onHide"
    :style="{ width: '50rem' }"
    header="Upload Dynamic Model Mapping File"
    :modal="true"
  >
    <uploadFileConfig @uploadFile="uploadGlobalDynamicModelMappingFile"></uploadFileConfig>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';
import uploadFileConfig from '../../components/uploadFileConfig.vue';

import { useRoute } from 'vue-router';
const route = useRoute();

import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
const { convertDateTimeToString } = chartComposable();
const toast = useToast();

onMounted(async () => {
  await getDynamicDefinitionList();
  await getDynamicMappingList();
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
const isGroupedValueByFirstLetter = ref(false);
const getDynamicDefinitionList = async () => {
  try {
    const res = await api.getGlobalDynamicModelDefinitionList(1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await api.getGlobalDynamicModelDefinitionList(page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicDefinition.value = data;
  } catch (error) {
    console.error('setGlobaldefinitionList error', error);
  }
};

const getNameDynamicDefinitionFromId = (id) => {
  const dynamicDefinitionData = dynamicDefinition.value.filter((val) => val._id === id)[0];
  return dynamicDefinitionData ? dynamicDefinitionData.name : '';
};

const groupedByFirstLetter = (arr) => {
  return arr.reduce((acc, word) => {
    const firstLetter = word[0].toLowerCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});
};

// --- dynamicDefinition - CRUD ---

//  create
const definitionVisibleDialog = ref(false);
const definitionData = ref();
const modeChange = ref();

const handleChangeDefinition = () => {
  if (modeChange.value === 'create') {
    createDynamicDefinition();
  }
  if (modeChange.value === 'update') {
    updateDynamicDefinition();
  }
};
const handleCreateDynamicDefinition = () => {
  definitionData.value = {
    name: '',
    modeltype: '',
    values: [],
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
    label: 'Renews',
    code: 'Renews',
    items: Object.values(api.TypeGlobalDynamicModelDefinition.Renews),
  },
]);
const createDynamicDefinition = async () => {
  try {
    const res = await api.createGlobalDynamicModelDefinitionList(definitionData.value);
    dynamicDefinition.value.unshift(res.data);
    toast.add({ severity: 'success', summary: 'Created Successfully', detail: res.message, life: 3000 });
    definitionVisibleDialog.value = false;
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
      modeltype: definitionData.value.modeltype,
      values: definitionData.value.values,
    });
    toast.add({ severity: 'success', summary: 'Update Successfully', detail: res.message, life: 3000 });
    definitionVisibleDialog.value = false;
    getDynamicDefinitionList();
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
    getDynamicDefinitionList();
  } catch (error) {
    console.log('deleteDynamicDefinition error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------- dynamicMapping
const dynamicMapping = ref();
const getDynamicMappingList = async () => {
  try {
    const res = await api.getGlobalDynamicModelMappingList(1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await api.getGlobalDynamicModelDefinitionList(page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicMapping.value = data;
  } catch (error) {
    console.error('getDynamicMappingList error', error);
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
const mappingData = ref();

const handleChangeMapping = () => {
  if (modeChange.value === 'create') {
    createDynamicMapping();
  }
  if (modeChange.value === 'update') {
    updateDynamicMapping();
  }
};

const globalDynamicModelDefinitionOpts = computed(() => {
  const opts = [];
  if (dynamicDefinition.value) {
    for (let index = 0; index < dynamicDefinition.value.length; index++) {
      const model = dynamicDefinition.value[index];
      opts.push({
        name: model.name,
        value: model._id,
      });
    }
  }

  return opts;
});

const handleCreateDynamicMapping = () => {
  mappingData.value = {
    name: '',
    globalDynamicModelDefinitionId: '',
    mapOrder: [],
  };

  mappingVisibleDialog.value = true;
  modeChange.value = 'create';
};

const createDynamicMapping = async () => {
  try {
    const res = await api.createGlobalDynamicModelMappingList({
      name: mappingData.value.name,
      globalDynamicModelDefinitionId: mappingData.value.globalDynamicModelDefinitionId,
      mapOrder: mappingData.value.mapOrder,
    });
    dynamicMapping.value.unshift(res.data);
    toast.add({ severity: 'success', summary: 'Created Successfully', detail: res.message, life: 3000 });
    mappingVisibleDialog.value = false;
  } catch (error) {
    console.log('createDynamicMapping error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const handleUpdateDynamicMapping = (data) => {
  mappingData.value = JSON.parse(JSON.stringify(data));

  mappingVisibleDialog.value = true;
  modeChange.value = 'update';
};
const updateDynamicMapping = async () => {
  try {
    const res = await api.updateGlobalDynamicModelMapping(mappingData.value._id, {
      name: mappingData.value.name,
      globalDynamicModelDefinitionId: mappingData.value.globalDynamicModelDefinitionId,
      mapOrder: mappingData.value.mapOrder,
    });
    toast.add({ severity: 'success', summary: 'Update Successfully', detail: res.message, life: 3000 });
    mappingVisibleDialog.value = false;
    getDynamicMappingList();
  } catch (error) {
    console.log('updateDynamicMapping error', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const deleteDynamicMapping = async (mapping_id) => {
  try {
    const res = await api.deleteGlobalDynamicModelMapping(mapping_id);
    toast.add({ severity: 'success', summary: 'Delete Successfully', detail: res.message, life: 3000 });
    getDynamicMappingList();
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
    callback();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const uploadGlobalDynamicModelMappingFile = async (formData, callback) => {
  try {
    await api.uploadGlobalDynamicModelMappingFile(formData);
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
    link.download = 'export.csv'; // Tên file tải về
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl); // Hủy đối tượng URL tạm thời
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style>
.p-chips ul {
  width: 100%;
}
</style>

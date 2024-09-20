<template>
  <DataTable
    id="psDynamicTable"
    :value="tableData"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    scrollHeight="38rem"
    showGridlines
    :loading="loading"
    rowGroupMode="rowspan"
    groupRowsBy="powerSystemDataUniqueId"
  >
    <template #header>
      <div class="flex justify-content-end">
        <Button
          type="button"
          label="Create Dynamic Model"
          icon="pi pi-plus"
          size="small"
          text
          @click="handleCreate()"
        />
      </div>
    </template>
    <Column
      field="powerSystemDataUniqueId"
      frozen
      header="Unique Id"
      class="frozen-column frozen-left-column"
      style="text-wrap: nowrap"
      :rowspan="4"
    >
      <template #body="{ data }">
        <div class="font-bold w-8rem text-center">
          {{ data.powerSystemDataUniqueId }}
        </div>
      </template>
    </Column>
    <Column field="modelType" class="frozen-column frozen-left-column" header="Type" style="text-wrap: nowrap" />
    <Column field="modelName" header="Model Name" style="text-wrap: nowrap" />

    <Column header="Values" field="modelData">
      <template #body="{ data }">
        <DataTable :value="data.modelData" tableStyle="min-width: 50rem" scrollable style="text-wrap: nowrap">
          <Column v-for="(val, col) in data.modelData[0]" :key="col" :field="col" :header="col"></Column>
        </DataTable>
      </template>
    </Column>
    <Column class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
      <template #body="{ data }">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEdit(data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
  <Paginator :rows="pageRowNumber" :totalRecords="totalRecords" :page="currentPage" @page="onPageChange"></Paginator>

  <Toast />

  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '80vw' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Dynamic Model</span>
      </div>
    </template>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="globalDynamicModelDefinitionId" class="font-semibold w-8rem"> Power System </label>

      <Dropdown
        v-model="createData.powerSystemDataId"
        :options="psData"
        optionValue="_id"
        optionLabel="generalInfo.uniqueId"
        placeholder="Select a unique Id"
        class="w-16rem my-3"
      />
    </div>
    <span class="p-text-secondary block my-3">Dynamic Model information</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="type" class="font-semibold w-8rem"> Type</label>
      <Button
        :severity="createData.isTraditionalModel ? 'info' : 'primary'"
        :label="createData.isTraditionalModel ? 'Traditional' : 'Renewal'"
        @click="createData.isTraditionalModel = !createData.isTraditionalModel"
      />
    </div>

    <template v-if="createData.isTraditionalModel">
      <!-- Generator  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Generator:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="generatorModel"
          :options="definitionTypeOption['Traditional']['Generator']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="generatorModel">
        <div class="grid">
          <div
            v-for="(val, col) in generatorTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="generatorTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- Excitation  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Excitation:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="excitationModel"
          :options="definitionTypeOption['Traditional']['Excitation']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="excitationModel">
        <div class="grid">
          <div
            v-for="(val, col) in excitationTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="excitationTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- Governor  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Governor:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="governorModel"
          :options="definitionTypeOption['Traditional']['Governor']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="governorModel">
        <div class="grid">
          <div
            v-for="(val, col) in governorTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="governorTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- Stabilizer  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Stabilizer:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="stabilizerModel"
          :options="definitionTypeOption['Traditional']['Stabilizer']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="stabilizerModel">
        <div class="grid">
          <div
            v-for="(val, col) in stabilizerTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="stabilizerTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>
    </template>

    <!-- ---------- Renewal----- -->
    <template v-else>
      <!-- generic  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Generic:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="genericModel"
          :options="definitionTypeOption['Renewal']['Generic']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="genericModel">
        <div class="grid">
          <div
            v-for="(val, col) in genericTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="genericTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- Renewable  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> Renewable:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="renewableModel"
          :options="definitionTypeOption['Renewal']['Renewable']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="renewableModel">
        <div class="grid">
          <div
            v-for="(val, col) in renewableTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="renewableTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- PlanControl  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> PlanControl:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="planControlModel"
          :options="definitionTypeOption['Renewal']['PlanControl']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="planControlModel">
        <div class="grid">
          <div
            v-for="(val, col) in planControlTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="planControlTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>

      <!-- DriveTrain  -->
      <div class="flex align-items-center gap-3 mb-3">
        <label for="" class="font-semibold w-8rem block"> DriveTrain:</label>
        <Dropdown
          v-if="definitionTypeOption"
          v-model="driveTrainModel"
          :options="definitionTypeOption['Renewal']['DriveTrain']"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Dynamic Model"
          class="w-16rem my-3"
          showClear
        />
      </div>
      <template v-if="driveTrainModel">
        <div class="grid">
          <div
            v-for="(val, col) in driveTrainTable"
            :key="col"
            :field="col"
            :header="col"
            class="col-3 pl-3 border-right-1 border-200"
          >
            <div class="flex gap-1 align-items-center">
              <div class="w-12rem">
                {{ col }}
              </div>
              <InputText v-model="driveTrainTable[col]" class="w-14rem" />
            </div>
          </div>
        </div>
        <Divider />
      </template>
    </template>

    <!-- this is for test  -->

    <!-- end test  -->
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Submit"
        :disabled="!createData.powerSystemDataId"
        @click="createDynamicModel()"
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
          <div>Unique Id: {{ slotProps.message.data.powerSystemDataUniqueId }}</div>
          <div>Type: {{ slotProps.message.data.modelType }}</div>
          <div>Model Name: {{ slotProps.message.data.modelName }}</div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();

import { default as globalDynamicModelApi } from '@/views/GlobalDynamicModelView/api.js';
import additionApi from './additionApi';
const toast = useToast();
const additionVersionId = ref('5eb7cf5a86d9755df3a6c593');

const props = defineProps({
  psData: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['getData']);
const modelDefinitionType = ref(globalDynamicModelApi.TypeGlobalDynamicModelDefinition);
onMounted(async () => {
  await getDynamicDefinitionList();

  await getDynamicModelList();
});

// addition
const pageRowNumber = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);

const dynamicModelList = ref([]);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1;
  await getDynamicModelList();
};
const getDynamicModelList = async () => {
  try {
    const res = await additionApi.getDynamicModelList(additionVersionId.value, currentPage.value);
    dynamicModelList.value = res.data.items;
    totalRecords.value = res.data.total;
  } catch (error) {
    dynamicModelList.value = [];
    console.log('getDynamicModelList: error ', error);
    toast.add({ severity: 'error', summary: 'Version List', detail: error.data.detail, life: 3000 });
  }
};

const dynamicDefinition = ref();
const getDynamicDefinitionList = async () => {
  try {
    const res = await globalDynamicModelApi.getGlobalDynamicModelDefinitionList(1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await globalDynamicModelApi.getGlobalDynamicModelDefinitionList(page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicDefinition.value = data;
  } catch (error) {
    dynamicDefinition.value = undefined;
    console.error('getDynamicDefinitionList error', error);
  }
};

const getGlobalDynamicModelDefinitionById = (id) => dynamicDefinition.value.filter((item) => item._id === id)[0];
const tableData = computed(() => {
  const data = [];
  for (let index = 0; index < dynamicModelList.value.length; index++) {
    const items = dynamicModelList.value[index];

    const typeModel = items.modelDynamicType === 0 ? 'Traditional' : 'Renewal';
    const typeModelArr = Object.values(modelDefinitionType.value[typeModel]);
    for (const type of typeModelArr) {
      const typeData = items.model.filter((model) => {
        return model.modelType === type;
      })[0];

      let dynamicModelDefinition = {};
      let modelData;
      if (typeData) {
        modelData = {};
        dynamicModelDefinition = getGlobalDynamicModelDefinitionById(typeData.modelId);
        for (let index = 0; index < dynamicModelDefinition.values.length; index++) {
          modelData[dynamicModelDefinition.values[index]] = typeData.values[index] || '';
        }
      }
      data.push({
        id: items.id,
        powerSystemDataId: items.powerSystemDataId,
        powerSystemDataUniqueId: items.powerSystemDataUniqueId,
        modelType: type,
        modelId: typeData ? typeData.modelId : undefined,
        modelName: dynamicModelDefinition.name,
        modelData: [modelData],
      });
    }
  }
  return data;
});

// CRUD
const createVisibleDialog = ref(false);
const createData = ref();
const editData = ref();
const modeChange = ref();
const modelDefinitionTypeForm = computed(() => {
  const data = {};
  for (const type in modelDefinitionType.value) {
    const typeData = {};
    for (const subtype in modelDefinitionType.value[type]) {
      typeData[subtype] = {
        modelId: '',
        values: [],
        modelType: subtype,
      };
    }
    data[type] = typeData;
  }
  return data;
});
const handleCreate = async () => {
  createData.value = {
    powerSystemDataId: '',
    isTraditionalModel: true,
    model: modelDefinitionTypeForm.value,
  };
  createVisibleDialog.value = true;
  await getdefinitionTypeOption();
  modeChange.value = 'Create';
};
const createDynamicModel = async () => {
  try {
    const data = { powerSystemDataId: createData.value.powerSystemDataId, model: [] };
    if (createData.value.isTraditionalModel) {
      if (generatorModel.value) {
        data.model.push({
          modelType: 'Generator',
          modelId: generatorModel.value,
          values: Object.values(generatorTable.value),
        });
      }
      if (excitationModel.value) {
        data.model.push({
          modelType: 'Excitation',
          modelId: excitationModel.value,
          values: Object.values(excitationTable.value),
        });
      }
      if (governorModel.value) {
        data.model.push({
          modelType: 'Governor',
          modelId: governorModel.value,
          values: Object.values(governorTable.value),
        });
      }
      if (stabilizerModel.value) {
        data.model.push({
          modelType: 'Stabilizer',
          modelId: stabilizerModel.value,
          values: Object.values(stabilizerTable.value),
        });
      }
    } else {
      if (genericModel.value) {
        data.model.push({
          modelType: 'Generic',
          modelId: genericModel.value,
          values: Object.values(genericTable.value),
        });
      }
      if (renewableModel.value) {
        data.model.push({
          modelType: 'Renewable',
          modelId: renewableModel.value,
          values: Object.values(renewableTable.value),
        });
      }
      if (planControlModel.value) {
        data.model.push({
          modelType: 'PlanControl',
          modelId: planControlModel.value,
          values: Object.values(planControlTable.value),
        });
      }
      if (driveTrainModel.value) {
        data.model.push({
          modelType: 'DriveTrain',
          modelId: driveTrainModel.value,
          values: Object.values(driveTrainTable.value),
        });
      }
    }
    await additionApi.createDynamicModel(additionVersionId.value, data);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createVisibleDialog.value = false;
    await getDynamicModelList();
  } catch (error) {
    console.log('getGlobalDynamicModelDefinitionByType: error ', error);
    toast.add({ severity: 'error', summary: 'Create', detail: error.data.detail, life: 3000 });
  }
};
const definitionTypeOption = ref();
const getdefinitionTypeOption = async () => {
  const opts = {};
  for (const type in modelDefinitionType.value) {
    const typeData = {};
    for (const subtype in modelDefinitionType.value[type]) {
      typeData[subtype] = await getGlobalDynamicModelDefinitionByType(subtype);
    }
    opts[type] = typeData;
  }
  definitionTypeOption.value = opts;
};

const getGlobalDynamicModelDefinitionByType = async (type) => {
  try {
    const res = await globalDynamicModelApi.getGlobalDynamicModelDefinitionByType(type);
    return res.data;
  } catch (error) {
    console.log('getGlobalDynamicModelDefinitionByType: error ', error);
    toast.add({ severity: 'error', summary: 'Version List', detail: error.data.detail, life: 3000 });
  }
};

// Traditional: {

const generatorModel = ref();
const generatorTable = ref();

watch(generatorModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    generatorTable.value = table;
  }
});
const excitationModel = ref();
const excitationTable = ref();

watch(excitationModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    excitationTable.value = table;
  }
});
const governorModel = ref();
const governorTable = ref();

watch(governorModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    governorTable.value = table;
  }
});

const stabilizerModel = ref();
const stabilizerTable = ref();

watch(stabilizerModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    stabilizerTable.value = table;
  }
});

// Renewal: {
const genericModel = ref();
const genericTable = ref();

watch(genericModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    genericTable.value = table;
  }
});

const renewableModel = ref();
const renewableTable = ref();

watch(renewableModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    renewableTable.value = table;
  }
});

const planControlModel = ref();
const planControlTable = ref();

watch(planControlModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    planControlTable.value = table;
  }
});
const driveTrainModel = ref();
const driveTrainTable = ref();

watch(driveTrainModel, (newId) => {
  if (newId) {
    const dynamicModelDefinition = getGlobalDynamicModelDefinitionById(newId);
    const table = {};
    for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
      table[dynamicModelDefinition.values[i]] = '';
    }
    driveTrainTable.value = table;
  }
});

const handleEdit = (data) => {
  const editData = JSON.parse(JSON.stringify(data));
  editData.isTraditionalModel = Boolean(data.modelDynamicType);
  editData.model = modelDefinitionTypeForm.value;
  createData.value = editData;
  createVisibleDialog.value = true;
  modeChange.value = 'Update';
};
const confirmDelete = (data) => {
  confirm.require({
    group: 'deleteConfirm',
    data: data,
    header: 'Dynamic Model Definition',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteDynamicModel(data.id);
    },
    reject: () => {},
  });
};

const deleteDynamicModel = async (dynamicModel_id) => {
  try {
    await additionApi.deleteDynamicModel(additionVersionId.value, dynamicModel_id);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    getDynamicModelList();
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Delete Power System', detail: error.data.detail, life: 3000 });
  }
};
</script>
<style>
#psDynamicTable .frozen-column {
  position: sticky;
  width: 8rem;
  z-index: 3;
  text-align: center;
  background-color: var(--surface-card);
}

#psDynamicTable .frozen-column.frozen-left-column {
  left: 0;
}
#psDynamicTable .frozen-column.frozen-right-column {
  right: 0;
}
</style>

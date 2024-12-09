<template>
  <div style="height: 40rem">
    <DataTable
      id="psDynamicTable"
      :value="tableData"
      dataKey="_id"
      tableStyle="min-width: 50rem;"
      :lazy="true"
      :sortOrder="1"
      rowHover
      scrollable
      scrollHeight="38rem"
      showGridlines
      :loading="isLoadingData"
      size="small"
    >
      <template v-if="showChangeColumn" #header>
        <div class="flex justify-content-end">
          <Button type="button" icon="pi pi-plus" size="small" text @click="handleCreate()" />
        </div>
      </template>

      <ColumnGroup type="header">
        <Row>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Unique Id</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Name</div>
            </template>
          </Column>
          <Column :colspan="4">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Traditional</div>
            </template>
          </Column>
          <Column :colspan="4" style="background-color: var(--surface-100)">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Renewable</div>
            </template>
          </Column>
          <Column v-if="showChangeColumn" header="" :rowspan="2" />
        </Row>
        <Row>
          <Column field="Generator.name" header="Generator" style="text-wrap: nowrap" />
          <Column field="Excitation.name" header="Excitation" style="text-wrap: nowrap" />
          <Column field="Governor.name" header="Governor" style="text-wrap: nowrap" />
          <Column field="Stabilizer.name" header="Stabilizer" style="text-wrap: nowrap" />

          <Column
            field="Generic.name"
            header="Generic"
            style="text-wrap: nowrap; background-color: var(--surface-100)"
          />
          <Column
            field="Renewable.name"
            header="Renewable"
            style="text-wrap: nowrap; background-color: var(--surface-100)"
          />
          <Column
            field="PlanControl.name"
            header="PlanControl"
            style="text-wrap: nowrap; background-color: var(--surface-100)"
          />
          <Column
            field="DriveTrain.name"
            header="DriveTrain"
            style="text-wrap: nowrap; background-color: var(--surface-100)"
          />
        </Row>
      </ColumnGroup>

      <Column field="powerSystemDataUniqueId" frozen header="Unique Id" style="text-wrap: nowrap">
        <template #body="{ data }">
          <div class="font-bold w-8rem text-center">
            {{ data.powerSystemDataUniqueId }}
          </div>
        </template>
      </Column>
      <Column field="powerSystemDataName" header="Name" style="text-wrap: nowrap" />

      <!-- Traditional -->
      <Column field="Generator.modelName" header="Generator" style="text-wrap: nowrap" />
      <Column field="Excitation.modelName" header="Excitation" style="text-wrap: nowrap" />
      <Column field="Governor.modelName" header="Governor" style="text-wrap: nowrap" />
      <Column field="Stabilizer.modelName" header="Stabilizer" style="text-wrap: nowrap" />
      <!-- Renewable -->
      <Column
        field="Generic.modelName"
        header="Generic"
        style="text-wrap: nowrap; background-color: var(--surface-100)"
      />
      <Column
        field="Renewable.modelName"
        header="Renewable"
        style="text-wrap: nowrap; background-color: var(--surface-100)"
      />
      <Column
        field="PlanControl.modelName"
        header="PlanControl"
        style="text-wrap: nowrap; background-color: var(--surface-100)"
      />
      <Column
        field="DriveTrain.modelName"
        header="DriveTrain"
        style="text-wrap: nowrap; background-color: var(--surface-100)"
      />

      <Column v-if="showChangeColumn" class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdate(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
  </div>
  <div class="flex justify-content-end align-items-center">
    <Paginator
      :rows="pageRowNumber"
      :totalRecords="totalRecords"
      :page="currentPage"
      class="flex-grow-1"
      @page="onPageChange"
    ></Paginator>
    <div class="mr-3">Total: {{ totalRecords }}</div>
  </div>
  <Toast />

  <!-- create dialog data -->
  <Dialog v-model:visible="visibleChangeDialog" style="width: 64rem" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Dynamic Model</span>
      </div>
    </template>
    <div style="height: 50rem">
      <div class="flex align-items-start gap-3 mb-5">
        <div class="w-12rem">
          <label for="globalDynamicModelDefinitionId" class="font-semibold"> Power System </label>
          <div class="mt-1">
            <small>
              {{ nodeSelected && nodeSelected.parentName ? `(${nodeSelected.parentName})` : '' }}
            </small>
          </div>
        </div>

        <AutoComplete
          v-if="modeChange === 'Create'"
          v-model="dataChange.powerSystemData"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="flex-grow-1 psAutoComplete"
          placeholder="Type Something to search ..."
          :suggestions="psSuggestions"
          @complete="searchPsQueryFilter"
        />
        <InputText v-else :value="dataChange.powerSystemDataName" class="flex-grow-1" disabled />
      </div>

      <div class="flex align-items-center gap-3 mb-5">
        <label for="type" class="font-semibold w-12rem">Dynamic Model Type</label>
        <Button
          :severity="dataChange.isTraditionalModel ? 'info' : 'primary'"
          :label="dataChange.isTraditionalModel ? 'Traditional' : 'Renewable'"
          class="flex-grow-1"
          @click="dataChange.isTraditionalModel = !dataChange.isTraditionalModel"
        />
      </div>
      <!-- ---------- Traditional----- -->
      <TabView v-if="dataChange.isTraditionalModel">
        <TabPanel header="Generator">
          <!-- Generator  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Generator:</label>
            <Dropdown
              v-model="generatorModel"
              :options="traditionalGeneratorOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="traditionalGeneratorOpts.length === 0"
              @change="generatorModelChange()"
            />
          </div>

          <template v-if="generatorModel">
            <div v-if="Object.keys(generatorTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in generatorTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="generatorTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>

        <TabPanel header="Excitation">
          <!-- Excitation  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Excitation:</label>
            <Dropdown
              v-model="excitationModel"
              :options="traditionalExcitationOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="traditionalExcitationOpts.length === 0"
              @change="excitationModelChange()"
            />
          </div>
          <template v-if="excitationModel">
            <div v-if="Object.keys(excitationTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in excitationTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="excitationTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
        <TabPanel header="Governor">
          <!-- Governor  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Governor:</label>
            <Dropdown
              v-model="governorModel"
              :options="traditionalGovernorOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="traditionalGovernorOpts.length === 0"
              @change="governorModelChange()"
            />
          </div>
          <template v-if="governorModel">
            <div v-if="Object.keys(governorTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in governorTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="governorTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
        <TabPanel header="Stabilizer">
          <!-- Stabilizer  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Stabilizer:</label>
            <Dropdown
              v-model="stabilizerModel"
              :options="traditionalStabilizerOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="traditionalStabilizerOpts.length === 0"
              @change="stabilizerModelChange()"
            />
          </div>
          <template v-if="stabilizerModel">
            <div v-if="Object.keys(stabilizerTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in stabilizerTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="stabilizerTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
      </TabView>

      <!-- ---------- Renewable----- -->
      <TabView v-else>
        <!-- generic  -->
        <TabPanel header="Generic">
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Generic:</label>
            <Dropdown
              v-model="genericModel"
              :options="renewableGenericOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="renewableGenericOpts.length === 0"
              @change="genericModelChange"
            />
          </div>
          <template v-if="genericModel">
            <div v-if="Object.keys(genericTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in genericTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="genericTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
        <TabPanel header="Renewable">
          <!-- Renewable  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Renewable:</label>
            <Dropdown
              v-model="renewableModel"
              :options="renewableRenewableOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="renewableRenewableOpts.length === 0"
              @change="renewableModelChange"
            />
          </div>
          <template v-if="renewableModel">
            <div v-if="Object.keys(renewableTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in renewableTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="renewableTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
        <TabPanel header="Plan Control">
          <!-- PlanControl  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Plan Control:</label>
            <Dropdown
              v-model="planControlModel"
              :options="renewablePlanControlOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="renewablePlanControlOpts.length === 0"
              @change="planControlModelChange"
            />
          </div>
          <template v-if="planControlModel">
            <div v-if="Object.keys(planControlTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in planControlTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="planControlTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
        <TabPanel header=" Drive Train">
          <!-- DriveTrain  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Drive Train:</label>
            <Dropdown
              v-model="driveTrainModel"
              :options="renewableDriveTrainOpts"
              optionLabel="name"
              placeholder="Select a Dynamic Model"
              class="flex-grow-1"
              showClear
              :disabled="renewableDriveTrainOpts.length === 0"
              @change="driveTrainModelChange"
            />
          </div>
          <template v-if="driveTrainModel">
            <div v-if="Object.keys(driveTrainTable).length > 0" class="grid mt-3">
              <div v-for="(val, col) in driveTrainTable" :key="col" :field="col" :header="col" class="col-6 pl-3">
                <div class="flex gap-1 align-items-center">
                  <div class="w-12rem">
                    {{ col }}
                  </div>
                  <InputText v-model="driveTrainTable[col]" class="flex-grow-1" />
                </div>
              </div>
            </div>
            <div v-else>This Global Dynamic Model Definition does not have values.</div>
          </template>
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="visibleChangeDialog = false"></Button>
      <Button
        v-if="modeChange === 'Create'"
        type="button"
        label="Save"
        :disabled="!dataChange.powerSystemData"
        @click="createDynamicModel()"
      ></Button>
      <Button v-if="modeChange === 'Update'" type="button" label="Update" @click="updateDynamicModel()"></Button>
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

import AutoComplete from 'primevue/autocomplete';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();

import { default as globalDynamicModelApi } from '@/views/GlobalDynamicModelView/api.js';
import { PowerSystemParameterApi, DynamicModelApi } from '@/views/PowerSystem/api';

const toast = useToast();

const props = defineProps({
  showDefinitionFlatList: { type: Boolean },
  nodeSelected: { type: Object },
  definitionId: { type: String, required: true },
  showChangeColumn: {
    type: Boolean,
    default: true,
  },
});

watch(
  () => props.showDefinitionFlatList,
  async (newData) => {
    await getTableData();
  },
);

onMounted(async () => {
  await getTableData();
  // // Traditional
});

const isLoadingData = ref(false);
const modelDefinitionType = ref(globalDynamicModelApi.TypeGlobalDynamicModelDefinition);

// Table Data
const pageRowNumber = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const dynamicModelList = ref([]);

const onPageChange = async (event) => {
  currentPage.value = event.page + 1;
  await getTableData();
};

const tableData = ref([]);

const getTableData = async () => {
  isLoadingData.value = true;
  await getDynamicModelList();
  const data = [];
  for (let index = 0; index < dynamicModelList.value.length; index++) {
    const items = dynamicModelList.value[index];
    const typeModel = items.modelDynamicType === 0 ? 'Traditional' : 'Renewable';
    const typeModelArr = Object.values(modelDefinitionType.value[typeModel]);
    for (const type of typeModelArr) {
      const modelData = items.model.filter((model) => {
        return model.modelType === type;
      })[0];
      items[type] = modelData || '';
    }
    data.push(items);
  }
  tableData.value = data;
  isLoadingData.value = false;
};

const getDynamicModelList = async () => {
  try {
    let resData = {
      items: [],
      total: 0,
    };
    if (props.showDefinitionFlatList) {
      const res = await DynamicModelApi.getDynamicModelList(currentPage.value);
      resData = res.data;
    } else {
      if (props.nodeSelected) {
        const res = await DynamicModelApi.getDynamicModelListWithTree(props.nodeSelected.parentId, currentPage.value);
        resData = res.data;
      }
    }
    dynamicModelList.value = resData.items;
    totalRecords.value = resData.total;
  } catch (error) {
    dynamicModelList.value = [];
    console.log('getDynamicModelList: error ', error);
    toast.add({ severity: 'error', summary: 'getDynamicModelList', detail: error.data.detail, life: 3000 });
  }
};

const getGlobalDynamicModelDefinitionById = async (id) => {
  try {
    const res = await globalDynamicModelApi.getGlobalDynamicModelDefinitionById(id);
    return res.data;
  } catch (error) {
    return {};
  }
};
// CRUD

const psSuggestions = ref();

const searchPsQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs([props.definitionId], query);
    psSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const visibleChangeDialog = ref(false);
const dataChange = ref();
const modeChange = ref();

const handleCreate = async () => {
  if (!traditionalGeneratorOpts.value) {
    await getModelTypeOptions();
  }
  clearModelTypeSelected();
  dataChange.value = {
    powerSystemData: '',
    isTraditionalModel: true,
  };
  visibleChangeDialog.value = true;
  modeChange.value = 'Create';
};

const clearModelTypeSelected = () => {
  generatorModel.value = undefined;
  excitationModel.value = undefined;
  governorModel.value = undefined;
  stabilizerModel.value = undefined;
  genericModel.value = undefined;
  renewableModel.value = undefined;
  planControlModel.value = undefined;
  driveTrainModel.value = undefined;
};

const getModelTypeOptions = async () => {
  traditionalGeneratorOpts.value = await getGlobalDynamicModelDefinitionByType('Generator');
  traditionalExcitationOpts.value = await getGlobalDynamicModelDefinitionByType('Excitation');
  traditionalGovernorOpts.value = await getGlobalDynamicModelDefinitionByType('Governor');
  traditionalStabilizerOpts.value = await getGlobalDynamicModelDefinitionByType('Stabilizer');
  // Renewable
  renewableGenericOpts.value = await getGlobalDynamicModelDefinitionByType('Generic');
  renewableRenewableOpts.value = await getGlobalDynamicModelDefinitionByType('Renewable');
  renewablePlanControlOpts.value = await getGlobalDynamicModelDefinitionByType('PlanControl');
  renewableDriveTrainOpts.value = await getGlobalDynamicModelDefinitionByType('DriveTrain');
};
const createDynamicModel = async () => {
  try {
    await DynamicModelApi.createDynamicModel(getValueModelInForm());
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    visibleChangeDialog.value = false;
    await getTableData();
  } catch (error) {
    console.log('createDynamicModel: error ', error);
    toast.add({ severity: 'error', summary: 'Create', detail: error.data.detail, life: 3000 });
  }
};
const getValueModelInForm = () => {
  const data = {
    id: dataChange.value.id,
    powerSystemDataId:
      modeChange.value === 'Create' ? dataChange.value.powerSystemData._id : dataChange.value.powerSystemDataId,
    modelDynamicType: dataChange.value.isTraditionalModel ? 0 : 1,
    model: [],
  };
  if (dataChange.value.isTraditionalModel) {
    if (generatorModel.value) {
      data.model.push({
        modelType: 'Generator',
        modelId: generatorModel.value._id,
        modelName: generatorModel.value.name,
        values: Object.values(generatorTable.value),
      });
    }
    if (excitationModel.value) {
      data.model.push({
        modelType: 'Excitation',
        modelId: excitationModel.value._id,
        modelName: excitationModel.value.name,
        values: Object.values(excitationTable.value),
      });
    }
    if (governorModel.value) {
      data.model.push({
        modelType: 'Governor',
        modelId: governorModel.value._id,
        modelName: governorModel.value.name,
        values: Object.values(governorTable.value),
      });
    }
    if (stabilizerModel.value) {
      data.model.push({
        modelType: 'Stabilizer',
        modelId: stabilizerModel.value._id,
        modelName: stabilizerModel.value.name,
        values: Object.values(stabilizerTable.value),
      });
    }
  } else {
    if (genericModel.value) {
      data.model.push({
        modelType: 'Generic',
        modelId: genericModel.value._id,
        modelName: genericModel.value.name,
        values: Object.values(genericTable.value),
      });
    }
    if (renewableModel.value) {
      data.model.push({
        modelType: 'Renewable',
        modelId: renewableModel.value._id,
        modelName: renewableModel.value.name,
        values: Object.values(renewableTable.value),
      });
    }
    if (planControlModel.value) {
      data.model.push({
        modelType: 'PlanControl',
        modelId: planControlModel.value._id,
        modelName: planControlModel.value.name,
        values: Object.values(planControlTable.value),
      });
    }
    if (driveTrainModel.value) {
      data.model.push({
        modelType: 'DriveTrain',
        modelId: driveTrainModel.value._id,
        modelName: driveTrainModel.value.name,
        values: Object.values(driveTrainTable.value),
      });
    }
  }
  return data;
};
// Traditional
const traditionalGeneratorOpts = ref();
const traditionalExcitationOpts = ref();
const traditionalGovernorOpts = ref();
const traditionalStabilizerOpts = ref();
// Renewable
const renewableGenericOpts = ref();
const renewableRenewableOpts = ref();
const renewablePlanControlOpts = ref();
const renewableDriveTrainOpts = ref();

const getGlobalDynamicModelDefinitionByType = async (type) => {
  try {
    const res = await globalDynamicModelApi.getGlobalDynamicModelDefinitionByType(type);
    return res.data;
  } catch (error) {
    console.log('getGlobalDynamicModelDefinitionByType: error ', error);
    toast.add({
      severity: 'error',
      summary: 'globaldynamicmodeldefinition/' + type,
      detail: error.data.detail,
      life: 3000,
    });
  }
};

// Traditional: {

const getDynamicModelTableOfType = async (dynamicModel_id, values = []) => {
  // console.log('generatorModelChange', dynamicModel_id);
  const dynamicModelDefinition = await getGlobalDynamicModelDefinitionById(dynamicModel_id);
  const table = {};
  for (let i = 0; i < dynamicModelDefinition.values.length; i++) {
    table[dynamicModelDefinition.values[i]] = values[i] || '';
  }
  return table;
};

const generatorModel = ref();
const generatorTable = ref([]);
const generatorModelChange = async () => {
  generatorTable.value = await getDynamicModelTableOfType(generatorModel.value._id);
};

const excitationModel = ref();
const excitationTable = ref([]);
const excitationModelChange = async () => {
  excitationTable.value = await getDynamicModelTableOfType(excitationModel.value._id);
};

const governorModel = ref();
const governorTable = ref([]);
const governorModelChange = async () => {
  governorTable.value = await getDynamicModelTableOfType(governorModel.value._id);
};

const stabilizerModel = ref();
const stabilizerTable = ref([]);
const stabilizerModelChange = async () => {
  stabilizerTable.value = await getDynamicModelTableOfType(stabilizerModel.value._id);
};

// Renewable: {
const genericModel = ref();
const genericTable = ref([]);
const genericModelChange = async () => {
  genericTable.value = await getDynamicModelTableOfType(genericModel.value._id);
};

const renewableModel = ref();
const renewableTable = ref([]);
const renewableModelChange = async () => {
  renewableTable.value = await getDynamicModelTableOfType(renewableModel.value._id);
};

const planControlModel = ref();
const planControlTable = ref([]);
const planControlModelChange = async () => {
  planControlTable.value = await getDynamicModelTableOfType(planControlModel.value._id);
};

const driveTrainModel = ref();
const driveTrainTable = ref([]);
const driveTrainModelChange = async () => {
  driveTrainTable.value = await getDynamicModelTableOfType(driveTrainModel.value._id);
};

const handleUpdate = async (data) => {
  if (!traditionalGeneratorOpts.value) {
    await getModelTypeOptions();
  }
  const updateData = JSON.parse(JSON.stringify(data));
  updateData.isTraditionalModel = data.modelDynamicType === 0;
  dataChange.value = updateData;

  // traditional
  if (updateData.Generator) {
    generatorModel.value = { _id: updateData.Generator.modelId, name: updateData.Generator.modelName };
    generatorTable.value = updateData.Generator.values;
    console.log('generatorTable.value', generatorTable.value);
  }
  if (updateData.Excitation) {
    excitationModel.value = { _id: updateData.Excitation.modelId, name: updateData.Excitation.modelName };
    excitationTable.value = updateData.Excitation.values;
  }
  if (updateData.Governor) {
    governorModel.value = { _id: updateData.Governor.modelId, name: updateData.Governor.modelName };
    governorTable.value = updateData.Governor.values;
  }

  if (updateData.Stabilizer) {
    stabilizerModel.value = { _id: updateData.Stabilizer.modelId, name: updateData.Stabilizer.modelName };
    stabilizerTable.value = updateData.Stabilizer.values;
  }
  // renewable;
  if (updateData.Generic) {
    genericModel.value = { _id: updateData.Generic.modelId, name: updateData.Generic.modelName };
    genericTable.value = updateData.Generic.values;
  }
  if (updateData.Renewable) {
    renewableModel.value = { _id: updateData.Renewable.modelId, name: updateData.Renewable.modelName };
    renewableTable.value = updateData.Renewable.values;
  }
  if (updateData.PlanControl) {
    planControlModel.value = { _id: updateData.PlanControl.modelId, name: updateData.PlanControl.modelName };
    planControlTable.value = updateData.PlanControl.values;
  }
  if (updateData.DriveTrain) {
    driveTrainModel.value = { _id: updateData.DriveTrain.modelId, name: updateData.DriveTrain.modelName };
    driveTrainModel.value = updateData.DriveTrain.values;
  }
  visibleChangeDialog.value = true;
  modeChange.value = 'Update';
};

const updateDynamicModel = async () => {
  const dataUpdate = getValueModelInForm();
  try {
    await DynamicModelApi.updateDynamicModel(dataUpdate.id, {
      model: dataUpdate.model,
      modelDynamicType: dataUpdate.modelDynamicType,
    });
    toast.add({ severity: 'success', summary: 'Update successfully', life: 3000 });
    visibleChangeDialog.value = false;
    await getTableData();
    clearModelTypeSelected();
  } catch (error) {
    console.log('getGlobalDynamicModelDefinitionByType: error ', error);
    toast.add({ severity: 'error', summary: 'Create', detail: error.data.detail, life: 3000 });
  }
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
    await DynamicModelApi.deleteDynamicModel(dynamicModel_id);
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
    await getTableData();
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

.psAutoComplete button {
  background-color: var(--gray-400);
  border-color: var(--gray-400);
}
</style>

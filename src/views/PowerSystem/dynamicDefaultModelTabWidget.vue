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
      <template #header>
        <div class="flex align-items-center justify-content-end">
          <Button type="button" icon="pi pi-plus" size="small" text @click="handleCreate()" />
        </div>
      </template>

      <ColumnGroup type="header">
        <Row>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">Name</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">pMax</div>
            </template>
          </Column>
          <Column :rowspan="2">
            <template #header>
              <div class="flex align-items-center justify-content-center w-full">pMin</div>
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
          <Column frozen header="" :rowspan="2" />
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

      <Column field="name" frozen header="Name" style="text-wrap: nowrap">
        <template #body="{ data }">
          <div class="font-bold min-w-8rem text-left">
            {{ data.name }}
          </div>
        </template>
      </Column>
      <Column field="pMax" header="pMax" style="text-wrap: nowrap" />
      <Column field="pMin" header="pMin" style="text-wrap: nowrap" />

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

      <Column class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdate(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
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
  <!-- create dialog data -->
  <Dialog v-model:visible="visibleChangeDialog" style="width: 64rem" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Dynamic Default Model</span>
      </div>
    </template>
    <div style="height: 50rem">
      <div class="flex align-items-center gap-3 mb-3">
        <label for="name" class="font-semibold w-12rem">Name <sup class="text-red-500">*</sup></label>
        <InputText id="name" v-model="dataChange.name" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="pMax" class="font-semibold w-12rem">pMax </label>
        <InputNumber id="pMax" v-model="dataChange.pMax" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="pMin" class="font-semibold w-12rem">pMin </label>
        <InputNumber id="pMin" v-model="dataChange.pMin" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex align-items-center gap-3 mb-5">
        <label for="type" class="font-semibold w-12rem"> Model Type</label>
        <Button
          :severity="dataChange.isRenewableModel ? 'info' : 'primary'"
          :label="!dataChange.isRenewableModel ? 'Traditional' : 'Renewable'"
          class="flex-grow-1"
          @click="dataChange.isRenewableModel = !dataChange.isRenewableModel"
        />
      </div>
      <!-- ---------- Traditional----- -->

      <TabView v-if="!dataChange.isRenewableModel">
        <TabPanel header="Generator">
          <!-- Generator  -->
          <div class="flex align-items-center gap-3 mb-3">
            <label for="" class="font-semibold w-12rem block"> Generator:</label>
            <Dropdown
              v-model="generatorModel"
              :options="traditionalGeneratorOpts"
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
              optionValue="_id"
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
        :disabled="!dataChange.name"
        @click="createDynamicDefaultModel()"
      ></Button>
      <Button v-if="modeChange === 'Update'" type="button" label="Update" @click="updateDynamicModel()"></Button>
    </template>
  </Dialog>

  <ConfirmDialog group="deleteDynamicDefaultConfirm">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: #fb923c"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div>Do you want to delete this model ?</div>
          <div>Name: {{ slotProps.message.data.name }}</div>
          <div>Type: {{ slotProps.message.data.isRenewableModel ? 'Traditional' : 'Renewable' }}</div>
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
import { PowerSystemParameterApi, DynamicDefaultApi } from '@/views/PowerSystem/api';

const toast = useToast();

const props = defineProps({
  showDefinitionFlatList: { type: Boolean },
  nodeSelected: { type: Object },
  definitionId: { type: String, required: true },
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
  await getDynamicDefaultModelList();
  const data = [];
  for (let index = 0; index < dynamicModelList.value.length; index++) {
    const items = dynamicModelList.value[index];
    const typeModel = items.renewable === 0 ? 'Traditional' : 'Renewable';
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

const getDynamicDefaultModelList = async () => {
  try {
    let resData = {
      items: [],
      total: 0,
    };
    if (props.showDefinitionFlatList) {
      const res = await DynamicDefaultApi.getDynamicDefaultList(currentPage.value);
      resData = res.data;
    } else {
      if (props.nodeSelected) {
        const res = await DynamicDefaultApi.getDynamicDefaultListWithTree(
          props.nodeSelected.parentId,
          currentPage.value,
        );
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

const visibleChangeDialog = ref(false);
const dataChange = ref();
const modeChange = ref();

const handleCreate = async () => {
  if (!traditionalGeneratorOpts.value) {
    await getModelTypeOptions();
  }
  clearModelTypeSelected();
  dataChange.value = {
    name: '',
    pMax: 0,
    pMin: 0,
    isRenewableModel: true,
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
const createDynamicDefaultModel = async () => {
  try {
    await DynamicDefaultApi.createDynamicDefault(getValueModelInForm());
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    visibleChangeDialog.value = false;
    await getTableData();
  } catch (error) {
    console.log('createDynamicModel: error ', error);
    toast.add({ severity: 'error', summary: 'Create', detail: error.data.detail, life: 3000 });
  }
};
const getValueModelInForm = () => {
  console.log(dataChange.value.powerSystemData);
  const data = {
    id: dataChange.value.id,
    name: dataChange.value.name,
    pMax: dataChange.value.pMax,
    pMin: dataChange.value.pMin,
    renewable: Number(dataChange.value.isRenewableModel),
    model: [],
  };
  if (!dataChange.value.isRenewableModel) {
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
  generatorTable.value = await getDynamicModelTableOfType(generatorModel.value);
};

const excitationModel = ref();
const excitationTable = ref([]);
const excitationModelChange = async () => {
  excitationTable.value = await getDynamicModelTableOfType(excitationModel.value);
};

const governorModel = ref();
const governorTable = ref([]);
const governorModelChange = async () => {
  governorTable.value = await getDynamicModelTableOfType(governorModel.value);
};

const stabilizerModel = ref();
const stabilizerTable = ref([]);
const stabilizerModelChange = async () => {
  stabilizerTable.value = await getDynamicModelTableOfType(stabilizerModel.value);
};

// Renewable: {
const genericModel = ref();
const genericTable = ref([]);
const genericModelChange = async () => {
  genericTable.value = await getDynamicModelTableOfType(genericModel.value);
};

const renewableModel = ref();
const renewableTable = ref([]);
const renewableModelChange = async () => {
  renewableTable.value = await getDynamicModelTableOfType(renewableModel.value);
};

const planControlModel = ref();
const planControlTable = ref([]);
const planControlModelChange = async () => {
  planControlTable.value = await getDynamicModelTableOfType(planControlModel.value);
};

const driveTrainModel = ref();
const driveTrainTable = ref([]);
const driveTrainModelChange = async () => {
  driveTrainTable.value = await getDynamicModelTableOfType(driveTrainModel.value);
};

const handleUpdate = async (data) => {
  if (!traditionalGeneratorOpts.value) {
    await getModelTypeOptions();
  }
  const updateData = JSON.parse(JSON.stringify(data));
  updateData.isRenewableModel = data.renewable === 1;
  dataChange.value = updateData;

  // traditional
  if (updateData.Generator) {
    generatorModel.value = updateData.Generator.modelId;
    generatorTable.value = updateData.Generator.values;
    console.log('generatorTable.value', generatorTable.value);
  }
  if (updateData.Excitation) {
    excitationModel.value = updateData.Excitation.modelId;
    excitationTable.value = updateData.Excitation.values;
  }
  if (updateData.Governor) {
    governorModel.value = updateData.Governor.modelId;
    governorTable.value = updateData.Governor.values;
  }

  if (updateData.Stabilizer) {
    stabilizerModel.value = updateData.Stabilizer.modelId;
    stabilizerTable.value = updateData.Stabilizer.values;
  }
  // renewable;
  if (updateData.Generic) {
    genericModel.value = updateData.Generic.modelId;
    genericTable.value = updateData.Generic.values;
  }
  if (updateData.Renewable) {
    renewableModel.value = updateData.Renewable.modelId;
    renewableTable.value = updateData.Renewable.values;
  }
  if (updateData.PlanControl) {
    planControlModel.value = updateData.PlanControl.modelId;
    planControlTable.value = updateData.PlanControl.values;
  }
  if (updateData.DriveTrain) {
    driveTrainModel.value = updateData.DriveTrain.modelId;
    driveTrainModel.value = updateData.DriveTrain.values;
  }
  visibleChangeDialog.value = true;
  modeChange.value = 'Update';
};

const updateDynamicModel = async () => {
  const dataUpdate = getValueModelInForm();
  try {
    await DynamicDefaultApi.updateDynamicDefault(dataUpdate.id, getValueModelInForm());
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
    group: 'deleteDynamicDefaultConfirm',
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
    await DynamicDefaultApi.deleteDynamicDefault(dynamicModel_id);
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

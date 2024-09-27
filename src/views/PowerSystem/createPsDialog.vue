<template>
  <Dialog v-model:visible="showDialog" style="width: 68rem" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Add New Power Systwem</span>
      </div>
    </template>
    <div class="grid">
      <div class="col-6">
        <span class="p-text-secondary block mb-5">General </span>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="name" class="font-semibold w-12rem"> Name<sup class="text-red-500">*</sup></label>
          <InputText id="name" v-model="parameterForm.generalInfo.name" class="flex-auto" autocomplete="off" />
        </div>

        <div class="flex align-items-center gap-3 mb-3">
          <label for="parrentData" class="font-semibold w-12rem"
            >Parent Power System <sup class="text-red-500">*</sup></label
          >

          <AutoComplete
            id="parameterparrentData"
            v-model="parameterForm.generalInfo.parrentData"
            optionLabel="name"
            optionValue="_id"
            completeOnFocus
            class="flex-grow-1 psAutoComplete"
            :suggestions="psParameterSuggestions"
            name="parameterparrentData"
            @complete="searchPsParameterQueryFilter"
          />
        </div>

        <div class="flex align-items-center gap-3 mb-3">
          <label for="uniqueId" class="font-semibold w-12rem">Unique Id <sup class="text-red-500">*</sup></label>
          <InputText id="uniqueId" v-model="parameterForm.generalInfo.uniqueId" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="operationName" class="font-semibold w-12rem">Operation Name</label>
          <InputText
            id="operationName"
            v-model="parameterForm.generalInfo.operationName"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        <div class="flex align-items-center gap-3 mb-3">
          <label for="operationUniqueId" class="font-semibold w-12rem">Operation Unique Id</label>
          <InputText
            id="operationUniqueId"
            v-model="parameterForm.generalInfo.operationUniqueId"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="col-6">
        <span class="p-text-secondary block mb-5">Scada </span>
        <div v-for="(val, name) in parameterForm.scadaInfo" :key="name" class="flex align-items-center gap-3 mb-3">
          <label :for="name" class="font-semibold w-12rem"> {{ capitalizeFirstLetter(name) }}</label>
          <InputText :id="name" v-model="parameterForm.scadaInfo[name]" class="flex-auto" autocomplete="off" />
        </div>
      </div>
    </div>

    <Divider />

    <span class="p-text-secondary block mb-5">Engine </span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="" class="font-semibold w-12rem block"> Definition<sup class="text-red-500">*</sup></label>
      <Dropdown
        v-model="parameterForm.engineInfo.powerSystemDefinitionId"
        :options="parameterFilter"
        optionValue="_id"
        optionLabel="name"
        placeholder="Select a Definition"
        class="flex-grow-1"
        @change="getParameterDefinitionData"
      />
    </div>
    <div class="grid pl-3">
      <template v-for="(data, field) in parameterDefinitionData" :key="field">
        <div v-if="data.display" :field="field" :header="field" class="col-6">
          <div class="flex gap-1 align-items-center">
            <div class="w-12rem">{{ field }}</div>
            <InputText v-model="parameterDefinitionData[field].value" class="flex-grow-1" />
          </div>
        </div>
      </template>
    </div>

    <Divider />
    <span class="p-text-secondary block mb-5">EMS </span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="emsparrentData" class="font-semibold w-12rem"> Parent Power System</label>
      <AutoComplete
        id="emsparrentData"
        v-model="emsForm.generalInfo.parrentData"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :suggestions="psEmsSuggestions"
        name="emsparrentData"
        @complete="searchPsEmsQueryFilter"
      />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="" class="font-semibold w-12rem block"> Definition</label>
      <Dropdown
        v-model="emsForm.engineInfo.powerSystemDefinitionId"
        :options="emsFilterOpts"
        optionValue="_id"
        optionLabel="label"
        placeholder="Select a Definition"
        class="flex-grow-1"
        @change="getEmsDefinitionData"
      />
    </div>
    <div class="grid pl-3">
      <template v-for="(data, field) in emsDefinitionData" :key="field">
        <div v-if="data.display" :field="field" :header="field" class="col-6">
          <div class="flex gap-1 align-items-center">
            <div class="w-12rem">{{ field }}</div>
            <InputText v-model="emsDefinitionData[field].value" class="flex-grow-1" />
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="showDialog = false"></Button>
      <Button type="button" label="Create" :disabled="!canSave" @click="createPs()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

import { useToast } from 'primevue/usetoast';
import AutoComplete from 'primevue/autocomplete';

import { PowerSystemEmsApi, PowerSystemParameterApi, DefinitionListApi } from '@/views/PowerSystem/api';

const toast = useToast();

const props = defineProps({
  visible: { type: Boolean, default: true },
  projectVersionId: { type: String, default: '' },
  parameterFilter: { type: Array, default: () => [] },
  emsFilter: { type: Array, default: () => [] },

  nodeSelected: { type: Object, default: () => {} },
  definitionSelected: { type: Object, default: () => {} },
});

const emit = defineEmits(['unvisible', 'reloadPsParameter', 'reloadPsEms']);
const showDialog = ref(props.visible);
watch(showDialog, (newStatus) => {
  if (newStatus === false) {
    emit('unvisible');
  }
});

watch(
  () => props.visible,
  (newStatus) => {
    showDialog.value = newStatus;
  },
);

const emsFilterOpts = computed(() => {
  const opts = props.emsFilter;
  opts.shift();
  return opts;
});
onMounted(async () => {
  if (props.nodeSelected && props.nodeSelected.parentId) {
    parameterForm.generalInfo.parrentData = {
      _id: props.nodeSelected.parentId,
      name: props.nodeSelected.parentName,
    };
  } else {
    parameterForm.generalInfo.parrentData = {};
  }
  if (props.definitionSelected._id) {
    parameterForm.engineInfo.powerSystemDefinitionId = props.definitionSelected._id;
    await getParameterDefinitionData();
  }
});
watch(
  () => props.nodeSelected,
  (newNode) => {
    if (newNode.parentId) {
      parameterForm.generalInfo.parrentData = {
        _id: props.nodeSelected.parentId,
        name: props.nodeSelected.parentName,
      };
    } else {
      parameterForm.generalInfo.parrentData = {};
    }
  },
);

watch(
  () => props.definitionSelected,
  async (newDefinition) => {
    if (newDefinition._id) {
      parameterForm.engineInfo.powerSystemDefinitionId = newDefinition._id;
      await getParameterDefinitionData();
    }
  },
);

const parameterForm = reactive({
  currentPowerSystemVersionId: props.projectVersionId,
  generalInfo: {
    name: '',
    parrentData: {},
    uniqueId: '',
    operationName: '',
    operationUniqueId: '',
  },
  engineInfo: {
    powerSystemDefinitionId: '',
    values: [''],
  },
  scadaInfo: {
    skey: '',
    scadaName: '',
    scadaUniqueId: '',
  },
});

const emsForm = reactive({
  currentPowerSystemVersionId: props.projectVersionId,
  generalInfo: {
    parrentData: {},
  },
  engineInfo: {
    powerSystemDefinitionId: '',
    values: [''],
  },
});

const canSave = computed(() => {
  if (!parameterForm.generalInfo.name) {
    return false;
  }
  if (!parameterForm.engineInfo.powerSystemDefinitionId) {
    return false;
  }
  if (!parameterForm.generalInfo.parrentData._id) {
    return false;
  }
  if (!parameterForm.generalInfo.uniqueId) {
    return false;
  }
  return true;
});

const createPs = async () => {
  const createParameter = await createPsParameter();
  const createEms = await createPsEms();
  if (createParameter && createEms) {
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
  }
};

const createPsParameter = async () => {
  const formCreate = JSON.parse(JSON.stringify(parameterForm));
  formCreate.generalInfo.parrentId = formCreate.generalInfo.parrentData._id;
  delete formCreate.generalInfo.parrentData;
  formCreate.engineInfo.values = Object.values(parameterDefinitionData.value).map((item) => item.value);

  try {
    await PowerSystemParameterApi.create(formCreate, props.projectVersionId);
    emit('reloadPsParameter');

    return true;
  } catch (error) {
    console.log('createPsParameter: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System - Parameter', detail: error.data.detail, life: 3000 });
  }
};
const createPsEms = async () => {
  const formCreate = JSON.parse(JSON.stringify(emsForm));
  formCreate.generalInfo.parrentId = formCreate.generalInfo.parrentData._id || null;
  delete formCreate.generalInfo.parrentData;

  formCreate.generalInfo.name = parameterForm.generalInfo.name;
  formCreate.generalInfo.uniqueId = parameterForm.generalInfo.uniqueId;
  formCreate.generalInfo.powersystemId = parameterForm.generalInfo.parrentData._id;

  formCreate.engineInfo.values = Object.values(emsDefinitionData.value).map((item) => item.value);

  try {
    await PowerSystemEmsApi.create(formCreate, props.projectVersionId);
    emit('reloadPsEms');

    return true;
  } catch (error) {
    console.log('createPsEms: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System - EMS', detail: error.data.detail, life: 3000 });
  }
};

// generalInfo

const psParameterSuggestions = ref([]);

const searchPsParameterQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, '', query);
    psParameterSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

// engine

const parameterDefinitionData = ref({});

const getParameterDefinitionData = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionData(parameterForm.engineInfo.powerSystemDefinitionId);
    const data = {};
    for (const definition of res.data.inputAttributes) {
      if (definition.name) {
        data[definition.name] = {
          name: definition.name,
          display: definition.display,
          value: null,
        };
      }
    }
    parameterDefinitionData.value = data;
  } catch (error) {
    parameterDefinitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};

// ems
const psEmsSuggestions = ref([]);

const searchPsEmsQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemEmsApi.searchPs(props.projectVersionId, '', query);
    psEmsSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const emsDefinitionData = ref({});

const getEmsDefinitionData = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionData(emsForm.engineInfo.powerSystemDefinitionId);
    const data = {};
    for (const definition of res.data.inputAttributes) {
      if (definition.name) {
        data[definition.name] = {
          name: definition.name,
          display: definition.display,
          value: null,
        };
      }
    }
    emsDefinitionData.value = data;
  } catch (error) {
    emsDefinitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};

function capitalizeFirstLetter(string) {
  if (!string) {
    return '';
  }
  return string
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

<template>
  <Dialog v-model:visible="showDialog" style="width: 56rem; min-height: 60vh" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Power Systwem</span>
      </div>
    </template>

    <!-- <div class="grid">
      <div class="col-6"> -->
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-12rem"> Name<sup class="text-red-500">*</sup></label>
      <InputText id="name" v-model="form.generalInfo.name" class="flex-auto" autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="parrentData" class="font-semibold w-12rem">Power System <sup class="text-red-500">*</sup></label>

      <AutoComplete
        v-model="form.generalInfo.parrentData"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :suggestions="psParameterSuggestions"
        @complete="searchPsParameterQueryFilter"
      />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="uniqueId" class="font-semibold w-12rem">Unique Id</label>
      <InputText id="uniqueId" v-model="form.generalInfo.uniqueId" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="operationName" class="font-semibold w-12rem">Operation Name</label>
      <InputText id="operationName" v-model="form.generalInfo.operationName" class="flex-auto" autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="operationUniqueId" class="font-semibold w-12rem">Operation Unique Id</label>
      <InputText
        id="operationUniqueId"
        v-model="form.generalInfo.operationUniqueId"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <Divider />

    <span class="p-text-secondary block mb-5">Engine information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="" class="font-semibold w-12rem block"> Definition<sup class="text-red-500">*</sup></label>
      <Dropdown
        v-model="form.engineInfo.powerSystemDefinitionId"
        :options="definitionList"
        optionValue="_id"
        optionLabel="name"
        placeholder="Select a Definition"
        class="flex-grow-1"
        @change="parameterDefinitionChange"
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

    <span class="p-text-secondary block my-5">Scada information.</span>
    <div v-for="(val, name) in form.scadaInfo" :key="name" class="flex align-items-center gap-3 mb-3">
      <label :for="name" class="font-semibold w-12rem"> {{ capitalizeFirstLetter(name) }}</label>
      <InputText :id="name" v-model="form.scadaInfo[name]" class="flex-auto" autocomplete="off" />
    </div>
    <!-- </div> -->
    <!-- <div class="col">
        form:
        <pre>
          {{ form }}
        </pre>
      </div>
      <div class="col">
        parameterDefinitionData:
        <pre>
          {{ parameterDefinitionData }}
        </pre>
      </div> -->
    <!-- </div> -->

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="showDialog = false"></Button>
      <Button type="button" label="Create" :disabled="!canSave" @click="createPsParameter()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

import { useToast } from 'primevue/usetoast';
import AutoComplete from 'primevue/autocomplete';

import { PowerSystemEmsApi, PowerSystemParameterApi, DefinitionListApi } from '@/views/PowerSystem/api';

const toast = useToast();

const props = defineProps({
  visible: { type: Boolean, default: true },
  projectVersionId: { type: String, default: '' },
  definitionList: { type: Array, default: () => [] },
});

const emit = defineEmits(['unvisible']);
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

const form = ref({
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

const canSave = computed(() => {
  if (!form.value.generalInfo.name) {
    return false;
  }
  if (!form.value.engineInfo.powerSystemDefinitionId) {
    return false;
  }
  if (!form.value.generalInfo.parrentData._id) {
    return false;
  }
  return true;
});
const createPsParameter = async () => {
  const formCreate = JSON.parse(JSON.stringify(form.value));
  formCreate.generalInfo.parrentId = formCreate.generalInfo.parrentData._id;
  delete formCreate.generalInfo.parrentData;
  formCreate.engineInfo.values = Object.values(parameterDefinitionData.value).map((item) => item.value);

  try {
    await PowerSystemParameterApi.create(formCreate, props.projectVersionId);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
  } catch (error) {
    console.log('createPS: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System', detail: error.data.detail, life: 3000 });
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
const parameterDefinitionChange = async () => {
  await getParameterDefinitionData();
};
const parameterDefinitionData = ref({});

const getParameterDefinitionData = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionData(form.value.engineInfo.powerSystemDefinitionId);
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

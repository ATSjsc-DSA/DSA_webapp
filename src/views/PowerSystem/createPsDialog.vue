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
          <InputText id="name" v-model="createForm.generalInfo.name" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="uniqueId" class="font-semibold w-12rem">Unique Id <sup class="text-red-500">*</sup></label>
          <InputText id="uniqueId" v-model="createForm.generalInfo.uniqueId" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="parrentData" class="font-semibold w-12rem"
            >Parent Power System <sup class="text-red-500">*</sup></label
          >

          <AutoComplete
            id="parameterparrentData"
            v-model="createForm.generalInfo.parrentData"
            optionLabel="name"
            optionValue="_id"
            completeOnFocus
            class="flex-grow-1 psAutoComplete"
            :suggestions="psSuggestions"
            name="parameterparrentData"
            @complete="searchPsQueryFilter"
          />
        </div>

        <div class="flex align-items-center gap-3 mb-3">
          <label for="operationName" class="font-semibold w-12rem">Operation Name</label>
          <InputText
            id="operationName"
            v-model="createForm.generalInfo.operationName"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        <div class="flex align-items-center gap-3 mb-3">
          <label for="operationUniqueId" class="font-semibold w-12rem">Operation Unique Id</label>
          <InputText
            id="operationUniqueId"
            v-model="createForm.generalInfo.operationUniqueId"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="col-6">
        <span class="p-text-secondary block mb-5">Scada </span>
        <div v-for="(val, name) in createForm.scadaInfo" :key="name" class="flex align-items-center gap-3 mb-3">
          <label :for="name" class="font-semibold w-12rem"> {{ capitalizeFirstLetter(name) }}</label>
          <InputText :id="name" v-model="createForm.scadaInfo[name]" class="flex-auto" autocomplete="off" />
        </div>
      </div>
    </div>

    <Divider />

    <span class="p-text-secondary block mb-5">Engine </span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="" class="font-semibold w-12rem block"> Definition<sup class="text-red-500">*</sup></label>
      <Dropdown
        v-model="createForm.engineInfo.powerSystemDefinitionId"
        :options="parameterFilter"
        optionValue="_id"
        optionLabel="name"
        placeholder="Select a Definition"
        class="flex-grow-1"
        @change="getDefinitionData"
      />
    </div>
    <div class="grid pl-3">
      <template v-for="(data, field) in definitionData" :key="field">
        <div v-if="data.display" :field="field" :header="field" class="col-6">
          <div class="flex gap-1 align-items-center">
            <div class="w-12rem">{{ field }}</div>
            <InputText v-model="definitionData[field].value" class="flex-grow-1" />
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

import { PowerSystemParameterApi, DefinitionListApi } from '@/views/PowerSystem/api';

const toast = useToast();

const props = defineProps({
  visible: { type: Boolean, default: true },
  parameterFilter: { type: Array, default: () => [] },
  nodeSelected: { type: Object, default: () => {} },
  definitionSelected: { type: Object, default: () => {} },
});

const emit = defineEmits(['unvisible', 'reloadPsParameter']);
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

onMounted(async () => {
  if (props.nodeSelected && props.nodeSelected.parentId) {
    createForm.generalInfo.parrentData = {
      _id: props.nodeSelected.parentId,
      name: props.nodeSelected.parentName,
    };
  } else {
    createForm.generalInfo.parrentData = {};
  }
  if (props.definitionSelected._id) {
    createForm.engineInfo.powerSystemDefinitionId = props.definitionSelected._id;
    await getDefinitionData();
  }
});
watch(
  () => props.nodeSelected,
  (newNode) => {
    if (newNode.parentId) {
      createForm.generalInfo.parrentData = {
        _id: props.nodeSelected.parentId,
        name: props.nodeSelected.parentName,
      };
    } else {
      createForm.generalInfo.parrentData = {};
    }
  },
);

watch(
  () => props.definitionSelected,
  async (newDefinition) => {
    if (newDefinition._id) {
      createForm.engineInfo.powerSystemDefinitionId = newDefinition._id;
      await getDefinitionData();
    }
  },
);

const createForm = reactive({
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
  if (!createForm.generalInfo.name) {
    return false;
  }
  if (!createForm.engineInfo.powerSystemDefinitionId) {
    return false;
  }
  if (!createForm.generalInfo.parrentData._id) {
    return false;
  }
  if (!createForm.generalInfo.uniqueId) {
    return false;
  }
  return true;
});

const createPs = async () => {
  const formCreate = JSON.parse(JSON.stringify(createForm));
  formCreate.generalInfo.parrentId = formCreate.generalInfo.parrentData._id;
  delete formCreate.generalInfo.parrentData;
  formCreate.engineInfo.values = Object.values(definitionData.value).map((item) => item.value);

  try {
    await PowerSystemParameterApi.create(formCreate);
    emit('reloadPsParameter');
    emit('unvisible');
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createForm.value = {
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
    };
  } catch (error) {
    console.log('createPsParameter: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System - Parameter', detail: error.data.detail, life: 3000 });
  }
};

// generalInfo

const psSuggestions = ref([]);

const searchPsQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs([], query);
    psSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

// engine

const definitionData = ref({});

const getDefinitionData = async () => {
  try {
    const res = await DefinitionListApi.getDefinitionData(createForm.engineInfo.powerSystemDefinitionId);
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
    definitionData.value = data;
  } catch (error) {
    definitionData.value = {};
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

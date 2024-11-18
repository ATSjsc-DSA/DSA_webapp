<template>
  <Dialog v-model:visible="showDialog" style="width: 68rem" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Add New EMS </span>
      </div>
    </template>
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
      <label for="createEms-emsparrentData" class="font-semibold w-12rem"> Parent Power System</label>
      <AutoComplete
        id="createEms-emsparrentData"
        v-model="createForm.generalInfo.parrentData"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :suggestions="parrentEmsSuggestions"
        name="createForm-emsparrentData"
        @complete="searchPsEmsQueryFilter"
      />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="createEms-powersystemData" class="font-semibold w-12rem">
        Power System <sup class="text-red-500">*</sup></label
      >

      <AutoComplete
        id="createEms-powersystemData"
        v-model="createForm.generalInfo.powersystemData"
        optionLabel="name"
        optionValue="_id"
        completeOnFocus
        class="flex-grow-1 psAutoComplete"
        :suggestions="psSuggestions"
        name="powersystemData"
        @complete="searchPsParameterQueryFilter"
      />
    </div>

    <Divider />
    <div class="flex align-items-center gap-3 mb-3">
      <label for="" class="font-semibold w-12rem block"> Definition</label>
      <Dropdown
        v-model="createForm.engineInfo.powerSystemDefinitionId"
        :options="emsFilterList"
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
      <Button type="button" label="Create" :disabled="!canSave" @click="createPsEms()"></Button>
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
  parameterFilter: { type: Array, default: () => [] },
  emsFilterSelected: { type: Object, default: () => {} },
  nodeSelected: { type: Object, default: () => {} },
});

const emit = defineEmits(['unvisible', 'reloadPsEms']);
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
    createForm.generalInfo.powersystemData = {
      _id: props.nodeSelected.parentId,
      name: props.nodeSelected.parentName,
    };
  } else {
    createForm.generalInfo.powersystemData = {};
  }

  getEmsfilterList();
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

const createForm = reactive({
  generalInfo: {
    name: '',
    parrentData: {},
    powersystemData: {},
    uniqueId: '',
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

const emsFilterList = ref();
const getEmsfilterList = async () => {
  try {
    const res = await DefinitionListApi.getEmsList();
    const opts = [];

    for (const item of res.data) {
      opts.push({
        label: item.name.replace('Ems', ''),
        _id: item._id,
      });
    }
    emsFilterList.value = opts;
    if (opts.length > 0) {
      createForm.engineInfo.powerSystemDefinitionId = opts[0]._id;
      await getEmsDefinitionData();
    }
  } catch (error) {
    console.log('getEmsfilterList: error ', error);
    // toast.add({ severity: 'error', summary: 'EMS List', detail: error.data.detail, life: 3000 });
  }
};

const canSave = computed(() => {
  if (!createForm.generalInfo.name) {
    return false;
  }
  if (!createForm.engineInfo.powerSystemDefinitionId) {
    return false;
  }
  if (!createForm.generalInfo.powersystemData._id) {
    return false;
  }
  if (!createForm.generalInfo.uniqueId) {
    return false;
  }
  return true;
});

const createPsEms = async () => {
  const data = {
    generalInfo: {
      uniqueId: createForm.generalInfo.uniqueId,
      powersystemId: createForm.generalInfo.powersystemData._id,
      parrentId: createForm.generalInfo.parrentData._id || null,
      name: createForm.generalInfo.name,
    },
    engineInfo: {
      powerSystemDefinitionId: createForm.engineInfo.powerSystemDefinitionId,
      values: Object.values(emsDefinitionData.value).map((item) => item.value),
    },
  };
  try {
    await PowerSystemEmsApi.create(data);
    emit('reloadPsEms');
    emit('unvisible');
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
  } catch (error) {
    console.log('createPsEms: error ', error);
    toast.add({ severity: 'error', summary: 'Create Power System - EMS', detail: error.data.detail, life: 3000 });
  }
};

// search

const psSuggestions = ref([]);
const parrentEmsSuggestions = ref([]);

const searchPsParameterQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemParameterApi.searchPs([], query);
    psSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const searchPsEmsQueryFilter = async (event) => {
  const query = event.query.trim();
  try {
    const res = await PowerSystemEmsApi.searchPs([], query);
    parrentEmsSuggestions.value = res.data;
    return res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

// ems

const emsDefinitionData = ref({});

const getEmsDefinitionData = async () => {
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
    emsDefinitionData.value = data;
  } catch (error) {
    emsDefinitionData.value = {};
    console.log('getDefinitionData: error ', error);
    toast.add({ severity: 'error', summary: 'Definition Header', detail: error.data.detail, life: 3000 });
  }
};
</script>

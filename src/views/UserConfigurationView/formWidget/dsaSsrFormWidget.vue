<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-10">
        <div class="flex flex-column gap-2 mb-3">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-2">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" v-model="data.active" autocomplete="off" />
        </div>
      </div>
    </template>
    <div class="col-12">
      <searchContingenciesWidget v-model="contingenciesSelected" />
    </div>

    <div class="col-12">
      <searchSubsystemWidget v-model="subsytemSelected" />
    </div>
    <div class="col-12">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="generatorReactanceOpts" class="font-semibold"> Generator Reactance </label>
        <Dropdown
          id="generatorReactanceOpts"
          v-model="data.generatorReactance"
          :options="generatorReactanceOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';
import searchContingenciesWidget from './searchContingenciesWidget.vue';
import searchSubsystemWidget from './searchSubsystemWidget.vue';
import { ApiContingencies, ApiSubsystem } from '@/views/SystemEvents/api';

const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const data = defineModel();

onMounted(async () => {
  if (data.value.contingenciesId) {
    await getContingenciesData();
  } else {
    contingenciesSelected.value = undefined;
  }
  if (data.value.fixSubSystemId) {
    await getSubsystemData();
  } else {
    subsytemSelected.value = undefined;
  }
});
watch(data, async (newVal, oldVal) => {
  if (newVal._id !== oldVal.__id) {
    if (newVal.contingenciesId) {
      await getContingenciesData();
    } else {
      contingenciesSelected.value = {};
    }
    if (newVal.fixSubSystemId) {
      await getSubsystemData();
    } else {
      subsytemSelected.value = {};
    }
  }
});

const contingenciesSelected = ref();

watch(contingenciesSelected, (newVal) => {
  data.value.contingenciesId = newVal._id;
});

const subsytemSelected = ref();

watch(subsytemSelected, (newVal) => {
  data.value.fixSubSystemId = newVal._id;
});
const getContingenciesData = async () => {
  try {
    const res = await ApiContingencies.getContingenciesData(data.value.contingenciesId);
    contingenciesSelected.value = {
      name: res.data.name,
      _id: res.data._id,
    };
  } catch (error) {
    contingenciesSelected.value = {};
    console.log('getContingenciesData: error ', error);
  }
};
const getSubsystemData = async () => {
  try {
    const res = await ApiSubsystem.getSubsystemData(data.value.fixSubSystemId);
    console.log('getSubsystemData', res.data);

    subsytemSelected.value = {
      name: res.data.name,
      _id: data.value.fixSubSystemId,
    };
  } catch (error) {
    subsytemSelected.value = {};
    console.log('getSubsystemData: error ', error);
  }
};

const generatorReactanceOpts = ref([
  { label: 'SubTransient', value: 0 },
  { label: 'Transient', value: 1 },
  { label: 'Synchoronous', value: 2 },
]);
</script>

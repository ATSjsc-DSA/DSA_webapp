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
    <div class="col-6">
      <searchContingenciesWidget v-model="contingenciesSelected" />
    </div>

    <div class="col-6">
      <searchPsWidget v-model="psSelected" />
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';
import searchContingenciesWidget from './searchContingenciesWidget.vue';
import searchPsWidget from '@/views/PowerSystem/searchPsWidget.vue';
import { ApiContingencies } from '@/views/SystemEvents/api';
import { PowerSystemParameterApi } from '@/views/PowerSystem/api';

const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const data = defineModel();

onMounted(async () => {
  if (data.value.contingenciesId) {
    await getContingenciesData();
    await getPsData();
  }
});
watch(data, async (newVal, oldVal) => {
  if (newVal._id !== oldVal.__id) {
    if (newVal.contingenciesId) {
      await getContingenciesData();
      await getPsData();
    }
  }
});

const contingenciesSelected = ref();

watch(contingenciesSelected, (newVal) => {
  data.value.contingenciesId = newVal._id;
});

const psSelected = ref();

watch(psSelected, (newVal) => {
  data.value.powerSytemId = newVal._id;
});
const getContingenciesData = async () => {
  try {
    const res = await ApiContingencies.getContingenciesData(data.value.contingenciesId);
    contingenciesSelected.value = {
      name: res.data.name,
      _id: res.data._id,
    };
  } catch (error) {
    console.log('getContingenciesData: error ', error);
  }
};

const getPsData = async (id) => {
  try {
    const res = await PowerSystemParameterApi.getPowersystemData(data.value.powerSytemId);
    psSelected.value = {
      name: res.data.generalInfo.name,
      _id: res.data._id,
    };
  } catch (error) {
    console.log('getContingenciesData: error ', error);
  }
};
</script>

<template>
  <div class="grid align-items-center">
    <div class="col-10">
      <div class="flex flex-column gap-2 mb-3">
        <label for="appName" class="font-semibold"> Name </label>
        <InputText id="appName" v-model="appData.name" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-2">
      <div class="flex flex-column gap-3 mb-3">
        <label for="appActive" class="font-semibold"> Active</label>
        <InputSwitch id="appActive" v-model="appData.active" autocomplete="off" />
      </div>
    </div>
  </div>

  <div class="flex flex-column gap-2 mb-3">
    <label for="appName" class="font-semibold"> Start Time </label>
    <Calendar id="calendar-24h" v-model="appData.startTimestamp" showTime hourFormat="24" showSeconds showIcon />
  </div>

  <div class="flex flex-column gap-3 mb-3">
    <label for="engine" class="font-semibold w-6rem"> Engine</label>
    <Dropdown v-model="engineSelected" :options="engineList" optionLabel="name" class="w-full" />
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import { onMounted, onUnmounted, watch } from 'vue';
import { ApiEngine } from '@/views/DSASettingView/api';
const appData = defineModel();
const engineSelected = ref({});
onMounted(async () => {
  await getEngineList();
});
watch(appData, (newValue, oldValue) => {
  if (newValue._id !== oldValue._id) {
    if (appData.value.engineId) {
      engineSelected.value = engineList.value.filter((item) => item._id === appData.value.engineId)[0];
    } else {
      engineSelected.value = {};
    }
  }
});

watch(engineSelected, (newVal) => {
  if (newVal && newVal._id !== appData.value.engineId) {
    appData.value.engineId = engineSelected.value._id;
  }
});
const engineList = ref([]);
const getEngineList = async () => {
  try {
    const res = await ApiEngine.getList();
    engineList.value = res.data;
  } catch (error) {
    engineList.value = [];
  }
};
</script>

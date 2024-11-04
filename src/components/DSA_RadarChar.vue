<script setup>
import { ref, onMounted, onUpdated, onUnmounted, triggerRef } from 'vue';
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';
import { ApplicationApi } from '@/views/DashboardView/api';
// primeVue
// import { useToast } from 'primevue/usetoast';
// import Toast from 'primevue/toast';
// const toast = useToast();
const refRadarChartContainer = ref(null);
const signalUpdate = ref(true);
const interval = ref(null);
const chartData = ref({
  Key: ['Slot1', 'Slot2', 'Slot3', 'Slot4', 'Slot5', 'Slot6', 'Slot7', 'Slot8'],
  data: {
    Rate1: [90, 90, 90, 90, 90, 90, 90, 0],
    Rate2: [95, 95, 95, 95, 95, 95, 95, 0],
    Rate3: [100, 100, 100, 100, 100, 100, 100, 0],
    CurentState: [99, 81, 81, 81, 81, 81, 81, 0],
  },
  modificationTime: '',
});

// Function to transform API response and ensure chartData always has 7 keys
const transformApiResponse = (apiResponse, modificationTime) => {
  // console.log(apiResponse, 'apiResponse');
  const result = {
    Key: apiResponse.Key.slice(0, 7), // If there are more than 7 keys, we take the first 7
    data: {
      Rate1: apiResponse.data.Rate1.slice(0, 7),
      Rate2: apiResponse.data.Rate2.slice(0, 7),
      Rate3: apiResponse.data.Rate3.slice(0, 7),
      CurentState: apiResponse.data.CurentState.slice(0, 7),
    },
    modificationTime: modificationTime,
  };
  // console.log(result, 'result');
  // Add missing slots if there are fewer than 7 keys
  const additionalSlots = 8 - result.Key.length;
  for (let i = 0; i < additionalSlots; i++) {
    result.Key.push(`slot${i + 1}`);
    result.data.Rate1.push(90);
    result.data.Rate2.push(95);
    result.data.Rate3.push(100);
    result.data.CurentState.push(0);
  }

  return result;
};

const getDataCriteria = async () => {
  try {
    const res = await ApplicationApi.getRadarChartData('6704ae00a0ce433ff084b984');
    chartData.value = transformApiResponse(res.data, res.data.modificationTime);
    // chartData.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getDataCriteria();
  interval.value = setInterval(() => {
    getDataCriteria();
  }, intervalTime);
});
onUnmounted(() => {
  clearInterval(interval.value);
});
const refeshData = () => {
  getDataCriteria();
};
</script>

<template>
  <!--  <Toast></Toast> -->
  <div class="radarChartContainer">
    <radar-chart :chartData="chartData" @refeshData="refeshData"></radar-chart>
  </div>
</template>
<style lang="scss" scoped>
.radarChartContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

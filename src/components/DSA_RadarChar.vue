<script setup>
import { ref, onMounted, onUpdated, onUnmounted, triggerRef } from 'vue';
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';

// primeVue
// import { useToast } from 'primevue/usetoast';
// import Toast from 'primevue/toast';
// const toast = useToast();
const refRadarChartContainer = ref(null);
const signalUpdate = ref(true);
const interval = ref(null);
const chartData = ref({
  Key: [
    'Line Loading',
    'Tranformer Loading',
    'Generator Loading',
    'Excitation Limiter',
    'Low/High Voltage',
    'VSA Module',
    'TSA Module',
    'SSR Module',
  ],
  data: {
    Rate1: [90, 90, 90, 90, 90, 90, 90, 90],
    Rate2: [95, 95, 95, 95, 95, 95, 95, 95],
    Rate3: [100, 100, 100, 100, 100, 100, 100, 100],
    CurentState: [81, 81, 81, 81, 81, 81, 81, 81],
  },
  modificationTime: '',
});

const transformApiResponse = (apiResponse, modificationTime) => {
  // Initialize the result object
  const result = {
    Key: [],
    data: {
      Rate1: [],
      Rate2: [],
      Rate3: [],
      CurentState: [],
    },
    modificationTime: 0,
  };
  result.modificationTime = modificationTime;
  // Iterate through each item in the API response
  apiResponse.forEach((item) => {
    if (item.modificationTime > result.modificationTime) {
      result.modificationTime = item.modificationTime;
    }
    result.Key.push(item.name);
    result.data.Rate1.push(item.rate1);
    result.data.Rate2.push(item.rate2);
    result.data.Rate3.push(item.rate3);
    result.data.CurentState.push(item.currentState);
  });

  return result;
};

const getDataCriteria = async () => {
  try {
    const res = await dsa_api.getdataCriteria();
    chartData.value = transformApiResponse(res.data.criteria, res.data.modificationTime);
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

<script setup>
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';

// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

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
  modificationTime: 0,
});
const interval = ref(null);
const getDataSub = async () => {
  try {
    const res = await dsa_api.getdataSub();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartData.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getDataSub();
  interval.value = setInterval(() => {
    getDataSub();
  }, intervalTime);
});
onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <Toast></Toast>
  <div class="radarChartContainer">
    <radar-chart :chartData="chartData"></radar-chart>
  </div>
</template>
<style lang="scss" scoped>
.radarChartContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

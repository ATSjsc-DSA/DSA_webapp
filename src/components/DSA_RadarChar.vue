<script setup>
import { ref, onMounted, onUpdated, onUnmounted, triggerRef } from 'vue';
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';

// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
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
  modificationTime: 0,
});

const radarChartContainerWidth = computed(() => {
  let a = signalUpdate.value;
  let width = 300;

  if (refRadarChartContainer.value) {
    let clWidth = refRadarChartContainer.value.clientWidth;
    let clientHeight = refRadarChartContainer.value.clientHeight;
    let finalSize = Math.min(clientHeight, clWidth);
    console.log(finalSize);
    width = finalSize;
  }
  width = width < 300 ? 300 : width;
  console.log('update');
  console.log(width);
  return width;
});
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
const refeshData = () => {
  getDataSub();
};

onUpdated(() => {
  signalUpdate.value = !signalUpdate.value;
});
</script>

<template>
  <!-- <Toast></Toast> -->
  <div ref="refRadarChartContainer" class="radarChartContainer">
    <radar-chart :chartData="chartData" :parentWidth="radarChartContainerWidth" @refeshData="refeshData"></radar-chart>
  </div>
</template>
<style lang="scss" scoped>
.radarChartContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

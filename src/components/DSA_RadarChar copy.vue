<script setup>
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';

// primeVue

import chartOverLayPanel from './chartOverLayPanel.vue';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const baseValueChart = {
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
  Rate1: [90, 90, 90, 90, 90, 90, 90, 90],
  Rate2: [95, 95, 95, 95, 95, 95, 95, 95],
  Rate3: [100, 100, 100, 100, 100, 100, 100, 100],
  CurentState: [81, 81, 87, 81, 81, 81, 81, 88],
};
const chartData = ref(baseValueChart);
const listSub = ref({});

const getDataSub = async () => {
  try {
    const res = await dsa_api.getdataSub();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      listSub.value = res.data.payload;
      console.log(listSub.value, 'listSub.value');
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  chartData.value = await getDataSub();
});
</script>

<template>
  <Toast></Toast>
  <div class="grid ssr">
    <radar-chart :chartData="chartData"></radar-chart>
  </div>
</template>
<style lang="scss" scoped>
.ssr {
  margin-top: 0px;
  .ssr-block {
    height: calc((100vh - 154px) / 2); /* 50% chiều cao của viewport, bạn có thể điều chỉnh theo nhu cầu */
    position: relative;
  }
  .block-top {
    padding-top: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0px;
      left: 0.5rem;
      z-index: 100;
    }
  }
  .block-bot {
    padding-bottom: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 100;
    }
  }
}
</style>

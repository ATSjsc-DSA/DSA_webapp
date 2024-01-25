<script setup>
import radarChart from './radarChart.vue';
import dsa_api from '@/api/dsa_api';

// primeVue

import chartOverLayPanel from './chartOverLayPanel.vue';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const chartData = ref({});
const listSub = ref({});

const getDataSub = async () => {
  try {
    const res = await dsa_api.getdataSub();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      listSub.value = res.data.payload;
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

<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const baseValueChart = {
  Key: [],
  Require: [],
  Estimated: [],
};

const chartBlock1 = ref(baseValueChart);

const getchartData = async (code_name) => {
  try {
    const res = await TSA_api.getSpsCodeInfo(code_name);
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      return res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  chartBlock1.value = await getchartData('F81');
});
</script>

<template>
  <Toast></Toast>
  <div class="sps-block">
    <barChartBase :chartData="chartBlock1" class="chart"></barChartBase>
  </div>
</template>
<style lang="scss" scoped>
.sps-block {
  position: relative;
  // padding: 0.5rem;
  width: 100%;
}
.chart {
  height: 100%;
}
</style>

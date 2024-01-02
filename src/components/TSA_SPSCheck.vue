<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import customFieldset from './customFieldset.vue';
// primeVue
import Tag from 'primevue/tag';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const baseValueChart = {
  Key: [],
  Require: [],
  Estimated: [],
};

const chartBlock1 = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);
const chartBlock3 = ref(baseValueChart);

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
  chartBlock2.value = await getchartData('F27');
  chartBlock3.value = await getchartData('PowerTransfer');
});
</script>

<template>
  <Toast></Toast>
  <customFieldset legendText="SPS Check">
    <div class="sps-fieldset-main">
      <div class="sps-block">
        <barChartBase :chartData="chartBlock1" class="chart"></barChartBase>
      </div>
      <div class="sps-block">
        <barChartBase :chartData="chartBlock2" class="chart"></barChartBase>
      </div>
      <div class="sps-block">
        <barChartBase :chartData="chartBlock3" class="chart"> </barChartBase>
      </div>
    </div>
  </customFieldset>
</template>
<style lang="scss" scoped>
.sps-fieldset-main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .sps-block {
    position: relative;
    padding: 0.5rem;
    flex: 1;
  }
}
</style>

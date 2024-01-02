<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';

// primeVue
import Tag from 'primevue/tag';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import customFieldset from './customFieldset.vue';

const toast = useToast();

const chartBlock1 = ref();

const getchartData = async () => {
  try {
    const res = await TSA_api.getTransCap();
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
  chartBlock1.value = await getchartData();
});
</script>

<template>
  <Toast></Toast>
  <customFieldset legendText="TTTG Check">
    <div class="tttg-block">
      <barChartBase :chartData="chartBlock1" class="chart"></barChartBase>
    </div>
  </customFieldset>
</template>
<style lang="scss" scoped>
.tttg-block {
  position: relative;
  padding: 0.5rem;
  height: 100%;
}
</style>

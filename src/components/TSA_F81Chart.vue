<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import { intervalTime } from '@/Constants/';
import { ref, watch } from 'vue';
// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const props = defineProps({
  enabledFieldset: Boolean,
});

const baseValueChart = {
  name: '',
  Key: [],
  data: {
    Require: [],
    Estimated: [],
  },
  modificationTime: 0,
};
const interval = ref(null);
const chartBlock1 = ref(baseValueChart);

const getchartData = async () => {
  try {
    const res = await TSA_api.getSpsCodeInfo('F81');
    if (!res.data.success) {
      // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartBlock1.value = res.data.payload;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};


onMounted(async () => {
  await getchartData();
  interval.value = setInterval(() => {
    getchartData();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const refeshData = () => {
  getchartData();
};
</script>

<template>
  <div class="sps-block-f81" >
    <!-- <Toast></Toast> -->
    <barChartBase :chartData="chartBlock1" class="chart" @refeshData="refeshData"></barChartBase>
  </div>
</template>
<style lang="scss" scoped>
.sps-block-f81 {
  position: relative;
  width: 100%;
}
.chart {
  height: 100%;
}
</style>

<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import { intervalTime } from '@/Constants/';

// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
const props = defineProps({
  enabledFieldset: Boolean,
});

const baseValueChart = {
  name: 'Power Tranfer',
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
    const res = await TSA_api.getSpsCodeInfo('PowerTransfer');
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartBlock1.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const displayFieldset = computed(() => {
  return props.enabledFieldset ? 'flex-1 p-2' : '';
});
onMounted(async () => {
  await getchartData();
  interval.value = setInterval(() => {
    getchartData();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <Toast></Toast>
  <div class="sps-block-trans" :class="displayFieldset">
    <barChartBase :chartData="chartBlock1" class="chart"></barChartBase>
  </div>
</template>
<style lang="scss" scoped>
.sps-block-trans {
  position: relative;
  // padding: 0.5rem;
  width: 100%;
}
.chart {
  height: 100%;
}
</style>

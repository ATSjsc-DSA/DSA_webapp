<script setup>
import barChartBase from '@/components/barChartBase.vue';
import TSA_api from '../api/tsa_api';
import { intervalTime } from '@/Constants/';
import { ref, watch } from 'vue';
// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import chartComposable from '@/combosables/chartData';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
const { fetchChartData } = chartComposable();

const toast = useToast();

const props = defineProps({
  enabledFieldset: Boolean,
});

const interval = ref(null);
const chartBlock1 = ref();

const getChartData = async () => {
  chartBlock1.value = await fetchChartData(TSA_api.getSpsCodeInfo('f81'), 'F81');
};

onMounted(async () => {
  await getChartData();
  interval.value = setInterval(() => {
    getChartData();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const refeshData = () => {
  getChartData();
};

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getchartData();
    }, 1000);
  }
});
</script>

<template>
  <div class="sps-block-f81">
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

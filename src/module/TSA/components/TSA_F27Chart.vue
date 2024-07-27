<script setup>
import barChartBase from '@/components/barChartBase.vue';
import TSA_api from '../api/tsa_api';
import { intervalTime } from '@/Constants/';
import { ref, onMounted, onUnmounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import { useCommonStore } from '@/store';

const { fetchChartData } = chartComposable();
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
const interval = ref(null);
const chartBlock1 = ref();

const getChartData = async () => {
  chartBlock1.value = await fetchChartData(TSA_api.getSpsCodeInfo('f27'), 'F27');
};

onMounted(() => {
  getChartData();
  interval.value = setInterval(getChartData, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getchartData();
    }, 1000);
  }
});

const refreshData = getChartData;
</script>

<template>
  <div class="sps-block-f27">
    <barChartBase :chartData="chartBlock1" class="chart" @refreshData="refreshData"></barChartBase>
  </div>
</template>

<style lang="scss" scoped>
.sps-block-f27 {
  position: relative;
  width: 100%;
}
.chart {
  height: 100%;
}
</style>

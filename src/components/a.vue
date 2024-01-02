<script setup>
import { ref, onMounted, computed } from 'vue';
import Carousel from 'primevue/carousel';
import TSA_api from '@/api/tsa_api';
import Tag from 'primevue/tag';

import lineChartSpecialBase from './lineChartSpecialBase.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
const active = ref(0);

const baseValueChart = {
  name: String,
  time: [],
  value: [],
  PowerTranfer: [],
  peak: [],
  mean: [],
  t_stablility: [],
  stability: [],
};

const chartBlock1 = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);

const products = computed(() => {
  return [chartBlock1, chartBlock2];
});

const getchartData = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
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
  chartBlock1.value = await getchartData('DaNang-Pleiku_100.0MW');
  chartBlock2.value = await getchartData('NhoQuan-HaTinh_1000.0MW');
});
</script>
<template>
  <fieldset class="h-full">
    <legend><Tag value="TTTG CHECK"></Tag></legend>
    <div class="h-full">
      <Carousel :value="products" :numVisible="1" :numScroll="1" class="w-full">
        <template #item="slotProps">
          <div class="h-full">
            <div class="">
              <lineChartSpecialBase
                :chartData="slotProps.data.value"
                labelChart="value"
                class="chart"
              ></lineChartSpecialBase>
            </div>
            <div class="">
              <lineChartSpecialBase
                :chartData="slotProps.data.value"
                labelChart="PowerTranfer"
                class="chart"
              ></lineChartSpecialBase>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <Toast></Toast>
  </fieldset>
</template>
<style lang="scss" scoped>
.chartView {
  height: 100%;
}
</style>

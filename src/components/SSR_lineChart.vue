<script setup>
import lineChartBase from './lineChartBase.vue';
import SSR_api from '@/api/ssr_api';

// primeVue

import chartOverLayPanel from './chartOverLayPanel.vue';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const baseValueChart = {
  name: '',
  dm: {
    f: Number,
    dmin: Number,
    dmax: Number,
  },
  freq: [],
  base: [],
  lne_4001_8001_1: [],
  lne_4001_4204_1: [],
  lne_4001_4097_1: [],
  lne_4001_4094_1: [],
  lne_4001_4090_1: [],
  lne_3906_4001_2: [],
  lne_3906_4001_1: [],
};

const listSub = ref([]);

const chartBlock = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);

const getListSub = async () => {
  try {
    const res = await SSR_api.getSubList();
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
getListSub();
const getchartData = async (subName) => {
  try {
    const res = await SSR_api.getSubInfo(subName);
    // chartData.value = await getDataSub('sym_4035_1');
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      console.log(res.data.payload, 'res.data.payload');
      return res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  chartBlock.value = await getchartData('sym_4031_1');
});

const changeSubActive = async (param) => {
  chartBlock.value = await getchartData(param);
};
</script>

<template>
  <Toast></Toast>
  <div class="ssr-block">
    <chartOverLayPanel
      :listSub="listSub"
      :subActive="chartBlock.name"
      @changeSubActive="changeSubActive"
      class="ssr-block-overlay"
    ></chartOverLayPanel>
    <lineChartBase :chartData="chartBlock" class="chart"></lineChartBase>
  </div>
</template>
<style lang="scss" scoped>
.ssr-block {
  // height: 100%;
  width: 100%;
  height: calc((100vh - 154px) / 2); /* 50% chiều cao của viewport, bạn có thể điều chỉnh theo nhu cầu */
  position: relative;
  .ssr-block-overlay {
    position: absolute;
    top: 0px;
    left: 0.5rem;
    z-index: 100;
  }
}
</style>

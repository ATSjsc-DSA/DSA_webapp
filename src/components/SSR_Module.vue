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
const chartData = ref(baseValueChart);
const chartData1 = ref();
const listSub = ref([]);

const chartBlock1 = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);
const chartBlock3 = ref(baseValueChart);
const chartBlock4 = ref(baseValueChart);

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
  chartBlock1.value = await getchartData('sym_4031_1');
  chartBlock2.value = await getchartData('sym_4035_1');
});

const changeSubActive1 = async (param) => {
  chartBlock1.value = await getchartData(param);
};
const changeSubActive2 = async (param) => {
  chartBlock2.value = await getchartData(param);
};
const changeSubActive3 = async (param) => {
  chartBlock3.value = await getchartData(param);
};
const changeSubActive4 = async (param) => {
  chartBlock4.value = await getchartData(param);
};
</script>

<template>
  <Toast></Toast>
  <div class="grid ssr">
    <div class="ssr-block col-6 block-top">
      <chartOverLayPanel
        :listSub="listSub"
        :subActive="chartBlock1.name"
        @changeSubActive="changeSubActive1"
        class="ssr-block-overlay"
      ></chartOverLayPanel>
      <lineChartBase :chartData="chartBlock1" class="chart"></lineChartBase>
    </div>
    <div class="ssr-block col-6 block-top">
      <chartOverLayPanel
        :listSub="listSub"
        :subActive="chartBlock2.name"
        @changeSubActive="changeSubActive2"
        class="ssr-block-overlay"
      ></chartOverLayPanel>
      <lineChartBase :chartData="chartBlock2" class="chart"></lineChartBase>
    </div>
    <div class="ssr-block col-6 block-bot">
      <chartOverLayPanel
        :listSub="listSub"
        :subActive="chartBlock3.name"
        @changeSubActive="changeSubActive3"
        class="ssr-block-overlay"
      ></chartOverLayPanel>
      <lineChartBase :chartData="chartBlock3" class="chart"></lineChartBase>
    </div>
    <div class="ssr-block col-6 block-bot">
      <chartOverLayPanel
        :listSub="listSub"
        :subActive="chartBlock4.name"
        @changeSubActive="changeSubActive4"
        class="ssr-block-overlay"
      ></chartOverLayPanel>
      <lineChartBase :chartData="chartBlock4" class="chart"></lineChartBase>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ssr {
  margin-top: 0px;
  height: 100%;
  .ssr-block {
    height: 50%;
    position: relative;
  }
  .block-top {
    padding-top: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0px;
      left: 0.5rem;
      z-index: 100;
    }
  }
  .block-bot {
    padding-bottom: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 100;
    }
  }
}
</style>

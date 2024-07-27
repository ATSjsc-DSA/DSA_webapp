<script setup>
import lineChartBase from './lineChartBase.vue';
import SSR_api from '@/api/ssr_api';
import chartOverLayPanel from './chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { ref, watch } from 'vue';

// primeVue

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const subActive = ref('');

const props = defineProps({
  linechartNumber: {
    default: 0,
    type: Number,
  },
});

const baseValueChart = {
  name: '',
  f: Number,
  dmin: Number,
  dmax: Number,
  SSR: Number,
  data: [],
  modificationTime: 0,
};

// const baseValueChart = {
//   name: '',
//   dm: {
//     f: Number,
//     dmin: Number,
//     dmax: Number,
//   },
//   freq: [],
//   base: [],
//   lne_4001_8001_1: [],
//   lne_4001_4204_1: [],
//   lne_4001_4097_1: [],
//   lne_4001_4094_1: [],
//   lne_4001_4090_1: [],
//   lne_3906_4001_2: [],
//   lne_3906_4001_1: [],
//   modificationTime: 0,
// };

const listSub = ref([]);
const interval = ref(null);
const chartBlock = ref(baseValueChart);

const getListGen = async () => {
  try {
    const res = await SSR_api.getGenList();

    listSub.value = res.data;
    if (listSub.value[props.linechartNumber]) {
      subActive.value = listSub.value[props.linechartNumber].name;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getchartData = async (subName) => {
  try {
    const res = await SSR_api.getSubInfo(subName);

    chartBlock.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getListGen();
  await getchartData(subActive.value);
  // interval.value = setInterval(() => {
  //   getchartData(subActive.value);
  // }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const changeSubActive = async (param) => {
  subActive.value = param;
  await getchartData(param);
};

const refeshData = () => {
  getchartData(subActive.value);
};
</script>

<template>
  <!-- <Toast></Toast>
   -->
  <div></div>
  <div class="ssr-block">
    <chartOverLayPanel
      :listSub="listSub"
      :subActive="subActive"
      @changeSubActive="changeSubActive"
      class="ssr-block-overlay"
    ></chartOverLayPanel>
    <lineChartBase :chartData="chartBlock" class="chart" @refeshData="refeshData"></lineChartBase>
  </div>
</template>
<style lang="scss" scoped>
.ssr-block {
  width: 100%;
  // height: calc((100vh - 154px) / 2);
  height: 100%;
  position: relative;
  .ssr-block-overlay {
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    z-index: 100;
  }
}
</style>

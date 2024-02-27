<script setup>
import lineChartBase from './lineChartBase.vue';
import SSR_api from '@/api/ssr_api';
import chartOverLayPanel from './chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { useLayout } from '@/layout/composables/layout';
import { ref, watch } from 'vue';

// primeVue

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
const { isDarkTheme } = useLayout();

const subActive = ref('');

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
  modificationTime: 0,
};

const listSub = ref([]);
const interval = ref(null);
const chartBlock = ref(baseValueChart);

const getListSub = async () => {
  try {
    const res = await SSR_api.getSubList();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      listSub.value = res.data.payload;
      subActive.value = listSub.value[0].name;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getchartData = async (subName) => {
  try {
    const res = await SSR_api.getSubInfo(subName);
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartBlock.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getListSub();
  await getchartData(subActive.value);
  interval.value = setInterval(() => {
    getchartData(subActive.value);
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const changeSubActive = async (param) => {
  subActive.value = param;
  await getchartData(param);
};
watch(isDarkTheme, () => {
  getchartData(subActive.value);
});
const refeshData = () => {
  getchartData(subActive.value);
};
</script>

<template>
  <Toast></Toast>
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

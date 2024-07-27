<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/module/TSA/api/tsa_api';
import chartOverLayPanel from './chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { computed, ref, watch } from 'vue';
// primeVue

// import { useToast } from 'primevue/usetoast';
// import Toast from 'primevue/toast';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

const props = defineProps({
  enabledFieldset: Boolean,
});
// const toast = useToast();
const interval = ref(null);
const baseValueChart = {
  name: '',
  Key: ['Thermal', 'PV', 'TSAT'],
  data: {
    Online: [],
    Offline: [],
  },
  modificationTime: 0,
};
const chartBlock1 = ref(baseValueChart);
const typelineActive = ref('');
const listTypeLine = ref([]);
const getListAreaTC = async () => {
  try {
    const res = await TSA_api.getListAreaTC();
    listTypeLine.value = res.data;
    typelineActive.value = listTypeLine.value[0]?.name;
  } catch (error) {}
};

const getchartData = async (typeline) => {
  if (!typeline) {
    // Tránh gọi getchartData khi typeline hoặc psm_id rỗng
    return;
  }
  try {
    const { data } = await TSA_api.getDetailTC(typeline);
    const { thermal, pv, TSAT, modificationTime } = data;
    chartBlock1.value = {
      name: data.name,
      Key: ['Thermal', 'VSA', 'TSAT'],
      data: {
        Offline: [thermal.offline, pv.offline, TSAT.offline],
        Online: [thermal.online, pv.online, TSAT.online],
        Current: [thermal.current, pv.current, TSAT.current],
      },
      modificationTime: modificationTime,
    };
  } catch (error) {}
};

const displayFieldset = computed(() => {
  return props.enabledFieldset ? 'flex-1 p-2' : '';
});

const changeSubActive = async (param) => {
  typelineActive.value = param;
  await getchartData(param);
};

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListAreaTC();
      await getchartData(typelineActive.value);
    }, 1000);
  }
});

onMounted(async () => {
  await getListAreaTC();
  await getchartData(typelineActive.value);
  interval.value = setInterval(() => {
    getchartData(typelineActive.value);
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const refeshData = () => {
  getchartData(typelineActive.value);
};
</script>

<template>
  <!-- <Toast></Toast> -->
  <div class="tttg-block" :class="displayFieldset">
    <chartOverLayPanel
      :listSub="listTypeLine"
      :subActive="typelineActive"
      @changeSubActive="changeSubActive"
      class="ssr-block-overlay"
    ></chartOverLayPanel>
    <barChartBase :chartData="chartBlock1" class="chart" @refeshData="refeshData"></barChartBase>
  </div>
</template>
<style lang="scss" scoped>
.tttg-block {
  position: relative;
  height: 100%;
  width: 100%;
  .ssr-block-overlay {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    z-index: 100;
  }
}
</style>

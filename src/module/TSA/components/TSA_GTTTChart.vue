<script setup>
import barChartBase from '@/components/barChartBase.vue';
import TSA_api from '../api/tsa_api';
import chartOverLayPanel from '@/components/chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { computed, ref, watch } from 'vue';
// primeVue
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
const props = defineProps({
  enabledFieldset: Boolean,
  typelineActive: {
    type: String,
    default: '',
  },
});
const interval = ref(null);
const baseValueChart = {
  name: '',
  Key: ['Thermal', 'PV', 'TSAT'],
  data: {
    Online: [],
    Offline: [],
    Current: [],
  },
  modificationTime: 0,
};
const chartBlock1 = ref(baseValueChart);

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

const typelineActive = ref(props.typelineActive);

watch([() => props.typelineActive], (newTypeline, oldTypeline) => {
  if (newTypeline !== oldTypeline) {
    typelineActive.value = newTypeline;
    nextTick(() => {
      getchartData(typelineActive.value);
    });
  }
});

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getchartData(typelineActive.value);
    }, 1000);
  }
});

onMounted(async () => {
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
  <barChartBase :chartData="chartBlock1" class="chart border-none" @refeshData="refeshData"></barChartBase>
</template>
<style lang="scss" scoped></style>

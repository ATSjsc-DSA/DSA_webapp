<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import chartOverLayPanel from './chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { computed, ref, watch } from 'vue';
// primeVue

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
  },
  modificationTime: 0,
};
const chartBlock1 = ref(baseValueChart);

const getchartData = async (param) => {
  if (param === '') {
    // Tránh gọi getchartData khi param rỗng
    return;
  }
  try {
    const res = await TSA_api.getTransCap(param);
    if (!res.data.success) {
    } else {
      let a = res.data.payload;
      let output = {
        name: res.data.payload.name,
        Key: ['Thermal', 'VSA', 'TSAT'],
        data: {
          Offline: [],
          Online: [],
          Current: [],
        },
        modificationTime: res.data.payload.modificationTime,
      };
      for (let i = 0; i < a['Key'].length; i++) {
        let key = a['Key'][i];
        if (key.includes('Offline') && key.includes('Limitation')) {
          output.data['Offline'].push(a.data.value[i]);
        } else if (key.includes('_Current')) {
          let percent = (Math.random() * 5 + 1) / 100;
          let operator = Math.random() < 0.5 ? -1 : 1;
          const variable = a.data.value[i] * percent * operator;
          const currentData = a.data.value[i] + variable;
          output.data['Current'].push(currentData);
        } else {
          if (key.includes('Limitation')) {
            output.data['Online'].push(a.data.value[i]);
          }
        }
      }
      chartBlock1.value = output;
    }
  } catch (error) {}
};

const typelineActive = ref('');
watch(
  () => props.typelineActive,
  (newValue) => {
    typelineActive.value = newValue;
    nextTick(() => {
      getchartData(typelineActive.value);
    });
  },
);

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

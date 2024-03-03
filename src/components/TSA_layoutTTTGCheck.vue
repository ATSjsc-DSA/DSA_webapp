<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import chartOverLayPanel from './chartOverLayPanel.vue';
import { intervalTime } from '@/Constants/';
import { computed, ref, watch } from 'vue';
// primeVue

// import { useToast } from 'primevue/usetoast';
// import Toast from 'primevue/toast';

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
const getListTypeLine = async () => {
  try {
    const res = await TSA_api.getListTypeLine();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      if (res.data.payload[0]) {
        listTypeLine.value = res.data.payload;
        typelineActive.value = res.data.payload[0].name;
      }
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getchartData = async (param) => {
  if (param === '') {
    // Tránh gọi getchartData khi param rỗng
    return;
  }
  try {
    const res = await TSA_api.getTransCap(param);
    if (!res.data.success) {
      // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      let a = res.data.payload;
      let output = {
        name: res.data.payload.name,
        Key: ['Thermal', 'PV', 'TSAT'],
        data: {
          Online: [],
          Offline: [],
          Current: [],
        },
        modificationTime: res.data.payload.modificationTime,
      };
      for (let i = 0; i < a['Key'].length; i++) {
        let key = a['Key'][i];
        if (key.includes('Offline') && key.includes('Limitation')) {
          output.data['Offline'].push(a.data.value[i]);
        } else if (key.includes('_Current')) {
          output.data['Current'].push(a.data.value[i]);
        } else {
          if (key.includes('Limitation')) {
            output.data['Online'].push(a.data.value[i]);
          }
        }
      }
      chartBlock1.value = output;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const displayFieldset = computed(() => {
  return props.enabledFieldset ? 'flex-1 p-2' : '';
});

const changeSubActive = async (param) => {
  typelineActive.value = param;
  await getchartData(param);
};

onMounted(async () => {
  await getListTypeLine();
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

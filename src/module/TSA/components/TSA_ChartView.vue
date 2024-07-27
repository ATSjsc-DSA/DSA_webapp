<script setup>
import TSA_api from '../api/tsa_api';

import { computed, ref } from 'vue';
import { intervalTime } from '@/Constants/';

import chartOverLayPanel from '@/components/chartOverLayPanel.vue';

import Dropdown from 'primevue/dropdown';

import Button from 'primevue/button';
import lineChartSpecialBase from '@/components/lineChartSpecialBase.vue';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

const props = defineProps({
  typelineActive: {
    type: String,
    default: '',
  },
});
const baseValueChart = {
  type: String,
  load_scale: Number,
  PowerTranfer: Number,
  peak: Number,
  t_stablility: Number,
  stability: Number,
  time: [],
  value: [],
  powertranfer: [],
  modificationTime: null,
};
const lineActiveBlock = ref();
const chartBlock = ref(baseValueChart);
const listLineBlock = ref([]);
const typelineActive = ref(props.typelineActive);

const getchartDataBlock = async () => {
  try {
    const res = await TSA_api.getLineData(typelineActive.value, lineActiveBlock.value.name);
    chartBlock.value = res.data;
  } catch (error) {}
};
// const getListLineWithType = async (type_line) => {
//   try {
//     const res = await TSA_api.getListLineWithType(type_line);
//     listLineBlock.value = res.data.map((item) => ({
//       name: item.load_scale,
//     }));
//     lineActiveBlock.value = listLineBlock.value[0];
//   } catch (error) {}
// };

const getListLineWithType = async () => {
  if (!typelineActive.value) {
    // Tránh gọi getchartData khi typeline hoặc psm_id rỗng
    return;
  }
  try {
    const res = await TSA_api.getListLineWithType(typelineActive.value);
    listLineBlock.value = res.data.map((item) => ({
      name: item.load_scale,
    }));
    lineActiveBlock.value = listLineBlock.value[0];
  } catch (error) {}
};

watch([() => props.typelineActive], (newTypeline, oldTypeline) => {
  if (newTypeline !== oldTypeline) {
    typelineActive.value = newTypeline;
    nextTick(async () => {
      await getListLineWithType();
      getchartDataBlock();
    });
  }
});

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListLineWithType();
      getchartDataBlock();
    }, 1000);
  }
});

const interval = ref(null);
onMounted(async () => {
  interval.value = setInterval(async () => {
    // await getListLineWithType();
    getchartDataBlock();
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const changeLineActive = (param) => {
  lineActiveBlock.value.name = param.name;
  getchartDataBlock();
};
</script>

<template>
  <div class="flex flex-column h-full">
    <div class="flex-1 relative">
      <div class="chartView-title">
        <!-- <chartOverLayPanel :listSub="listLineBlock" :subActive="lineActiveBlock" @changeSubActive="changeLineActive">
          <span>{{ typelineActive }}</span></chartOverLayPanel
        > -->
        <Dropdown
          v-model="lineActiveBlock"
          :options="listLineBlock"
          optionLabel="name"
          placeholder="Select a ine"
          class="w-full md:w-11rem border-noround active:outline-none"
          size="small"
          @update:modelValue="changeLineActive($event)"
        />
      </div>
      <!-- <div class="chartView-lastUpdate">
        <div class="icon-chart">
          <i class="pi pi-sync"></i>
          <span> {{ modificationTimeBlock }}</span>
        </div>
      </div> -->
      <lineChartSpecialBase
        ChartStabe
        :chartData="chartBlock"
        labelChart="value"
        class="chart border-none"
      ></lineChartSpecialBase>
    </div>
    <div class="flex-1">
      <lineChartSpecialBase
        :chartData="chartBlock"
        labelChart="powertranfer"
        class="chart border-none"
      ></lineChartSpecialBase>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chartView-title {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
.chartView-options {
  position: absolute;
  top: 0;
}

.chartView-lastUpdate {
  position: absolute;
  top: 1%;
  right: 87%;
  width: 100%;
}
.icon-chart {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 1rem;
  color: var(--primary-color);
  display: block;
  text-align: center;
  i {
    display: block;
    margin: 0 auto; /* Để căn giữa theo chiều ngang */
  }
  span {
    display: block;
    margin: 4px auto;
    font-size: 0.6rem;
    color: #808080;
    width: 100%;
  }
}
</style>

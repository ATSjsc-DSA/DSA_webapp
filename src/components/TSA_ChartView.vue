<script setup>
import TSA_api from '@/api/tsa_api';

import { computed, ref } from 'vue';
import { intervalTime } from '@/Constants/';

import chartOverLayPanel from './chartOverLayPanel.vue';

import Dropdown from 'primevue/dropdown';

import Button from 'primevue/button';
import lineChartSpecialBase from './lineChartSpecialBase.vue';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

const props = defineProps({
  typelineActive: {
    type: String,
    default: '',
  },
});
const baseValueChart = {
  name: '',
  data: {
    time: [],
    value: [],
    PowerTranfer: [],
    peak: [],
    mean: [],
    t_stablility: [],
    stability: [],
  },
  modificationTime: null,
};
const typelineActive = ref('');
const lineActiveBlock = ref('');
const chartBlock = ref(baseValueChart);
const listLineBlock = ref([]);
// const modificationTimeBlock = computed(() => {
//   return convertDateTimeToString(chartBlock.value.modificationTime);
// });

const getchartDataBlock = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    if (!res.data.success) {
    } else {
      chartBlock.value = res.data.payload;
    }
  } catch (error) {}
};
const getListLineWithType = async (type_line) => {
  try {
    const res = await TSA_api.getListLineWithType(type_line);
    if (!res.data.success) {
    } else {
      if (res.data.payload.data && res.data.payload.data.length > 0) {
        listLineBlock.value = res.data.payload.data;
        lineActiveBlock.value = res.data.payload.data[0];
      }
    }
  } catch (error) {}
};

watch(
  () => props.typelineActive,
  (newValue) => {
    typelineActive.value = newValue;
    nextTick(async () => {
      await getListLineWithType(typelineActive.value);
      await getchartDataBlock(typelineActive.value + '_' + lineActiveBlock.value.name);
    });
  },
);

const interval = ref(null);
onMounted(async () => {
  interval.value = setInterval(async () => {
    // await getListLineWithType(typelineActive.value);
    getchartDataBlock(typelineActive.value + '_' + lineActiveBlock.value.name);
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const changeLineActive = (param) => {
  getchartDataBlock(typelineActive.value + '_' + param.name);
  lineActiveBlock.value = param;
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
        labelChart="PowerTranfer"
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

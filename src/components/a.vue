<script setup>
import TSA_api from '@/api/tsa_api';

import { computed, ref } from 'vue';
import { intervalTime } from '@/Constants/';

import chartOverLayPanel from './chartOverLayPanel.vue';

import Button from 'primevue/button';
import lineChartSpecialBase from './lineChartSpecialBase.vue';

import chartComposable from '@/combosables/chartData';
const { convertDateTimeToString } = chartComposable();

const active = ref(0);
const props = defineProps({
  listTypeLine: {
    type: Array,
    default: [],
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

const chartBlock1 = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);
const listLine = ref({});

const lineActiveBlock1 = ref('');
const lineActiveBlock2 = ref('');
const listLineBlock1 = ref([]);
const listLineBlock2 = ref([]);
const modificationTimeBlock1 = computed(() => {
  return convertDateTimeToString(chartBlock1.value.modificationTime);
});

const modificationTimeBlock2 = computed(() => {
  return convertDateTimeToString(chartBlock2.value.modificationTime);
});

const getchartDataBlock1 = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    if (!res.data.success) {
    } else {
      chartBlock1.value = res.data.payload;
    }
  } catch (error) {}
};
const getchartDataBlock2 = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    if (!res.data.success) {
    } else {
      chartBlock2.value = res.data.payload;
    }
  } catch (error) {}
};

const getListLine = async () => {
  try {
    const res = await TSA_api.getListLine();
    if (!res.data.success) {
    } else {
      listLine.value = res.data.payload;
      listLineBlock1.value = listLine.value[typeLine1.value.name];
      listLineBlock2.value = listLine.value[typeLine2.value.name];

      lineActiveBlock1.value = listLine.value[typeLine1.value.name][0].name;
      lineActiveBlock2.value = listLine.value[typeLine2.value.name][0].name;
    }
  } catch (error) {}
};

const listTypeLine = ref(props.listTypeLine);
const typeLine1 = ref('');
const typeLine2 = ref('');
watch(
  () => props.listTypeLine,
  (newValue) => {
    listTypeLine.value = newValue;
    typeLine1.value = newValue[0];
    typeLine2.value = newValue[1];
    nextTick(async () => {
      await getListLine();
      console.log(typeLine1.value, ' typeLine1.value');
      await getchartDataBlock1(typeLine1.value.name + '_' + lineActiveBlock1.value);
      await getchartDataBlock2(typeLine2.value.name + '_' + lineActiveBlock2.value);
    });
  },
);

const interval1 = ref(null);

onMounted(async () => {
  interval1.value = setInterval(async () => {
    await getListLine();

    getchartDataBlock1(typeLine1.value.name + '_' + lineActiveBlock1.value);
    getchartDataBlock2(typeLine2.value.name + '_' + lineActiveBlock2.value);
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval1.value);
});
const getActive = (value) => {
  active.value = value;
};
const changeLineActive1 = (param) => {
  getchartDataBlock1(typeLine1.value.name + param);
  lineActiveBlock1.value = param;
};
const changeLineActive2 = (param) => {
  getchartDataBlock2(typeLine2.value.name + '_' + param);
  lineActiveBlock2.value = param;
};
</script>

<template>
  <div class="chartView-title">
    <div v-show="active === 0">
      <chartOverLayPanel :listSub="listLineBlock1" :subActive="lineActiveBlock1" @changeSubActive="changeLineActive1">
        <span>{{ chartBlock1.name }}</span></chartOverLayPanel
      >
    </div>
    <div v-show="active === 1">
      <chartOverLayPanel :listSub="listLineBlock2" :subActive="lineActiveBlock2" @changeSubActive="changeLineActive2">
        <span>{{ chartBlock2.name }}</span></chartOverLayPanel
      >
    </div>
  </div>
  <div class="chartView-lastUpdate">
    <div class="icon-chart">
      <i class="pi pi-sync"></i>
      <span v-show="active === 0"> {{ modificationTimeBlock1 }}</span>
      <span v-show="active === 1"> {{ modificationTimeBlock2 }}</span>
    </div>
  </div>
  <div class="h-full flex flex-column p-2">
    <div class="flex mb-2 gap-2 justify-content-end mr-2">
      <Button @click="getActive(0)" rounded label="1" class="w-2rem h-2rem p-0" :outlined="active !== 0" />
      <Button @click="getActive(1)" rounded label="2" class="w-2rem h-2rem p-0" :outlined="active !== 1" />
    </div>

    <div class="flex-1">
      <div v-show="active === 0" class="h-full">
        <div class="flex flex-column h-full">
          <div class="flex-1">
            <lineChartSpecialBase
              ChartStabe
              :chartData="chartBlock1"
              labelChart="value"
              class="chart"
            ></lineChartSpecialBase>
          </div>
          <div class="flex-1">
            <lineChartSpecialBase
              :chartData="chartBlock1"
              labelChart="PowerTranfer"
              class="chart"
            ></lineChartSpecialBase>
          </div>
        </div>
      </div>

      <div v-show="active === 1" class="h-full">
        <div class="flex flex-column h-full">
          <div class="flex-1">
            <lineChartSpecialBase
              ChartStabe
              :chartData="chartBlock2"
              labelChart="value"
              class="chart"
            ></lineChartSpecialBase>
          </div>
          <div class="flex-1">
            <lineChartSpecialBase
              :chartData="chartBlock2"
              labelChart="PowerTranfer"
              class="chart"
            ></lineChartSpecialBase>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chartView-title {
  position: absolute;
  top: 0;
  left: 37%;
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

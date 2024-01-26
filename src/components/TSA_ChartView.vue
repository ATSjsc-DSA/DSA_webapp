<script setup>
import TSA_api from '@/api/tsa_api';

import { computed, ref } from 'vue';
import Tag from 'primevue/tag';

import Avatar from 'primevue/avatar';
import chartOverLayPanel from './chartOverLayPanel.vue';
import customFieldset from './customFieldset.vue';

import Button from 'primevue/button';
import lineChartSpecialBase from './lineChartSpecialBase.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
const active = ref(0);

const baseValueChart = {
  name: '',
  time: [],
  value: [],
  PowerTranfer: [],
  peak: [],
  mean: [],
  t_stablility: [],
  stability: [],
};

const chartBlock1 = ref(baseValueChart);
const chartBlock2 = ref(baseValueChart);
const listLine = ref({
  NQHT: [],
  DNPK: [],
});

const lineActiveBlock1 = computed(() => {
  if (chartBlock1.value.name !== '') {
    const result = chartBlock1.value.name.match(/([\d.]+MW)/);
    return result[1];
  } else return '';
});
const lineActiveBlock2 = computed(() => {
  if (chartBlock2.value.name !== '') {
    const result = chartBlock2.value.name.match(/([\d.]+MW)/);
    return result[1];
  } else return '';
});

const getchartData = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      return res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getListLine = async () => {
  try {
    const res = await TSA_api.getListLine();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      listLine.value = res.data.payload;
      console.log(listLine.value, 'listLine.value');
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getListLine();
  chartBlock1.value = await getchartData('DaNang-Pleiku_' + listLine.value.NQHT[0].name);
  chartBlock2.value = await getchartData('NhoQuan-HaTinh_' + listLine.value.DNPK[0].name);
});
const getActive = (value) => {
  active.value = value;
};
const changeLineActive1 = async (param) => {
  chartBlock1.value = await getchartData('DaNang-Pleiku_' + param);
};
const changeLineActive2 = async (param) => {
  chartBlock2.value = await getchartData('NhoQuan-HaTinh_' + param);
};
</script>

<template>
  <Toast></Toast>
  <customFieldset legendText="Chart View">
    <div class="chartView-title">
      <div v-show="active === 0">
        <chartOverLayPanel :listSub="listLine.DNPK" :subActive="lineActiveBlock1" @changeSubActive="changeLineActive1">
          <span>{{ chartBlock1.name }}</span></chartOverLayPanel
        >
      </div>
      <div v-show="active === 1">
        <chartOverLayPanel :listSub="listLine.NQHT" :subActive="lineActiveBlock2" @changeSubActive="changeLineActive2">
          <span>{{ chartBlock2.name }}</span></chartOverLayPanel
        >
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
  </customFieldset>
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
</style>

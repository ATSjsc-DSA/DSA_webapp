<script setup>
import TSA_api from '@/api/tsa_api';

import { computed, ref } from 'vue';
import Tag from 'primevue/tag';
import { intervalTime } from '@/Constants/';

import Avatar from 'primevue/avatar';
import chartOverLayPanel from './chartOverLayPanel.vue';
import customFieldset from './customFieldset.vue';

import Button from 'primevue/button';
import lineChartSpecialBase from './lineChartSpecialBase.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import chartComposable from '@/combosables/chartData';
import { useLayout } from '@/layout/composables/layout';
const { convertDateTimeToString } = chartComposable();
const { isDarkTheme } = useLayout();

const toast = useToast();
const active = ref(0);

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
const listLine = ref({
  NQHT: [],
  DNPK: [],
});

// const lineActiveBlock1 = computed(() => {
//   console.log(chartBlock1.value, 'chartBlock1');
//   if (chartBlock1.value.name !== '') {
//     const result = chartBlock1.value.name.match(/([\d.]+MW)/);
//     return result[1];
//   } else return '';
// });
// const lineActiveBlock2 = computed(() => {
//   if (chartBlock2.value.name !== '') {
//     const result = chartBlock2.value.name.match(/([\d.]+MW)/);
//     return result[1];
//   } else return '';
// });

const lineActiveBlock1 = ref('');
const lineActiveBlock2 = ref('');

const modificationTimeBlock1 = computed(() => {
  return convertDateTimeToString(chartBlock1.value.modificationTime);
});

const modificationTimeBlock2 = computed(() => {
  return convertDateTimeToString(chartBlock2.value.modificationTime);
});

const getchartDataBlock1 = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    console.log(res, 'res.data.payload');
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      console.log(res.data.payload, 'res.data.payload');
      chartBlock1.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const getchartDataBlock2 = async (code_name) => {
  try {
    const res = await TSA_api.getLineData(code_name);
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartBlock2.value = res.data.payload;
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
      lineActiveBlock1.value = listLine.value.DNPK[0].name;
      lineActiveBlock2.value = listLine.value.NQHT[0].name;
      console.log(listLine.value, 'listLine.value');
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const interval1 = ref(null);
const interval2 = ref(null);

onMounted(async () => {
  await getListLine();

  await getchartDataBlock1('DaNang-Pleiku_' + lineActiveBlock1.value);
  await getchartDataBlock2('NhoQuan-HaTinh_' + lineActiveBlock2.value);
  interval1.value = setInterval(() => {
    getchartDataBlock1('DaNang-Pleiku_' + lineActiveBlock1.value);
  }, intervalTime);
  interval2.value = setInterval(() => {
    getchartDataBlock2('NhoQuan-HaTinh_' + lineActiveBlock2.value);
  }, intervalTime);
});

onUnmounted(() => {
  clearInterval(interval1.value);
  clearInterval(interval2.value);
});
const getActive = (value) => {
  active.value = value;
};
const changeLineActive1 = (param) => {
  getchartDataBlock1('DaNang-Pleiku_' + param);
  lineActiveBlock1.value = param;
};
const changeLineActive2 = (param) => {
  getchartDataBlock2('NhoQuan-HaTinh_' + param);
  lineActiveBlock2.value = param;
};
watch(isDarkTheme, () => {
  console.log(lineActiveBlock1.value, 'lineActiveBlock1');
  changeLineActive1(lineActiveBlock1.value);
  changeLineActive2(lineActiveBlock2.value);
});
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

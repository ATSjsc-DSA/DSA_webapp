<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';

const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
});

const chartData = computed(() => {
  return setChartData(props.chartData);
});

let maxAxisValue = 0.3;
let titleStatus = 'Secure'; // Secure , Warning , Critical
let colorStatus = 'rgba(0,128,0,1)';
let colorTitle = 'blue'; // blue, darkOrange, red

const getChartConfig = (pdata, pborderColor, pbackgroundColor, pfill, plabel) => ({
  data: pdata,
  showLine: true,
  pointRadius: 0,
  borderWidth: 1,
  borderColor: pborderColor,
  backgroundColor: pbackgroundColor,
  fill: pfill,
  label: plabel,
});

const getCurrentStateColor = (rate1, rate2) => {
  if (rate2 <= 0) {
    colorTitle = 'red';
    colorStatus = 'rgba(255,0,0,1)';
    titleStatus = 'Critical';
  } else if (rate1 <= 0) {
    colorTitle = 'darkOrange';
    colorStatus = 'rgba(255,255,0,1)';
    titleStatus = 'Warning';
  } else {
    colorTitle = 'blue';
    colorStatus = 'rgba(0,128,0,1)';
    titleStatus = 'Secure';
  }
  return {
    title: titleStatus,
    color: colorStatus,
  };
};

const setChartData = (radarData) => {
  const chartValue = [];

  const axislabel =
    radarData.Key == null
      ? [
          'Line Loading',
          'Tranformer Loading',
          'Generator Loading',
          'Excitation Limiter',
          'Low Voltage',
          'VSA Module',
          'TSA Module',
          'SSR Module',
        ]
      : radarData.Key;
  const numAxis = axislabel.length;

  const rate1 = radarData.Rate1;
  const rate2 = radarData.Rate2;
  const rate3 = radarData.Rate3;
  const current = radarData.CurentState;

  const reserve1Data = [];
  const reserve2Data = [];
  const reserve3Data = [];

  for (let index = 0; index < numAxis; index++) {
    const re1 = (-current[index] + rate1[index]) / rate3[index];
    const re2 = (-current[index] + rate2[index]) / rate3[index];
    const re3 = (-current[index] + rate3[index]) / rate3[index];
    reserve1Data.push(re1);
    reserve2Data.push(re2);
    reserve3Data.push(re3);
  }

  let maxDataValue = Math.max(...reserve1Data, ...reserve2Data, ...reserve3Data);
  if (maxDataValue > maxAxisValue) maxAxisValue = maxDataValue;

  let minRate1 = Math.min(...reserve1Data);
  let minRate2 = Math.min(...reserve2Data);
  getCurrentStateColor(minRate1, minRate2);

  const currentData = new Array(numAxis).fill(0);
  const boundData = new Array(numAxis).fill(maxAxisValue);

  const currentValue = getChartConfig(currentData, 'rgba(0,0,0,1)', colorStatus, 'start', 'current');
  const reserve1Value = getChartConfig(reserve1Data, 'rgba(0,128,0,1)', 'rgba(0,128,0,0.5)', '-1', 'rate1');
  const reserve2Value = getChartConfig(reserve2Data, 'rgba(255,255,0,1)', 'rgba(255,165,0,0.5)', '-1', 'rate2');
  const reserve3Value = getChartConfig(reserve3Data, 'rgba(128,0,128,1)', 'rgba(255,0,0,0.5)', '-1', 'rate3');
  const boundValue = getChartConfig(boundData, 'rgba(255,0,0,1)', 'rgba(255,0,0,0.5)', '-1', 'bound');

  chartValue.push(currentValue, reserve1Value, reserve2Value, reserve3Value, boundValue);

  return {
    labels: axislabel,
    datasets: chartValue,
  };
};

const chartOptions = computed(() => {
  return {
    scales: {
      r: {
        beginAtZero: true,
        stacked: true,
        min: -0.05,
        max: maxAxisValue,
        grid: {
          display: true,
          lineWidth: 1,
          circular: false,
        },
        angleLines: {
          display: true,
          lineWidth: 1,
        },
        ticks: {
          display: true,
          stepSize: 0.05,
          callback: function (value, index, values) {
            return value * 100 + '%';
          },
          color: 'rgba(169,169,169,1)',
        },
      },
    },
    plugins: {
      filler: {
        propagate: false,
      },
      'samples-filler-analyser': {
        target: 'chart-analyser',
      },
      title: {
        display: true,
        text: 'System status : ' + titleStatus,
        color: colorTitle,
        position: 'top', // Đặt vị trí tiêu đề là top
        align: 'center', // Căn giữa
        font: {
          size: 20, // Kích thước font
          weight: 'bold', // Độ đậm của font
        },
        padding: 0,
      },
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          color: 'red',
          font: {
            size: 8,
          },
          padding: 12,
        },
        position: 'top',
      },
    },
    interaction: {
      intersect: true,
    },
  };
});
</script>

<template>
  <div class="card">
    <Chart type="radar" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
}
.chart {
  height: 100%;
}
</style>

<!-- template api data return

const data = {
  Key: [
    'Line Loading',
    'Tranformer Loading',
    'Generator Loading',
    'Excitation Limiter',
    'Low/High Voltage',
    'VSA Module',
    'TSA Module',
    'SSR Module',
  ],
  Rate1: [90, 90, 90, 90, 90, 90, 90, 90],
  Rate2: [95, 95, 95, 95, 95, 95, 95, 95],
  Rate3: [100, 100, 100, 100, 100, 100, 100, 100],
  CurentState: [81, 81, 87, 81, 81, 81, 81, 88],
};
-->
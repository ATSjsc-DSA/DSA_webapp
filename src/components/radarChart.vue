<script setup>
import chartComposable from '@/combosables/chartData';
import Chart from 'primevue/chart';
const { convertDateTimeToString } = chartComposable();

const props = defineProps({
  chartData: {
    type: Object,
    require: true,
  },
});

onMounted(() => {
  //chartData.value = setChartData(props.chartData.data);
});

const chartData = computed(() => {
  return setChartData(props.chartData.data);
});
const modificationTime = computed(() => {
  if (props.chartData.modificationTime) {
    return convertDateTimeToString(props.chartData.modificationTime);
  }
});
const label = computed(() => {
  return props.chartData.Key;
});
let maxAxisValue = 0.3;
let titleStatus = 'Secure'; // Secure , Warning , Critical
let colorStatus = 'rgba(0,128,0,1)';
let colorTitle = 'blue'; // blue, darkOrange, red
let defaultChartData = {
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
  CurentState: [81, 81, 81, 81, 81, 81, 81, 81],
};

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

const getCurrentStateColorAndTitle = (rate1, rate2) => {
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
  updateTitleChart(titleStatus, colorTitle);
};

const updateTitleChart = (titleStatus, colorTitle) => {
  chartOptions.value.plugins.title.text = 'System status : ' + titleStatus;
  chartOptions.value.plugins.title.color = colorTitle;
};

const setChartData = (radarData) => {
  const chartValue = [];
  const numAxis = label.value.length;

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
  getCurrentStateColorAndTitle(minRate1, minRate2);

  const currentData = new Array(numAxis).fill(0);
  const boundData = new Array(numAxis).fill(maxAxisValue);

  const currentValue = getChartConfig(currentData, 'rgba(0,0,0,1)', colorStatus, 'start', 'current');
  const reserve1Value = getChartConfig(reserve1Data, 'rgba(0,128,0,1)', 'rgba(0,128,0,0.5)', '-1', 'rate1');
  const reserve2Value = getChartConfig(reserve2Data, 'rgba(255,255,0,1)', 'rgba(255,165,0,0.5)', '-1', 'rate2');
  const reserve3Value = getChartConfig(reserve3Data, 'rgba(128,0,128,1)', 'rgba(255,0,0,0.5)', '-1', 'rate3');
  const boundValue = getChartConfig(boundData, 'rgba(255,0,0,1)', 'rgba(255,0,0,0.5)', '-1', 'bound');

  chartValue.push(currentValue, reserve1Value, reserve2Value, reserve3Value, boundValue);
  return {
    labels: label.value,
    datasets: chartValue,
  };
};

const chartOptions = computed(() => {
  let abc = props.chartData.data;
  let chartOpt = {
    animation: false,
    scales: {
      r: {
        startAngle: 0,
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
          color: [
            'rgba(169,169,169,0.3)',
            'rgba(169,169,169,0.3)',
            'rgba(169,169,169,0.3)',
            'rgba(169,169,169,0.3)',
            'rgba(169,169,169,0.3)',
            'rgba(255,165,0,1)',
            'rgba(255,165,0,1)',
            'rgba(255,165,0,1)',
          ],
        },
        ticks: {
          display: true,
          stepSize: 0.05,
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + '%';
          },
        },

        pointLabels: {
          fontColor: 'blue', // Change the color of the labels here
          backdropColor: [
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0.2)',
            'rgba(255,169,169,0.2)',
            'rgba(255,169,169,0.2)',
          ],
          color: ['gray', 'gray', 'gray', 'gray', 'gray', 'blue', 'blue', 'blue'],
          font: {
            style: ['normal', 'normal', 'normal', 'normal', 'normal', 'oblique', 'oblique', 'oblique'],
            weight: ['normal', 'normal', 'normal', 'normal', 'normal', 'bold', 'bold ', 'bold '],
          },
        },

        pointLabels: {
          fontColor: 'blue', // Change the color of the labels here
          backdropColor: [
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0)',
            'rgba(255,169,169,0.2)',
            'rgba(255,169,169,0.2)',
            'rgba(255,169,169,0.2)',
          ],
          color: ['gray', 'gray', 'gray', 'gray', 'gray', 'blue', 'blue', 'blue'],
          font: {
            // size: 14,
            style: ['normal', 'normal', 'normal', 'normal', 'normal', 'oblique', 'oblique', 'oblique'],
            weight: ['normal', 'normal', 'normal', 'normal', 'normal', 'bold', 'bold ', 'bold '],
          },
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
          size: 18, // Kích thước font
          weight: 'bold', // Độ đậm của font
        },
        padding: 12,
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
      //intersect: false,
    },
  };
  console.log(chartOpt);
  return chartOpt;
});
</script>

<template>
  <div class="card flex justify-content-center" style="height: 100%">
    <div class="icon-chart">
      <i class="pi pi-sync pi-spin"></i>
      <span> {{ modificationTime }}</span>
    </div>
    <Chart type="radar" :data="chartData" :options="chartOptions" class="chart md:w-27rem" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  position: relative;
  padding: 5px 5px 5px 5px;
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
    }
  }
}
.p-chart {
  max-width: calc(100vh - 16rem) !important;
  width: 95%;
  height: 100%;
}
.chart {
  height: 100%;
}
</style>

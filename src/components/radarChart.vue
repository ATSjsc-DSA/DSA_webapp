<script setup>
import chartComposable from '@/combosables/chartData';
import Chart from 'primevue/chart';
import { useLayout } from '@/layout/composables/layout';
import modificationTimeFile from './modificationTimeFile.vue';
import { computed, watch } from 'vue';

const { convertDateTimeToString } = chartComposable();
const { isDarkTheme } = useLayout();

const props = defineProps({
  chartData: {
    type: Object,
    require: true,
  },
  parentWidth: {
    type: Number,
    default: 200,
  },
});

const emits = defineEmits(['refeshData']);
const DataProps = computed(() => props.chartData);
const chartData = ref();
const modificationTime = ref();
watch(DataProps, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    chartData.value = setChartData(newValue);
    modificationTime.value = convertDateTimeToString(newValue.modificationTime);
  }
});

// const chartData = computed(() => {
//   return setChartData(props.chartData.data);
// });

// const modificationTime = computed(() => {
//   if (props.chartData.modificationTime) {
//     return convertDateTimeToString(props.chartData.modificationTime);
//   }
// });
// const label = computed(() => {
//   console.log('123');
//   return props.chartData.Key;
// });
let maxAxisValue = 0.2;
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

const getCurrentStateColorAndTitle = (rate1, rate2) => {
  if (rate2 < 0) {
    colorTitle = 'red';
    colorStatus = 'rgba(255,0,0,1)';
    titleStatus = 'Emergency';
  } else if (rate1 < 0) {
    colorTitle = 'darkOrange';
    colorStatus = 'rgba(255,255,0,1)';
    titleStatus = 'Abnormal';
  } else {
    colorTitle = 'rgb(34,139,34)';
    colorStatus = 'rgba(0,128,0,1)';
    titleStatus = 'Normal';
  }
  TitleChart(titleStatus);
  colorTitleChart(colorTitle);
  chartOptions.value = setChartOptions();
  // updateTitleChart(titleStatus, colorTitle);
};

const TitleChart = () => 'System status : ' + titleStatus;
const colorTitleChart = () => colorTitle;
// const updateTitleChart = (titleStatus, colorTitle) => {
//   chartOptions.value.plugins.title.text = 'System status : ' + titleStatus;
//   chartOptions.value.plugins.title.color = colorTitle;
// };

const setChartData = (radarData) => {
  const chartValue = [];
  const numAxis = radarData.Key.length;

  const rate1 = radarData.data.Rate1;
  const rate2 = radarData.data.Rate2;
  const rate3 = radarData.data.Rate3;
  const current = radarData.data.CurentState;

  let reserve1Data = [];
  let reserve2Data = [];
  let reserve3Data = [];

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
  maxAxisValue = maxDataValue + 0.05;
  maxAxisValue = maxAxisValue > 0.2 ? 0.2 : maxAxisValue;

  let minRate1 = Math.min(...reserve1Data);
  let minRate2 = Math.min(...reserve2Data);
  getCurrentStateColorAndTitle(minRate1, minRate2);

  reserve1Data = removeValueBellowZero(reserve1Data);
  reserve2Data = removeValueBellowZero(reserve2Data);
  reserve3Data = removeValueBellowZero(reserve3Data);
  reserve1Data = removeValueExceed20(reserve1Data);
  reserve2Data = removeValueExceed20(reserve2Data);
  reserve3Data = removeValueExceed20(reserve3Data);

  const currentData = new Array(numAxis).fill(0);
  const boundData = new Array(numAxis).fill(maxAxisValue);

  const currentValue = getChartConfig(currentData, 'rgba(0,0,0,1)', colorStatus, 'start', 'current');
  const reserve1Value = getChartConfig(reserve1Data, 'rgba(0,128,0,1)', 'rgba(0,128,0,0.5)', '-1', 'rate1');
  const reserve2Value = getChartConfig(reserve2Data, 'rgba(255,255,0,1)', 'rgba(255,165,0,0.5)', '-1', 'rate2');
  const reserve3Value = getChartConfig(reserve3Data, 'navy', 'rgba(255,0,0,0.6)', '-1', 'rate3');
  const boundValue = getChartConfig(boundData, 'rgba(255,0,0,1)', 'rgba(255,0,0,0.6)', '-1', 'bound');

  chartValue.push(currentValue, reserve1Value, reserve2Value, reserve3Value, boundValue);
  return {
    labels: radarData.Key,
    datasets: chartValue,
  };
};

const removeValueBellowZero = (reserveData) => {
  var reserveDataZero = reserveData.map((item) => (item < 0 ? 0 : item));
  return reserveDataZero;
};

const removeValueExceed20 = (reserveData) => {
  var reserveDataExceed20 = reserveData.map((item) => (item > 0.2 ? 0.2 : item));
  return reserveDataExceed20;
};
const chartOptions = ref();

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColor2nd = documentStyle.getPropertyValue('--text-color-secondary');
  const primaryColor = documentStyle.getPropertyValue('--primary-color');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  return {
    animation: false,
    maintainAspectRatio: true,

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
          color: surfaceBorder,
        },
        angleLines: {
          display: true,
          lineWidth: 1,
          color: [
            surfaceBorder,
            surfaceBorder,
            surfaceBorder,
            surfaceBorder,
            surfaceBorder,
            textColor2nd,
            textColor2nd,
            textColor2nd,
          ],
        },
        pointLabels: {
          padding: 2,
          color: textColor,
          borderRadius: 2,
          backdropColor: [, , , , , primaryColor, primaryColor, primaryColor],
          font: {
            size: 10,
            style: 'normal',
            weight: ['normal', 'normal', 'normal', 'normal', 'normal', 'bold', 'bold ', 'bold '],
          },
        },

        ticks: {
          display: true,
          stepSize: 0.05,
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + '%';
          },
          color: textColor,
          backdropColor: 'transparent',
          z: 10,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: TitleChart,
        color: colorTitleChart,
        position: 'top', // Đặt vị trí tiêu đề là top
        align: 'center', // Căn giữa
        font: {
          size: 18, // Kích thước font
          weight: 'bold', // Độ đậm của font
        },
        padding: {
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          color: 'red',
          font: {
            size: 8,
          },
          padding: 0,
        },
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              let viewValue = context.parsed.r * 100;
              label += viewValue;
            }
            return label;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };
};
onMounted(async () => {
  chartData.value = setChartData(props.chartData);
  modificationTime.value = convertDateTimeToString(props.chartData.modificationTime);
  chartOptions.value = setChartOptions();
});
watch(isDarkTheme, () => {
  chartOptions.value = setChartOptions();
});
const refeshData = () => {
  chartOptions.value = setChartOptions();
  emits('refeshData');
};
</script>

<template>
  <div class="card flex justify-content-center h-full">
    <modificationTimeFile :modificationTime="modificationTime" @refeshData="refeshData"></modificationTimeFile>
    <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-27rem" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  position: relative;
  // padding: 5px 5px 5px 5px;
  padding: 10px;
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
/*
.p-chart {
  max-width: calc(100vh - 16rem) !important;
  width: 95%;
  height: 100%;
}
*/
</style>

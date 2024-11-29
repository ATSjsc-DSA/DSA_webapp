<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'primevue/chart';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  dataKey: {
    type: Array,
    default: () => [],
  },
});
const projectRadarChartWrap = ref();
const getChartWidth = async () => {
  if (projectRadarChartWrap.value) {
    let w = 0;
    await nextTick(() => {
      w = projectRadarChartWrap.value.getBoundingClientRect().width;
    });
    return w;
  }
  return 0;
};
onMounted(async () => {
  chartData.value = await setChartData();
  chartOptions.value = setChartOptions();
});

watch(
  () => props.data,
  async (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      chartData.value = await setChartData();
      chartOptions.value = setChartOptions();
    }
  },
);

watch(
  () => props.dataKey,
  async () => {
    chartData.value = await setChartData();
    chartOptions.value = setChartOptions();
  },
);
watch(
  isDarkTheme,
  () => {
    chartOptions.value = setChartOptions();
  },
  { immediate: false },
);
const chartData = ref({
  Key: ['Slot1', 'Slot2', 'Slot3', 'Slot4', 'Slot5', 'Slot6', 'Slot7', 'Slot8'],
  data: {
    Rate1: [], //[90, 90, 90, 90, 90, 90, 90, 0],
    Rate2: [], //[95, 95, 95, 95, 95, 95, 95, 0],
    // Rate3: [], //[100, 100, 100, 100, 100, 100, 100, 0],
    CurentState: [], //[99, 81, 81, 81, 81, 81, 81, 0],
  },
  modificationTime: '',
});
const chartOptions = ref();

// Function to transform API response and ensure chartData always has 7 keys
const transformApiResponse = (data) => {
  if (!data.Key) {
    return {
      Key: [],
      data: [],
    };
  }
  const result = {
    Key: data.Key.slice(0, 7), // If there are more than 7 keys, we take the first 7
    data: {
      Rate1: data.data.Rate1.slice(0, 7),
      Rate2: data.data.Rate2.slice(0, 7),
      // Rate3: data.data.Rate3.slice(0, 7),
      CurentState: data.data.CurentState.slice(0, 7),
    },
  };
  // console.log(result, 'result');
  // Add missing slots if there are fewer than 7 keys
  const additionalSlots = 8 - result.Key.length;
  for (let i = 0; i < additionalSlots; i++) {
    result.Key.push(`slot${i + 1}`);
    result.data.Rate1.push(90);
    result.data.Rate2.push(95);
    // result.data.Rate3.push(100);
    result.data.CurentState.push(0);
  }

  return result;
};

const setChartData = async () => {
  const radarData = transformApiResponse(props.data);
  const chartValue = [];
  const numAxis = radarData.Key.length;

  const rate1 = radarData.data.Rate1;
  const rate2 = radarData.data.Rate2;
  // const rate3 = radarData.data.Rate3;
  const current = radarData.data.CurentState;

  let reserve1Data = [];
  let reserve2Data = [];
  // let reserve3Data = [];

  for (let index = 0; index < numAxis; index++) {
    const re1 = (-current[index] + rate1[index]) / rate2[index];
    const re2 = (-current[index] + rate2[index]) / rate2[index];
    // const re3 = (-current[index] + rate3[index]) / rate3[index];
    reserve1Data.push(re1);
    reserve2Data.push(re2);
    // reserve3Data.push(re3);
  }

  const maxDataValue = Math.max(...reserve1Data, ...reserve2Data);
  if (maxDataValue > maxAxisValue) maxAxisValue = maxDataValue;
  maxAxisValue = maxDataValue + 0.05;
  maxAxisValue = maxAxisValue > 0.2 ? 0.2 : maxAxisValue;

  if (reserve1Data.length > 0) {
    const minRate1 = Math.min(...reserve1Data);
    const minRate2 = Math.min(...reserve2Data);
    getCurrentStateColorAndTitle(minRate1, minRate2);
  } else {
    getCurrentStateColorAndTitle(undefined, undefined);
  }

  reserve1Data = removeValueBellowZero(reserve1Data);
  reserve2Data = removeValueBellowZero(reserve2Data);
  // reserve3Data = removeValueBellowZero(reserve3Data);
  reserve1Data = removeValueExceed20(reserve1Data);
  reserve2Data = removeValueExceed20(reserve2Data);
  // reserve3Data = removeValueExceed20(reserve3Data);

  const currentData = new Array(numAxis).fill(0);
  const boundData = new Array(numAxis).fill(maxAxisValue);

  const currentValue = getChartConfig(currentData, 'rgba(0,0,0,1)', colorStatus, 'start', 'current');
  const reserve1Value = getChartConfig(reserve1Data, 'rgba(0,128,0,1)', 'rgba(40,167,69,0.5)', '-1', 'rate1');
  const reserve2Value = getChartConfig(reserve2Data, 'rgba(255,255,0,1)', 'rgba(255,165,0,0.5)', '-1', 'rate2');
  // const reserve3Value = getChartConfig(reserve3Data, 'rgba(244,67,54,1)', 'rgba(244,67,54,0.6)', '-1', 'rate3');
  const boundValue = getChartConfig(boundData, 'rgba(255,0,0,1)', 'rgba(255,0,0,0.6)', '-1', 'bound');

  chartValue.push(currentValue, reserve1Value, reserve2Value, boundValue);
  return {
    labels: await breakLabels(radarData.Key),
    datasets: chartValue,
  };
};
const breakLabels = async (labelArr) => {
  const labels = [];
  const chartWidth = await getChartWidth();
  const isSmallChart = chartWidth < 500;
  labelArr.forEach((item) => {
    const splitAtHyphen = item.split('-');
    let label = [];
    if (splitAtHyphen.length > 1) {
      if (isSmallChart) {
        splitAtHyphen.forEach((itemBreak) => {
          if (itemBreak.split('_').length > 3) {
            const splitAtUnderscore = itemBreak.split('_');
            label.push(splitAtUnderscore.slice(0, 2).join('_') + '_');
            label.push(splitAtUnderscore.slice(2).join('_'));
          } else {
            label.push(itemBreak);
          }
        });
      } else {
        label = label.concat(splitAtHyphen);
      }
    } else {
      label.push(item);
    }
    labels.push(label);
  });
  return labels;
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColor2nd = documentStyle.getPropertyValue('--text-color-secondary');
  const primaryColor = documentStyle.getPropertyValue('--primary-color');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  return {
    animation: false,
    maintainAspectRatio: false,
    responsive: true,
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
          color: textColor2nd,
        },
        pointLabels: {
          padding: 2,
          color: textColor,
          borderRadius: 2,
          font: {
            size: 10,
            style: 'normal',
            weight: 'bold',
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
          font: {
            size: 10,
            style: 'normal',
          },
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
          bottom: 10,
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
              const viewValue = context.parsed.r * 100;
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
const TitleChart = () => 'System status : ' + titleStatus;
const colorTitleChart = () => colorTitle;
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
  if (!rate1) {
    // nodata
    colorTitle = 'gray';
    colorStatus = 'gray';
    titleStatus = 'No data';
  } else {
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
  }
  TitleChart(titleStatus);
  colorTitleChart(colorTitle);
  chartOptions.value = setChartOptions();
};

const removeValueBellowZero = (reserveData) => {
  const reserveDataZero = reserveData.map((item) => (item < 0 ? 0 : item));
  return reserveDataZero;
};

const removeValueExceed20 = (reserveData) => {
  const reserveDataExceed20 = reserveData.map((item) => (item > 0.2 ? 0.2 : item));
  return reserveDataExceed20;
};
</script>

<template>
  <div ref="projectRadarChartWrap" class="h-full">
    <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full h-full" />
  </div>
</template>

<template>
  <div ref="appBarChartWrap" class="flex flex-column h-full">
    <Chart type="line" :data="chartData" :options="chartOptions" class="flex-grow-1" />
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import { watch } from 'vue';
import { draw, generate } from 'patternomaly';
import chartComposable from '@/combosables/chartData';
const { zoomOptions, nodataAnnotationOption } = chartComposable();
import { useLayout } from '@/layout/composables/layout';
import { smallChartSize } from './chartConfig';
const { isDarkTheme } = useLayout();
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  width: {
    type: Number,
    default: 1,
  },
});
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
  () => props.width,
  () => {
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
const chartData = ref();
const chartOptions = ref();
const setChartData = async () => {
  /*
  data = list of moduleData
  moduleData = {
        "name": "TSA HMI Sample 1",
        "type": "TSA",
        "online": {
            "rateCritical1": 1.0,
            "rateCritical2": 2.0,
            "rateCritical3": 3.0
        },
        "offline": {
            "rateCritical1": 0.0,
            "rateCritical2": 0.0,
            "rateCritical3": 0.0
        },
        "current": 3.5
    }

  */
  const isSmallChart = props.width < smallChartSize;

  const labels = [];

  const onlineRate1Data = [];
  const onlineRate2Data = [];

  const offlineRate1Data = [];
  const offlineRate2Data = [];

  const currentData = [];
  const currentColor = [];
  const currentPatternomalyColor = 'rgb(229, 231, 235)';
  for (let moduleIndex = 0; moduleIndex < props.data.length; moduleIndex++) {
    // vsa / tsa data F
    const moduleData = props.data[moduleIndex];
    labels.push(isSmallChart ? moduleData.name.split('-') : moduleData.name);
    onlineRate1Data.push(moduleData.online['rateCritical1']);
    onlineRate2Data.push(moduleData.online['rateCritical2'] - moduleData.online['rateCritical1']);

    offlineRate1Data.push(moduleData.offline['rateCritical1']);
    offlineRate2Data.push(moduleData.offline['rateCritical2'] - moduleData.offline['rateCritical1']);
    currentData.push(moduleData.current);
    const currentBgColor = getCurrentColor(moduleData.current, moduleData.online);
    currentColor.push(draw('dash', currentBgColor, currentPatternomalyColor, isSmallChart ? 40 : 25, 300));
  }

  const datasets = [
    // current
    {
      type: 'bar',
      datalabels: 'Current',
      label: 'Current',
      barThickness: isSmallChart ? 20 : 30,
      data: currentData,
      backgroundColor: currentColor,
      borderColor: currentPatternomalyColor,
      borderWidth: 0.1,
      stack: 'Stack Current',
    },
    // online
    {
      datalabels: 'Online',
      barThickness: isSmallChart ? 20 : 30,
      type: 'bar',
      label: 'Rate Critical 1',
      data: onlineRate1Data,
      backgroundColor: 'rgba(40,167,69,1)',

      stack: 'Stack Online',
    },
    {
      type: 'bar',
      datalabels: 'Online',
      barThickness: isSmallChart ? 20 : 30,
      label: 'Rate Critical 2',
      data: onlineRate2Data,
      backgroundColor: 'rgba(255,165,0,1)',

      stack: 'Stack Online',
    },

    // offline
    {
      type: 'bar',
      datalabels: 'Offline',
      barThickness: isSmallChart ? 20 : 30,
      label: 'Rate Critical 1',
      data: offlineRate1Data,
      backgroundColor: isDarkTheme.value ? 'rgba(0,128,0,1)' : 'rgba(0,128,30,1)',

      stack: 'Stack Offline',
    },
    {
      type: 'bar',
      datalabels: 'Offline',
      barThickness: isSmallChart ? 20 : 30,
      label: 'Rate Critical 2',
      data: offlineRate2Data,
      backgroundColor: isDarkTheme.value ? 'rgba(255, 141, 0, 1)' : 'rgba(255, 141, 0, 1)',

      stack: 'Stack Offline',
    },
  ];
  return { datasets: datasets, labels: labels };
};

const getCurrentColor = (current, rateArr) => {
  if (current <= rateArr['rateCritical1']) {
    return 'rgba(40,167,69,1)';
  } else if (current <= rateArr['rateCritical2']) {
    return 'rgba(255,165,0,1)';
  } else {
    return 'rgba(255,0,0,1)';
  }
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const isSmallChart = props.width < smallChartSize;
  return {
    animation: false,
    barThickness: 20,
    stacked: true,
    barThickness: 20,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      zoom: zoomOptions(),
      tooltip: {
        mode: 'x',
        position: 'average',
        callbacks: {
          title: function (tooltipItems) {
            return `${tooltipItems[0].label} - ${tooltipItems[0].dataset.datalabels}`;
          },
          label: function (context) {
            const label = context.dataset.label || '';
            if (label === 'Rate Critical 2') {
              const rate2 =
                chartData.value.datasets[context.datasetIndex - 1].data[context.dataIndex] +
                chartData.value.datasets[context.datasetIndex].data[context.dataIndex];
              return `${label}: ${rate2}`;
            }

            return `${label}: ${context.raw}`;
          },
        },
      },
      legend: {
        display: false,
      },
      annotation: props.data.length === 0 ? nodataAnnotationOption(textColorSecondary) : {},
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
          autoSkip: true, // Cho phép Chart.js tự động bỏ qua nhãn để giảm độ phân giải
          maxTicksLimit: 5, // Số lượng tối đa các nhãn trục x được hiển thị'
          font: {
            size: isSmallChart ? 7 : 14,
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>
<style>
.legend-rounded {
  border-radius: 0.5rem;
}
</style>

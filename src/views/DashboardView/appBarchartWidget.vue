<template>
  <div ref="appBarChartWrap" class="flex flex-column h-full">
    <Chart type="line" :data="chartData" :options="chartOptions" class="flex-grow-1" />
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import { computed, watch } from 'vue';
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

const color = computed(() => {
  return {
    current: {
      rate1: '#a7c957',
      rate2: '#ffb627',
      rate3: '#d00000',
      borderRate1: '#606c38',
      borderRate2: '#bc6c25',
    },
    online: {
      rate1: '#6a994e',
      rate2: '#ff9505',
      borderRate1: '#606c38',
      borderRate2: '#bc6c25',
    },
    offline: {
      rate1: '#5c8001',
      rate2: '#e2711d',
      borderRate1: '#606c38',
      borderRate2: '#bc6c25',
    },
  };
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

    offlineRate1Data.push(moduleData.online['rateCritical1']);
    offlineRate2Data.push(moduleData.online['rateCritical2'] - 3000 - moduleData.offline['rateCritical1']);

    if (moduleIndex === 0) {
      moduleData.current = moduleData.online['rateCritical2'] + 100;
    }
    currentData.push(moduleData.current);

    currentColor.push(getCurrentColor(moduleData.current, moduleData.online));
  }

  const datasets = [
    // current
    {
      type: 'bar',
      datalabels: 'Current',
      label: 'Current',
      data: currentData,
      borderColor: color.value.current.borderRate1,
      borderWidth: 1.5,
      backgroundColor: currentColor,
      borderColor: currentPatternomalyColor,
      stack: 'Stack Current',
    },

    // online
    {
      datalabels: 'Online',
      type: 'bar',
      label: 'Rate Critical 1',
      data: onlineRate1Data,
      backgroundColor: color.value.online.rate1,
      borderColor: color.value.online.borderRate1,
      borderWidth: 1.5,
      stack: 'Stack Online',
    },
    {
      type: 'bar',
      datalabels: 'Online',
      label: 'Rate Critical 2',
      data: onlineRate2Data,
      backgroundColor: color.value.online.rate2,
      borderColor: color.value.online.borderRate2,
      borderWidth: 1.5,
      stack: 'Stack Online',
    },

    // offline
    {
      type: 'bar',
      datalabels: 'Offline',
      label: 'Rate Critical 1',
      data: offlineRate1Data,
      backgroundColor: color.value.offline.rate1,
      borderColor: color.value.offline.borderRate1,
      borderWidth: 1.5,
      stack: 'Stack Offline',
    },
    {
      type: 'bar',
      datalabels: 'Offline',
      label: 'Rate Critical 2',
      data: offlineRate2Data,
      backgroundColor: color.value.offline.rate2,
      borderColor: color.value.offline.borderRate2,
      borderWidth: 1.5,
      stack: 'Stack Offline',
    },
  ];
  return { datasets: datasets, labels: labels };
};

const getCurrentColor = (current, rateArr) => {
  if (current <= rateArr['rateCritical1']) {
    return color.value.current.rate1;
  } else if (current <= rateArr['rateCritical2']) {
    return color.value.current.rate2;
  } else {
    return color.value.current.rate3;
  }
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const isSmallChart = props.width < smallChartSize;
  return {
    animation: false,
    stacked: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    responsive: true,
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
        barPercentage: 0.1, // Adjust this value to increase/decrease the width of the bars
        categoryPercentage: 1.0, // Adjust this value to increase/decrease the space between groups
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

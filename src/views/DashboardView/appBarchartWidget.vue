<template>
  <div class="flex flex-column h-full">
    <div>
      <div class="flex align-items-center justify-content-start gap-3 mb-1">
        <div class="font-semibold text-primary-500">Online:</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-primary-400">Rate Critical 1</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-primary-300">Rate Critical 2</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-primary-200">Rate Critical 3</div>
      </div>
      <div class="flex align-items-center justify-content-start gap-3 mb-1">
        <div class="font-semibold text-gray-500">Offline:</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-gray-400">Rate Critical 1</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-gray-300">Rate Critical 2</div>
        <div class="px-2 py-1 legend-rounded text-sm bg-gray-200">Rate Critical 3</div>
      </div>
      <div class="flex align-items-center justify-content-start gap-3 mb-1">
        <div class="px-2 py-1 legend-rounded text-sm bg-orange-400">Current</div>
      </div>
    </div>
    <Chart type="line" :data="chartData" :options="chartOptions" class="flex-grow-1" />
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import { watch } from 'vue';
import chartComposable from '@/combosables/chartData';
const { zoomOptions, nodataAnnotationOption } = chartComposable();
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
watch(
  () => props.data,
  () => {
    chartData.value = setChartData();
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

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
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
  const labels = [];
  // const datasets = [];

  const onlineRate1Data = [];
  const onlineRate2Data = [];
  const onlineRate3Data = [];

  const offlineRate1Data = [];
  const offlineRate2Data = [];
  const offlineRate3Data = [];
  const currentData = [];

  for (let moduleIndex = 0; moduleIndex < props.data.length; moduleIndex++) {
    // vsa / tsa data F
    const moduleData = props.data[moduleIndex];
    labels.push(moduleData.name);

    onlineRate1Data.push(moduleData.online['rateCritical1']);
    onlineRate2Data.push(moduleData.online['rateCritical2']);
    onlineRate3Data.push(moduleData.online['rateCritical3']);

    offlineRate1Data.push(moduleData.offline['rateCritical1']);
    offlineRate2Data.push(moduleData.offline['rateCritical2']);
    offlineRate3Data.push(moduleData.offline['rateCritical3']);
    currentData.push(moduleData.current);
  }
  const datasets = [
    // online
    {
      datalabels: 'Online',

      type: 'bar',
      label: 'Rate Critical 1',
      data: onlineRate1Data,
      backgroundColor: documentStyle.getPropertyValue('--primary-400'),
      stack: 'Stack Online',
    },
    {
      type: 'bar',
      datalabels: 'Online',
      label: 'Rate Critical 2',
      data: onlineRate2Data,
      backgroundColor: documentStyle.getPropertyValue('--primary-300'),
      stack: 'Stack Online',
    },
    {
      type: 'bar',
      datalabels: 'Online',
      label: 'Rate Critical 3',
      data: onlineRate3Data,
      backgroundColor: documentStyle.getPropertyValue('--primary-200'),
      stack: 'Stack Online',
    },
    // offline
    {
      type: 'bar',
      datalabels: 'Offline',
      label: 'Rate Critical 1',
      data: offlineRate1Data,
      backgroundColor: documentStyle.getPropertyValue('--gray-400'),
      stack: 'Stack Offline',
    },
    {
      type: 'bar',
      datalabels: 'Offline',
      label: 'Rate Critical 2',
      data: offlineRate2Data,
      backgroundColor: documentStyle.getPropertyValue('--gray-300'),
      stack: 'Stack Offline',
    },
    {
      type: 'bar',
      datalabels: 'Offline',
      label: 'Rate Critical 3',
      data: offlineRate3Data,
      backgroundColor: documentStyle.getPropertyValue('--gray-200'),
      stack: 'Stack Offline',
    },
    // current
    {
      type: 'bar',
      datalabels: 'Current',
      label: 'Current',
      data: currentData,
      backgroundColor: documentStyle.getPropertyValue('--orange-400'),
      stack: 'Stack Current',
    },
  ];
  return { datasets: datasets, labels: labels };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
            size: 7,
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

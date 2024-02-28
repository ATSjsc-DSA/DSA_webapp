<script setup>
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';
import modificationTimeFile from './modificationTimeFile.vue';
import { onMounted, watch } from 'vue';
const { zoomOptions, convertDateTimeToString } = chartComposable();
import { useLayout } from '@/layout/composables/layout';

const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
});
const { isDarkTheme } = useLayout();

const emits = defineEmits(['refeshData']);
const chartData = computed(() => {
  return setChartData(props.chartData);
});

const titleChart = computed(() => {
  return props.chartData.name;
});
const modificationTime = computed(() => {
  if (props.chartData.modificationTime) {
    return convertDateTimeToString(props.chartData.modificationTime);
  }
});
const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  return {
    labels: dataSub.freq,
    datasets: [
      {
        label: 'Dm',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--red-600'), // Set your desired color
        yAxisID: 'y', // Choose the appropriate axis
        tension: 0.4, // Use tension 0 to draw straight lines
        data: dataSub.dm,
        pointRadius: 0.2,
        borderWidth: 2,
      },
      {
        label: 'Base',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.base,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_4001_8001_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--green-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_4001_8001_1,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_4001_4204_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--purple-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_4001_4204_1,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_4001_4097_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--pink-400'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_4001_4097_1,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_4001_4094_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--teal-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_4001_4094_1,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_4001_4090_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--orange-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_4001_4090_1,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_3906_4001_2',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--black-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_3906_4001_2,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'lne_3906_4001_1',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--primary-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: dataSub.lne_3906_4001_1,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  return {
    animation: false,
    stacked: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      zoom: zoomOptions(),
      title: {
        display: true,
        text: props.chartData.name,
        padding: 4,
        color: textColor,
      },
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
          font: {
            size: 8,
          },
          padding: 12,
        },
        position: 'top',
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        display: true,
        ticks: {
          color: textColorSecondary,
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 5,
            },
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
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
const chartOptions = ref();
onMounted(() => {
  chartOptions.value = setChartOptions();
});
const lineChart = ref();
const refeshData = () => {
  lineChart.value.chart.resetZoom();
  chartOptions.value = setChartOptions();
  emits('refeshData');
};
watch(isDarkTheme, () => {
  chartOptions.value = setChartOptions();
});

watch(titleChart, () => {
  chartOptions.value = setChartOptions();
});
</script>

<template>
  <div class="card">
    <modificationTimeFile :modificationTime="modificationTime" @refeshData="refeshData"></modificationTimeFile>
    <Chart ref="lineChart" type="line" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
  position: relative;
}
.chart {
  height: 100%;
}
</style>

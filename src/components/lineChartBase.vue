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
const chartOptions = ref();
const chartData = ref();
watch(
  () => props.chartData,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      nextTick(() => {
        chartData.value = setChartData(newValue);
      });
    }
  },
);
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
        label: 'T',
        fill: true,
        borderColor: documentStyle.getPropertyValue('--green-700'), // Set your desired color
        yAxisID: 'y', // Choose the appropriate axis
        tension: 0.4, // Use tension 0 to draw straight lines
        data: [{ x: dataSub.dm[0].x, y: 0.3 }],
        pointRadius: 2,
        borderWidth: 6,
      },
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
        borderColor: documentStyle.getPropertyValue('--indigo-500'),
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
      tooltip: {
        enabled: true,
        position: 'nearest', // Chỉ hiển thị tooltip cho điểm gần nhất với con trỏ chuột
        intersect: false,
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
    <div v-show="!titleChart" class="card-Skeleton"></div>
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
.card-Skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--surface-card);
  opacity: 0.9;
  z-index: 6;
}
.chart {
  height: 100%;
}
</style>

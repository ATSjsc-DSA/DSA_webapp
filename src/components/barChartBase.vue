<script setup>
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';

const { zoomOptions } = chartComposable();
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
const titleChart = computed(() => {
  return props.chartData.name;
});

const keysChartData = computed(() => {
  return Object.keys(props.chartData);
});
const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  return {
    labels: dataSub.Key,
    datasets: [
      {
        label: keysChartData.value[2],
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        data: dataSub[keysChartData.value[2]],
      },
      {
        label: keysChartData.value[3],
        backgroundColor: documentStyle.getPropertyValue('--pink-500'),
        borderColor: documentStyle.getPropertyValue('--pink-500'),
        data: dataSub[keysChartData.value[3]],
      },
    ],
  };
};

const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    barThickness: 20,
    stacked: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      zoom: zoomOptions(),
      title: {
        display: true,
        text: titleChart.value,
        padding: 4,
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
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
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
});
</script>
<template>
  <div class="card">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
}
.chart {
  height: 100%;
  width: 100%;
}
</style>

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
        tension: 0, // Use tension 0 to draw straight lines
        data: dataSub.dm,
        pointRadius: 0,
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

const chartOptions = computed(() => {
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
    <div class="icon-chart">
      <i class="pi pi-sync pi-spin"></i>
      <span>Auto update</span>
    </div>
    <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
  position: relative;
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
.chart {
  height: 100%;
}
</style>

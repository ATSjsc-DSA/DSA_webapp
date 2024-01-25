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
    animation: false,
    stacked: true,
    barThickness: 20,
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
  <div class="card relative">
    <div class="icon-chart">
      <i class="pi pi-sync pi-spin"></i>
      <span>Auto update</span>
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="chart" />
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
  width: 100%;
}
</style>

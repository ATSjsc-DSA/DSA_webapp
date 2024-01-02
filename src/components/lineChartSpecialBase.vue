<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';
import chartOverLayPanel from './chartOverLayPanel.vue';
const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
  labelChart: String,
  ChartStabe: {
    type: Boolean,
    default: false,
  },
});
const chartData = computed(() => {
  return setChartData(props.chartData);
});
const titleChart = computed(() => {
  if (props.labelChart === 'value') {
    return 'Angle chart';
  } else return 'Power Tranfer';
});

const getChartConfig = (label, borderColor, data, pointRadius = 1.5, borderDash) => ({
  label,
  fill: false,
  borderColor,
  yAxisID: 'y',
  tension: 0,
  data,
  pointRadius,
  borderDash: [borderDash, borderDash],
});

const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const chartValue = [
    getChartConfig(props.labelChart, documentStyle.getPropertyValue('--red-600'), dataSub[props.labelChart]),
  ];
  if (props.ChartStabe) {
    const peakChartData = [
      { x: dataSub.time[0], y: dataSub.peak[0] },
      { x: dataSub.time[dataSub.time.length - 1], y: dataSub.peak[0] },
    ];

    const meanChartData = [
      { x: dataSub.time[0], y: dataSub.mean[0] },
      { x: dataSub.time[dataSub.time.length - 1], y: dataSub.mean[0] },
    ];
    const chartPeakValue = getChartConfig('peak', documentStyle.getPropertyValue('--green-400'), peakChartData, 0.5, 5);
    const chartMeanValue = getChartConfig('mean', documentStyle.getPropertyValue('--green-300'), meanChartData, 0.5, 5);

    chartValue.push(chartPeakValue, chartMeanValue);
  }

  return {
    labels: dataSub.time,
    datasets: chartValue,
  };
};

const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    stacked: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
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
    <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
}
.chart {
  height: 100%;
}
</style>

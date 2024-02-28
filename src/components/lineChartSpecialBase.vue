<script setup>
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();
const { zoomOptions } = chartComposable();
const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
  labelChart: {
    type: String,
    require: true,
    default: 'Angle chart',
  },
  ChartStabe: {
    type: Boolean,
    default: false,
  },
});
const chartData = computed(() => {
  return setChartData(props.chartData.data);
});
const titleChart = computed(() => (props.labelChart === 'value' ? 'Angle chart' : 'Power Transfer'));
const lineName = computed(() => props.chartData.name);
const getChartConfig = (label, borderColor, data, pointRadius = 1.5, borderDash) => ({
  label,
  fill: false,
  borderColor,
  yAxisID: 'y',
  tension: 0,
  data,
  pointRadius,
  borderDash: [borderDash, borderDash],
  borderWidth: 1,
});

const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const chartValue = [
    getChartConfig(props.labelChart, documentStyle.getPropertyValue('--red-600'), dataSub[props.labelChart], 0),
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
    const stablilityChartData = [
      { x: dataSub.t_stablility[0], y: Math.min(...dataSub.value) },
      { x: dataSub.t_stablility[0], y: Math.max(...dataSub.value) },
    ];
    const chartPeakValue = getChartConfig('peak', documentStyle.getPropertyValue('--green-400'), peakChartData, 0, 5);
    const chartMeanValue = getChartConfig('mean', documentStyle.getPropertyValue('--green-300'), meanChartData, 0, 5);
    const chartStablilityValue = getChartConfig(
      'stablility',
      documentStyle.getPropertyValue('--yellow-300'),
      stablilityChartData,
      0,
      5,
    );
    chartValue.push(chartPeakValue, chartMeanValue, chartStablilityValue);
  }

  return {
    labels: dataSub.time,
    datasets: chartValue,
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
        type: 'linear',
        display: true,
        ticks: {
          color: textColorSecondary,
          autoSkip: true, // Cho phép Chart.js tự động bỏ qua nhãn để giảm độ phân giải
          maxTicksLimit: 20, // Số lượng tối đa các nhãn trục x được hiển thị
          stepSize: 1,
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
watch(isDarkTheme, () => {
  chartOptions.value = setChartOptions();
});
watch(lineName, () => {
  chartOptions.value = setChartOptions();
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

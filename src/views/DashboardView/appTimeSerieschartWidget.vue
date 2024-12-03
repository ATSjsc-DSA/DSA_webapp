<template>
  <div ref="appTimeSeriesChartWrap" class="flex flex-column h-full">
    <Chart type="line" :data="chartData" :options="chartOptions" class="flex-grow-1" />
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import { watch } from 'vue';
import dayjs from 'dayjs';
import 'chartjs-adapter-dayjs-3';

import chartComposable from '@/combosables/chartData';
const { zoomOptions, nodataAnnotationOption, convertDateTimeToString } = chartComposable();
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      list_time: [],
      list_data: [],
    }),
  },
  appName: {
    type: String,
    default: 'Application',
  },
});
onMounted(async () => {
  chartData.value = await setChartData();
  chartOptions.value = await setChartOptions();
});
watch(
  () => props.data,
  async (newVal, oldVal) => {
    const newChartWidth = await getChartWidth();
    if (
      (JSON.stringify(newVal) !== JSON.stringify(oldVal) || chartWidth !== newChartWidth) &&
      newVal.list_data !== undefined
    ) {
      chartData.value = await setChartData();
      chartOptions.value = await setChartOptions();
    }
  },
);
watch(
  isDarkTheme,
  async () => {
    chartOptions.value = await setChartOptions();
  },
  { immediate: false },
);
const chartData = ref();
const chartOptions = ref();
const chartWidth = ref(0);
const appTimeSeriesChartWrap = ref();
const setChartData = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  if (props.data.list_time) {
    return {
      datasets: [
        {
          data: props.data.list_data,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--primary-400'),
          tension: 0.4,
        },
      ],
      labels: props.data.list_time.map((timeVal) => dayjs.unix(timeVal).toDate()),
    };
  } else {
    return [{ labels: [], datasets: [] }];
  }
};

const setChartOptions = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const chartWidth = await getChartWidth();
  const isSmallChart = chartWidth < 500;
  const isNoData = !props.data.list_time || props.data.list_time.length === 0;
  return {
    animation: false,
    barThickness: 20,
    stacked: true,
    barThickness: 20,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      zoom: zoomOptions(),
      legend: {
        display: false,
      },
      annotation: isNoData ? nodataAnnotationOption(textColorSecondary) : {},
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: isSmallChart ? 'day' : 'hour',
          displayFormats: {
            day: 'MM/DD HH:mm',
            hour: 'MM/DD HH:mm',
          },
        },
        ticks: {
          color: textColorSecondary,
          source: 'data',
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          autoSkipPadding: 10,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
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

const getChartWidth = async () => {
  if (appTimeSeriesChartWrap.value) {
    let w = 0;
    await nextTick(() => {
      w = appTimeSeriesChartWrap.value.getBoundingClientRect().width;
    });
    return w;
  }
  return 0;
};
</script>
<style>
.legend-rounded {
  border-radius: 0.5rem;
}
</style>

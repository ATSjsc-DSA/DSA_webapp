<template>
  <div class="flex flex-column h-full">
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
import { smallChartSize } from './chartConfig';
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
  width: {
    type: Number,
    default: 1,
  },
});
onMounted(async () => {
  chartData.value = await setChartData();
  chartOptions.value = setChartOptions();
});
watch(
  () => props.data,
  async (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && newVal.list_data !== undefined) {
      chartData.value = await setChartData();
      chartOptions.value = setChartOptions();
    }
  },
);
watch(
  () => props.width,
  async () => {
    chartOptions.value = setChartOptions();
  },
);

watch(
  isDarkTheme,
  async () => {
    chartOptions.value = setChartOptions();
  },
  { immediate: false },
);
const chartData = ref();
const chartOptions = ref();
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

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const isSmallChart = props.width < smallChartSize;

  const isNoData = !props.data.list_time || props.data.list_time.length === 0;
  let unit = 'day';
  if (!isNoData) {
    unit = isSmallChart && props.data.list_time.length > 5 ? 'day' : 'hour';
  }
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
          unit: unit,
          displayFormats: {
            day: 'MM/DD ',
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
</script>
<style>
.legend-rounded {
  border-radius: 0.5rem;
}
</style>

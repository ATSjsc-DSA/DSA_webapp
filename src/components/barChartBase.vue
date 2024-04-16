<script setup>
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';
import modificationTimeFile from './modificationTimeFile.vue';
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();

const { zoomOptions, convertDateTimeToString } = chartComposable();
const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
});
const emits = defineEmits(['refeshData']);

// const chartData = computed(() => {
//   return setChartData(props.chartData.data);
// });
const chartData = ref();
watch(
  () => props.chartData,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue.data) !== JSON.stringify(oldValue.data)) {
      nextTick(() => {
        chartData.value = setChartData(newValue.data);
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
const keysChartData = computed(() => {
  return Object.keys(props.chartData.data);
});
const label = computed(() => {
  return props.chartData.Key;
});
const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const colorVariables = ['--blue-500', '--pink-500', '--green-500'];
  return {
    labels: label.value,
    datasets: keysChartData.value.map((dataset, index) => {
      return {
        label: dataset,
        backgroundColor: documentStyle.getPropertyValue(colorVariables[index]),
        borderColor: documentStyle.getPropertyValue(colorVariables[index]),
        data: dataSub[dataset],
      };
    }),
  };
};

const setChartOptions = () => {
  console.log('abcd');
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
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
      title: {
        display: true,
        text: titleChart.value,
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
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          autoSkip: true, // Cho phép Chart.js tự động bỏ qua nhãn để giảm độ phân giải
          maxTicksLimit: 5, // Số lượng tối đa các nhãn trục x được hiển thị
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
const barChart = ref();
const refeshData = () => {
  barChart.value.chart.resetZoom();
  chartOptions.value = setChartOptions();
  emits('refeshData');
};
watch(
  isDarkTheme,
  () => {
    chartOptions.value = setChartOptions();
  },
  { immediate: false },
);
watch(titleChart, () => {
  chartOptions.value = setChartOptions();
});
</script>
<template>
  <div class="card relative">
    <modificationTimeFile :modificationTime="modificationTime" @refeshData="refeshData"></modificationTimeFile>
    <Chart ref="barChart" type="bar" :data="chartData" :options="chartOptions" class="chart" />
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
  width: 100%;
}
</style>

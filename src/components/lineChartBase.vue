<script setup>
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';
import modificationTimeFile from './modificationTimeFile.vue';
import { onMounted, watch } from 'vue';
const { zoomOptions, convertDateTimeToString } = chartComposable();
import { useLayout } from '@/layout/composables/layout';
import styleLocal from '@/combosables/style';
const { getRandomColor } = styleLocal();
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

const getChartConfig = (label, borderColor, data, fill = false, tension = 0.4, pointRadius = 0.2, borderWidth = 2) => ({
  label,
  borderColor,
  data,
  fill,
  tension,
  pointRadius,
  borderWidth,
  yAxisID: 'y',
});

const setChartData = (dataSub) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const datasets = [];
  const colorsUsed = [];

  dataSub?.data?.slice(1).forEach((element) => {
    const randomColor = getRandomColor(colorsUsed);
    colorsUsed.push(randomColor);
    datasets.push(getChartConfig(element.name, documentStyle.getPropertyValue(randomColor), element.data));
  });
  // Add the 'T' dataset
  datasets.push({
    label: 'T',
    fill: true,
    borderColor: documentStyle.getPropertyValue('--red-300'),
    yAxisID: 'y',
    tension: 0,
    data: [{ x: dataSub.f, y: 0.3 }],
    pointRadius: 2,
    borderWidth: 6,
  });

  // Add the 'Dm' dataset
  datasets.push({
    label: 'Dm',
    fill: false,
    borderColor: documentStyle.getPropertyValue('--yellow-300'),
    yAxisID: 'y',
    tension: 0,
    data: [
      { x: dataSub.f, y: dataSub.dmin },
      { x: dataSub.f, y: dataSub.dmax },
    ],
    pointRadius: 0.2,
    borderWidth: 2,
  });
  return {
    labels: dataSub?.data && Array.isArray(dataSub.data) && dataSub.data.length > 0 ? dataSub.data[0].data : [],
    datasets: datasets,
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
          filter: function (legendItem, chartData) {
            // Hide legend for datasets with label 'T' and 'Dm'
            return legendItem.text !== 'T' && legendItem.text !== 'Dm';
          },
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

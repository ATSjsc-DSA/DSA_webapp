<template>
  <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
</template>

<script setup>
import { watch } from 'vue';

import Chart from 'primevue/chart';
import { colorArray } from './chartConfig';
import chartComposable from '@/combosables/chartData';

const { zoomOptions, nodataAnnotationOption } = chartComposable();

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  showLegend: {
    type: Boolean,
    default: true,
  },
});
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
watch(
  () => props.data,
  async (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }
  },
);
watch(
  () => props.showLegend,
  () => {
    chartOptions.value = setChartOptions();
  },
);

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  const datasets = [];
  /*
  [
   {
        caseName: 'name of case',
        definitionValue: [list of x],
        documents:{
            curve_name_1: [list of y],
            curve_name_2: [list of y],
            curve_name_3: [list of y],
            ...
        }
   }
  ]
  */
  let colorIndex = 0;
  let labels = [];
  for (let caseIndex = 0; caseIndex < props.data.length; caseIndex++) {
    const caseData = props.data[caseIndex];
    labels = labels.concat(caseData.definitionValue);
    for (const curveName in caseData.documents) {
      const data = [];
      const curveData = caseData.documents[curveName];
      for (let curveDataIndex = 0; curveDataIndex < curveData.length; curveDataIndex++) {
        data.push({
          x: caseData.definitionValue[curveDataIndex],
          y: curveData[curveDataIndex],
        });
      }
      datasets.push({
        label: curveName,
        data: data,
        fill: false,
        borderColor: documentStyle.getPropertyValue(colorArray[colorIndex]),
        tension: 0,
        pointRadius: 1,
      });
      colorIndex++;
      if (colorIndex >= colorArray.length) {
        colorIndex = 0;
      }
    }
  }
  return { datasets: datasets, labels: labels };
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
      legend: {
        display: props.showLegend,
        labels: {
          usePointStyle: true,
          color: textColor,
          font: {
            size: 8,
          },
          padding: 12,
        },
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
      annotation: props.data.length === 0 ? nodataAnnotationOption(textColorSecondary) : {},
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
</script>

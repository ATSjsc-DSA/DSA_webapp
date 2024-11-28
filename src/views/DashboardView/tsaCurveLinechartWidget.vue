<template>
  <div ref="tsaChartWrap" class="h-full">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
  </div>
</template>

<script setup>
import { watch } from 'vue';

import Chart from 'primevue/chart';
import { colorArray } from './chartConfig';
import chartComposable from '@/combosables/chartData';
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();

const { zoomOptions } = chartComposable();

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  config: {
    type: Object,
    default: () => {},
  },
});
const hiddenDatasets = defineModel('hiddenDatasets');

onMounted(async () => {
  chartData.value = setChartData();
  chartOptions.value = await setChartOptions();
});
watch(
  () => props.data,
  async () => {
    chartData.value = setChartData();
    chartOptions.value = await setChartOptions();
  },
);

watch(
  () => props.config,
  async () => {
    chartData.value = setChartData();
    chartOptions.value = await setChartOptions();
  },
);
watch(
  isDarkTheme,
  async () => {
    chartData.value = setChartData();
    chartOptions.value = await setChartOptions();
  },
  { immediate: false },
);
const chartData = ref();
const chartOptions = ref();

const tsaChartWrap = ref();
const getChartWidth = async () => {
  if (tsaChartWrap.value) {
    let w = 0;
    await nextTick(() => {
      w = tsaChartWrap.value.getBoundingClientRect().width;
    });
    return w;
  }
  return 0;
};
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
        },
        standard:{ <--point max và min
          curve_name_1:{
              definitionMax: []
              valueMax: []
              definitionMin: []
              valueMin: []
          }
        },
        other: {  <--- 3 annotations y và 1 annotations x
          curve_name_1:[max-line, max-ràng-line, min-rangeline, time of stability]
          curve_name_2:...

        }
   }
  ]
  [
    case 2...
  ]
  */

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  const datasets = [];

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
        tension: 0.4,
        pointRadius: 1,
        hidden: hiddenDatasets.value.includes(colorIndex),
      });
      colorIndex++;
    }
  }
  return { datasets: datasets, labels: labels };
};

const setChartOptions = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const annotation = await getAnnotation();
  const chartWidth = await getChartWidth();

  const isSmallChart = chartWidth < 500;
  return {
    animation: false,
    stacked: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      zoom: zoomOptions(),
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
          font: {
            size: isSmallChart ? 8 : 12,
          },
          padding: 12,
        },
        onClick: function (event, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
            hiddenDatasets.value.push(index);
          } else {
            ci.show(index);
            legendItem.hidden = false;
            hiddenDatasets.value.filter((item) => item !== index);
          }
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
      annotation: annotation,
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

const getAnnotation = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  let annotation = {};
  if (props.data.length === 0) {
    annotation = {
      nodataLabel: {
        type: 'label',
        position: 'center',
        backgroundColor: 'transparent ',
        color: documentStyle.getPropertyValue('--text-color-secondary'),
        content: ['No data'],
        font: {
          size: 12,
        },
      },
    };
  }

  const standarAnnotations = getStandardAnnotation();
  if (standarAnnotations) {
    annotation = { ...annotation, ...standarAnnotations };
  }
  const otherAnnotations = await getOtherdAnnotation();
  if (otherAnnotations) {
    annotation = { ...annotation, ...otherAnnotations };
  }
  return { annotations: annotation };
};
const getStandardAnnotation = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  const standarAnnotations = {};
  let colorIndex = 0;

  for (let caseIndex = 0; caseIndex < props.data.length; caseIndex++) {
    const caseData = props.data[caseIndex];
    for (const curveName in caseData.standard) {
      const maxPointColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '500');
      const minPointColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
      colorIndex++;
      if (props.config.standard.indexOf(curveName) !== -1) {
        for (
          let pointMaxIndex = 0;
          pointMaxIndex < caseData.standard[curveName].definitionMax.length;
          pointMaxIndex++
        ) {
          standarAnnotations[curveName + '_point_max_' + pointMaxIndex] = {
            type: 'point',
            radius: 4,

            xValue: caseData.standard[curveName].definitionMax[pointMaxIndex],
            yValue: caseData.standard[curveName].valueMax[pointMaxIndex],
            backgroundColor: maxPointColor,
          };
        }
        for (
          let pointMinIndex = 0;
          pointMinIndex < caseData.standard[curveName].definitionMin.length;
          pointMinIndex++
        ) {
          standarAnnotations[curveName + '_point_min_' + pointMinIndex] = {
            type: 'point',
            radius: 4,
            xValue: caseData.standard[curveName].definitionMin[pointMinIndex],
            yValue: caseData.standard[curveName].valueMin[pointMinIndex],
            backgroundColor: minPointColor,
          };
        }
      }
    }
  }
  return standarAnnotations;
};
/*
other: {  <--- 3 annotations y và 1 annotations x
          curve_name_1:[max-line, max-ràng-line, min-rangeline, time of stability]
          curve_name_2:...

        }

        */
const getOtherdAnnotation = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const otherAnnotations = {};
  let colorIndex = 0;
  const chartWidth = await getChartWidth();
  const isSmallChart = chartWidth < 500;

  for (let caseIndex = 0; caseIndex < props.data.length; caseIndex++) {
    const caseData = props.data[caseIndex];
    for (const curveName in caseData.standard) {
      const maxLine1Color = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '500');
      const maxLine2Color = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '700');
      const minLineColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
      const stabilityLineColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
      colorIndex++;
      if (props.config.other.indexOf(curveName) !== -1) {
        otherAnnotations[curveName + '_line_max_1'] = {
          type: 'line',
          yMin: caseData.other[curveName][0],
          yMax: caseData.other[curveName][0],
          borderColor: maxLine1Color,
          borderWidth: isSmallChart ? 1 : 2,
          borderDash: [5, 2], // Length and spacing of dashes
        };
        otherAnnotations[curveName + '_line_max_2'] = {
          type: 'line',
          yMin: caseData.other[curveName][1],
          yMax: caseData.other[curveName][1],
          borderColor: maxLine2Color,
          borderWidth: isSmallChart ? 1 : 2,
          borderDash: [5, 2], // Length and spacing of dashes
        };
        otherAnnotations[curveName + '_line_min'] = {
          type: 'line',
          yMin: caseData.other[curveName][2],
          yMax: caseData.other[curveName][2],
          borderColor: minLineColor,
          borderWidth: isSmallChart ? 1 : 2,
          borderDash: [5, 2], // Length and spacing of dashes
        };
        otherAnnotations[curveName + '_time_stability'] = {
          type: 'line',
          xMin: caseData.other[curveName][3],
          xMax: caseData.other[curveName][3],
          borderColor: stabilityLineColor,
          borderWidth: isSmallChart ? 1 : 2,
          borderDash: [20, 3], // Length and spacing of dashes
        };
      }
    }
  }
  return otherAnnotations;
};
</script>

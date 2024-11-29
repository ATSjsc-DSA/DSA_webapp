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
list of curveData
  [
   {
        caseName: 'name of case',
        documents:{
          definition: [list of y]
        value: [list of x],

            ...
        },
        standard:{ <--point max và min
              definitionMax: []
              valueMax: []
              definitionMin: []
              valueMin: []
        },
        other: 
         [max-line, max-ràng-line, min-rangeline, time of stability] <--- 3 annotations y và 1 annotations x
   }
  
  
  */

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const datasets = [];
  let colorIndex = 0;
  const labels = [];
  for (let curveIndex = 0; curveIndex < props.data.length; curveIndex++) {
    const curveData = props.data[curveIndex];
    labels.push(curveData.curveName);
    const data = [];
    for (let dataIndex = 0; dataIndex < curveData.documents.definition.length; dataIndex++) {
      data.push({
        x: curveData.documents.definition[dataIndex],
        y: curveData.documents.value[dataIndex],
      });
    }
    datasets.push({
      label: curveData.curveName,
      data: data,
      fill: false,
      borderColor: documentStyle.getPropertyValue(colorArray[colorIndex]),
      tension: 0.4,
      pointRadius: 1,
    });
    colorIndex++;
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

  for (let curveIndex = 0; curveIndex < props.data.length; curveIndex++) {
    const curveData = props.data[curveIndex];
    const maxPointColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '500');
    const minPointColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
    colorIndex++;
    if (props.config.standard.indexOf(curveData.curveName) !== -1) {
      for (let pointMaxIndex = 0; pointMaxIndex < curveData.standard.definitionMax.length; pointMaxIndex++) {
        standarAnnotations[curveData.curveName + '_point_max_' + pointMaxIndex] = {
          type: 'point',
          radius: 4,

          xValue: curveData.standard.definitionMax[pointMaxIndex],
          yValue: curveData.standard.valueMax[pointMaxIndex],
          backgroundColor: maxPointColor,
        };
      }
      for (let pointMinIndex = 0; pointMinIndex < curveData.standard.definitionMin.length; pointMinIndex++) {
        standarAnnotations[curveData.curveName + '_point_min_' + pointMinIndex] = {
          type: 'point',
          radius: 4,
          xValue: curveData.standard.definitionMin[pointMinIndex],
          yValue: curveData.standard.valueMin[pointMinIndex],
          backgroundColor: minPointColor,
        };
      }
    }
  }
  return standarAnnotations;
};
/*
other: {  3 annotations y và 1 annotations x
          max-line, max-ràng-line, min-rangeline, time of stability]
        }

        */
const getOtherdAnnotation = async () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const otherAnnotations = {};
  let colorIndex = 0;
  const chartWidth = await getChartWidth();
  const isSmallChart = chartWidth < 500;

  for (let curveIndex = 0; curveIndex < props.data.length; curveIndex++) {
    const curveData = props.data[curveIndex];
    const maxLine1Color = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '500');
    const maxLine2Color = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '700');
    const minLineColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
    const stabilityLineColor = documentStyle.getPropertyValue(colorArray[colorIndex].slice(0, -3) + '900');
    colorIndex++;
    if (props.config.other.indexOf(curveData.curveName) !== -1) {
      otherAnnotations[curveData.curveName + '_line_max_1' + curveIndex] = {
        type: 'line',
        yMin: curveData.other[0],
        yMax: curveData.other[0],
        borderColor: maxLine1Color,
        borderWidth: isSmallChart ? 1 : 2,
        borderDash: [5, 2], // Length and spacing of dashes
      };
      otherAnnotations[curveData.curveName + '_line_max_2' + curveIndex] = {
        type: 'line',
        yMin: curveData.other[1],
        yMax: curveData.other[1],
        borderColor: maxLine2Color,
        borderWidth: isSmallChart ? 1 : 2,
        borderDash: [5, 2], // Length and spacing of dashes
      };
      otherAnnotations[curveData.curveName + '_line_min' + curveIndex] = {
        type: 'line',
        yMin: curveData.other[2],
        yMax: curveData.other[2],
        borderColor: minLineColor,
        borderWidth: isSmallChart ? 1 : 2,
        borderDash: [5, 2], // Length and spacing of dashes
      };
      otherAnnotations[curveData.curveName + '_time_stability' + curveIndex] = {
        type: 'line',
        xMin: curveData.other[3],
        xMax: curveData.other[3],
        borderColor: stabilityLineColor,
        borderWidth: isSmallChart ? 1 : 2,
        borderDash: [20, 3], // Length and spacing of dashes
      };
    }
  }
  return otherAnnotations;
};
</script>

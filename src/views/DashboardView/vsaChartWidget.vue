<template>
  <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
</template>

<script setup>
import Chart from 'primevue/chart';
import { colorArray } from './chartConfig';
import { watch } from 'vue';
const props = defineProps({
  data: {
    type: Array,
    default: () => {},
  },
});
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
watch(
  () => props.data,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }
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
        tension: 0.4,
      });
      colorIndex++;
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
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
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

<template>
  <div class="card h-full">
    <modificationTimeFile
      :modificationTime="convertDateTimeToString(props.modificationTime)"
      @refeshData="refeshData"
    ></modificationTimeFile>
    <Chart ref="comboChart" type="line" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';
import chartComposable from '@/combosables/chartData';
import modificationTimeFile from './modificationTimeFile.vue';
import { useLayout } from '@/layout/composables/layout';
import { watch } from 'vue';

const { zoomOptions, convertDateTimeToString } = chartComposable();
const { isDarkTheme } = useLayout();
const emits = defineEmits(['refeshData']);
const props = defineProps({
  chartData: {
    type: Object,
    require: true,
    default: {},
  },
  modificationTime: {
    type: Number,
  },
  P_area: {
    type: Number,

    default: 1,
  },
  Pmax_area: {
    type: Number,
    default: 1,
  },
});

onMounted(() => {
  chartOptions.value = setChartOptions();
});

const chartData = computed(() => {
  return setChartData(props.chartData);
});
const chartOptions = ref();
const getChartConfig = (type, label, borderColor, data, fill = false, tension = 0.4, pointRadius = 1) => ({
  type: type,
  label,
  borderColor,
  data,
  fill,
  tension,
  pointRadius,
});
const colorArray = [
  '--blue-200',
  '--blue-300',
  '--blue-400',
  '--blue-500',
  '--blue-600',
  '--blue-700',
  '--primary-200',
  '--primary-300',
  '--primary-400',
  '--primary-500',
  '--primary-600',
  '--primary-700',
  '--green-200',
  '--green-300',
  '--green-400',
  '--green-500',
  '--green-600',
  '--green-700',
  '--yellow-200',
  '--yellow-300',
  '--yellow-400',
  '--yellow-500',
  '--yellow-600',
  '--yellow-700',
  '--cyan-200',
  '--cyan-300',
  '--cyan-400',
  '--cyan-500',
  '--cyan-600',
  '--cyan-700',
  '--pink-200',
  '--pink-300',
  '--pink-400',
  '--pink-500',
  '--pink-600',
  '--pink-700',
  '--indigo-200',
  '--indigo-300',
  '--indigo-400',
  '--indigo-500',
  '--indigo-600',
  '--indigo-700',
  '--teal-200',
  '--teal-300',
  '--teal-400',
  '--teal-500',
  '--teal-600',
  '--teal-700',
  '--orange-200',
  '--orange-300',
  '--orange-400',
  '--orange-500',
  '--orange-600',
  '--orange-700',
  '--red-200',
  '--red-300',
  '--red-400',
  '--red-500',
  '--red-600',
  '--red-700',
  '--purple-200',
  '--purple-300',
  '--purple-400',
  '--purple-500',
  '--purple-600',
  '--purple-700',
];
const getRandomColor = (colorsUsed) => {
  const getRandomIndex = () => Math.floor(Math.random() * colorArray.length);

  let colorIndex;

  do {
    colorIndex = getRandomIndex();
  } while (colorsUsed.includes(colorArray[colorIndex]));

  return colorArray[colorIndex];
};

const setChartData = (data) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const datasets = [];
  const colorsUsed = [];
  let maxValue = 0;
  let minValue = 100;
  if (data.data) {
    Object.entries(data.data).forEach(([key, value]) => {
      const randomColor = getRandomColor(colorsUsed);
      colorsUsed.push(randomColor);
      datasets.push(getChartConfig('line', key, documentStyle.getPropertyValue(randomColor), value));
      value.forEach((element) => {
        if (element < minValue) {
          minValue = element; // Cập nhật giá trị nhỏ nhất nếu tìm thấy giá trị nhỏ hơn
        }
        if (element > maxValue) {
          maxValue = element; // Cập nhật giá trị nhỏ nhất nếu tìm thấy giá trị nhỏ hơn
        }
      });
    });

    // const line = {
    //   type: 'line',
    //   label: '',
    //   borderColor: documentStyle.getPropertyValue('--surface-card'),
    //   pointRadius: 1,
    //   borderWidth: 1,
    //   yAxisID: 'y', // Choose the appropriate axis
    //   tension: 0, // Use tension 0 to draw straight lines
    //   data: [{ x: (props.Pmax_area * 9.5) / 10, y: minValue - 0.1 }],
    // };
    // datasets.push(line);
    // const lineP95 = {
    //   type: 'line',
    //   label: '',
    //   borderColor: documentStyle.getPropertyValue('--surface-card'),
    //   pointRadius: 0,
    //   borderWidth: 0,
    //   yAxisID: 'y', // Choose the appropriate axis
    //   tension: 0, // Use tension 0 to draw straight lines
    //   data: [{ x: props.P_area, y: maxValue + 0.1 }],
    //   z: 10,
    // };
    // datasets.push(lineP95);
    // const linePmax = {
    //   type: 'line',
    //   label: 'P',
    //   borderColor: '#787878',
    //   borderWidth: 12,
    //   pointRadius: 0,
    //   yAxisID: 'y', // Choose the appropriate axis
    //   tension: 0, // Use tension 0 to draw straight lines
    //   data: [
    //     { x: props.P_area, y: minValue - 0.02 },
    //     { x: props.Pmax_area, y: minValue - 0.02 },
    //   ],
    //   z: 5,
    // };
    // datasets.push(linePmax);
  }

  return {
    labels: data.key,
    datasets: datasets,
  };
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
        // display: false,
        labels: {
          usePointStyle: true,
          boxHeight: 10,
          boxWidth: 10,
          color: textColor,
          // font: {
          //   size: 8,
          // },
          // padding: 12,
          pointStyleWidth: false,
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
          stepSize: 1,
          autoSkip: true,
          maxTicksLimit: 10,
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
        // suggestedMin: 0,
      },
    },
    elements: {
      point: {
        radius: 10,
        hoverRadius: 15,
      },
    },
  };
};
watch(isDarkTheme, () => {
  chartOptions.value = setChartOptions();
});

// watch(titleChart, () => {
//   chartOptions.value = setChartOptions();
// });
const comboChart = ref();

const refeshData = () => {
  comboChart.value.chart.resetZoom();
  chartOptions.value = setChartOptions();
  emits('refeshData');
};
</script>
<style scoped>
.chart {
  height: 100%;
}
.card {
  border-radius: 0;
  padding: 10px;
  position: relative;
}
</style>

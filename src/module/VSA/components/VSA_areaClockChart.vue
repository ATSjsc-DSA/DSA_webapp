<template>
  <div class="container-clock">
    <div class="flex-item relative">
      <highcharts :options="chartOptionsBase" ref="chart" class="w-full"></highcharts>
      <div class="absolute titleChart">P/Pmax</div>
    </div>
    <div class="flex-item">
      <Chip class="py-0 pl-0 pr-3">
        <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center"
          ><i class="pi pi-map-marker"></i
        ></span>
        <span class="ml-2 font-medium">{{ title }}</span>
      </Chip>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import ChartModuleMore from 'highcharts/highcharts-more.js';
import solidGauge from 'highcharts/modules/solid-gauge';
import { useLayout } from '@/layout/composables/layout';

// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
// HighchartsSolidGauge(Highcharts);
ChartModuleMore(Highcharts);
solidGauge(Highcharts);

// const chart = ref(null);

export default {
  components: {
    highcharts: Chart,
  },
  props: {
    DataArea: {
      type: Object,
      requied: true,
    },
  },

  setup(props, ctx) {
    // const renderIcons() {
    const documentStyle = getComputedStyle(document.documentElement);
    const { isDarkTheme } = useLayout();
    const DataArea = computed(() => props.DataArea);
    // }

    const P_ratio = computed(() => {
      // Kiểm tra xem DataArea có tồn tại không
      if (props.DataArea && props.DataArea.P_area !== undefined && props.DataArea.Pmax_area !== 0) {
        return parseFloat(((props.DataArea.P_area / props.DataArea.Pmax_area) * 100).toFixed(2));
      } else {
        return 0;
      }
    });
    const title = computed(() => {
      // Kiểm tra xem DataArea có tồn tại không
      if (props.DataArea && props.DataArea.P_area !== undefined && props.DataArea.Pmax_area !== 0) {
        return props.DataArea.name;
      } else {
        return '';
      }
    });

    const chartOptionsBase = computed(() => ({
      chart: {
        type: 'gauge',
        // backgroundColor: documentStyle.getPropertyValue('--surface-card'),
        backgroundColor: 'transparent', // Thiết lập nền trong suốt

        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        marginLeft: 0,
        height: '100%',
      },
      dark: isDarkTheme.value,
      title: {
        text: null,
        style: {
          color: documentStyle.getPropertyValue('--text-color'),
        },
      },
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -130,
        endAngle: 130,
        background: null,
      },

      // the value axis
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 20,
        tickPosition: 'inside',
        minorTickPosition: 'inside',
        tickColor: documentStyle.getPropertyValue('--text-color'),
        minorTickColor: documentStyle.getPropertyValue('--text-color'),
        tickLength: 10,
        minorTickLength: 5,
        tickWidth: 1,
        labels: {
          distance: -20,
          style: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
            fontSize: '1rem',
          },
        },
        offset: -20,
        endOnTick: false,
        lineWidth: 0,
        plotBands: [
          {
            from: 0,
            to: 60,
            color: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, '#18b858'], // Green
                [1, '#77b818'], // Green
              ],
            },
            thickness: 15,
          },
          {
            from: 60,
            to: 80,
            color: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, '#c0f132'], // Green
                [1, '#e9d217'], // Green
              ],
            },
            thickness: 15,
          },
          {
            from: 80,
            to: 100,
            // color: '#DF5353', // Red
            color: {
              linearGradient: { x1: 1, x2: 1, y1: 0, y2: 1 },
              stops: [
                [0, '#dfb60d'], // Green
                [1, '#ff0808'], // Green
              ],
            },
            thickness: 15,
          },
        ],
      },

      series: [
        {
          name: 'P_area/Pmax_area',
          data: [P_ratio.value],
          tooltip: {
            valueSuffix: ' %',
          },
          dataLabels: {
            format: props.DataArea.P_area.toFixed(2) + ' MW',
            borderWidth: 0,
            color: '#333333',
            style: {
              fontSize: '1rem',
            },
          },
          dial: {
            radius: '70%',
            backgroundColor: documentStyle.getPropertyValue('--text-color-secondary'),
            // baseWidth: 12,
            // baseLength: '0%',
            // rearLength: '0%',
          },
          pivot: {
            backgroundColor: 'orange',
            radius: 6,
          },
        },
      ],
    }));
    // watch(isDarkTheme, () => {
    //   chartOptions.value = setChartOptions();
    // });
    return { chartOptionsBase, title, P_ratio };
  },
};

// onMounted(() => {
//   Highcharts.chart(chart.value, {
//
//   });
//   /**
//    * In the chart render event, add icons on top of the circular shapes
//    */

//   // const trackColors = Highcharts.getOptions().colors.map((color) => new Highcharts.Color(color).setOpacity(0.3).get());

//   // Highcharts.chart('container', {

//   // });
// });
//
</script>
<style scoped>
.container-clock {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Đảm bảo các phần tử con chia đều không gian */
  height: 100%; /* Hoặc chiều cao mà bạn muốn */
}

.flex-item {
  flex: 1; /* Mỗi phần tử con sẽ chia đều chiều cao container */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #ccc;  */
}
.titleChart {
  bottom: 19%;
}
</style>

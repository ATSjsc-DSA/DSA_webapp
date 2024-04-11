<template>
  <div class="chartClock">
    <highcharts :options="chartOptionsBase" ref="chart" class="w-full"></highcharts>
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
        return props.DataArea.Name;
      } else {
        return '';
      }
    });

    const chartOptionsBase = computed(() => ({
      chart: {
        type: 'gauge',
        backgroundColor: documentStyle.getPropertyValue('--surface-card'),
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        marginLeft: 0,
        // height: '100%',
      },
      dark: isDarkTheme.value,
      title: {
        text: title.value,
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
        startAngle: -150,
        endAngle: 150,
        background: [
          {
            backgroundColor: documentStyle.getPropertyValue('--surface-ground'),
            borderWidth: 0,
            outerRadius: '105%',
          },
        ],
      },

      // the value axis
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 10,
        tickPosition: 'inside',
        tickColor: documentStyle.getPropertyValue('--surface-card'),
        // tickLength: 20,
        // tickWidth: 2,
        minorTickInterval: null,
        labels: {
          distance: 15,
          style: {
            color: documentStyle.getPropertyValue('--text-color-secondary'),
            fontSize: '1rem',
          },
        },
        lineWidth: 0,
        plotBands: [
          {
            from: 0,
            to: 100,
            color: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, '#55BF3B'], // Green
                [0.5, '#DDDF0D'], // Yellow
                [1, '#DF5353'], // Red
              ],
            },
            thickness: 10,
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
            format: ((P_ratio.value * props.DataArea.Pmax_area) / 100).toFixed(2),
            borderWidth: 0,
            color: '#333333',
            style: {
              fontSize: '1rem',
            },
          },
          dial: {
            radius: '80%',
            backgroundColor: 'gray',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%',
          },
          pivot: {
            backgroundColor: 'gray',
            radius: 6,
          },
        },
      ],
    }));
    // watch(isDarkTheme, () => {
    //   chartOptions.value = setChartOptions();
    // });
    return { chartOptionsBase };
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
<style scoped></style>

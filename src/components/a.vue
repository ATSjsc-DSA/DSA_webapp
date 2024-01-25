<script setup>
import barChartBase from './barChartBase.vue';
import TSA_api from '@/api/tsa_api';
import _ from 'lodash';

// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

const baseValueChart = {
  Key: [],
  Require: [],
  Estimated: [],
};
const interval = ref(null);
const chartBlock1 = ref(baseValueChart);

const getchartData = async () => {
  try {
    const res = await TSA_api.getSpsCodeInfo('F81');
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      chartBlock1.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const debouncedGetChartData = _.debounce(getchartData, 500);

onMounted(async () => {
  await getchartData();
  interval.value = setInterval(() => {
    debouncedGetChartData();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <Toast></Toast>
  <div class="sps-block">
    <barChartBase :chartData="chartBlock1" class="chart"></barChartBase>
  </div>
</template>
<style lang="scss" scoped>
.sps-block {
  position: relative;
  // padding: 0.5rem;
  width: 100%;
}
.chart {
  height: 100%;
}
</style>
// function getFeaturesLine(param) { // const featuresline = []; // param.forEach((line) => { // console.log(line.geo,
'geo'); // // const lineStringnpCoords = line.geo.map((coord) => fromLonLat(coord)); // // const lineString = new
LineString(lineStringnpCoords); // // const midPoint = fromLonLat([((line.geo[0][0] + line.geo[1][0]) / 2,
(line.geo[1][0] + line.geo[1][1]) / 2)]); // // const lineStringCoords = [fromLonLat(line.geo[0]), midPoint,
fromLonLat(line.geo[1])]; // var line = turf.lineString([line.geo[0], line.geo[1]]); // var d =
turf.distance(line.geo[0], line.geo[1]); // var pMid = turf.along(line, d / 2); // var lineBearing =
turf.bearing(line.geo[0], line.geo[1]); // var centerPoint = turf.destination(pMid, 2 * d, lineBearing - 90); // var r =
turf.distance(centerPoint, turf.point(line.geo[0])); // var bear1 = turf.bearing(centerPoint, turf.point(line.geo[0]));
// var bear2 = turf.bearing(centerPoint, turf.point(line.geo[1])); // var arc2 = turf.lineArc(centerPoint, r, bear2,
bear1, { steps: 256 }); // var arcFeature2 = new GeoJSON().readFeatures(arc2, { // featureProjection: 'EPSG:3857', //
dataProjection: 'EPSG:4326', // }); // arcFeature2[0].setStyle( // new Style({ // stroke: new Stroke({ // color:
'#FF0000', // width: 1, // lineDash: [5, 2], // lineCap: 'butt', // }), // }), // ); //
featuresline.push(arcFeature2[0]); // }); // return featuresline; // } // // var p1LonLat = [104.784, -3.03]; // var
p2LonLat = [103.591, -1.625]; // var line = turf.lineString([p1LonLat, p2LonLat]); // var d = turf.distance(p1LonLat,
p2LonLat); // var pMid = turf.along(line, d / 2); // var lineBearing = turf.bearing(p1LonLat, p2LonLat); // var
centerPoint = turf.destination(pMid, 2 * d, lineBearing - 90); // var r = turf.distance(centerPoint,
turf.point(p1LonLat)); // var bear1 = turf.bearing(centerPoint, turf.point(p1LonLat)); // var bear2 =
turf.bearing(centerPoint, turf.point(p2LonLat)); // var arc2 = turf.lineArc(centerPoint, r, bear2, bear1, { steps: 256
}); // var arcFeature2 = new ol.format.GeoJSON().readFeatures(arc2, { // featureProjection: 'EPSG:3857', //
dataProjection: 'EPSG:4326', // }); // arcFeature2[0].setStyle( // new ol.style.Style({ // stroke: new ol.style.Stroke({
// color: '#FF0000', // width: 1, // lineDash: [5, 2], // lineCap: 'butt', // }), // }), // ); //
vectorSource.addFeature(arcFeature2[0]); // // function getFeaturesLine(param) { // const featuresline = []; //
param.forEach((line) => { // // console.log(line.geo[0]); // // console.log(line.geo[1]); // // var p1LonLat = [104.784,
-3.03]; // // var p2LonLat = [103.591, -1.625]; // // console.log(p1LonLat); // // console.log(p2LonLat); // // var line
= turf.lineString([p1LonLat, p2LonLat]); // // console.log(line, 'line'); // // // var d =
turf.distance(turf.point(line.geo[0]), turf.point(line.geo[1])); // // var d = turf.distance(p1LonLat, p2LonLat); // //
console.log(d, 'd'); // // var pMid = turf.along(line, d / 2); // // console.log(pMid, 'pMid'); // // var lineBearing =
turf.bearing(line.geo[0], line.geo[1]); // // var centerPoint = turf.destination(pMid, 2 * d, lineBearing - 90); // //
var r = turf.distance(centerPoint, turf.point(line.geo[0])); // // var bear1 = turf.bearing(centerPoint,
turf.point(line.geo[0])); // // var bear2 = turf.bearing(centerPoint, turf.point(line.geo[1])); // // var arc2 =
turf.lineArc(centerPoint, r, bear2, bear1, { steps: 256 }); // // console.log(arc2, 'arc2'); // // const // const
geoJsonFeature = { // type: 'Feature', // geometry: { // type: 'LineString', // coordinates: line.geo.map((coord) =>
fromLonLat(coord)), // }, // properties: { // name: line.name, // id: 'line', // subData: { // name: line.name, // id:
'line', // }, // lineColor: greenColor, // }, // }; // featuresline.push(new GeoJSON().readFeature(geoJsonFeature)); //
}); // console.log(featuresline, 'featuresline'); // return featuresline; // } // heatmapLayer.value = new Heatmap({ //
source: source500kV, // blur: 10, // radius: 10, // gradient: ['red', 'yellow', 'green'], // // weight: function
(feature) { // // // Có thể tùy chỉnh giá trị trọng số của từng điểm // // return 1; // // }, // });

    // pointsLayer.value = new WebGLPointsLayer({
    //   source: source500kV2,
    //   style: {
    //     'circle-radius': 16,
    //     'circle-fill-color': ['match', ['get', 'status'], 1, 'red', 'green'],
    //     'circle-blur': 1,
    //     'circle-rotate-with-view': false,
    //     'circle-displacement': [0, 0],
    //     'circle-opacity': ['interpolate', ['linear'], ['get', 'population'], 40000, 0.6, 2000000, 0.92],
    //   },
    // });
    // // map.value.addLayer(pointsLayer.value);
import { defineStore } from 'pinia';
import DSA_api from '@/api/dsa_api';

// Openlayer
import BingMaps from 'ol/source/BingMaps.js';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import View from 'ol/View';

import LineString from 'ol/geom/LineString';

export const useMapStore = defineStore('map_Store', () => {
  // setup data map

  const subData = ref();

  const popup = ref(null);
  const panel = ref(null);

  const map = ref(null);

  //layer500
  const featuresSubLine = ref([]);
  const layerSubLine = ref(null);

  //config
  const blueLayer = 'rgba(0, 0, 255, 0.2)';
  const aquaLayer = 'rgba(0, 255, 255, 0.2)';
  const greenLayer = 'rgba(11, 185, 11, 0.2)';
  const yellowLayer = 'rgba(255, 255, 102, 0.2)';
  const redLayer = 'rgba(255, 0, 0, 0.5)';

  const greenLineColor = '#28a745';
  const orangeLineColor = '#fb5630';
  const redLineColor = '#d01e39';

  const greenColor = '#28a745';
  const yellowColor = '#ffb40a';
  const redColor = '#d01e39';

  const Point500Color = 'black';
  const Point345Color = '#142b8e';
  const Point287Color = '#658bca';
  const Point230Color = '#007bff';
  const Point138Color = '#1f8597';
  const Point115Color = '#1166bb';
  const Point20Color = '#1166bb';

  const viewMap_config = new View({
    zoom: 4.3,
    maxZoom: 16,
    center: fromLonLat([-102.198, 37.055]),
  });

  const iconStyle = new Style({
    image: new Icon({
      src: './map/pngwing.png',
      width: 25,
      height: 25,
    }),
  });

  const voltageLimits = ref({
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
  });
  const loadingLimits = ref({
    step1: 0,
    step2: 0,
  });
  //common function
  function getFeaturesPoint(param, type, visible = false) {
    const featuresPoin = [];
    param.forEach((sub) => {
      featuresPoin.push(
        new Feature({
          geometry: new Point(fromLonLat(sub.geo)),
          name: sub.name,
          id: 'sub',
          code: sub.code,
          subData: {
            name: sub.name,
            id: 'sub',
          },
          status: 0,
          zIndex: 1,
          type: type,
          visible: visible,
        }),
      );
    });
    return featuresPoin;
  }

  function getFeaturesLine(param, type, visible = false) {
    const featuresline = [];
    if (param) {
      param.forEach((line) => {
        const midPoint = [(line.geo[0][0] + line.geo[1][0]) / 2, (line.geo[0][1] + line.geo[1][1]) / 2];

        // Tính toán điểm thứ ba để tạo góc 30 độ
        const angle = Math.atan2(line.geo[1][1] - line.geo[0][1], line.geo[1][0] - line.geo[0][0]);
        const distance = Math.sqrt(
          Math.pow(line.geo[1][0] - line.geo[0][0], 2) + Math.pow(line.geo[1][1] - line.geo[0][1], 2),
        );
        const thirdPointX = midPoint[0] + (distance / 2) * Math.cos(angle + Math.PI / 3); // Góc 30 độ
        const thirdPointY = midPoint[1] + (distance / 2) * Math.sin(angle + Math.PI / 8); // Góc 30 độ

        const lineStringCoords = [line.geo[0], [thirdPointX, thirdPointY], line.geo[1]];
        featuresline.push(
          new Feature({
            geometry: new LineString(lineStringCoords.map((coord) => fromLonLat(coord))),
            name: line.name,
            id: 'line',
            subData: {
              name: line.name,
              id: 'line',
              desc: line.desc,
            },
            lineColor: greenColor,
            type: type,
            visible: visible,
            zIndex: 2,
          }),
        );
      });
    }
    return featuresline;
  }

  function getFeatureStyle(pointColor, feature) {
    const id = feature.get('id');
    const subStrokeColor = () => {
      switch (feature.get('status')) {
        case 1:
          return blueLayer;
        case 2:
          return aquaLayer;
        case 4:
          return yellowLayer;
        case 5:
          return redLayer;
        default:
          return greenLayer;
      }
    };
    const subFillColor = () => {
      switch (feature.get('type')) {
        case 500:
          return Point500Color;
        case 345:
          return Point345Color;
        case 287:
          return Point287Color;
        case 230:
          return Point230Color;
        case 138:
          return Point138Color;
        case 115:
          return Point115Color;
        default:
          return Point20Color;
      }
    };
    if (feature.getProperties().visible) {
      const styleOptions =
        id === 'sub'
          ? {
              image: new CircleStyle({
                radius: 4,
                fill: new Fill({
                  color: subFillColor(),
                }),
                stroke: new Stroke({
                  color: subStrokeColor(),
                  width: 36,
                }),
              }),
              zIndex: feature.get('zIndex'),
            }
          : {
              stroke: new Stroke({
                color: feature.get('lineColor') !== null ? feature.get('lineColor') : greenColor,
                width: 2,
                lineCap: 'round',
                lineJoin: 'round',
                blur: 5,
              }),
              zIndex: feature.get('zIndex'),
            };

      return new Style(styleOptions);
    } else {
      return null;
    }
  }

  function addLayerBase(layer) {
    console.log(layer, 'layer');
    layerSubLine.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        const type = feature.get('type');
        if (type === layer) {
          feature.set('visible', true);
        }
      });
  }

  function removeLayerBase(layer) {
    layerSubLine.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        const type = feature.get('type');
        if (type === layer) {
          feature.set('visible', false);
        }
      });
  }
  function getStep(x) {
    if (x < voltageLimits.value.step1) {
      return 1;
    } else if (x < voltageLimits.value.step2) {
      return 2;
    } else if (x < voltageLimits.value.step3) {
      return 3;
    } else if (x < voltageLimits.value.step4) {
      return 4;
    } else {
      return 5;
    }
  }
  function setLineColor(x) {
    if (x < loadingLimits.value.step1) {
      return greenLineColor;
    } else if (x < voltageLimits.value.step2) {
      return orangeLineColor;
    } else {
      return redLineColor;
    }
  }
  //subData get API
  async function getListSub() {
    try {
      const res = await DSA_api.getListSub();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        featuresSubLine.value = [
          ...featuresSubLine.value,
          ...getFeaturesPoint(res.data.payload.sub500kV, 500, true),
          ...getFeaturesPoint(res.data.payload.sub345kV, 345),
          ...getFeaturesPoint(res.data.payload.sub287kV, 287),
          ...getFeaturesPoint(res.data.payload.sub230kV, 230),
          ...getFeaturesPoint(res.data.payload.sub138kV, 138),
          ...getFeaturesPoint(res.data.payload.sub115kV, 115),
          ...getFeaturesPoint(res.data.payload.sub20kV, 20),
        ];
        // features230.value = [...features230.value, ...getFeaturesPoint(res.data.payload.sub230kV)];
      }
    } catch (error) {
      throw error;
    }
  }
  async function getListLine() {
    try {
      const res = await DSA_api.getListLine();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        featuresSubLine.value = [
          ...featuresSubLine.value,
          ...getFeaturesLine(res.data.payload.line500kV, 500, true),
          ...getFeaturesLine(res.data.payload.line345kV, 345),
          ...getFeaturesLine(res.data.payload.line287kV, 287),
          ...getFeaturesLine(res.data.payload.line230kV, 230),
          ...getFeaturesLine(res.data.payload.line138kV, 138),
          ...getFeaturesLine(res.data.payload.line115kV, 115),
          ...getFeaturesLine(res.data.payload.line20kV, 20),
        ];
      }
    } catch (error) {
      throw error;
    }
  }
  // *****standard*****
  async function voltageStandards() {
    try {
      resetLineSubColor();
      const res = await DSA_api.voltageStandards();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        voltageLimits.value = res.data.payload.evaluation;
        changeStandardsHighLowVoltage(res.data.payload.value);
      }
    } catch (error) {
      throw error;
    }
  }
  async function ssrStandards() {
    try {
      resetLineSubColor();
      const res = await DSA_api.ssrStandards();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        changeStandardsSSR(res.data.payload.value);
      }
    } catch (error) {
      throw error;
    }
  }
  async function lineLoadingStandards() {
    try {
      resetLineSubColor();
      const res = await DSA_api.lineLoadingStandards();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        loadingLimits.value = res.data.payload.evaluation;
        changeStandardsLineLoading(res.data.payload.value);
      }
    } catch (error) {
      throw error;
    }
  }
  //method layer Init
  function addLayerInit() {
    const sourceSubline = new VectorSource({
      features: featuresSubLine.value,
    });
    layerSubLine.value = new VectorLayer({
      source: sourceSubline,
      style: getFeatureStyle.bind(null, Point230Color),
    });

    map.value.addLayer(layerSubLine.value);
  }

  // voltageStandards
  function changeStandardsHighLowVoltage(param) {
    layerSubLine.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        if (feature.get('id') === 'sub') {
          param.forEach((sub) => {
            if (sub.name === feature.get('name')) {
              feature.set('status', getStep(sub.value));
              feature.set('zIndex', 10);
            }
          });
        }
      });
  }
  // SSR
  function changeStandardsSSR(param) {
    layerSubLine.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        if (feature.get('id') === 'sub') {
          param.forEach((sub) => {
            if (sub.name === feature.get('name')) {
              feature.set('status', 5);
              feature.set('zIndex', 10);
            }
          });
        }
      });
  }
  // lineloading
  function changeStandardsLineLoading(param) {
    console.log(param);
    layerSubLine.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        if (feature.get('id') === 'line') {
          console.log(feature.get('name'), 'feature');
          param.forEach((sub) => {
            console.log(sub, 'sub');
            if (sub.name === feature.get('name')) {
              console.log('avc');
              feature.set('lineColor', 'red');
              feature.set('zIndex', 10);
            }
          });
        }
      });
  }

  function resetLineSubColor() {
    if (layerSubLine.value) {
      layerSubLine.value
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          const id = feature.get('id');
          if (id === 'line') {
            feature.set('lineColor', null);
          }
        });
      layerSubLine.value
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          const id = feature.get('id');
          if (id === 'sub') {
            feature.set('status', null);
          }
        });
    }
  }

  return {
    subData,
    viewMap_config,
    popup,
    panel,
    map,
    iconStyle,
    getListSub,
    getListLine,
    addLayerInit,
    addLayerBase,
    removeLayerBase,
    changeStandardsLineLoading,
    voltageStandards,
    ssrStandards,
    lineLoadingStandards,
  };
});

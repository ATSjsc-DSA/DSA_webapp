import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

// Openlayer
import BingMaps from 'ol/source/BingMaps.js';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import MultiLineString from 'ol/geom/MultiLineString';
import Control from 'ol/control/Control';
import LineString from 'ol/geom/LineString';

export const useMapStore = defineStore('map_Store', () => {
  // setup data map

  const subData = ref();

  const popup = ref(null);
  const panel = ref(null);

  const map = ref(null);

  //layer500
  const features500 = ref([]);
  const layer500kV = ref(null);

  //config
  const greenColor = '#28a745';
  const yellowColor = '#ffb40a';
  const redColor = '#d01e39';

  const Point500Color = '#f5385a';

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
  //common function
  function getFeaturesPoint(param) {
    const featuresPoin = [];
    param.forEach((sub) => {
      featuresPoin.push(
        new Feature({
          geometry: new Point(fromLonLat(sub.geo)),
          name: sub.name,
          id: 'sub',
          subData: {
            name: sub.name,
            id: 'sub',
          },
        }),
      );
    });
    return featuresPoin;
  }
  function getFeaturesLine(param) {
    const featuresline = [];
    param.forEach((line) => {
      const lineStringCoords = line.geo.map((coord) => fromLonLat(coord));
      featuresline.push(
        new Feature({
          geometry: new LineString(lineStringCoords),
          name: line.name,
          id: 'line',
          subData: {
            name: line.name,
            id: 'line',
          },
          lineColor: greenColor,
        }),
      );
    });
    return featuresline;
  }

  function getFeatureStyle(pointColor, feature) {
    const id = feature.get('id');
    if (id === 'sub') {
      // Style for Point
      return new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'white' }),
          stroke: new Stroke({ color: pointColor, width: 5 }),
        }),
      });
    } else if (id === 'line') {
      // Style for line
      const lineColor = feature.get('lineColor') !== null ? feature.get('lineColor') : greenColor;
      return new Style({
        stroke: new Stroke({
          color: lineColor,
          width: 3,
        }),
      });
    }
  }
  //subData
  async function getListSub() {
    try {
      const res = await DSA_api.getListSub();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        features500.value = [...features500.value, ...getFeaturesPoint(res.data.payload.sub500kV)];
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
        features500.value = [...features500.value, ...getFeaturesLine(res.data.payload.line500kV)];
      }
    } catch (error) {
      throw error;
    }
  }

  function addLayer500kV() {
    const source500kV = new VectorSource({
      features: features500.value,
    });
    layer500kV.value = new VectorLayer({
      source: source500kV,
      style: getFeatureStyle.bind(null, Point500Color),
    });
    map.value.addLayer(layer500kV.value);
  }

  function removeLayer500kV() {
    if (layer500kV.value) {
      map.value.getLayers().remove(layer500kV.value);
      layer500kV.value.dispose();
      layer500kV.value = null;
    }
  }
  function changeStandardsLineLoading() {
    layer500kV.value
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        const id = feature.get('id');
        if (id === 'line') {
          feature.set('lineColor', redColor);
        }
      });
  }
  function resetLineColor() {
    console.log('resetLineColor');
    if (layer500kV.value) {
      layer500kV.value
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          const id = feature.get('id');
          if (id === 'line') {
            feature.set('lineColor', null);
          }
        });

      // call ol.layer.Layer#changed update layer
      // layer500kV.value.changed();
    }
  }

  return {
    subData,
    viewMap_config,
    popup,
    panel,
    map,
    iconStyle,
    layer500kV,
    getListSub,
    getListLine,
    addLayer500kV,
    removeLayer500kV,
    changeStandardsLineLoading,
    resetLineColor,
  };
});

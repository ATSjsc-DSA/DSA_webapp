import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

// Openlayer
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
  const features500 = ref([]);
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
  //subData
  const layer500kV = ref(null);
  async function getListSub() {
    try {
      const res = await DSA_api.getListSub();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        getFeaturesSub500kV(res.data.payload.sub500kV);
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
        getFeaturesLine500kV(res.data.payload.line500kV);
      }
    } catch (error) {
      throw error;
    }
  }
  function getFeaturesSub500kV(param) {
    param.forEach((sub) => {
      features500.value.push(
        new Feature({
          geometry: new Point(fromLonLat(sub.geo)),
          name: sub.name,
          id: 'point',
          subData: {
            name: sub.name,
            id: sub.id,
          },
        }),
      );
    });
  }
  function getFeaturesLine500kV(param) {
    param.forEach((line) => {
      const lineStringCoords = line.geo.map((coord) => fromLonLat(coord));
      features500.value.push(
        new Feature({
          geometry: new LineString(lineStringCoords),
          name: line.name,
          id: 'line',
          subData: {
            name: line.name,
            id: 'line',
          },
        }),
      );
    });
  }
  function addLayer500kV() {
    const source500kV = new VectorSource({
      features: features500.value,
    });
    layer500kV.value = new VectorLayer({
      source: source500kV,
      style: function (feature) {
        console.log(feature, 'feature');
        if (feature.values_.id === 'point') {
          return iconStyle;
        } else if (feature.values_.id === 'line') {
          return new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          });
        }
      },
    });
    map.value.addLayer(layer500kV.value);
  }

  function removeLayer500kV() {
    if (layer500kV.value) {
      // Xóa layer khỏi danh sách layers của bản đồ
      map.value.getLayers().remove(layer500kV.value);
      // Dispose of the layer to release resources
      layer500kV.value.dispose();
      layer500kV.value = null;
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
  };
});

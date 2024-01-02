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

export const useMapStore = defineStore('map_Store', () => {
  // setup data map

  const subData = ref();

  const popup = ref(null);
  const panel = ref(null);

  const map = ref(null);
  const featuresSub500 = ref([]);

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
  const layerSub500kV = ref(null);

  async function getListSub() {
    try {
      const res = await DSA_api.getListSub();
      if (!res.data.success) {
        throw res.data.error;
      } else {
        getFeatures500kV(res.data.payload.sub500kV);
      }
    } catch (error) {
      throw error;
    }
  }
  function getFeatures500kV(param) {
    param.forEach((sub) => {
      featuresSub500.value.push(
        new Feature({
          geometry: new Point(fromLonLat([sub[0], sub[1]])),
          name: sub[3],
          id: sub[2],
          subData: {
            name: sub[3],
            id: sub[2],
          },
        }),
      );
    });
  }
  function addLayer500kV() {
    const sourceSub500kV = new VectorSource({
      features: featuresSub500.value,
    });
    layerSub500kV.value = new VectorLayer({
      source: sourceSub500kV,
      style: iconStyle,
    });
    map.value.addLayer(layerSub500kV.value);
  }

  function removeLayer500kV() {
    if (layerSub500kV.value) {
      // Xóa layer khỏi danh sách layers của bản đồ
      map.value.getLayers().remove(layerSub500kV.value);
      // Dispose of the layer to release resources
      layerSub500kV.value.dispose();
      layerSub500kV.value = null;
    }
  }

  return {
    subData,
    viewMap_config,
    popup,
    panel,
    map,
    iconStyle,
    layerSub500kV,
    getListSub,
    addLayer500kV,
    removeLayer500kV,
  };
});

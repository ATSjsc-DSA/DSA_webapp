<script setup>
import { onMounted, ref } from 'vue';
import mapMultiselect from './mapMultiselect.vue';
import { useMapStore } from '@/store';
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
// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const mapStore = useMapStore();
const toast = useToast();
// setup data map
const subDataClick = ref();
const olMap = ref(null);

const features = ref([]);
// set layer

//method

const getListSub = async () => {
  try {
    await mapStore.getListSub();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getListLine = async () => {
  try {
    await mapStore.getListLine();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  await getListSub();
  await getListLine();
  // Create a map with the tile and vector layers
  mapStore.map = new Map({
    layers: [
      new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: 'AjXb8jlJMD-Q4iyDA1defb1sCi4ZDUJEaoqgwLNi4CnucFBmWea61Q2bJrLi_Zba',
          imagerySet: 'RoadOnDemand',
        }),
      }),
    ],
    target: olMap.value,
    view: mapStore.viewMap_config,
  });

  //Add Control panel
  mapStore.panel = new Control({
    element: document.getElementById('panel'),
  });
  mapStore.map.addControl(mapStore.panel);

  // Create an overlay for the popup element
  mapStore.popup = new Overlay({
    element: document.getElementById('popup'),
    positioning: 'bottom-center',
    autoPan: {
      animation: {
        duration: 250,
      },
    },
    stopEvent: false,
    offset: [0, -10],
  });
  //Add overlay popup
  mapStore.map.addOverlay(mapStore.popup);
  // Add a click event listener to the map
  mapStore.map.on('click', (e) => {
    close_popup();
    mapStore.map.forEachFeatureAtPixel(e.pixel, (feature) => {
      subDataClick.value = feature.values_.subData;
      mapStore.popup.setPosition(e.coordinate);
    });
  });
});

function close_popup() {
  if (mapStore.popup) {
    mapStore.popup.setPosition(undefined);
  }
}

const selectedSubs = ref([]);

const changeSelecet = (dataFocus, dataArray) => {
  selectedSubs.value = dataArray;
  if (dataFocus.added) {
    switch (dataFocus.valueFocus.value) {
      case 500:
        mapStore.addLayer500kV();
        break;
      case 345:
        // addLayer500kV();
        break;
      case 287:
        break;
      case 220:
        break;
      case 138:
        break;
      case 115:
        break;
      case 20:
        break;
      case 'LL':
        mapStore.changeStandardsLineLoading();
        break;
    }
  } else {
    switch (dataFocus.valueFocus.value) {
      case 500:
        mapStore.removeLayer500kV();
        break;
      case 345:
        break;
      case 287:
        break;
      case 220:
        break;
      case 138:
        break;
      case 115:
        break;
      case 20:
        break;
      case 'LL':
        mapStore.resetLineColor();
        break;
    }
  }
};
</script>

<template>
  <div class="map" ref="olMap"></div>
  <div id="panel" class="ol-panel">
    <div class="ol-panel_checkbox">
      <mapMultiselect :selectedSubs="selectedSubs" @changeSelecet="changeSelecet"></mapMultiselect>
    </div>
  </div>
  <div id="popup" class="ol-popup">
    <div v-if="subDataClick" class="ol-popup_card">
      <div class="ol-popup_card_maintitle">
        <span>{{ subDataClick.name }}</span>
      </div>
      <Tag :severity="subDataClick.id === 'line' ? 'info' : 'success'" :value="subDataClick.id"></Tag>
    </div>
  </div>
  <Toast></Toast>
</template>

<style lang="scss" scoped>
@mixin panel() {
  position: absolute;
  right: 0px;
  top: 0px;
}
.ol-panel {
  /* Các thiết lập khác... */
  .ol-panel_button {
    @include panel;
  }
  .ol-panel_checkbox {
    @include panel;
    // display: none;
    opacity: 0.6;
    border-radius: 0px;
  }
}
.ol-popup {
  background-color: white;
  padding: 10px;
  width: fit-content;
  border-radius: 10px;
  .ol-popup_card {
    font-size: small;
    padding: 0px;
    .ol-popup_card_maintitle {
      white-space: nowrap;
      margin-bottom: 0.5rem;
    }
  }
}
.map {
  // height: calc(100vh - 154px);
  height: 100%;
  width: 100%;
}
</style>

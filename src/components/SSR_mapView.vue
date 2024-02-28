<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import mapMultiselect from './mapMultiselect.vue';
import { useMapStore } from '@/store';
import mapCheckBoxLayer from './mapCheckBoxLayer.vue';
// Openlayer
import BingMaps from 'ol/source/BingMaps.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import Map from 'ol/Map';
import Control from 'ol/control/Control';
// primeVue
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Tag from 'primevue/tag';
// define
const mapStore = useMapStore();
const toast = useToast();
// setup data map
const subDataClick = ref();
const olMap = ref(null);
const popup = ref(null);
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
const close_popup = () => {
  if (popup.value) {
    popup.value.setPosition(undefined);
  }
};
//mouted
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
  mapStore.addLayerInit();
  //Add Control panel
  const panelLayer = new Control({
    element: document.getElementById('panelLayer'),
  });
  mapStore.map.addControl(panelLayer);

  // Create an overlay for the popup element
  popup.value = new Overlay({
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
  mapStore.map.addOverlay(popup.value);
  // Add a click event listener to the map
  mapStore.map.on('click', (e) => {
    close_popup();
    mapStore.map.forEachFeatureAtPixel(e.pixel, (feature) => {
      subDataClick.value = feature.values_.subData;
      popup.value.setPosition(e.coordinate);
    });
  });
  mapStore.ssrStandards();
});

const selectedLayer = ref([500]);
const changeSelecetLayer = (dataFocus, dataArray) => {
  selectedLayer.value = dataArray;
  if (dataFocus.added) {
    switch (dataFocus.valueFocus) {
      case 500:
        mapStore.addLayerBase(500);
        break;
      case 345:
        mapStore.addLayerBase(345);
        break;
      case 287:
        mapStore.addLayerBase(287);
        break;
      case 230:
        mapStore.addLayerBase(230);
        break;
      case 138:
        mapStore.addLayerBase(138);
        break;
      case 115:
        mapStore.addLayerBase(115);
        break;
      case 20:
        mapStore.addLayerBase(20);
        break;
    }
  } else {
    switch (dataFocus.valueFocus) {
      case 500:
        mapStore.removeLayerBase(500);
        break;
      case 345:
        mapStore.removeLayerBase(345);
        break;
      case 287:
        mapStore.removeLayerBase(287);
        break;
      case 230:
        mapStore.removeLayerBase(230);
        break;
      case 138:
        mapStore.removeLayerBase(138);
        break;
      case 115:
        mapStore.removeLayerBase(115);
        break;
      case 20:
        mapStore.removeLayerBase(20);
        break;
    }
  }
};
// onUnmounted(() => {
//   // reset component when unmounted
//   // mapStore.removeMap();
// });
</script>

<template>
  <div class="map" ref="olMap"></div>
  <div id="panelLayer" class="ol-panel-layer">
    <mapCheckBoxLayer :selectedSubs="selectedLayer" @changeSelecetLayer="changeSelecetLayer"></mapCheckBoxLayer>
  </div>
  <div id="popup" class="ol-popup">
    <div v-if="subDataClick" class="ol-popup_card">
      <div class="ol-popup_card_maintitle">
        <span>{{ subDataClick.name }}</span>
        <br />
        <span>{{ subDataClick.desc }}</span>
      </div>
      <Tag :severity="subDataClick.id === 'line' ? 'info' : 'success'" :value="subDataClick.id" class="w-full"></Tag>
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
  .ol-panel_button {
    @include panel;
  }
  .ol-panel_checkbox {
    @include panel;
    opacity: 0.6;
    border-radius: 0px;
  }
}
.ol-panel-layer {
  position: absolute;
  right: 0px;
  bottom: 0px;
  border-radius: 0;
  opacity: 0.92;
}
.ol-popup {
  background-color: var(--surface-ground);
  padding: 10px;
  width: fit-content;
  border-radius: 10px;
  .ol-popup_card {
    font-size: small;
    padding: 0px;
    &::after {
      border-top-color: var(--surface-ground);
    }
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

<template>
  <div class="grid w-full h-full">
    <div class="col-3 h-full">
      <mapView />
    </div>
    <div class="col-3 h-full">
      <div class="flex flex-column gap-3 h-full">
        <projectTreeWidget
          v-bind:application-draggable="applicationDraggable"
          v-bind:vsa-curve-draggable="vsaCurveDraggable"
          v-bind:tsa-curve-draggable="tsaCurveDraggable"
          @onStartDragNode="onStartDragNode"
          @onRemoveWidget="onRemoveChartComponent()"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="w-full h-full flex gap-3">
        <div
          class="w-full h-full"
          :class="{ 'border-2 border-gray-300': chartComponentArr.length === 0 }"
          @dragleave.prevent="canDropChartComponent = false"
          @dragenter.prevent
          @dragover.prevent="dragOverChartComponent"
          @drop.prevent="onDropChartComponent"
        >
          <!-- <div ref="grid" class="grid-stack bg-blue-100"></div> -->
          <div
            v-if="chartComponentArr.length === 0"
            class="flex h-full justify-content-center align-items-center"
            :class="{ 'bg-white font-semibold': canDropChartComponent }"
          >
            Drag component at right to here !
          </div>
          <div class="grid-stack" style="margin: -0.7rem">
            <div
              v-for="w in chartComponentArr"
              :id="w.id"
              :key="w.id"
              class="grid-stack-item"
              :gs-x="w.x"
              :gs-y="w.y"
              :gs-w="w.w"
              :gs-h="w.h"
              :gs-id="w.id"
            >
              <div class="grid-stack-item-content">
                <chartComponent
                  :nodeDrag="nodeDrag"
                  :chartId="w.id"
                  :typeChart="w.typeChart"
                  :muiltiSelect="w.muiltiSelect"
                  @addNodeTreeSelectd="addNodeTreeSelectd"
                  @removeNodeTreeSelected="removeNodeTreeSelected"
                  @onRemoveWidget="onRemoveChartComponent(w)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="application-right-side-custom">
          <div class="flex flex-column gap-3 justify-content-center align-items-center sticky" style="top: 6rem">
            <div
              v-tooltip.left="'Compact Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-primary"
              :style="styleButtonComponents"
              placeholder="Left"
            >
              <i class="pi pi-sync" style="font-size: 1rem" @click="compactGrid" />
            </div>
            <Divider />
            <div
              v-tooltip.left="'Appplication Radar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('appRadar')"
            >
              <i class="pi pi-chart-pie" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">RADAR</div>
            </div>
            <div
              v-tooltip.left="'Appplication Bar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('appBar')"
            >
              <i class="pi pi-fw pi-chart-bar" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">BAR</div>
            </div>

            <div
              v-tooltip.left="'VSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('vsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">VSA</div>
            </div>
            <div
              v-tooltip.left="'TSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap"
              :style="styleButtonComponents"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragChartTypeStart('tsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">TSA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, render } from 'vue';

import mapView from '@/components/mapView.vue';
import projectTreeWidget from './projectTreeWidget.vue';

import chartComponent from './chartComponent.vue';
import { VsaApi, TsaApi, CommonApi } from './api';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const chartComponentGrid = ref(null);

onMounted(async () => {
  chartComponentGrid.value = GridStack.init({
    float: false,
    cellHeight: '10rem', // row's height
    // row: 6, max row
  });

  chartComponentGrid.value.on('change', onChangeChartComponent);
});

const styleButtonComponents = ref({
  textAlign: 'center',
  height: 'auto',
  backgroundColor: 'var(--surface-overlay)',
  color: 'var(--text-color)',
  border: '1px solid gray',
  width: '3rem',
});

// -- drag drop ---
const nodeDrag = ref({});
const onStartDragNode = (evt, node) => {
  evt.dataTransfer.dropEffect = 'move';
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('itemDrag', node.label);
  nodeDrag.value = node;
};

// vsa caseType
const getVsaCaseTypeValue = (caseType) => {
  switch (caseType) {
    case 0:
      return 'N:1';
    case 1:
      return 'N:2';
    case 2:
      return 'Base';
    default:
      return caseType;
  }
};
const getVsaCaseTypeSeverity = (caseType) => {
  switch (caseType) {
    case 0:
      return 'info';
    case 1:
      return 'warning';
    case 2:
      return 'success';
    default:
      return '';
  }
};

// ---- tsa vsa type curve
const getVsaCurveTypeValue = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'P';
    case 1:
      return 'Q';
    case 2:
      return 'U';
    case 3:
      return 'I';
    default:
      return curveType;
  }
};
const getVsaCurveTypeSeverity = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'primary';
    case 1:
      return 'secondary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    default:
      return '';
  }
};

const getTsaCurveTypeValue = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'Voltage';
    case 1:
      return 'Frequency';
    case 2:
      return 'ASngle';
    case 3:
      return 'ActivePower';
    case 4:
      return 'ReactivePower';
    case 5:
      return 'RotorAngle';
    case 6:
      return 'Elect P';
    case 7:
      return 'Elect Q';
    case 8:
      return 'MechQ';
    case 9:
      return 'Efd';
    default:
      return curveType;
  }
};
const getTsaCurveTypeSeverity = (curveType) => {
  if (!curveType) {
    return '';
  }
  switch (curveType) {
    case 0:
      return 'primary';
    case 1:
      return 'secondary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    case 4:
      return 'contrast';
    case 5:
      return 'danger';
    case 6:
      return 'success';
    case 7:
      return 'success';
    case 8:
      return 'secondary';
    case 9:
      return 'info';
    default:
      return '';
  }
};
const addNodeTreeSelectd = (key) => {
  treeSelected.value[key] = true;
};
const removeNodeTreeSelected = (key) => {
  treeSelected.value[key] = false;
};
// ---  drag drop chart type

const canDropChartComponent = ref(false);
const typeChartDrag = ref();
const applicationDraggable = ref(false);
const vsaCurveDraggable = ref(false);
const tsaCurveDraggable = ref(false);

const compactGrid = () => {
  chartComponentGrid.value.compact();
};

const handleDragChartTypeStart = (typeChart) => {
  typeChartDrag.value = typeChart;
};
const dragOverChartComponent = () => {
  canDropChartComponent.value = true;
};
const onDropChartComponent = () => {
  canDropChartComponent.value = false;

  if (typeChartDrag.value === 'appBar') {
    applicationDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, false);
  }
  if (typeChartDrag.value === 'appRadar') {
    applicationDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, false);
  }
  if (typeChartDrag.value === 'vsa') {
    vsaCurveDraggable.value = true;
    addNewChartComponent(typeChartDrag.value, true);
  }
  if (typeChartDrag.value === 'tsa') {
    tsaCurveDraggable.value = true;

    addNewChartComponent(typeChartDrag.value, true);
  }
  typeChartDrag.value = undefined;
};

// --- chart component
const chartComponentArr = ref([]);

const addNewChartComponent = async (typeChart, muiltiSelect) => {
  const node = {
    w: 6,
    h: 3,
    id: typeChart + '_' + chartComponentArr.value.length,
    typeChart: typeChart,
    muiltiSelect: muiltiSelect,
  };
  chartComponentArr.value.push(node);

  await nextTick(() => {
    chartComponentGrid.value.makeWidget(`#${node.id}`);
    chartComponentGrid.value.update(document.querySelector(`#${node.id}`), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
  });
};

const onRemoveChartComponent = (widget) => {
  const index = chartComponentArr.value.findIndex((w) => w.id == widget.id);
  chartComponentArr.value.splice(index, 1);
  const selector = `#${widget.id}`;
  chartComponentGrid.value.removeWidget(selector, false);
};
const onChangeChartComponent = (event, changeItems) => {
  changeItems.forEach((item) => {
    const widget = chartComponentArr.value.find((w) => w.id == item.id);
    if (!widget) {
      console.warn('Widget not found: ' + item.id);
      return;
    }
    widget.x = item.x;
    widget.y = item.y;
    widget.w = item.w;
    widget.h = item.h;
  });
};
</script>
<style>
@import 'gridstack/dist/gridstack.min.css';

.textUnActive {
  color: var(--surface-500);
}
.p-treenode-label {
  width: 100%;
}

.disabled-drag-item {
  opacity: 0.5;
  pointer-events: none;
}

.cursor-grap {
  cursor: -webkit-grab;
  cursor: grab;
}
/* Hide specific resize handles */
.ui-resizable-e,
.ui-resizable-se,
.ui-resizable-s,
.ui-resizable-sw,
.ui-resizable-w,
.ui-resizable-nw,
.ui-resizable-n,
.ui-resizable-ne {
  opacity: 0.5 !important;
}
</style>

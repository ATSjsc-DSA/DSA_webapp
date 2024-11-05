<template>
  <div class="grid w-full h-full">
    <div v-if="showTree" class="col-3">
      <div class="sticky" style="top: 6rem">
        <ScrollPanel style="width: 100%; height: 58rem">
          <projectTreeWidget
            v-bind:application-draggable="applicationDraggable"
            v-bind:vsa-curve-draggable="vsaCurveDraggable"
            v-bind:tsa-curve-draggable="tsaCurveDraggable"
            @onStartDragNode="onStartDragNode"
            @onRemoveWidget="showTree = false"
          />
        </ScrollPanel>
      </div>
    </div>
    <div class="col">
      <div class="w-full h-full flex gap-3">
        <div
          class="w-full h-full"
          :class="{ 'border-2 border-gray-300': gridStackComponentArr.length === 0 }"
          @dragleave.prevent="canDropGridStackComponent = false"
          @dragenter.prevent
          @dragover.prevent="dragOverGridStackComponent"
          @drop.prevent="onDropGridStackComponent"
        >
          <!-- <div ref="grid" class="grid-stack bg-blue-100"></div> -->
          <div
            v-if="gridStackComponentArr.length === 0"
            class="flex h-full justify-content-center align-items-center"
            :class="{ 'bg-white font-semibold': canDropGridStackComponent }"
          >
            Drag component at right to here !
          </div>
          <div class="grid-stack" style="margin: -0.7rem">
            <div
              v-for="w in gridStackComponentArr"
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
                <div v-if="w.type === 'map'" class="h-full">
                  <mapView @onRemoveWidget="onRemoveGridStackComponent(w)" />
                </div>

                <chartComponent
                  v-if="w.type === 'chart'"
                  v-model:nodeSelected="w.nodeSelected"
                  :nodeDrag="nodeDrag"
                  :chartId="w.id"
                  :typeChart="w.typeChart"
                  :muiltiSelect="w.muiltiSelect"
                  @onRemoveWidget="onRemoveGridStackComponent(w)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="application-right-side-custom">
          <div class="flex flex-column gap-3 justify-content-center align-items-center sticky" style="top: 6rem">
            <div
              v-tooltip.left="'Compact Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-primary button-choose-components"
              placeholder="Left"
              @click="sortGrid"
            >
              <i class="pi pi-sync cursor-pointer" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">SORT</div>
            </div>
            <div
              v-tooltip.left="'Lock'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 button-choose-components"
              :class="gridLock ? 'bg-gray-400' : 'bg-orange-400'"
              placeholder="Left"
              @click="gridLock = !gridLock"
            >
              <i
                :class="gridLock ? 'pi pi-lock cursor-pointer' : 'pi pi-lock-open cursor-pointer'"
                style="font-size: 1rem"
              />
              <div style="font-size: 0.7rem">{{ gridLock ? 'LOCK' : 'OPEN' }}</div>
            </div>
            <div
              v-tooltip.left="'Compact Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-red-400 button-choose-components"
              placeholder="Left"
              @click="confirmRemoveAllComponent"
            >
              <i class="pi pi-trash cursor-pointer" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">DELETE</div>
            </div>

            <div
              v-tooltip.left="'Save Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-gray-100 button-choose-components"
              placeholder="Left"
              @click="saveGrid"
            >
              <i class="pi pi-save cursor-pointer" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">Save</div>
            </div>
            <Divider />
            <div
              v-tooltip.left="'Map'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('map')"
            >
              <i class="pi pi-map" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">MAP</div>
            </div>

            <div
              v-tooltip.left="'Project Tree'"
              class="flex flex-column align-items-center gap-1 p-1 button-choose-components"
              placeholder="Left"
              @click="showTree = !showTree"
            >
              <i class="pi pi-list" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">TREE</div>
            </div>

            <Divider />
            <div
              v-tooltip.left="'Appplication Radar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('appRadar')"
            >
              <i class="pi pi-chart-pie" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">RADAR</div>
            </div>
            <div
              v-tooltip.left="'Appplication Bar'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('appBar')"
            >
              <i class="pi pi-fw pi-chart-bar" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">BAR</div>
            </div>

            <div
              v-tooltip.left="'VSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('vsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">VSA</div>
            </div>
            <div
              v-tooltip.left="'TSA Line'"
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('tsa')"
            >
              <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">TSA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmDialog />
  <Toast />
</template>

<script setup>
import { onMounted, ref, render, watch } from 'vue';
import { v4 } from 'uuid';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import ScrollPanel from 'primevue/scrollpanel';

import { useToast } from 'primevue/usetoast';
import mapView from '@/components/mapView.vue';
import projectTreeWidget from './projectTreeWidget.vue';

import chartComponent from './chartComponent.vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import { useConfirm } from 'primevue/useconfirm';
const toast = useToast();

const confirm = useConfirm();
const showTree = ref(localStorage.getItem('showTree') === 'true' || false);
const gridStackComponentGrid = ref(null);
const gridLock = ref(true);
const gridStackComponentArr = ref([]);

onMounted(async () => {
  gridStackComponentGrid.value = GridStack.init({
    float: false,
    cellHeight: '1rem', // row's height
    cellWidth: '1rem',
    disableDrag: gridLock.value,
    disableResize: gridLock.value,
  });

  gridStackComponentGrid.value.on('change', onChangeGridStackComponent);
  setTimeout(() => {
    const oldGrid = JSON.parse(localStorage.getItem('gridStackComponentArr'));
    if (oldGrid) {
      oldGrid.forEach((widget) => {
        if (widget.type === 'map') {
          addMapComponent(widget);
        }
        if (widget.type === 'chart') {
          if (widget.typeChart === 'appBar') {
            applicationDraggable.value = true;
            addNewChartComponent('appBar', false, widget);
          }
          if (widget.typeChart === 'appRadar') {
            applicationDraggable.value = true;
            addNewChartComponent('appRadar', false, widget);
          }
          if (widget.typeChart === 'vsa') {
            vsaCurveDraggable.value = true;
            addNewChartComponent('vsa', true, widget);
          }
          if (widget.typeChart === 'tsa') {
            tsaCurveDraggable.value = true;
            addNewChartComponent('tsa', true, widget);
          }
        }
      });
    }
  }, 1000);
});

watch(gridLock, async () => {
  await nextTick(() => {
    gridStackComponentGrid.value.enableMove(!gridLock.value);
    gridStackComponentGrid.value.enableResize(!gridLock.value);
  });
});

const onRemoveGridStackComponent = (widget) => {
  if (gridLock.value) {
    return;
  }
  const index = gridStackComponentArr.value.findIndex((w) => w.id == widget.id);
  gridStackComponentArr.value.splice(index, 1);
  const selector = `#${widget.id}`;
  gridStackComponentGrid.value.removeWidget(selector, false);
};
const onChangeGridStackComponent = (event, changeItems) => {
  changeItems.forEach((item) => {
    const widget = gridStackComponentArr.value.find((w) => w.id == item.id);
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

const sortGrid = () => {
  gridStackComponentGrid.value.compact();
};
const confirmRemoveAllComponent = () => {
  confirm.require({
    message: 'Are you sure you want to remove all component?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      removeAllComponent();
    },
  });
};

const removeAllComponent = () => {
  gridStackComponentArr.value.forEach((widget) => {
    gridStackComponentGrid.value.removeWidget(`#${widget.id}`, false);
  });
  gridStackComponentArr.value = [];
  toast.add({ severity: 'success', summary: 'Removed Successfully', life: 3000 });
};

const saveGrid = () => {
  const { nodes } = gridStackComponentGrid.value.engine;
  nodes.forEach((node) => {
    gridStackComponentArr.value.map((w) => {
      if (w.id === node.id) {
        w.x = node.x;
        w.y = node.y;
      }
    });
  });
  localStorage.setItem('gridStackComponentArr', JSON.stringify(gridStackComponentArr.value));
  localStorage.setItem('showTree', JSON.stringify(showTree.value));
  toast.add({ severity: 'success', summary: 'Saved Successfully', life: 3000 });
};

// -- drag drop ---
const nodeDrag = ref({});
const onStartDragNode = (evt, node) => {
  evt.dataTransfer.dropEffect = 'move';
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('itemDrag', node.label);
  nodeDrag.value = node;
};

// ---  drag drop chart type

const canDropGridStackComponent = ref(false);
const componentSelected = ref();
const applicationDraggable = ref(false);
const vsaCurveDraggable = ref(false);
const tsaCurveDraggable = ref(false);

// -- add
const handleDragStart = (componentType) => {
  componentSelected.value = componentType;
};
const dragOverGridStackComponent = () => {
  canDropGridStackComponent.value = true;
};
const onDropGridStackComponent = () => {
  canDropGridStackComponent.value = false;

  if (componentSelected.value === 'appBar') {
    applicationDraggable.value = true;
    addNewChartComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'appRadar') {
    applicationDraggable.value = true;
    addNewChartComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'vsa') {
    vsaCurveDraggable.value = true;
    addNewChartComponent(componentSelected.value, true);
  }
  if (componentSelected.value === 'tsa') {
    tsaCurveDraggable.value = true;
    addNewChartComponent(componentSelected.value, true);
  }

  if (componentSelected.value === 'map') {
    addMapComponent();
  }
  componentSelected.value = undefined;
};

const addNewChartComponent = async (typeChart, muiltiSelect, oldConfig = {}) => {
  const node = {
    x: oldConfig.x || null,
    y: oldConfig.y | null,
    w: oldConfig.w || 3,
    h: oldConfig.h || 30,
    id: typeChart + '_' + gridStackComponentArr.value.length,
    typeChart: typeChart,
    muiltiSelect: muiltiSelect,
    nodeSelected: oldConfig.nodeSelected,
    type: 'chart',
  };
  gridStackComponentArr.value.push(node);

  await nextTick(() => {
    gridStackComponentGrid.value.makeWidget(`#${node.id}`);
    gridStackComponentGrid.value.update(document.querySelector(`#${node.id}`), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
  });
};

const addMapComponent = async (oldConfig = {}) => {
  const mapId = 'mapComponent' + v4();
  const node = {
    x: oldConfig.x || null,
    y: oldConfig.y | null,
    w: oldConfig.w || 3,
    h: oldConfig.h || 60,
    id: mapId,
    type: 'map',
  };
  gridStackComponentArr.value.push(node);

  await nextTick(() => {
    gridStackComponentGrid.value.makeWidget(mapId);
    gridStackComponentGrid.value.update(document.querySelector(mapId), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
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
.button-choose-components {
  text-align: center;
  height: auto;
  background-color: var(--surface-overlay);
  color: var(--text-color);
  border: 1px solid gray;
  width: 3rem;
}
</style>

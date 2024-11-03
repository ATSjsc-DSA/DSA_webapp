<template>
  <div class="grid w-full h-full">
    <div class="col-12">
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
                <div v-if="w.type === 'tree'" class="h-full">
                  <projectTreeWidget
                    v-bind:application-draggable="applicationDraggable"
                    v-bind:vsa-curve-draggable="vsaCurveDraggable"
                    v-bind:tsa-curve-draggable="tsaCurveDraggable"
                    @onStartDragNode="onStartDragNode"
                    @onRemoveWidget="onRemoveGridStackComponent(w)"
                  />
                </div>
                <chartComponent
                  v-if="w.type === 'chart'"
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
              <i class="pi pi-sync" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">SORT</div>
            </div>
            <div
              v-tooltip.left="'Lock'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 button-choose-components"
              :class="gridLock ? 'bg-gray-400' : 'bg-orange-400'"
              placeholder="Left"
              @click="gridLock = !gridLock"
            >
              <i :class="gridLock ? 'pi pi-lock' : 'pi pi-lock-open'" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">{{ gridLock ? 'LOCK' : 'OPEN' }}</div>
            </div>
            <div
              v-tooltip.left="'Compact Grid'"
              class="flex flex-column align-items-center gap-1 px-1 py-2 bg-red-400 button-choose-components"
              placeholder="Left"
              @click="confirmRemoveAllComponent"
            >
              <i class="pi pi-trash" style="font-size: 1rem" />
              <div style="font-size: 0.7rem">DELETE</div>
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
              class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
              draggable="true"
              placeholder="Left"
              @dragstart="handleDragStart('tree')"
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
</template>

<script setup>
import { onMounted, ref, render, watch } from 'vue';
import { v4 } from 'uuid';

import ConfirmDialog from 'primevue/confirmdialog';

import mapView from '@/components/mapView.vue';
import projectTreeWidget from './projectTreeWidget.vue';

import chartComponent from './chartComponent.vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

const gridStackComponentGrid = ref(null);
const gridLock = ref(false);
const gridStackComponentArr = ref([]);

onMounted(async () => {
  gridStackComponentGrid.value = GridStack.init({
    float: false,
    cellHeight: '1rem', // row's height
    cellWidth: '1rem',
    // row: 6, max row
  });

  gridStackComponentGrid.value.on('change', onChangeGridStackComponent);
  setTimeout(() => {
    addMapComponent();
    addProjectTreeComponent();
  }, 500);
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
    addNewGridStackComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'appRadar') {
    applicationDraggable.value = true;
    addNewGridStackComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'vsa') {
    vsaCurveDraggable.value = true;
    addNewGridStackComponent(componentSelected.value, true);
  }
  if (componentSelected.value === 'tsa') {
    tsaCurveDraggable.value = true;
    addNewGridStackComponent(componentSelected.value, true);
  }
  if (componentSelected.value === 'tree') {
    addProjectTreeComponent();
  }
  if (componentSelected.value === 'map') {
    addMapComponent();
  }
  componentSelected.value = undefined;
};

const addNewGridStackComponent = async (typeChart, muiltiSelect) => {
  const node = {
    w: 3,
    h: 30,
    id: typeChart + '_' + gridStackComponentArr.value.length,
    typeChart: typeChart,
    muiltiSelect: muiltiSelect,
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

const addProjectTreeComponent = async () => {
  const treeId = 'projectTreeComponent' + v4();
  const node = {
    w: 3,
    h: 60,
    id: treeId,
    type: 'tree',
  };
  gridStackComponentArr.value.push(node);

  await nextTick(() => {
    gridStackComponentGrid.value.makeWidget(treeId);
    gridStackComponentGrid.value.update(document.querySelector(treeId), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
  });
};

const addMapComponent = async () => {
  const mapId = 'mapComponent' + v4();
  const node = {
    w: 3,
    h: 60,
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

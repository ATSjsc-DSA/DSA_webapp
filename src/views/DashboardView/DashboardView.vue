<template>
  <div class="grid w-full h-full m-0">
    <div v-if="showTree || showLog" class="col-3 2xl:col-4">
      <div class="sticky flex flex-column gap-3" style="top: 5.5rem">
        <ScrollPanel v-if="showTree" style="width: 100%" :style="{ height: showLog ? '30rem' : '61rem' }">
          <projectTreeWidget
            v-if="showTree"
            v-bind:application-draggable="applicationDraggable"
            v-bind:vsa-curve-draggable="vsaCurveDraggable"
            v-bind:tsa-curve-draggable="tsaCurveDraggable"
            v-bind:ssr-curve-draggable="ssrCurveDraggable"
            v-bind:showLog="showLog"
            @onStartDragNode="onStartDragNode"
            @onRemoveWidget="showTree = false"
          />
        </ScrollPanel>

        <ScrollPanel v-if="showLog" style="width: 100%" :style="{ height: showTree ? '30rem' : '61rem' }">
          <logListWidget v-model="showTree" @onRemoveWidget="showLog = false" @saveLogConfig="saveLogConfig" />
        </ScrollPanel>
      </div>
    </div>

    <div class="col">
      <div class="w-full h-full flex">
        <div
          class="w-full h-full"
          style="margin-right: 4rem"
          :class="{ 'border-2 border-gray-300': gridStackComponentArr.length === 0 }"
          @dragleave.prevent="canDropGridStackComponent = false"
          @dragenter.prevent
          @dragover.prevent="dragOverGridStackComponent"
          @drop.prevent="onDropGridStackComponent"
        >
          <div class="grid-stack" style="margin: -0.7rem">
            <div
              v-for="widget in gridStackComponentArr"
              :id="widget.id"
              :key="widget.id"
              class="grid-stack-item"
              :gs-x="widget.x"
              :gs-y="widget.y"
              :gs-w="widget.w"
              :gs-h="widget.h"
              :gs-id="widget.id"
            >
              <div class="grid-stack-item-content">
                <MeasInfoDialogWidget v-if="widget.type === 'measInfo' && widget.show" @reloadData="reloadData" />

                <div v-if="widget.type === 'map'" class="h-full">
                  <mapView @onRemoveWidget="onRemoveGridStackComponent(widget)" />
                </div>

                <template v-if="widget.type === 'chart'">
                  <chartComponentTsa
                    v-if="widget.typeChart === 'tsa'"
                    v-model:nodeSelected="widget.nodeSelected"
                    v-model:gridLock="gridLock"
                    v-model:width="widget.w"
                    :nodeDrag="nodeDrag"
                    :chartId="widget.id"
                    @onRemoveWidget="onRemoveGridStackComponent(widget)"
                  />
                  <chartComponentAppTimeseries
                    v-else-if="widget.typeChart === 'appTimeSeries'"
                    v-model:nodeSelected="widget.nodeSelected"
                    v-model:gridLock="gridLock"
                    v-model:width="widget.w"
                    :nodeDrag="nodeDrag"
                    :chartId="widget.id"
                    @onRemoveWidget="onRemoveGridStackComponent(widget)"
                  />
                  <chartComponent
                    v-else
                    v-model:nodeSelected="widget.nodeSelected"
                    v-model:gridLock="gridLock"
                    v-model:width="widget.w"
                    :nodeDrag="nodeDrag"
                    :chartId="widget.id"
                    :typeChart="widget.typeChart"
                    :muiltiSelect="widget.muiltiSelect"
                    @onRemoveWidget="onRemoveGridStackComponent(widget)"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="application-right-side-custom" class="fixed" style="top: 6.5rem; right: 0; margin-left: 1rem">
    <div class="font-semibold text-center w-full pb-3" style="font-size: 0.8rem">DATA</div>
    <div class="flex flex-column gap-2 justify-content-center align-items-center">
      <div
        v-tooltip.left="measInfo_automatic ? 'Stop Automatic Mode' : 'Start Automatic Mode'"
        class="flex flex-column align-items-center gap-1 px-1 py-2 button-choose-components button-select cursor-pointer"
        :class="!measInfo_automatic ? 'bg-primary' : 'bg-red-400'"
        placeholder="Left"
        @click="changeMeasInfoMode"
      >
        <i v-if="!measInfo_automatic" class="pi pi-play cursor-pointer" style="font-size: 1rem" />
        <i v-else class="pi pi-pause" style="font-size: 1rem" />

        <div style="font-size: 0.7rem">{{ measInfo_automatic ? 'STOP' : 'START' }}</div>
      </div>
      <Button
        v-show="!measInfo_automatic"
        v-tooltip.left="'His HMI Data'"
        icon="pi  pi-ellipsis-h"
        aria-label="Filter"
        text
        @click="changeMeasInfoActive()"
      />

      <div
        v-tooltip.left="'Reload Data'"
        class="flex flex-column align-items-center gap-1 p-1 button-choose-components"
        placeholder="Left"
        @click="reloadData"
      >
        <i class="pi pi-replay" style="font-size: 1rem" />
        <div style="font-size: 0.7rem">RELOAD</div>
      </div>
    </div>

    <div class="font-semibold text-center w-full py-3" style="font-size: 0.8rem">GRID</div>
    <div class="flex flex-column gap-2 justify-content-center align-items-center">
      <div
        v-tooltip.left="'Compact Grid'"
        class="flex flex-column align-items-center gap-1 px-1 py-2 bg-primary button-choose-components button-select cursor-pointer"
        placeholder="Left"
        @click="sortGrid"
      >
        <i class="pi pi-sync" style="font-size: 1rem" />
        <div style="font-size: 0.7rem">SORT</div>
      </div>
      <div
        v-tooltip.left="'Lock'"
        class="flex flex-column align-items-center gap-1 px-1 py-2 button-choose-components button-select cursor-pointer"
        :class="gridLock ? 'bg-gray-500' : 'bg-orange-500'"
        placeholder="Left"
        @click="gridLock = !gridLock"
      >
        <i :class="gridLock ? 'pi pi-lock' : 'pi pi-lock-open'" style="font-size: 1rem" />
        <div style="font-size: 0.7rem">{{ gridLock ? 'LOCK' : 'OPEN' }}</div>
      </div>
      <div
        v-tooltip.left="'Compact Grid'"
        class="flex flex-column align-items-center gap-1 px-1 py-2 bg-red-400 button-choose-components button-select cursor-pointer"
        placeholder="Left"
        @click="confirmRemoveAllComponent"
      >
        <i class="pi pi-trash" style="font-size: 1rem" />
        <div style="font-size: 0.7rem">DELETE</div>
      </div>
      <div
        v-tooltip.left="'Save Grid'"
        class="flex flex-column align-items-center gap-1 px-1 py-2 bg-cyan-600 button-choose-components button-select cursor-pointer"
        placeholder="Left"
        @click="saveGrid"
      >
        <i class="pi pi-save" style="font-size: 1rem" />
        <div style="font-size: 0.7rem">SAVE</div>
      </div>
    </div>

    <div class="font-semibold text-center w-full py-3" style="font-size: 0.8rem">COMPONENT</div>
    <ScrollPanel :style="{ height: measInfo_automatic ? '33rem' : '30rem' }">
      <div class="flex flex-column gap-2 justify-content-center align-items-center">
        <div
          v-tooltip.left="'Project Tree'"
          class="flex flex-column align-items-center gap-1 p-1 button-choose-components"
          placeholder="Left"
          @click="showTree = !showTree"
        >
          <i class="pi pi-list" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">TREE</div>
        </div>

        <div
          v-tooltip.left="'Logs'"
          class="flex flex-column align-items-center gap-1 p-1 button-choose-components"
          placeholder="Left"
          @click="showLog = !showLog"
        >
          <i class="pi pi-file" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">LOG</div>
        </div>
        <Divider class="m-1" />

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

        <Divider class="m-1" />
        <div class="font-semibold" style="font-size: 0.8rem">CHART</div>
        <div
          v-tooltip.left="'Project Radar'"
          class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
          draggable="true"
          placeholder="Left"
          @dragstart="handleDragStart('projectRadar')"
        >
          <i class="pi pi-chart-pie" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">PROJECT</div>
        </div>

        <div
          v-tooltip.left="'Appplication Radar'"
          class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
          draggable="true"
          placeholder="Left"
          @dragstart="handleDragStart('appRadar')"
        >
          <i class="pi pi-chart-pie" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">APP</div>
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
          v-tooltip.left="'Appplication Bar Time Series'"
          class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
          draggable="true"
          placeholder="Left"
          @dragstart="handleDragStart('appTimeSeries')"
        >
          <i class="pi pi-fw pi-chart-bar" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">TIME</div>
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

        <div
          v-tooltip.left="'SSR Line'"
          class="flex flex-column align-items-center gap-1 p-1 cursor-grap button-choose-components"
          draggable="true"
          placeholder="Left"
          @dragstart="handleDragStart('ssr')"
        >
          <i class="pi pi-fw pi-chart-line" style="font-size: 1rem" />
          <div style="font-size: 0.7rem">SSR</div>
        </div>
      </div>
    </ScrollPanel>
  </div>
  <MeasInfoDialog
    v-model:dialogVisible="MeasInfoDialogVisible"
    v-model="pinMeasInfo"
    @reloadData="reloadData"
  ></MeasInfoDialog>
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
import logListWidget from './logListWidget.vue';
import MeasInfoDialogWidget from './MeasInfoWidget.vue';
import chartComponent from './chartComponent.vue';
import chartComponentTsa from './chartComponentTsa.vue';
import chartComponentAppTimeseries from './chartComponentAppTimeseries.vue';

import { useCommonStore } from '@/store';

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import MeasInfoDialog from './MeasInfoDialog.vue';
import { useConfirm } from 'primevue/useconfirm';
import ApiAuth from '@/api/user';
const toast = useToast();

const confirm = useConfirm();
const commonStore = useCommonStore();
const menuRightActiveIndex = ref([0, 1, 2]);
const showTree = ref(localStorage.getItem('showTree') === 'true' || false);
const showLog = ref(localStorage.getItem('showLog') === 'true' || false);

const gridStackComponentGrid = ref(null);
const gridLock = ref(true);
const gridStackComponentArr = ref([]);

const { measInfo_automatic, measInfoActive } = storeToRefs(commonStore);
const pinMeasInfo = ref(false);
watch(pinMeasInfo, (isPin) => {
  const measInfoComponent = gridStackComponentArr.value.filter((item) => item.type === 'measInfo');
  if (measInfoComponent.length > 0) {
    measInfoComponent[0].show = pinMeasInfo.value;
  } else if (isPin) {
    addMeasInfoComponent();
  }
});
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
        if (widget.type === 'log') {
          showLog.value = widget.show;
        }
        if (widget.type === 'tree') {
          showTree.value = widget.show;
        }
        if (widget.type === 'measInfo') {
          addMeasInfoComponent(widget);
          pinMeasInfo.value = widget.show;
        }
        if (widget.type === 'chart') {
          if (widget.typeChart === 'projectRadar') {
            addNewChartComponent('projectRadar', true, widget);
          }
          if (widget.typeChart === 'appRadar') {
            applicationDraggable.value = true;
            addNewChartComponent('appRadar', false, widget);
          }
          if (widget.typeChart === 'appBar') {
            applicationDraggable.value = true;
            addNewChartComponent('appBar', false, widget);
          }
          if (widget.typeChart === 'appTimeSeries') {
            applicationDraggable.value = true;
            addNewChartComponent('appTimeSeries', false, widget);
          }
          if (widget.typeChart === 'vsa') {
            vsaCurveDraggable.value = true;
            addNewChartComponent('vsa', true, widget);
          }
          if (widget.typeChart === 'tsa') {
            tsaCurveDraggable.value = true;
            addNewChartComponent('tsa', true, widget);
          }
          if (widget.typeChart === 'ssr') {
            ssrCurveDraggable.value = true;
            addNewChartComponent('ssr', true, widget);
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
  stopReloadChartData.value = true;
  setTimeout(() => {
    gridStackComponentArr.value.forEach((widget) => {
      gridStackComponentGrid.value.removeWidget(`#${widget.id}`, false);
    });
    gridStackComponentArr.value = [];
  }, 1000);
  toast.add({ severity: 'success', summary: 'Removed Successfully', life: 3000 });
};

const saveGrid = async () => {
  const { nodes } = gridStackComponentGrid.value.engine;
  nodes.forEach((node) => {
    gridStackComponentArr.value.map((w) => {
      if (w.id === node.id) {
        w.x = node.x;
        w.y = node.y;
      }
    });
  });

  const logComponent = gridStackComponentArr.value.filter((item) => item.type === 'log');
  if (logComponent.length > 0) {
    logComponent.show = showLog.value;
  } else {
    gridStackComponentArr.value.push({
      type: 'log',
      show: showLog.value,
      limitLog: 100,
      intervalTime: 5 * 1000,
    });
  }
  const treeComponent = gridStackComponentArr.value.filter((item) => item.type === 'tree');
  if (treeComponent.length > 0) {
    treeComponent.show = showTree.value;
  } else {
    gridStackComponentArr.value.push({
      type: 'tree',
      show: showTree.value,
    });
  }

  localStorage.setItem('gridStackComponentArr', JSON.stringify(gridStackComponentArr.value));
  localStorage.setItem('showTree', JSON.stringify(showTree.value));
  localStorage.setItem('showLog', JSON.stringify(showLog.value));

  localStorage.setItem('stopReloadChartData', stopReloadChartData.value);
  toast.add({ severity: 'success', summary: 'Saved Successfully', life: 3000 });

  await updateGridInAuth(JSON.stringify(gridStackComponentArr.value));
};

const saveLogConfig = async (newConfig) => {
  newConfig.type = 'log';
  newConfig.show = showLog.value;
  gridStackComponentArr.value.push(newConfig);
  await updateGridInAuth(JSON.stringify(gridStackComponentArr.value));
};

const updateGridInAuth = async (data) => {
  try {
    await ApiAuth.updateHMILayout(data);
  } catch (error) {
    console.log('updateGridInAuth error', error);
  }
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
const ssrCurveDraggable = ref(false);

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
  if (componentSelected.value === 'appTimeSeries') {
    applicationDraggable.value = true;
    addNewChartComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'appRadar') {
    applicationDraggable.value = true;
    addNewChartComponent(componentSelected.value, false);
  }
  if (componentSelected.value === 'projectRadar') {
    addNewChartComponent(componentSelected.value, true, { nodeSelected: { data: 'project' } });
  }
  if (componentSelected.value === 'vsa') {
    vsaCurveDraggable.value = true;
    addNewChartComponent(componentSelected.value, true);
  }
  if (componentSelected.value === 'tsa') {
    tsaCurveDraggable.value = true;
    addNewChartComponent(componentSelected.value, true);
  }
  if (componentSelected.value === 'ssr') {
    ssrCurveDraggable.value = true;
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

const addMeasInfoComponent = async (oldConfig = {}) => {
  const measinfoId = 'measInfo' + v4();
  const node = {
    x: oldConfig.x || 0,
    y: oldConfig.y | 0,
    w: oldConfig.w || 6,
    h: oldConfig.h || 6,
    id: measinfoId,
    type: 'measInfo',
    show: oldConfig.show !== undefined ? oldConfig.show : true,
  };
  gridStackComponentArr.value.push(node);

  await nextTick(() => {
    gridStackComponentGrid.value.makeWidget(measinfoId);
    gridStackComponentGrid.value.update(document.querySelector(measinfoId), {
      resizable: { handles: 'e, se, s, sw, w, nw, n, ne' },
    });
  });
};

// --- control reload data

const stopReloadChartData = ref(localStorage.getItem('stopReloadChartData') === 'true');
const MeasInfoDialogVisible = ref(false);

const changeMeasInfoActive = () => {
  MeasInfoDialogVisible.value = true;
};

const changeMeasInfoMode = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Submit',
    accept: () => {
      stopReloadChartData.value = !stopReloadChartData.value;
      commonStore.updateMeasInfoAutomatic(!measInfo_automatic.value);
      // measInfo_automatic.value = !measInfo_automatic.value;
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
const reloadData = () => {
  const oldId = measInfoActive.value;
  measInfoActive.value = {};
  setTimeout(() => {
    measInfoActive.value = oldId;
  }, 1000);
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

.button-choose-components:hover {
  background-color: var(--surface-hover);
}
.button-select {
  border: 0;
  border-radius: 0.5rem;
}
</style>

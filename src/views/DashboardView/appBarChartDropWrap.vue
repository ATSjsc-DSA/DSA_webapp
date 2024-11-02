<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropNode }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div><i class="pi pi-folder-open pr-3"></i>Application Chart</div>
        <div>
          <Button
            icon="pi pi-trash "
            title="Reset Data"
            severity="danger"
            text
            :disabled="!nodeDrag._id"
            @click="resetChart"
          />
          <Button
            icon="pi pi-refresh "
            title="Refresh chart"
            severity="secondary"
            text
            :disabled="!nodeDrag._id"
            @click="getChartData"
          />
          <Button icon="pi pi-times" text severity="secondary" title="Remove chart" @click="onRemoveWidget" />
        </div>
      </div>
    </template>
    <template #content>
      <div
        id="applicationBarChartSelected"
        class="w-full h-full"
        @dragleave.prevent="canDropNode = false"
        @dragenter.prevent
        @dragover.prevent="onDragoverComponent"
        @drop.prevent="onDropComponent"
      >
        <appBarchartWidget :data="chartData" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ApplicationApi } from './api';
import appBarchartWidget from './appBarchartWidget.vue';

const props = defineProps({
  nodeDrag: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['addNodeTreeSelectd', 'removeNodeTreeSelected', 'onRemoveWidget']);

const onRemoveWidget = () => {
  emit('removeNodeTreeSelected', nodeKey.value);
  emit('onRemoveWidget');
};
const nodeKey = ref(props.nodeDrag.key);

//  Drop Application - bar
const nodeSelected = ref();
const nodeKeySelected = ref();
const canDropNode = ref(false);

const onDragoverComponent = () => {
  if (props.nodeDrag.type === 'Application' && nodeSelected.value !== props.nodeDrag._id) {
    canDropNode.value = true;
  } else {
    canDropNode.value = false;
  }
};
const onDropComponent = async () => {
  if (props.nodeDrag.type === 'Application' && nodeSelected.value !== props.nodeDrag._id) {
    resetChart();
    nodeSelected.value = props.nodeDrag._id;
    nodeKeySelected.value = props.nodeDrag.key;
    await getChartData();
    canDropNode.value = false;
    emit('addNodeTreeSelectd', props.nodeDrag.key);
    nodeKey.value = props.nodeDrag.key;
  }
};

const chartData = ref([]);
const getChartData = async () => {
  try {
    const res = await ApplicationApi.getBarChartData(nodeSelected.value);
    chartData.value = res.data || [];
  } catch (error) {
    console.log('getAppliactionChartData: error ', error);
    chartData.value = [];
  }
};

const resetChart = () => {
  chartData.value = [];
  nodeSelected.value = undefined;
  emit('removeNodeTreeSelected', nodeKey.value);
};
</script>

<style>
.p-card-body {
  height: 100% !important;
}
.p-card-content {
  height: 90% !important;
}
</style>

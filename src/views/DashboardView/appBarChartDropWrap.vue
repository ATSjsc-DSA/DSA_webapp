<template>
  <Card class="flex-grow-1 w-full h-full grid-stack-item-content" :class="{ 'border-2': canDropApplicationToBarChart }">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <div><i class="pi pi-folder-open pr-3"></i>Application Chart</div>
        <div>
          <Button
            icon="pi pi-trash "
            title="Reset Data"
            severity="danger"
            text
            @click="resetApplicationBarChartSelected"
          />
          <Button
            icon="pi pi-refresh "
            title="Refresh chart"
            severity="secondary"
            text
            @click="getAppliactionChartData"
          />
          <Button icon="pi pi-times" text severity="primary" title="Remove chart" @click="handleRemoveChart" />
        </div>
      </div>
    </template>
    <template #content>
      <div
        id="applicationBarChartSelected"
        class="w-full h-full"
        @dragleave.prevent="canDropApplicationToBarChart = false"
        @dragenter.prevent
        @dragover.prevent="onDragoverApplicationBarChart"
        @drop.prevent="onDropApplicationBarChart"
      >
        <appBarchartWidget :data="applicationBarChartData" />
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
const emit = defineEmits(['addNodeTreeSelectd', 'removeNodeTreeSelected', 'remove']);
const handleRemoveChart = () => {
  emit('remove', props.itemId);
};
//  Drop Application - bar
const applicationBarChartSelected = ref();
const applicationBarChartKeySelected = ref();
const canDropApplicationToBarChart = ref(false);

const onDragoverApplicationBarChart = () => {
  if (props.nodeDrag.type === 'Application' && applicationBarChartSelected.value !== props.nodeDrag._id) {
    canDropApplicationToBarChart.value = true;
  } else {
    canDropApplicationToBarChart.value = false;
  }
};
const onDropApplicationBarChart = async () => {
  console.log('drop',JSON.stringify(props.nodeDrag));

  if (props.nodeDrag.type === 'Application' && applicationBarChartSelected.value !== props.nodeDrag._id) {
    resetApplicationBarChartSelected();
    applicationBarChartSelected.value = props.nodeDrag._id;
    applicationBarChartKeySelected.value = props.nodeDrag.key;
    emit('addNodeTreeSelectd', props.nodeDrag.key);
    await getAppliactionChartData();
    canDropApplicationToBarChart.value = false;
  }
};

const applicationBarChartData = ref([]);
const getAppliactionChartData = async () => {
  try {
    const res = await ApplicationApi.getBarChartData(applicationBarChartSelected.value);
    applicationBarChartData.value = res.data || [];
  } catch (error) {
    console.log('getVsaChartData: error ', error);
    applicationBarChartData.value = [];
  }
};

const resetApplicationBarChartSelected = () => {
  applicationBarChartData.value = [];
  applicationBarChartSelected.value = undefined;
  emit('removeNodeTreeSelected', props.nodeDrag.key);
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

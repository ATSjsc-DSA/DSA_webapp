<script setup>
import { watch } from 'vue';
import VSA_areaClockChart from './VSA_areaClockChart.vue';
import VSA_areChart from './VSA_areChart.vue';

const props = defineProps({
  dataArea: {
    type: Object,
  },
});

const dataArea = ref(props.dataArea);
watch(props.dataArea, (newVal, oldValue) => {
  if (newVal !== oldValue) {
    dataArea.value = props.dataArea;
  }
});
</script>
<template>
  <div class="h-full flex flex-column gap-2 w-full">
    <div class="grid card">
      <div class="col">
        <VSA_areaClockChart :DataArea="dataArea"></VSA_areaClockChart>
      </div>
      <div class="col flex justify-content-center">
        <VSA_areaView :DataArea="dataArea"></VSA_areaView>
      </div>
    </div>
    <div class="flex-1">
      <VSA_areChart :areaActive="dataArea"></VSA_areChart>
    </div>
  </div>
</template>
<style scoped>
.card {
  border-radius: 0;
  margin-bottom: 0px;
  margin: 0;
  padding: 1rem;
}
</style>

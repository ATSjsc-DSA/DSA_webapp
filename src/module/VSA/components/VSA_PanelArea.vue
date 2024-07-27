<script setup>
import { watch } from 'vue';
import VSA_areaClockChart from './VSA_areaClockChart.vue';
import VSA_areChart from './VSA_areChart.vue';
import VSA_areaView from './VSA_areaView.vue';
import VSA_ListData from './VSA_ListData.vue';
const props = defineProps({
  dataArea: {
    type: Object,
  },
});

const DataProps = computed(() => props.dataArea);
const dataArea = ref({
  mon: '',
  VSA_max: 0,
});
watch(DataProps, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    dataArea.value = newValue;
  }
});
onMounted(() => {
  dataArea.value = DataProps.value;
});
// const dataArea = computed(() => props.dataArea);
</script>
<template>
  <div class="h-full flex flex-column gap-2 w-full">
    <!-- <div class="grid card">
      <div class="col">
        <VSA_areaClockChart :DataArea="dataArea"></VSA_areaClockChart>
      </div>
      <div class="col">
        <VSA_ListData :DataArea="dataArea"></VSA_ListData>
      </div>
    </div> -->
    <!-- <div class="col flex justify-content-center">
      <VSA_areaView :DataArea="dataArea"></VSA_areaView>
    </div> -->

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
  background: rgb(0, 100, 212);
  background: radial-gradient(circle, rgba(0, 100, 212, 1) 0%, rgba(0, 0, 0, 0.9836309523809523) 100%);
}
</style>

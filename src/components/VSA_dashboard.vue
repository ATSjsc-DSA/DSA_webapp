<script setup>
import VSA_areaView from './VSA_areaView.vue';
import VSA_areaClockChart from './VSA_areaClockChart.vue';

import Card from 'primevue/card';

const props = defineProps({
  listDataArea: {
    type: Array,
    requied: true,
  },
});
const DataArea1 = computed(() => props.listDataArea[0]);
const DataArea2 = computed(() => props.listDataArea[1]);
const DataArea3 = computed(() => props.listDataArea[2]);
</script>

<template>
  <div class="grid ssr">
    <div class="ssr-block col-12 grid">
      <div class="flex justify-content-start h-full relative col-5">
        <VSA_areaClockChart
          :DataArea="DataArea1"
          class="flex align-items-center justify-content-center"
        ></VSA_areaClockChart>
        <VSA_areaView :DataArea="DataArea1" class="block-areaView"></VSA_areaView>
      </div>
    </div>
    <div class="ssr-block col-12 grid">
      <div class="flex justify-content-end h-full relative">
        <VSA_areaClockChart :DataArea="DataArea2" class="flex align-items-center"></VSA_areaClockChart>
        <!-- <VSA_areaView :DataArea="DataArea2" class="block-areaView"></VSA_areaView> -->
      </div>
    </div>
    <div class="ssr-block col-12 grid">
      <div class="flex justify-content-start h-full relative">
        <VSA_areaClockChart :DataArea="DataArea3" class="flex align-items-center"></VSA_areaClockChart>
        <VSA_areaView :DataArea="DataArea3" class="block-areaView"></VSA_areaView>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  padding: 10px;
  position: relative;
}
.ssr {
  margin-top: 0px;
  height: 100%;
  gap: 4rem;
  .ssr-block {
    height: calc(100% / 4);
    .block-areaView {
      position: absolute;
    }
  }
}
.card-block {
  padding: 0px;
  position: relative;
  border: 2px solid var(--surface-border);
  // border-top-right-radius: 35%;
  // border-bottom-right-radius: 35%;
  border-radius: 15%;
  box-shadow: 2px 2px 2px 2px;
  background-color: var(--surface-card);
}
</style>

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
      <div class="col-7 grid card-block">
        <VSA_areaClockChart :DataArea="DataArea1" class="col-7 flex align-items-center"></VSA_areaClockChart>
        <VSA_areaView :DataArea="DataArea1" class="col-5"></VSA_areaView>
      </div>
    </div>
    <div class="ssr-block col-12 grid">
      <div class="col-offset-5 col-7 grid card-block">
        <VSA_areaClockChart :DataArea="DataArea2" class="col-7 flex align-items-center"></VSA_areaClockChart>
        <VSA_areaView :DataArea="DataArea2" class="col-5"></VSA_areaView>
      </div>
    </div>
    <div class="ssr-block col-12 grid">
      <div class="col-7 grid card-block">
        <VSA_areaClockChart :DataArea="DataArea3" class="col-7 flex align-items-center"></VSA_areaClockChart>
        <VSA_areaView :DataArea="DataArea3" class="col-5"></VSA_areaView>
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
  .ssr-block {
    height: 33%;
    position: relative;
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

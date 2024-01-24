<script setup>
import TSA_SPSCheck from './TSA_SPSCheck.vue';
import TSA_GTTTCheck from './TSA_GTTTCheck.vue';
import TSA_ChartView from './TSA_ChartView.vue';
</script>

<template>
  <div class="grid h-full">
    <div class="col-4 tsa-block py-0">
      <TSA_SPSCheck></TSA_SPSCheck>
    </div>
    <div class="col-8 tsa-block py-0">
      <div class="tsa-block-gtth">
        <TSA_GTTTCheck></TSA_GTTTCheck>
      </div>
      <div class="tsa-block-chart">
        <TSA_ChartView></TSA_ChartView>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tsa-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  .tsa-block-gtth {
    flex: 1;
  }
  .tsa-block-chart {
    flex: 2;
  }
}
fieldset {
  padding: 0;
  width: 100%;
}
</style>

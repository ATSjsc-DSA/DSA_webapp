<script setup>
import TSA_F27Chart from './TSA_F27Chart.vue';
import TSA_F81Chart from './TSA_F81Chart.vue';
import TSA_PowerTransfer from './TSA_PowerTransfer.vue';
</script>

<template>
  <div class="SPS-view-block">
    <TSA_F81Chart class="SPS-view-item"></TSA_F81Chart>
    <TSA_F27Chart class="SPS-view-item"></TSA_F27Chart>
    <TSA_PowerTransfer class="SPS-view-item"></TSA_PowerTransfer>
  </div>
</template>
<style lang="scss">
.SPS-view-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  gap: 1rem;
  .SPS-view-item {
    flex: 1;
  }
}
</style>

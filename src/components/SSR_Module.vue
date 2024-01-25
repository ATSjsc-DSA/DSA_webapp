<script setup>
import SSR_lineChart from './SSR_lineChart.vue';
// primeVue
</script>

<template>
  <div class="grid ssr">
    <div class="ssr-block col-6 block-top">
      <SSR_lineChart subActive="sym_4031_1"></SSR_lineChart>
    </div>
    <div class="ssr-block col-6 block-top">
      <SSR_lineChart subActive="sym_4035_1"></SSR_lineChart>
    </div>
    <div class="ssr-block col-6 block-bot">
      <SSR_lineChart subActive="sym_4035_1"></SSR_lineChart>
    </div>
    <div class="ssr-block col-6 block-bot">
      <SSR_lineChart subActive="sym_4031_1"></SSR_lineChart>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ssr {
  margin-top: 0px;
  height: 100%;
  .ssr-block {
    height: 50%;
    position: relative;
  }
  .block-top {
    padding-top: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0px;
      left: 0.5rem;
      z-index: 100;
    }
  }
  .block-bot {
    padding-bottom: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 100;
    }
  }
}
</style>

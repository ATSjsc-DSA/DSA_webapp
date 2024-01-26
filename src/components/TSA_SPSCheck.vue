<script setup>
import customFieldset from './customFieldset.vue';

import TSA_F27Chart from './TSA_F27Chart.vue';
import TSA_F81Chart from './TSA_F81Chart.vue';
import TSA_PowerTransfer from './TSA_PowerTransfer.vue';
</script>

<template>
  <customFieldset legendText="SPS Check">
    <div class="sps-fieldset-main">
      <TSA_F81Chart enabledFieldset></TSA_F81Chart>
      <TSA_F27Chart enabledFieldset></TSA_F27Chart>
      <TSA_PowerTransfer enabledFieldset></TSA_PowerTransfer>
    </div>
  </customFieldset>
</template>
<style lang="scss">
.sps-fieldset-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<script setup>
import comboChartBase from './comboChartBase.vue';
import VSA_BusbarSelect from './VSA_BusbarSelect.vue';
import VSA_ResultSelect from './VSA_ResultSelect.vue';
// primeVue
</script>

<template>
  <div class="flex h-full column-gap-2">
    <div class="flex-1">
      <comboChartBase></comboChartBase>
    </div>
    <div class="card flex flex-column row-gap-6">
      <VSA_ResultSelect></VSA_ResultSelect>
      <VSA_BusbarSelect></VSA_BusbarSelect>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>

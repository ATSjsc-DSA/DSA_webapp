<script setup>
import mapViewSSR from '@/components/SSR_mapView.vue';
import SSR_Module from '@/module/SSR/components/SSR_Module.vue';
</script>

<template>
  <div class="grid h-full">
    <div class="col-5">
      <mapViewSSR></mapViewSSR>
    </div>
    <div class="col-7 h-full">
      <SSR_Module></SSR_Module>
    </div>
  </div>
</template>
<style scoped></style>

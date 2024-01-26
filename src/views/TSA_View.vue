<script setup>
import mapViewTSA from '@/components/TSA_mapView.vue';
import TSA_Module from '@/components/TSA_Module.vue';
</script>

<template>
  <div class="grid h-full">
    <div class="col-4">
      <mapViewTSA></mapViewTSA>
    </div>
    <div class="col-8">
      <TSA_Module></TSA_Module>
    </div>
  </div>
</template>

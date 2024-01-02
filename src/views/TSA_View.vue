<script setup>
import mapView from '@/components/mapView.vue';
import TSA_Module from '@/components/TSA_Module.vue';
</script>

<template>
  <div class="grid">
    <div class="col-4">
      <mapView></mapView>
    </div>
    <div class="col-8">
      <TSA_Module></TSA_Module>
    </div>
  </div>
</template>

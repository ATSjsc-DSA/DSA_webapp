<script setup>
import mapView from '@/components/mapView.vue';
import SSR_Module from '@/components/SSR_Module.vue';
</script>

<template>
  <div class="grid">
    <div class="col-5">
      <mapView></mapView>
    </div>
    <div class="col-7">
      <SSR_Module></SSR_Module>
    </div>
  </div>
</template>

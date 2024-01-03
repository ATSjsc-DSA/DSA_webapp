<script setup>
import mapView from '@/components/mapView.vue';
import mainLayout from '@/components/layout/mainLayout.vue';
</script>

<template>
  <div class="grid">
    <div class="col-4">
      <mapView></mapView>
    </div>
    <div class="col-8">
      <mainLayout></mainLayout>
    </div>
  </div>
</template>

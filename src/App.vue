<script setup>
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);
</script>
<template>
  <RouterView></RouterView>
</template>

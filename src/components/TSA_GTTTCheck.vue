<script setup>
import TSA_GTTTChart from './TSA_GTTTChart.vue';
// primeVue

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import customFieldset from './customFieldset.vue';

const toast = useToast();
const props = defineProps({
  listTypeLine: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <Toast></Toast>
  <customFieldset legendText="TTTG Check">
    <TSA_GTTTChart :listTypeLine="props.listTypeLine" enabledFieldset></TSA_GTTTChart>
  </customFieldset>
</template>
<style lang="scss" scoped>
.tttg-block {
  position: relative;
  padding: 0.5rem;
  height: 100%;
}
</style>

<script setup>
import VSA_api from '@/api/vsa_api';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import VSA_areChart from './VSA_areChart.vue';
const toast = useToast();
// primeVue
const props = defineProps({
  listDataArea: {
    type: Array,
    requied: true,
  },
});
const listDataArea = computed(() => props.listDataArea);
</script>

<template>
  <div class="grid ssr">
    <div class="ssr-block col-6" v-for="area in listDataArea" :key="area.name">
      <VSA_areChart :areaActive="area"></VSA_areChart>
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
    padding-bottom: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0px;
      left: 0.5rem;
      z-index: 100;
    }
  }
  .block-bot {
    // padding-bottom: 0px;
    .ssr-block-overlay {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 100;
    }
  }
}
</style>

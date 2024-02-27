<script setup>
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  modificationTime: {
    type: Number,
    require: true,
  },
});

const emits = defineEmits(['refeshData']);

const refeshData = () => {
  emits('refeshData');
};
</script>

<template>
  <a href="javascript:void(0)" class="icon-chart cursor-pointer" @click="refeshData">
    <i class="pi pi-sync" v-tooltip.top="'Refesh chart'"></i>
    <span> {{ modificationTime }}</span>
  </a>
</template>
<style scoped>
.icon-chart {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 1rem;
  color: var(--primary-color);
  display: block;
  text-align: center;
  i {
    display: block;
    margin: 0 auto; /* Để căn giữa theo chiều ngang */
  }
  span {
    display: block;
    margin: 4px auto;
    font-size: 0.6rem;
    color: #808080;
  }
}
</style>

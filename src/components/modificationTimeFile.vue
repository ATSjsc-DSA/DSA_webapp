<script setup>
const props = defineProps({
  modificationTime: {
    type: String,
    require: true,
  },
});

const emits = defineEmits(['refeshData']);

const refeshData = () => {
  emits('refeshData');
};
</script>

<template>
  <div class="icon-chart" @click="refeshData">
    <i class="pi pi-sync"></i>
    <span> {{ modificationTime }}</span>
  </div>
</template>
<style scoped>
.icon-chart {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 4rem;
  color: var(--primary-color);
  display: block;
  text-align: center;
  cursor: pointer;
  i {
    display: block;
    margin: 0 auto; /* Để căn giữa theo chiều ngang */
  }
  span {
    cursor: pointer;
    display: block;
    margin: 4px auto;
    font-size: 0.6rem;
    color: var(--text-color);
  }
}
</style>

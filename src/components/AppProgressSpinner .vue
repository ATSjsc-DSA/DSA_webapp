<template>
  <div :class="{ overlay: showSpinner, 'overlay-hidden': !showSpinner }">
    <ProgressSpinner v-if="showSpinner" />
  </div>
</template>

<script setup>
const props = defineProps({
  showSpinner: Boolean,
});
const showSpinner = computed(() => props.showSpinner);
</script>
<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Màu nền với độ trong suốt */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Đảm bảo overlay nằm trên cùng */
}
.overlay-hidden {
  display: none;
}
</style>

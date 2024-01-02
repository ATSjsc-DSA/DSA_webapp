<script setup>
import Tag from 'primevue/tag';

const props = defineProps({
  legendText: {
    type: String,
    default: 'Legend',
  },
});
</script>
<template>
  <div class="custom-fieldset">
    <div class="legend">
      <Tag :value="props.legendText"></Tag>
    </div>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.custom-fieldset {
  width: 100%;
  height: 100%;
  position: relative;
  // padding: 0px;
  border: 1px solid #ccc;
  border-radius: 0px;

  .legend {
    position: absolute;
    top: -15px;
    left: 10px;
    // padding: 0 5px;
  }
}
</style>

<template>
  <div class="h-full grid-stack-item-content border-2">
    <Card class="h-full">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div>{{ title }}</div>
          <Button icon="pi pi-times" text severity="primary" @click="handleRemove" />
        </div>
      </template>
      <template #content>
        <div class="h-full">
          <slot />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
const props = defineProps({
  itemId: {
    type: [String, Number],
    required: true,
  },
});
const emit = defineEmits(['remove']);
const handleRemove = () => {
  emit('remove', props.itemId);
};
</script>

<style>
@import 'gridstack/dist/gridstack.min.css';
</style>

<template>tooi laf dependencyWidget.vue dependencyId:{{ dependencyId }}</template>

<script setup>
const props = defineProps({
  dependencyId: {
    type: String,
    required: true,
  },
});
</script>

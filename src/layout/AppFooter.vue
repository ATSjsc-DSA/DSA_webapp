<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();
</script>

<template>
  <div class="layout-footer">
    <img src="/img/favicon.ico" alt="Logo" height="20" class="mr-2" />
    by
    <span class="font-medium ml-2">Ats.jsc</span>
  </div>
</template>
<style lang="scss" scoped></style>

<script setup>
import { defineAsyncComponent } from 'vue';
import { icons } from '../../assets/app';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const icon = defineAsyncComponent(icons[props.name] || (() => import('../../assets/app/NOT_gate.svg')));
</script>

<template>
  <component :is="icon" class="fill-current" />
</template>

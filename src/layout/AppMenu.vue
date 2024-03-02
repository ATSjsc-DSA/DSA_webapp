<script setup>
import { ref } from 'vue';
// import { useLayout } from '@/layout/composables/layout';

import AppMenuItem from './AppMenuItem.vue';
// const { onMenuToggle } = useLayout();
const emits = defineEmits(['menuToggle']);
const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
  },
  {
    label: 'Layout',
    items: [
      { label: 'SSR', icon: 'pi pi-fw pi-server', to: '/DSA/SSR' },
      { label: 'TSA', icon: 'pi pi-fw pi-slack', to: '/DSA/TSA' },
      { label: 'VSA', icon: 'pi pi-fw pi-sitemap', to: '/DSA/VSA' },
    ],
  },
  {
    label: 'VNA',
    items: [{ label: 'Map', icon: 'pi pi-fw pi-map-marker', to: '/DSA/Map' }],
  },
  {
    label: 'UTILITIES',
    items: [{ label: 'Help', icon: 'pi pi-fw pi-info-circle', to: '/DSA/Info' }],
  },
]);
const menuToggle = () => {
  emits('menuToggle');
};
</script>

<template>
  <ul class="layout-menu relative">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        @changeMenuToggle="menuToggle"
        :item="item"
        :index="i"
        a=" avb"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
  <!-- <Button
    icon="pi pi-chevron-left"
    size="small"
    class="absolute bottom-0 border-noround left-0 w-full"
    @click="onMenuToggle()"
  /> -->
</template>

<style lang="scss" scoped></style>

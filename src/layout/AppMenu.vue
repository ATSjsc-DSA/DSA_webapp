<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
  },
  {
    label: 'Dependency blocks',
    items: [
      { label: 'SSR', icon: 'pi pi-fw pi-id-card', to: '/DSA/SSR' },
      { label: 'TSA', icon: 'pi pi-fw pi-check-square', to: '/DSA/TSA' },
      { label: 'VSA', icon: 'pi pi-fw pi-bookmark', to: '/DSA/VSA' },
    ],
  },

  {
    label: 'Utilities',
    items: [
      { label: 'Group test', icon: 'pi pi-fw pi-list', to: '/DSA/DataInitialize' },
      { label: 'Study Mode', icon: 'pi pi-fw pi-clone', to: '/DSA/StudyMode' },
      { label: 'Data Initialize', icon: 'pi pi-fw pi-list', to: '/DSA/Initialize' },
      {
        label: 'System Events',
        icon: 'pi pi-fw  pi-clone',
        items: [
          {
            label: 'Disturbances',
            to: '/DSA/SystemEvents/Disturbances',
          },
          {
            label: 'Contingencies',
            to: '/DSA/SystemEvents/Contingencies',
          },
        ],
      },
      { label: 'Branch Monitoring', icon: 'pi pi-fw pi-desktop', to: '/DSA/Monitor' },
      { label: 'Profile', icon: 'pi pi-fw pi-file-edit', to: '/DSA/Profile' },

      { label: 'Config DSA Device', icon: 'pi pi-fw pi-cog', to: '/DSA/Setting' },

      { label: 'Task list', icon: 'pi pi-fw pi-calendar-plus', to: '/DSA/Task' },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>

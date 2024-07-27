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
      { label: 'Data Initialize', icon: 'pi pi-fw pi-file', to: '/DSA/Setting/Area' },
      { label: 'Link Monitoring', icon: 'pi pi-fw pi-clone', to: '/DSA/Setting/Monitor' },
      {
        label: 'Setting',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'System Configuration',
            to: '/DSA/Setting/System',
          },
          {
            label: 'Profile Configuration',
            to: '/DSA/Setting/Profile',
          },
        ],
      },

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

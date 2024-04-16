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
    items: [{ label: 'Setting', icon: 'pi pi-fw pi-cog', to: '/DSA/Setting' }],
  },
  // {
  //   label: 'Get Started',
  //   items: [
  //     {
  //       label: 'Documentation',
  //       icon: 'pi pi-fw pi-question',
  //       to: '/documentation',
  //     },
  //     {
  //       label: 'Figma',
  //       url: 'https://www.dropbox.com/scl/fi/bhfwymnk8wu0g5530ceas/sakai-2023.fig?rlkey=u0c8n6xgn44db9t4zkd1brr3l&dl=0',
  //       icon: 'pi pi-fw pi-pencil',
  //       target: '_blank',
  //     },
  //     {
  //       label: 'View Source',
  //       icon: 'pi pi-fw pi-search',
  //       url: 'https://github.com/primefaces/sakai-vue',
  //       target: '_blank',
  //     },
  //     {
  //       label: 'Nuxt Version',
  //       url: 'https://github.com/primefaces/sakai-nuxt',
  //       icon: 'pi pi-fw pi-star',
  //     },
  //   ],
  // },
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

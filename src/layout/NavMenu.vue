<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-fw pi-home',
    to: '/',
    command: () => {
      router.push('/');
    },
  },
  {
    label: 'Application View',
    items: [
      { label: 'SSR', icon: 'pi pi-fw pi-id-card', to: '/DSA/SSR' },
      { label: 'TSA', icon: 'pi pi-fw pi-check-square', to: '/DSA/TSA' },
      { label: 'VSA', icon: 'pi pi-fw pi-bookmark', to: '/DSA/VSA' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'PowerSystem ', icon: 'pi pi-fw pi-list', to: '/powersystem' },
      { label: 'Configuration ', icon: 'pi pi-fw pi-file-edit', to: '/Configuration' },

      { label: 'Study Mode', icon: 'pi pi-fw pi-clone', to: '/DSA/StudyMode' },
      { label: 'DSA Device', icon: 'pi pi-fw pi-cog', to: '/DSA/Setting' },
      { label: 'Task list', icon: 'pi pi-fw pi-calendar-plus', to: '/DSA/Task' },
    ],
  },
]);

const checkActiveRoute = (item) => router.currentRoute.value.path === item.to;
</script>

<template>
  <Menubar :model="items" class="border-none">
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
        <a
          v-ripple
          :href="href"
          v-bind="props.action"
          :class="{ 'active-route ': checkActiveRoute(item) }"
          @click="navigate"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a
        v-else
        v-ripple
        :href="item.url"
        :target="item.target"
        v-bind="props.action"
        :class="{ 'active-route': checkActiveRoute(item) }"
      >
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
      </a>
    </template>
  </Menubar>
</template>

<style>
.active-route {
  font-weight: 700;
  color: var(--primary-color) !important;
}
</style>

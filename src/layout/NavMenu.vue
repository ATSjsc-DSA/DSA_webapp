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
      // { label: 'Configuration ', icon: 'pi pi-fw pi-file-edit', to: '/Configuration' },

      // { label: 'Study Mode', icon: 'pi pi-fw pi-clone', to: '/DSA/StudyMode' },
      { label: 'DSA Device', icon: 'pi pi-fw pi-cog', to: '/DSA/Setting' },
      { label: 'Task list', icon: 'pi pi-fw pi-calendar-plus', to: '/DSA/Task' },

      { label: 'User Configuration', icon: 'pi pi-file-edit', to: '/user_config' },
      {
        label: 'System Events',
        icon: 'pi pi-fw pi-clone',
        items: [
          {
            label: 'Contingencies',
            to: '/SystemEvents/Contingencies',
            // icon: 'pi pi-fw pi-cog',
          },
          {
            label: 'Subsystems',
            to: '/SystemEvents/Subsystems',
            // icon: 'pi pi-fw pi-cog',
          },
        ],
      },
    ],
  },
  {
    label: 'Grid Code',
    icon: 'pi pi-fw pi-id-card',
    to: '/gridcode/',
  },
]);

const checkActiveRoute = (item) => router.currentRoute.value.path === item.to;
</script>

<template>
  <Menubar id="topbar-menu" :model="items" class="border-none text-nowrap">
    <template #item="{ item, props, hasSubmenu, root }">
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
        <i
          v-if="hasSubmenu"
          :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"
        ></i>
      </a>
    </template>
  </Menubar>
</template>

<style>
.active-route {
  font-weight: 700;
  color: var(--primary-color) !important;
}

#topbar-menu .p-menuitem-link {
  white-space: nowrap;
}
.p-menuitem .p-submenu-list {
  flex-direction: row; /* Đảm bảo menu xổ ngang */
}
</style>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { profileData, slotData } = storeToRefs(commonStore);

const router = useRouter();
const items = computed(() => {
  const userConfigPath = profileData.value._id ? '/user_config/config' : '/user_config/profile';
  const powerSystemPath = '/powersystem/ps';

  return [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      to: '/',
      command: () => {
        router.push('/');
      },
    },

    {
      label: 'Configuration',
      items: [
        { label: 'PowerSystem ', icon: 'pi pi-fw pi-list', to: powerSystemPath },
        {
          label: 'System Events',
          icon: 'pi pi-fw pi-clone',
          items: [
            {
              label: 'Contingencies',
              to: '/SystemEvents/Contingencies',
            },
            {
              label: 'Subsystems',
              to: '/SystemEvents/Subsystems',
            },
            {
              label: 'Dynamic Model Default',
              to: '/SystemEvents/dynamicModelDefault',
            },
          ],
        },
        {
          label: 'User Configuration',
          icon: 'pi pi-file-edit',
          to: userConfigPath,
        },
        {
          label: 'Grid Code',
          icon: 'pi pi-fw pi-id-card',
          to: '/gridcode/',
        },
        { label: 'DSA Device', icon: 'pi pi-fw pi-cog', to: '/DSA/Setting' },
        { label: 'Task list', icon: 'pi pi-fw pi-calendar-plus', to: '/DSA/Task' },
      ],
    },
  ];
});

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
.p-menubar .p-menuitem {
  margin: 0;
}
</style>

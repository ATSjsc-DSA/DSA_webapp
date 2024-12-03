<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { usePrimeVue } from 'primevue/config';

import NavMenu from './NavMenu.vue';

import DSA_api from '@/api/dsa_api';
import chartComposable from '@/combosables/chartData';
import { useCommonStore } from '@/store';
const { layoutConfig, isDarkTheme } = useLayout();
const { convertDateTimeToString } = chartComposable();
const commonStore = useCommonStore();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

const PrimeVue = usePrimeVue();
const logs = ref();
const countLogs = ref('0');
let logView = [];
const interval = ref(null);
const op = ref();
const { measInfo_automatic } = storeToRefs(commonStore);
onMounted(async () => {
  await commonStore.getMeasInfoActive();
  if (measInfo_automatic.value) {
    commonStore.startAutoUpdate();
  }
  bindOutsideClickListener();

  const theme = localStorage.getItem('theme');
  if (theme !== null) {
    const DarkMode = !!theme.includes('dark');

    const linkElement = document.getElementById('theme-css');

    // Thay đổi giá trị href bằng cách sử dụng replace
    if (linkElement) {
      linkElement.href = linkElement
        .getAttribute('href')
        .replace(/\/themes\/.*\/theme\.css/, `/themes/${theme}/theme.css`);
    }
    layoutConfig.theme.value = theme;
    layoutConfig.theme.darkTheme = DarkMode;
  }
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
  clearInterval(interval.value);
});

const toggleDarkMode = () => {
  const newDarkMode = !layoutConfig.darkTheme.value;
  const newThemeName = newDarkMode ? 'aura-dark-green' : 'aura-light-green';
  console.log('newThemeName', newThemeName);
  PrimeVue.changeTheme(layoutConfig.theme.value, newThemeName, 'theme-css', () => {
    layoutConfig.theme.value = newThemeName;
    setTimeout(() => {
      layoutConfig.darkTheme.value = newDarkMode;
    }, 100);
    localStorage.setItem('theme', newThemeName);
  });
};

watch(logs, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    logView = logs.value.filter((log) => {
      return log.viewed === false;
    });
    if (logView.length !== 0) {
      await nextTick();
      console.log('abc');
      const audio = new Audio('/img/SoundBible.mp3');
      audio.play();
    }
    countLogs.value = logView.length > 5 ? '5+' : String(logView.length);
  }
});

const toggle = async (event) => {
  op.value.toggle(event);
  try {
    const ids = logView.map((log) => log._id);
    const res = await DSA_api.putLogsViewed({ ids: ids });
    if (res.data.message === 'successfully') {
      countLogs.value = '0';
    }
  } catch (error) {}
};

const onTopBarUserView = () => {
  router.push('/DSA/user');
};
const onProjectView = () => {
  localStorage.removeItem('projectData');
  localStorage.removeItem('slotData');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('gridStackComponentArr');

  localStorage.setItem('user', user.data.username);
  localStorage.setItem('role', user.data.role);
  router.push('/Project');
};

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img src="/img/ATS_logo.png" alt="logo" />
      <span>DSA Solution</span>
    </router-link>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <nav-menu />
    <div class="layout-topbar-menu align-items-center" :class="topbarMenuClasses">
      <Button
        type="button"
        rounded
        outlined
        :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"
        class="mx-2"
        @click="toggleDarkMode"
      />

      <button v-tooltip.bottom="'User'" class="p-link layout-topbar-button" type="text" @click="onTopBarUserView()">
        <i class="pi pi-user"></i>
        <span>User</span>
      </button>
      <button v-tooltip.bottom="'Project'" class="p-link layout-topbar-button" type="text" @click="onProjectView()">
        <i class="pi pi-sign-out"></i>
        <span>Project</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

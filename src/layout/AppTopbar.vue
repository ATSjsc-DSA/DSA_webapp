<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

import NavMenu from './NavMenu.vue';

import DSA_api from '@/api/dsa_api';
import chartComposable from '@/combosables/chartData';
import { intervalTime } from '@/Constants/';
import { useCommonStore } from '@/store';
const { layoutConfig, onMenuToggle } = useLayout();
const { convertDateTimeToString } = chartComposable();
const commonStore = useCommonStore();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

const logs = ref();
const countLogs = ref('0');
let logView = [];
const interval = ref(null);
const op = ref();
const audioSrc = '@/public/img/Elevator Ding-SoundBible.com-685385892.mp3';

onMounted(async () => {
  await commonStore.getPsmIdActive();
  await commonStore.getListPsm();
  commonStore.startAutoUpdate();
  bindOutsideClickListener();
  getLogs();
  interval.value = setInterval(() => {
    getLogs();
  }, intervalTime);
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
  clearInterval(interval.value);
});

const getLogs = async () => {
  try {
    const res = await DSA_api.getLogs();
    logs.value = res.data.items;
  } catch (error) {}
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
  localStorage.removeItem('projectId');
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

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <div v-tooltip.bottom="'Notification'" class="p-link layout-topbar-notifi" type="text" @click="toggle">
        <i v-if="countLogs === '0'" class="pi pi-bell"></i>
        <i v-else v-badge.danger="countLogs" class="pi pi-bell" />
        <OverlayPanel ref="op" appendTo="body">
          <DataTable
            v-model:selection="selectedProduct"
            :value="logs"
            selectionMode="single"
            :rows="5"
            highlightOnSelect
            scrollable
            scrollHeight="400px"
          >
            <Column field="timestamp" header="Timestamp" sortable style="min-width: 8rem">
              <template #body="slotProps"> {{ convertDateTimeToString(slotProps.data.timestamp) }} </template>
            </Column>

            <Column field="event" header="Event" style="min-width: 18rem"> </Column>
          </DataTable>
        </OverlayPanel>
      </div>
      <button v-tooltip.bottom="'User'" class="p-link layout-topbar-button" type="text" @click="onTopBarUserView()">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <button v-tooltip.bottom="'Project'" class="p-link layout-topbar-button" type="text" @click="onProjectView()">
        <i class="pi pi-sign-out"></i>
        <span>Project</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

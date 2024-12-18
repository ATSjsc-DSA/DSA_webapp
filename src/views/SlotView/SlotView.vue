<template>
  <div class="card layout-content m-4 py-6">
    <div class="flex align-items-start justify-content-center py-6">
      <DataTable
        id="slotList"
        :value="slotList"
        dataKey="_id"
        tableStyle="width: 80rem;"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        :loading="isLoadingData"
        :rowClass="rowClass"
      >
        <template #header>
          <div class="flex align-items-center justify-content-between">
            <div class="font-semibold text-xl py-3">Power System Workspace</div>
            <router-link to="/Project">
              <Button v-tooltip.bottom="'Project'" severity="secondary" icon="pi pi-sign-out" text />
            </router-link>
          </div>
        </template>
        <Column field="name" frozen header="Name" style="text-wrap: nowrap; width: 8rem">
          <template #body="{ data }">
            <div class="text-left">
              {{ data.name }}
            </div>
          </template>
        </Column>
        <Column field="description" header="Description" style="text-wrap: nowrap" />

        <Column class="" alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
          <template #body="{ data }">
            <Button
              v-if="data.name === 'Online'"
              v-tooltip.bottom="'Open Power System'"
              icon="pi pi-caret-right"
              :text="data.name !== slotData.name"
              rounded
              class="flex m-auto"
              @click="saveSlotDataAndRedirect(data)"
            />
            <Button
              v-else
              v-tooltip.bottom="data.name === slotData.name ? 'Open Power System' : 'Setting Power System'"
              icon="pi pi-caret-right"
              :text="data.name !== slotData.name"
              rounded
              class="flex m-auto"
              @click="confirmRunSlot($event, data)"
            />
          </template>
        </Column>
        <template #empty> No Data </template>
      </DataTable>
    </div>
  </div>
  <ConfirmDialog group="runDialog">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: #fb923c"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div class="font-semibold">This Action will affect the final calculation result.</div>
          <div class="text-orange-500 font-semibold">Are you sure you want to Continue?</div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
<script setup>
import { onMounted } from 'vue';
import { isNavigationFailure, NavigationFailureType } from 'vue-router';

import router from '@/router';
import { useCommonStore } from '@/store';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { Api } from './api';
// import from '@/views/ProjectView/api.js';
import ApiOnline from '../ProjectView/api';

const commonStore = useCommonStore();
const { slotData } = storeToRefs(commonStore);
const confirm = useConfirm();
onMounted(async () => {
  await getList();
});

const slotList = ref([]);
const isLoadingData = ref(false);
const onlineMode = ref({});
const getList = async () => {
  isLoadingData.value = true;
  try {
    const res = await Api.getList();
    await getOnlineModeId();
    if (onlineMode.value) {
      res.data.push(onlineMode.value);
    }
    slotList.value = res.data;
  } catch (error) {
    slotList.value = [];
    console.log('getList: error ', error);
  }
  isLoadingData.value = false;
};
const getOnlineModeId = async () => {
  try {
    const res = await ApiOnline.getOnlineModeId();
    if (res.data.description === '') {
      res.data.description = 'Read Only';
    }
    onlineMode.value = res.data;
  } catch (error) {
    return;
  }
};
const confirmRunSlot = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Config Workspace - ' + data.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-cog',
    group: 'runDialog',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-success',
    rejectLabel: 'Cancel',
    acceptLabel: 'Config',
    accept: () => {
      saveSlotDataAndRedirect(data);
    },
    reject: () => {},
  });
};
const rowClass = (data) => {
  return [{ 'bg-primary text-white': data.name === slotData.value.name }];
};
const saveSlotDataAndRedirect = (newSlot) => {
  slotData.value = newSlot;
  localStorage.setItem('slotData', JSON.stringify(newSlot));
  router.push('/powersystem/ps').catch((failure) => {
    console.log('router.push failure', failure);
    if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
      // Handle the failure
      console.log('Navigation was redirected');
    }
  });
};
</script>

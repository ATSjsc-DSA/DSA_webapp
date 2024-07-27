<template>
  <div class="card flex-auto">
    <div class="flex mb-2 gap-2 justify-content-end">
      <i v-badge.danger class="pi pi-calendar" style="font-size: 1.2rem" />
      {{ time }}
    </div>
    <TabView>
      <TabPanel header="Common">
        <DSA_CommonConfig></DSA_CommonConfig>
      </TabPanel>
      <TabPanel header="SPS-F81">
        <DSA_F81_table></DSA_F81_table>
      </TabPanel>
      <TabPanel header="SPS-F27">
        <DSA_F27_table></DSA_F27_table>
      </TabPanel>
      <TabPanel header="SPS-PT">
        <DSA_SPS_PowerTrans></DSA_SPS_PowerTrans>
      </TabPanel>
      <TabPanel header="SSR">
        <DSA_SSRConfig></DSA_SSRConfig>
      </TabPanel>
      <TabPanel header="TSAT">
        <DSA_TSATConfig></DSA_TSATConfig>
      </TabPanel>
      <TabPanel header="TSA Common">
        <DSA_TSA_common></DSA_TSA_common>
      </TabPanel>
      <!-- <TabPanel header="VSA">
        <DSA_VSAConfig></DSA_VSAConfig>
      </TabPanel> -->
    </TabView>
    <div class="flex justify-content-end mt-3">
      <Button label="Submit" @click="createNewInitSetting" />
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import dsa_api from '@/api/dsa_api';
import { useConfirm } from 'primevue/useconfirm';
import DSA_CommonConfig from '@/components/DSA_CommonConfig.vue';
import DSA_F81_table from '@/components/DSA_F81_table.vue';
import DSA_F27_table from '@/components/DSA_F27_table.vue';
import DSA_SPS_PowerTrans from '@/components/DSA_SPS_PowerTrans.vue';
import DSA_SSRConfig from '@/components/DSA_SSRConfig.vue';
import DSA_TSATConfig from '@/components/DSA_TSATConfig.vue';
// import DSA_VSAConfig from '@/components/DSA_VSAConfig.vue';
import { useDSAStore } from '@/store';
import DSA_Common from '@/combosables/DSA_common';
import chartComposable from '@/combosables/chartData';
import DSA_TSA_common from '@/components/DSA_TSA_common.vue';
// import DSA_TSAT_common from '@/components/DSA_TSAT_common.vue';
import { useToast } from 'primevue/usetoast';
const { convertDateTimeToString } = chartComposable();
const dsaStore = useDSAStore();
const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
  await dsaStore.getProfile();
  dsaStore.getListContingencies();
  dsaStore.getListAreaWithoutEquip();
  dsaStore.getListMonitorWithoutEquip();
});

onUnmounted(() => {
  dsaStore.dataProfile.value = {};
  dsaStore.listContingencies.value = [];
});

const createNewInitSetting = async () => {
  const res = await dsaStore.createNewProfile();
  if (res.status !== 200) {
    toast.add({
      severity: 'error',
      summary: 'Success Message',
      detail: res.data.detail,
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: res.data.message,
      life: 3000,
    });
    dsaStore.getProfile();
  }
};

const time = computed(() => convertDateTimeToString(dsaStore.dataProfile.timestamp));
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
  // cancel the navigation and stay on the same page
  if (!answer) return false;
});
</script>

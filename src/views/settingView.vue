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
      <TabPanel header="VSA">
        <DSA_VSAConfig></DSA_VSAConfig>
      </TabPanel>
    </TabView>
    <div class="flex justify-content-end mt-3">
      <Button label="Submit" @click="createNewInitSetting" />
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<script setup>
import { ref, markRaw } from 'vue';
import dsa_api from '@/api/dsa_api';
import { useConfirm } from 'primevue/useconfirm';
import DSA_CommonConfig from '@/components/DSA_CommonConfig.vue';
import DSA_F81_table from '@/components/DSA_F81_table.vue';
import DSA_F27_table from '@/components/DSA_F27_table.vue';
import DSA_SPS_PowerTrans from '@/components/DSA_SPS_PowerTrans.vue';
import DSA_SSRConfig from '@/components/DSA_SSRConfig.vue';
import DSA_TSATConfig from '@/components/DSA_TSATConfig.vue';
import DSA_VSAConfig from '@/components/DSA_VSAConfig.vue';
import { useDSAStore } from '@/store';

const dsaStore = useDSAStore();
const confirm = useConfirm();
import { useToast } from 'primevue/usetoast';
const toast = useToast();

onMounted(async () => {
  await dsaStore.getSetting();
});

const createNewInitSetting = () => {
  dsaStore.createNewSetting();
  dsaStore.getSetting();
};
const convertUTCtoLocalTime = (utcTimeString) => {
  // Tạo một đối tượng Date từ chuỗi thời gian UTC
  const dateTimeWithoutMilliseconds = utcTimeString.replace(/\.\d+$/, '') + 'Z';

  const utcDate = new Date(dateTimeWithoutMilliseconds);
  return utcDate.toLocaleString(); // hoặc localDate.toLocaleDateString() tùy vào nhu cầu
};

const time = computed(() => convertUTCtoLocalTime(dsaStore.dataSetting.timestamp));
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
  // cancel the navigation and stay on the same page
  if (!answer) return false;
});
</script>

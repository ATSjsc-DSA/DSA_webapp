<script setup>
// import VSA_Chart from './VSA_Chart.vue';
// import VSA_dashboard from './VSA_dashboard.vue';
// import VSA_api from '@/api/vsa_api';
// import VSA_PanelArea from './VSA_PanelArea.vue';
import VSA_ChartProgres from './VSA_ChartProgres.vue';
import TSA_api from '@/module/TSA/api/tsa_api';
import Tag from 'primevue/tag';
import { intervalTime } from '@/Constants/';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

// primeVue
const dataListArea = ref([]);
const interval = ref(null);

const getListTypeLine = async () => {
  try {
    const res = await TSA_api.getListAreaTC();
    dataListArea.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const PmaxZone = (value1, value2) => {
  if (value1 >= value2) {
    return value1;
  } else return value2;
};

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListTypeLine();
    }, 1000);
  }
});
onMounted(async () => {
  await getListTypeLine();
  interval.value = setInterval(() => {
    getListTypeLine();
  }, intervalTime);
});
onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="h-full card flex flex-column gap-8 justify-content-center">
    <div v-for="(area, index) in dataListArea" :key="index" class="flex flex-column gap-2">
      <div class="flex justify-content-center">
        <Tag :value="area.name"></Tag>
      </div>
      <div class="flex-1 flex flex-column gap-6">
        <div class="flex-1 flex gap-2">
          <span class="text-gen">VSA</span>
          <VSA_ChartProgres
            :PmaxZone="PmaxZone(area.pv.online, area.TSAT.online)"
            :Pmax_area="area.pv.online"
            :P_area="area.pv.current"
          ></VSA_ChartProgres>
        </div>
        <div class="flex-1 flex gap-2">
          <span class="text-gen">TSA</span>
          <VSA_ChartProgres
            :PmaxZone="PmaxZone(area.pv.online, area.TSAT.online)"
            :Pmax_area="area.TSAT.online"
            :P_area="area.TSAT.current"
          ></VSA_ChartProgres>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  border-radius: 0;
  margin-bottom: 0px;
  margin: 0;
  overflow-y: auto;
}
.text-gen {
  color: var(--text-color);
  font-size: small;
  margin-bottom: 0.2rem;
}
</style>
<!-- <template>
  <div class="h-full flex flex-column gap-8 card">
    <div v-for="area in listDataArea" :key="area.name" class="flex-1">
      <VSA_ChartProgres :dataArea="area" class="h-full"></VSA_ChartProgres>
    </div>
    <div class="flex-1 flex flex-column gap-2">
      <div class="flex justify-content-center">
        <Tag value="Area1-Area2"></Tag>
      </div>
      <div class="flex-1 flex flex-column gap-6">
        <div class="flex-1 flex gap-2">
          <span class="text-gen">VSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone1" :Pmax_area="VSA1_Pmax" :P_area="curent1_Pmax"></VSA_ChartProgres>
        </div>
        <div class="flex-1 flex gap-2">
          <span class="text-gen">TSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone1" :Pmax_area="TSA1_Pmax" :P_area="curent1_Pmax"></VSA_ChartProgres>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-column gap-2">
      <div class="flex justify-content-center">
        <Tag value="Area2-Area1"></Tag>
      </div>
      <div class="flex-1 flex flex-column gap-6">
        <div class="flex-1 flex gap-2">
          <span class="text-gen">VSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone2" :Pmax_area="VSA2_Pmax" :P_area="curent2_Pmax"></VSA_ChartProgres>
        </div>
        <div class="flex-1 flex gap-2">
          <span class="text-gen">TSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone2" :Pmax_area="TSA2_Pmax" :P_area="curent2_Pmax"></VSA_ChartProgres>
        </div>
      </div>
    </div>
  </div>
</template> -->
<!-- zone1: {
    curent: 554.6593147,
    pv: 3807.440671,
    tsat: 554.6593147,
  },
  zone2: {
    curent: 2610,
    pv: 5922.739794,
    tsat: 3345.422332,
  }, -->

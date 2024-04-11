<script setup>
import VSA_Chart from './VSA_Chart.vue';
import VSA_dashboard from './VSA_dashboard.vue';
import VSA_api from '@/api/vsa_api';
import VSA_PanelArea from './VSA_PanelArea.vue';
import VSA_ChartProgres from './VSA_ChartProgres.vue';
import TSA_api from '@/api/tsa_api';
import Tag from 'primevue/tag';
import { intervalTime } from '@/Constants/';

// primeVue
const dataListArea = ref({
  zone1: {
    curent: 554.6593147,
    pv: 3807.440671,
    tsat: 554.6593147,
  },
  zone2: {
    curent: 2610,
    pv: 5922.739794,
    tsat: 3345.422332,
  },
});
const interval = ref(null);

const getListTypeLine = async () => {
  try {
    const res = await TSA_api.getTransCapData();
    if (!res.data.success) {
      //   toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      dataListArea.value = res.data.payload;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const VSA1_Pmax = computed(() => dataListArea.value.zone1.pv);
const VSA2_Pmax = computed(() => dataListArea.value.zone2.pv);
const TSA1_Pmax = computed(() => dataListArea.value.zone1.tsat);
const TSA2_Pmax = computed(() => dataListArea.value.zone2.tsat);
const curent1_Pmax = computed(() => dataListArea.value.zone1.curent);
const curent2_Pmax = computed(() => dataListArea.value.zone2.curent);
const PmaxZone1 = computed(() => {
  if (VSA1_Pmax.value >= TSA1_Pmax.value) {
    return VSA1_Pmax.value;
  } else return TSA1_Pmax.value;
});
const PmaxZone2 = computed(() => {
  if (VSA2_Pmax.value >= TSA2_Pmax.value) {
    return VSA2_Pmax.value;
  } else return TSA2_Pmax.value;
});
onMounted(async () => {
  await getListTypeLine();
  interval.value = setInterval(() => {
    getListTypeLine();
  }, intervalTime);
});
</script>

<template>
  <div class="h-full flex flex-column gap-8 card">
    <!-- <div v-for="area in listDataArea" :key="area.name" class="flex-1">
      <VSA_ChartProgres :dataArea="area" class="h-full"></VSA_ChartProgres>
    </div> -->
    <div class="flex-1 flex flex-column gap-2">
      <Tag value="North-Central" class="w-2 mb-1"></Tag>
      <div class="flex-1 flex flex-column gap-6">
        <div class="flex-1">
          <span class="text-gen">VSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone1" :Pmax_area="VSA1_Pmax" :P_area="curent1_Pmax"></VSA_ChartProgres>
        </div>
        <div class="flex-1">
          <span class="text-gen">TSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone1" :Pmax_area="TSA1_Pmax" :P_area="curent1_Pmax"></VSA_ChartProgres>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-column gap-2">
      <Tag value="Central-South" class="w-2"></Tag>
      <div class="flex-1 flex flex-column gap-6">
        <div class="flex-1">
          <span class="text-gen">VSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone2" :Pmax_area="VSA2_Pmax" :P_area="curent2_Pmax"></VSA_ChartProgres>
        </div>
        <div class="flex-1">
          <span class="text-gen">TSA</span>
          <VSA_ChartProgres :PmaxZone="PmaxZone2" :Pmax_area="TSA2_Pmax" :P_area="curent2_Pmax"></VSA_ChartProgres>
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
}
.text-gen {
  color: var(--text-color);
  font-size: small;
  margin-bottom: 0.2rem;
}
</style>

<script setup>
import VSA_Chart from './VSA_Chart.vue';
import VSA_dashboard from './VSA_dashboard.vue';
import VSA_api from '@/api/vsa_api';
import VSA_PanelArea from './VSA_PanelArea.vue';
import { intervalTime } from '@/Constants/';

// primeVue
const listDataArea = ref([]);

const getListArea = async () => {
  try {
    const res = await VSA_api.getAreaList();
    if (!res.data.success) {
    } else {
      listDataArea.value = res.data.payload;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const interval = ref(null);

onMounted(async () => {
  await getListArea();
  interval.value = setInterval(() => {
    getListArea();
  }, intervalTime);
});
</script>

<template>
  <div class="h-full grid gap-3">
    <div v-for="area in listDataArea" :key="area.name" class="col">
      <VSA_PanelArea :dataArea="area"></VSA_PanelArea>
    </div>
    <!-- <div class="col-4">
      <VSA_dashboard :listDataArea="listDataArea"></VSA_dashboard>
    </div> -->
    <!-- <VSA_Chart :listDataArea="listDataArea" class="col-8 p-0"></VSA_Chart> -->
  </div>
</template>
<style lang="scss" scoped></style>

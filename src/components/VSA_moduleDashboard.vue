<script setup>
import VSA_Chart from './VSA_Chart.vue';
import VSA_dashboard from './VSA_dashboard.vue';
import VSA_api from '@/api/vsa_api';
import VSA_PanelArea from './VSA_PanelArea.vue';
import VSA_ChartProgres from './VSA_ChartProgres.vue';
import TSA_api from '@/api/tsa_api';

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
const getListTypeLine = async () => {
  try {
    const res = await TSA_api.getListTypeLine();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      if (res.data.payload[0]) {
        listTypeLine.value = res.data.payload;
        typelineActive.value = res.data.payload[0].name;
      }
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
onMounted(async () => {
  await getListArea();
  await getListTypeLine();
});
</script>

<template>
  <div class="h-full flex flex-column gap-8 p-8">
    <div v-for="area in listDataArea" :key="area.name" class="flex-1">
      <VSA_ChartProgres :dataArea="area" class="h-full"></VSA_ChartProgres>
    </div>
    <!-- <div class="col-4">
      <VSA_dashboard :listDataArea="listDataArea"></VSA_dashboard>
    </div> -->
    <!-- <VSA_Chart :listDataArea="listDataArea" class="col-8 p-0"></VSA_Chart> -->
  </div>
</template>
<style lang="scss" scoped></style>

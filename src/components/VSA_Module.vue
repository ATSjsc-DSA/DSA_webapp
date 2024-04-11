<script setup>
import VSA_Chart from './VSA_Chart.vue';
import VSA_dashboard from './VSA_dashboard.vue';
import VSA_api from '@/api/vsa_api';
import VSA_PanelArea from './VSA_PanelArea.vue';
import { intervalTime } from '@/Constants/';
import { computed } from 'vue';

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
const dataArea1 = computed(() => (listDataArea.value.length > 0 ? listDataArea.value[0] : null));
const dataArea2 = computed(() => (listDataArea.value.length > 1 ? listDataArea.value[1] : null));
const dataArea3 = computed(() => (listDataArea.value.length > 2 ? listDataArea.value[2] : null));

const interval = ref(null);

onMounted(async () => {
  await getListArea();
  interval.value = setInterval(async () => {
    getListArea();
  }, intervalTime);
});
</script>

<template>
  <div class="h-full grid gap-3">
    <div v-if="dataArea1" class="col">
      <VSA_PanelArea :dataArea="dataArea1"></VSA_PanelArea>
    </div>
    <div v-if="dataArea2" class="col">
      <VSA_PanelArea :dataArea="dataArea2"></VSA_PanelArea>
    </div>
    <div v-if="dataArea3" class="col">
      <VSA_PanelArea :dataArea="dataArea3"></VSA_PanelArea>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>

<script setup>
import VSA_api from '../api/vsa_api';
import VSA_PanelArea from './VSA_PanelArea.vue';
import { intervalTime } from '@/Constants/';
import { computed } from 'vue';
import { useCommonStore } from '@/store';
import VSA_areChart from './VSA_areChart.vue';

const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

// primeVue
const listDataArea = ref([]);

const getListArea = async () => {
  try {
    const res = await VSA_api.getAreaList();
    listDataArea.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const dataArea1 = computed(() => (listDataArea.value.length > 0 ? listDataArea.value[0] : null));
const dataArea2 = computed(() => (listDataArea.value.length > 1 ? listDataArea.value[1] : null));
const dataArea3 = computed(() => (listDataArea.value.length > 2 ? listDataArea.value[2] : null));

const interval = ref(null);

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      getListArea();
    }, 1000);
  }
});

onMounted(async () => {
  await getListArea();
  // interval.value = setInterval(async () => {
  //   getListArea();
  // }, intervalTime);
});
onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="h-full grid">
    <div v-if="dataArea1" class="col-4">
      <VSA_areChart :areaActive="dataArea1"></VSA_areChart>
      <!-- <VSA_PanelArea :dataArea="dataArea1"></VSA_PanelArea> -->
    </div>
    <div v-if="dataArea2" class="col-4">
      <VSA_areChart :areaActive="dataArea2"></VSA_areChart>
      <!-- <VSA_PanelArea :dataArea="dataArea2"></VSA_PanelArea> -->
    </div>
    <div v-if="dataArea3" class="col-4">
      <VSA_areChart :areaActive="dataArea3"></VSA_areChart>
      <!-- <VSA_PanelArea :dataArea="dataArea3"></VSA_PanelArea> -->
    </div>
  </div>
</template>
<style lang="scss" scoped></style>

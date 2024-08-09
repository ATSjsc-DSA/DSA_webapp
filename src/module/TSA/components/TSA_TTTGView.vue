<script setup>
import TSA_ChartView from './TSA_ChartView.vue';
import TSA_api from '../api/tsa_api';
import TSA_GTTTChart from './TSA_GTTTChart.vue';
import chartOverLayPanel from '@/components/chartOverLayPanel.vue';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
const listTypeLine = ref([]);
const typelineActive = ref('');
const getListArea = async () => {
  try {
    const res = await TSA_api.getListAreaTC();
    listTypeLine.value = res.data;
    typelineActive.value = listTypeLine.value[0]?.name;
  } catch (error) {}
};

const changeSubActive = async (param) => {
  typelineActive.value = param;
};

onMounted(async () => {
  await getListArea();
});

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListArea();
    }, 1000);
  }
});
</script>

<template>
  <div class="tsa-block row-gap-2">
    <div class="tsa-block-gtth">
      <div class="tttg-block">
        <chartOverLayPanel
          :listSub="listTypeLine"
          :subActive="typelineActive"
          @changeSubActive="changeSubActive"
          class="ssr-block-overlay"
        ></chartOverLayPanel>
        <TSA_GTTTChart :typelineActive="typelineActive"></TSA_GTTTChart>
      </div>
    </div>
    <div class="tsa-block-chart">
      <TSA_ChartView :typelineActive="typelineActive"></TSA_ChartView>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tsa-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-card);
  // padding: 0;
  // border: 1px solid var(--surface-border);
  // border-radius: 12px;

  // row-gap: 0.5rem;
  .tsa-block-gtth {
    flex: 1;
  }
  .tsa-block-chart {
    flex: 2;
  }
}
fieldset {
  // padding: 0;
  width: 100%;
}
.tttg-block {
  position: relative;
  height: 100%;
  width: 100%;
  .ssr-block-overlay {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    z-index: 100;
  }
}
</style>

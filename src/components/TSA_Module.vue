<script setup>
import TSA_SPSCheck from './TSA_SPSCheck.vue';
import TSA_GTTTCheck from './TSA_GTTTCheck.vue';
import TSA_ChartView from './TSA_ChartView.vue';
import TSA_api from '@/api/tsa_api';

const listTypeLine = ref([]);

const getListTypeLine = async () => {
  try {
    const res = await TSA_api.getListTypeLine();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      listTypeLine.value = res.data.payload;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
onMounted(async () => {
  await getListTypeLine();
});
</script>

<template>
  <div class="grid h-full mt-0 pb-0">
    <div class="col-5 tsa-block">
      <TSA_SPSCheck></TSA_SPSCheck>
    </div>
    <div class="col-7 tsa-block row-gap-2">
      <div class="tsa-block-gtth">
        <TSA_GTTTCheck :listTypeLine="listTypeLine"></TSA_GTTTCheck>
      </div>
      <div class="tsa-block-chart">
        <TSA_ChartView :listTypeLine="listTypeLine"></TSA_ChartView>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tsa-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
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
</style>

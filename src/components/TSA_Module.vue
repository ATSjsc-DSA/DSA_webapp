<script setup>
import TSA_SPSCheck from './TSA_SPSCheck.vue';
import TSA_api from '@/api/tsa_api';
import TSA_TTTGView from './TSA_TTTGView.vue';

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
  <div class="grid h-full mt-0">
    <TSA_SPSCheck class="col-5 pt-0"></TSA_SPSCheck>
    <div class="col-7 py-0">
      <TSA_TTTGView></TSA_TTTGView>
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

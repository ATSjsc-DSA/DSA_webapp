<script setup>
import VSA_api from '@/api/vsa_api';
import VSA_OverlayPannelBusbar from './VSA_OverlayPannelBusbar.vue';
import comboChartBase from './comboChartBase.vue';
import VSA_BusbarSelect from './VSA_BusbarSelect.vue';
import { useToast } from 'primevue/usetoast';
import { intervalTime } from '@/Constants/';

import Tag from 'primevue/tag';

import Toast from 'primevue/toast';
const toast = useToast();
// primeVue

const props = defineProps({
  areaActive: {
    type: Object,
    requied: true,
  },
});

const areaActive = ref(props.areaActive.Name);
const p_area = ref(props.areaActive.P_area);
const Pmax_area = ref(props.areaActive.Pmax_area);
const listBusbar = ref([]);
const detailBusbars = ref([]);
const getListBusbar = async () => {
  try {
    const res = await VSA_api.getBusbarList(areaActive.value);
    if (!res.data.success) {
    } else {
      listBusbar.value = res.data.payload;
      busbarsActive.value = [listBusbar.value[0]];
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const getDetailBusbars = async (lisBusbar) => {
  const payload = [];
  lisBusbar.forEach((element) => {
    payload.push(element.name);
  });

  try {
    const res = await VSA_api.detailBusBar(areaActive.value, { payload: payload });
    if (!res.data.success) {
    } else {
      detailBusbars.value = res.data.payload;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
const busbarsActive = ref([]);
const changeListBusbar = (lisBusbar) => {
  getDetailBusbars(lisBusbar);
};
onMounted(async () => {
  await getListBusbar();
  await getDetailBusbars(busbarsActive.value);
});
</script>

<template>
  <div class="areaChart">
    <comboChartBase :chartData="detailBusbars" :P_area="p_area" :Pmax_area="Pmax_area"></comboChartBase>
    <!-- <Tag severity="info" :value="areaActive" class="areaNameChart"></Tag> -->
    <span class="areaNameChart">{{ areaActive }}</span>
    <div class="selectAreaChart">
      <VSA_OverlayPannelBusbar
        :listBusbar="listBusbar"
        :busbarsActive="busbarsActive"
        @changeListBusbar="changeListBusbar"
      ></VSA_OverlayPannelBusbar>
      <!-- <VSA_BusbarSelect :listBusbar="listBusbar" @changeListBusbar="changeListBusbar"></VSA_BusbarSelect> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.areaChart {
  height: 100%;
  width: 100%;
  position: relative;
  .selectAreaChart {
    position: absolute;
    top: 0rem;
    right: 0rem;
  }
  .areaNameChart {
    position: absolute;
    top: 0.2rem;
    left: 50%;
    border-radius: 0%;
  }
}
</style>

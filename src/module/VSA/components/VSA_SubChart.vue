<script setup>
import VSA_api from '../api/vsa_api';
import VSA_OverlayPannelBusbar from './VSA_OverlayPannelBusbar.vue';
import comboChartBase from '@/components/comboChartBase.vue';
import VSA_BusbarSelect from './VSA_BusbarSelect.vue';
import { useToast } from 'primevue/usetoast';
import { intervalTime } from '@/Constants/';
import ProgressBar from 'primevue/progressbar';

import Tag from 'primevue/tag';

import Toast from 'primevue/toast';
import { computed } from 'vue';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

const toast = useToast();
// primeVue

const props = defineProps({
  busbarsActive: {
    type: Object,
    requied: true,
  },
  listBusbar: {
    type: Array,
  },
});

const p_area = 10;
// const p_area = computed(() => props.areaActive.P_area);

const busbarsActive = computed(() => props.busbarsActive)
const listBusbar = computed(() => props.listBusbar)
const changeListBusbar = (lisBusbar) => {
  getDetailBusbars(lisBusbar);
};
onMounted(async () => {
  await getDetailBusbars(busbarsActive.value);
});
watch(props.areaActive, (newVal, oldValue) => {});

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListBusbar();
      await getDetailBusbars(busbarsActive.value);
    }, 1000);
  }
});
</script>

<template>
  <div class="areaChart flex flex-column">
    <div class="flex-1">
      <comboChartBase :chartData="detailBusbars" :P_area="p_area" :Pmax_area="Pmax_area"></comboChartBase>
    </div>
    <div class="card">
      <div class="selectAreaChart">
        <VSA_OverlayPannelBusbar
          :listBusbar="listBusbar"
          :busbarsActive="busbarsActive"
          @changeListBusbar="changeListBusbar"
        ></VSA_OverlayPannelBusbar>
      </div>
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
.card {
  border-radius: 0;
  padding: 10px;
}
.progressBar {
  border-radius: 0px;
}
.p-progressbar-value {
  background-color: greenyellow !important;
}
.dataP {
  position: absolute;
  color: var(--text-color-secondary);
  font-size: 0.7rem;
}
.p_area {
  left: 1%;
}
.p_curent {
  left: 80%;
}
.pmax_area {
  right: 1%;
}
.progress-outer {
  width: 96%;
  margin: 10px 2%;
  padding: 3px;
  text-align: center;
  background-color: var(--surface-ground);
  border: 1px solid var(--surface-ground);
  color: var(--surface-ground);
  // border-radius: 20px;
  position: relative;
}

.progress-inner {
  min-width: 15%;
  white-space: nowrap;
  overflow: hidden;
  padding: 5px;
  // border-radius: 20px;
  background-color: green;
}

.progressBarCurrent {
  color: var(--text-color);
  float: center;
  font-size: 0.8rem;
}

.progressBarGoal {
  color: var(--text-color);
  position: absolute;
  font-size: 0.8rem;
  right: 5px;
}
</style>

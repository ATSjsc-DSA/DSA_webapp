<template>
  <div
    v-if="!measInfo_automatic"
    class="card h-full flex justify-content-between align-items-center"
    style="border-radius: 6px"
  >
    <Button
      class="measInfoBtn"
      :disabled="!canGetPrev"
      :severity="canGetPrev ? 'primary' : 'secondary'"
      icon="pi pi-angle-left"
      text
      @click="getPrevIndex"
    />
    <div v-if="measInfoList.length > 0" class="flex-grow-1 text-center">
      {{ formatMeasInfo(measInfoList[currentIndex].createdTimestamp) }}
    </div>
    <div v-else class="flex-grow-1 text-center">{{ isLoadingList ? 'Loading . . .' : 'No His HMI data' }}</div>
    <Button
      class="measInfoBtn"
      :disabled="!canGetNext"
      :severity="canGetNext ? 'primary' : 'secondary'"
      icon="pi pi-angle-right"
      text
      @click="getNextIndex"
    />
  </div>
  <div v-else class="card h-full flex justify-content-between align-items-center" style="border-radius: 6px">
    <div class="flex-grow-1 text-center">
      {{ formatMeasInfo(measInfoActive.createdTimestamp) }}
    </div>
  </div>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { computed, watch } from 'vue';
import DSA_api from '@/api/dsa_api';
const commonStore = useCommonStore();
const emit = defineEmits(['reloadData']);

const { measInfoActive, projectData, measInfo_automatic } = storeToRefs(commonStore);

const currentIndex = ref(0);
const canGetPrev = computed(() => currentIndex.value > 0);
const canGetNext = computed(() => currentIndex.value < measInfoList.value.length - 1);
const isLoadingList = ref(false);
onMounted(async () => {
  isLoadingList.value = true;
  await getListMeasInfo();
  isLoadingList.value = false;
  if (measInfoList.value.length > 0) {
    currentIndex.value = measInfoList.value.length - 1;
  }
});

const measInfoList = ref([]);
watch(measInfo_automatic, async (isActive) => {
  if (isActive) {
    await commonStore.getMeasInfoActive();
    currentIndex.value = measInfoList.value.map((item) => item._id).indexOf(measInfoActive.value._id);
  }
});

watch(measInfoActive, async (newVal, oldVal) => {
  if (newVal._id && newVal._id !== oldVal._id) {
    if (measInfoList.value.map((item) => item._id).indexOf(newVal._id) !== -1) {
      currentIndex.value = measInfoList.value.map((item) => item._id).indexOf(newVal._id);
    }
  }
});

const getListMeasInfo = async () => {
  try {
    const res = await DSA_api.getListMeasInfo(projectData.value._id, {
      startTime: 0,
      endTime: 0,
    });
    const measInfoNotExist = res.data.filter(
      (item) => measInfoList.value.map((item) => item._id).indexOf(item._id) === -1,
    );
    measInfoNotExist.reverse();
    measInfoList.value = measInfoList.value.concat(measInfoNotExist);
  } catch (error) {
    console.log('getListMeasInfo error', error);
  }
};
const updateMeasInfoDelay = ref();
const getPrevIndex = async () => {
  currentIndex.value -= 1;
  await updateMeasInfo();
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getNextIndex = async () => {
  currentIndex.value += 1;
  await updateMeasInfo();
};
const updateMeasInfo = async () => {
  await delay(300);
  commonStore.updateMeasInfoActive(measInfoList.value[currentIndex.value]);
  emit('reloadData');
};

const formatMeasInfo = (timestamp) => {
  const date = new Date(timestamp * 1000); // Chuyển từ giây sang milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `Snapshot_${year}${month}${day}_${hours}${minutes}${seconds}`;
};
</script>

<style>
.measInfoBtn .p-button-icon {
  font-size: 1.5rem;
}
</style>

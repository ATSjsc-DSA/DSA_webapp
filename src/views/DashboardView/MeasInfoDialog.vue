<template>
  <Dialog v-model:visible="dialogVisible" modal header="Change Measurement Info" :style="{ width: '30rem' }">
    <template #header>
      <div class="flex align-items-center justify-content-between gap-2 w-full">
        <div>Change Measurement Info</div>
        <Button
          type="button"
          :icon="pinMeasInfo ? 'pi pi-eye-slash' : 'pi pi-eye'"
          severity="secondary"
          text
          @click="pinMeasInfo = !pinMeasInfo"
        />
      </div>
    </template>
    <span class="p-text-secondary block mb-5">Select Active Measure</span>
    <div class="flex gap-2 mb-5">
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time start </label>
        <Calendar id="calendar-24h" v-model="timeStart" showTime hourFormat="24" />
      </div>
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time end </label>
        <Calendar
          id="calendar-24h"
          v-model="timeEnd"
          showTime
          hourFormat="24"
          @update:modelValue="updateMeasInfoList"
        />
      </div>
    </div>
    <div class="flex flex-column gap-2 mb-5">
      <label for="profile" class="font-semibold">Measurement Info List</label>
      <Dropdown
        id="profile"
        v-model="MeasInfoSelect"
        :options="measInfoList"
        :placeholder="loadingMeasInfo ? 'Loading...' : 'Select timestamp'"
        class="!w-full"
        :loading="loadingMeasInfo"
      >
        <template #value="slotProps">
          <div class="flex align-items-center">
            {{ formatMeasInfo(slotProps.value.createdTimestamp) }}
          </div>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            {{ formatMeasInfo(slotProps.option.createdTimestamp) }}
          </div>
        </template>
      </Dropdown>
    </div>

    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="$emit('update:dialogVisible', false)"></Button>
      <Button type="button" label="Save" @click="updateMeasInfo()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import chartComposable from '@/combosables/chartData';
import { computed } from 'vue';

const { convertDateTimeToString } = chartComposable();

const prop = defineProps({
  dialogVisible: Boolean,
  typeOptions: {
    type: Array,
    default: () => [],
  },
});

const pinMeasInfo = defineModel();
const dialogVisible = computed({
  get: () => prop.dialogVisible,
  set: (value) => {
    emit('update:dialogVisible', value);
  },
});
const confirm = useConfirm();
const commonStore = useCommonStore();
const { measInfoActive, measInfoList, measInfo_automatic } = storeToRefs(commonStore);
const MeasInfoSelect = ref(measInfoActive.value);
const timeStart = ref();
const timeEnd = ref();
const loadingMeasInfo = ref(false);
const emit = defineEmits(['update:dialogVisible', 'reloadData']);

const updateMeasInfoList = async () => {
  try {
    loadingMeasInfo.value = true;
    await commonStore.getListMeasInfo(timeStart.value, timeEnd.value);
    setTimeout(() => {
      loadingMeasInfo.value = false;
    }, 1000);
  } catch (error) {}
};

const updateMeasInfo = async () => {
  console.log(MeasInfoSelect.value, 'MeasInfoSelect.value');

  commonStore.updateMeasInfoActive(MeasInfoSelect.value);
  emit('update:dialogVisible', false);
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

// watch(measInfoActive, (oldValue, newValue) => {
//   if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
//     MeasInfoSelect.value = newValue;
//   }
// });

onMounted(async () => {
  await commonStore.getListMeasInfo();
});
onUnmounted(() => {
  commonStore.clearData();
});
</script>

<style lang="scss" scoped></style>

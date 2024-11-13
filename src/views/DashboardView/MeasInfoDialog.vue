<template>
  <Dialog v-model:visible="dialogVisible" modal header="Change Power System Model" :style="{ width: '30rem' }">
    <span class="p-text-secondary block mb-5">Update power system model information.</span>
    <div class="flex gap-2 mb-5">
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time start </label>
        <Calendar id="calendar-24h" v-model="timeStart" showTime hourFormat="24" />
      </div>
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time end </label>
        <Calendar id="calendar-24h" v-model="timeEnd" showTime hourFormat="24" @update:modelValue="updatePSMList" />
      </div>
    </div>
    <div class="flex flex-column gap-2 mb-5">
      <label for="profile" class="font-semibold">Power System Model</label>
      <Dropdown
        id="profile"
        v-model="psmSelect"
        :options="psmList"
        optionLabel="name"
        :placeholder="loadingMeasInfo ? 'Loading...' : 'Select timestamp'"
        class="!w-full"
        :loading="loadingMeasInfo"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.name }} - {{ convertDateTimeToString(slotProps.option.createdTimestamp) }}</div>
          </div>
        </template>
      </Dropdown>
    </div>

    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="updatePSM()"></Button>
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
    default: [],
  },
});

const dialogVisible = computed(() => prop.dialogVisible);
const confirm = useConfirm();
const commonStore = useCommonStore();
const { measInfoActiveId, measInfoList, measInfo_automatic } = storeToRefs(commonStore);
const MeasInfoSelect = ref(measInfoActiveId);
const timeStart = ref();
const timeEnd = ref();
const loadingMeasInfo = ref(false);
const emit = defineEmits(['update:dialogVisible']);
const updatePSMList = async () => {
  try {
    loadingMeasInfo.value = true;
    await commonStore.getListMeasInfo(timeStart.value, timeEnd.value);
    setTimeout(() => {
      loadingMeasInfo.value = false;
    }, 1000);
  } catch (error) {}
};

watch(measInfoActiveId, (oldValue, newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    MeasInfoSelect.value = newValue;
  }
});

onMounted(async () => {
  await commonStore.getListMeasInfo();
});
onUnmounted(() => {
  commonStore.clearData();
});
</script>

<style lang="scss" scoped></style>

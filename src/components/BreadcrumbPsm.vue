<template>
  <div>
    <div class="flex justify-content-between">
      <Chip class="py-0 pl-0 pr-3">
        <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center"
          ><i class="pi pi-slack" style="font-size: 1rem"></i>
        </span>
        <span class="ml-2">{{ psm_active.name }}</span>
      </Chip>
      <div>
        <Chip :label="createdTimestamp" v-tooltip.top="'Create Time'" icon="pi pi-plus-circle" />
        <span class="mx-2">-</span>
        <Chip :label="modifiedTimestamp" v-tooltip.top="'Modified Time'" icon="pi pi-replay" />
        <!-- <Chip label="Facebook" icon="pi pi-facebook" /> -->
        <Button
          v-tooltip.top="'Change PSM Mode'"
          icon="pi pi-arrow-right-arrow-left"
          class="mx-2"
          text
          severity="help"
          rounded
          aria-label="Filter"
          size="small"
          @click="changePSMMode"
        />

        <Button
          v-if="!psm_automatic"
          icon="pi pi-ellipsis-h"
          text
          rounded
          aria-label="Filter"
          size="small"
          @click="changePSMActive()"
        />
        <Button v-else text></Button>
      </div>
    </div>
    <Dialog v-model:visible="visible" modal header="Change Power System Model" :style="{ width: '30rem' }">
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
          :placeholder="loadingPSM ? 'Loading...' : 'Select a PSM'"
          class="!w-full"
          :loading="loadingPSM"
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
    <ConfirmPopup></ConfirmPopup>
  </div>
</template>

<script setup>
import { useCommonStore } from '@/store';
import chartComposable from '@/combosables/chartData';
import { computed, onMounted, onUnmounted } from 'vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
const loadingPSM = ref(false);
const { convertDateTimeToString } = chartComposable();
const visible = ref(false);
const commonStore = useCommonStore();
const { psm_active, psmList, psm_automatic } = storeToRefs(commonStore);
const psmSelect = ref(psm_active);
const timeStart = ref();
const timeEnd = ref();

watch(psm_active, (oldValue, newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    psmSelect.value = newValue;
  }
});

const modifiedTimestamp = computed(() => convertDateTimeToString(psm_active.value.modifiedTimestamp));
const createdTimestamp = computed(() => convertDateTimeToString(psm_active.value.createdTimestamp));
const changePSMActive = () => {
  visible.value = true;
};
const changePSMMode = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Submit',
    accept: () => {
      psm_automatic.value = !psm_automatic.value;
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
const updatePSM = async () => {
  psm_active.value = psmSelect.value;
  visible.value = false;
};
const updatePSMList = async () => {
  try {
    loadingPSM.value = true;
    await commonStore.getListPsm(timeStart.value, timeEnd.value);
    setTimeout(() => {
      loadingPSM.value = false;
    }, 1000);
  } catch (error) {}
};
onMounted(async () => {
  await commonStore.getListPsm();
});
onUnmounted(() => {
  commonStore.clearData();
});
</script>

<style lang="scss" scoped></style>

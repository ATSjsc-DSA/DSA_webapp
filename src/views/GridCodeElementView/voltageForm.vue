<template>
  <div class="grid align-items-center">
    <div class="col-10">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="name" class="font-semibold"> Name </label>
        <InputText id="name" v-model="formData.name" class="flex-auto w-full" autocomplete="off" />
      </div>
    </div>
    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitType" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitType"
          v-model="formData.unitType"
          :options="voltageUnitOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-12">
      <span class="p-text-secondary block"> Voltage Range</span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="volRangeLower" class="font-semibold"> Lower</label>
        <InputNumber v-model="formData.volRangeLower" :suffix="unitLabel" :maxFractionDigits="10" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="volRangeUpper" class="font-semibold"> Upper</label>
        <InputNumber v-model="formData.volRangeUpper" :suffix="unitLabel" :maxFractionDigits="10" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Normal Voltage Limit</span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="normalVolLimitLower" class="font-semibold"> Lower</label>
        <InputNumber v-model="formData.normalVolLimitLower" :suffix="unitLabel" :maxFractionDigits="10" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="normalVolLimitUpper" class="font-semibold"> Upper</label>
        <InputNumber v-model="formData.normalVolLimitUpper" :suffix="unitLabel" :maxFractionDigits="10" />
      </div>
    </div>

    <div class="col-12">
      <div class="flex align-items-center gap-6">
        <label for="abnormalActivation" class="p-text-secondary blockmr-3"> Abnomal Voltage Limit</label>

        <div class="flex align-items-center">
          <Checkbox v-model="formData.abnormalActivation" inputId="abnormalActivation" :binary="true" />
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="abnormalVolLimitLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.abnormalVolLimitLower"
          :disabled="!formData.abnormalActivation"
          :suffix="unitLabel" :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="abnormalVolLimitUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.abnormalVolLimitUpper"
          :disabled="!formData.abnormalActivation"
          :suffix="unitLabel" :maxFractionDigits="10"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import Checkbox from 'primevue/checkbox';

import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { computed } from 'vue';

const formData = defineModel('formData');
const voltageUnitOpts = ref([
  { label: 'kV', value: 0 },
  { label: '%', value: 1 },
]);
const unitLabel = computed(() => {
  return ' ' + voltageUnitOpts.value.filter((item) => item.value === formData.value.unitType)[0].label;
});
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

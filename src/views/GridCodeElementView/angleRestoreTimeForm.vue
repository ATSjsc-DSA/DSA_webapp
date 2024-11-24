<template>
  <div class="grid align-items-center">
    <div class="col-12 flex justify-content-between gap-3">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="name" class="font-semibold"> Name </label>
        <InputText id="name" v-model="formData.name" class="flex-auto w-full" autocomplete="off" />
      </div>
      <div class="flex flex-column gap-2 mb-3 align-items-center">
        <label for="active" class="font-semibold mb-2"> Active</label>
        <InputSwitch id="active" v-model="formData.active" autocomplete="off" />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="dampingRequirement" class="font-semibold">Damping Requirement</label>
        <InputNumber v-model="formData.dampingRequirement" suffix="%" :maxFractionDigits="10" class="flex-auto" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="restoreTime" class="font-semibold">Restore Time</label>
        <InputNumber v-model="formData.restoreTime" class="flex-auto" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Instantaneous</span>
    </div>

    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="instantaneousMin" class="font-semibold"> Min</label>
        <InputNumber
          id="instantaneousMin"
          v-model="formData.InstantaneousMin"
          :suffix="getUnitLabel(formData.unitTypeInstantaneous)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="instantaneousMax" class="font-semibold"> Max</label>
        <InputNumber
          v-model="formData.InstantaneousMax"
          :suffix="getUnitLabel(formData.unitTypeInstantaneous)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeInstantaneous" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeInstantaneous"
          v-model="formData.unitTypeInstantaneous"
          :options="unitLabelOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Frequency Oscillation</span>
    </div>

    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="freqOscillationLower" class="font-semibold"> Frequency Oscillation</label>
        <InputNumber
          v-model="formData.freqOscillationLower"
          :suffix="getUnitLabel(formData.unitTypeSFrequencyOscillation)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="freqOscillationUpper" class="font-semibold">Upper</label>
        <InputNumber
          v-model="formData.freqOscillationUpper"
          :suffix="getUnitLabel(formData.unitTypeSFrequencyOscillation)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeSFrequencyOscillation" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeSFrequencyOscillation"
          v-model="formData.unitTypeSFrequencyOscillation"
          :options="unitLabelOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Stable</span>
    </div>

    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.stableLower"
          :suffix="getUnitLabel(formData.unitTypeStable)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.stableUpper"
          :suffix="getUnitLabel(formData.unitTypeStable)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeStable" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeStable"
          v-model="formData.unitTypeStable"
          :options="unitLabelOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const formData = defineModel('formData');
const unitLabelOpts = ref([
  { label: '%', value: 1 },
  { label: '\u00B0', value: 3 },
]);
const getUnitLabel = (unitLabel) => {
  return ' ' + unitLabelOpts.value.filter((item) => item.value === unitLabel)[0].label;
};
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

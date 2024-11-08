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

    <div class="col-4">
      <div class="flex flex-column gap-2 mb-3">
        <label for="dampingRequirement" class="font-semibold">Damping Requirement</label>
        <InputNumber v-model="formData.dampingRequirement" class="flex-auto" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 mb-3">
        <label for="restoreTime" class="font-semibold">Restore Time</label>
        <InputNumber v-model="formData.restoreTime" class="flex-auto" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 mb-3">
        <label for="unit" class="font-semibold">Unit</label>
        <InputNumber v-model="formData.unit" class="flex-auto" />
      </div>
    </div>
    <div class="col-12">
      <span class="p-text-secondary block">Instantaneous</span>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="instantaneousMin" class="font-semibold"> Min</label>
        <InputNumber id="instantaneousMin" v-model="formData.InstantaneousMin" :max="formData.InstantaneousMax" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="instantaneousMax" class="font-semibold"> Max</label>
        <InputNumber v-model="formData.InstantaneousMax" :min="formData.InstantaneousMin" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Frequency Oscillation</span>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="freqOscillationLower" class="font-semibold"> Frequency Oscillation</label>
        <InputNumber v-model="formData.freqOscillationLower" :max="formData.freqOscillationUpper" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="freqOscillationUpper" class="font-semibold">Upper</label>
        <InputNumber v-model="formData.freqOscillationUpper" :min="formData.freqOscillationLower" />
      </div>
    </div>
    <div class="col-12">
      <span class="p-text-secondary block">Stable</span>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableLower" class="font-semibold"> Lower</label>
        <InputNumber v-model="formData.stableLower" :max="formData.stableUpper" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableUpper" class="font-semibold"> Upper</label>
        <InputNumber v-model="formData.stableUpper" :min="formData.stableLower" />
      </div>
    </div>
  </div>
</template>
<script setup>
const formData = defineModel('formData');
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

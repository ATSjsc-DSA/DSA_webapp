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
    <div class="col-10">
      <div class="flex flex-column gap-2 mb-3">
        <label for="norminalFreq" class="font-semibold"> Norminal Frequency</label>
        <InputNumber v-model="formData.norminalFreq" :suffix="unitLabel" :maxFractionDigits="10" />
      </div>
    </div>
    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitType" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitType"
          v-model="formData.unitType"
          :options="frequencyUnitOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block"> Normal Voltage Limit</span>
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
  </div>
</template>
<script setup>
const formData = defineModel('formData');
const frequencyUnitOpts = ref([
  { label: '%', value: 1 },
  { label: 'Hz', value: 2 },
]);
const unitLabel = computed(() => {
  return ' ' + frequencyUnitOpts.value.filter((item) => item.value === formData.value.unitType)[0].label;
});
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

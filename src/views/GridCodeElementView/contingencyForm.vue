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
    <div class="col-12">
      <div class="flex flex-column gap-2 mb-3">
        <label for="contingencyType" class="font-semibold">Contingency Type</label>
        <Dropdown
          id="contingencyType"
          v-model="formData.contingencyType"
          :options="contingencyTypeOpts"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Critical</span>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="criticalLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.criticalLower"
          :suffix="unitLabel"
          :maxFractionDigits="10"
          :minFractionDigits="1"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="criticalUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.criticalUpper"
          :suffix="unitLabel"
          :maxFractionDigits="10"
          :minFractionDigits="1"
        />
      </div>
    </div>
    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitType" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitType"
          v-model="formData.unitType"
          :options="contigencyUnitOpts"
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

const contingencyTypeOpts = ref([
  { label: 'N-1', value: 0 },
  { label: 'N-2', value: 1 },
  { label: 'Base', value: 2 },
]);

const contigencyUnitOpts = ref([
  { label: '%', value: 1 },
  { label: 'Hz', value: 2 },
]);
const unitLabel = computed(() => {
  return ' ' + contigencyUnitOpts.value.filter((item) => item.value === formData.value.unitType)[0].label;
});
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

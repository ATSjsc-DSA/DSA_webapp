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
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="criticalLower" class="font-semibold"> Lower</label>
        <InputNumber :maxFractionDigits="999" v-model="formData.criticalLower" :max="formData.criticalUpper" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="criticalUpper" class="font-semibold"> Upper</label>
        <InputNumber :maxFractionDigits="999" v-model="formData.criticalUpper" :min="formData.criticalLower" />
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
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

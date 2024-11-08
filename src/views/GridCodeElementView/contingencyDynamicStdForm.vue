<template>
  <div class="grid align-items-center">
    <div class="col-12 flex justify-content-between gap-3">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="name" class="font-semibold">Name </label>
        <InputText id="name" v-model="formData.name" class="flex-auto w-full" autocomplete="off" />
      </div>
      <div class="flex flex-column gap-2 mb-3 align-items-center">
        <label for="active" class="font-semibold mb-2"> Active</label>
        <InputSwitch id="active" v-model="formData.active" autocomplete="off" />
      </div>
    </div>
    <div class="col-12">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="restoreTime" class="font-semibold"> Restore Time </label>
        <InputNumber id="restoreTime" v-model="formData.restoreTime" class="flex-auto w-full" autocomplete="off" />
      </div>
    </div>
    <div class="col-12">
      <span class="p-text-secondary block">Stable </span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableRangeLower" class="font-semibold"> Lower</label>
        <InputNumber v-model="formData.stableRangeLower" :max="formData.stableRangeUpper" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stableRangeUpper" class="font-semibold"> Upper</label>
        <InputNumber v-model="formData.stableRangeUpper" :min="formData.stableRangeLower" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Error </span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="lowerError" class="font-semibold"> Lower</label>
        <InputNumber v-model="formData.lowerError" :max="formData.upperError" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="upperError" class="font-semibold"> Upper</label>
        <InputNumber v-model="formData.upperError" :min="formData.lowerError" />
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

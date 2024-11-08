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
      <span class="p-text-secondary block">Instantaneous</span>
    </div>
    <div class="col-9 grid align-items-center">
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="instantaneousMin" class="font-semibold"> Min</label>
          <InputNumber v-model="formData.instantaneousMin" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="instantaneousMax" class="font-semibold"> Max</label>
          <InputNumber v-model="formData.instantaneousMax" />
        </div>
      </div>
    </div>
    <div class="col-3">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitType" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitType"
          v-model="formData.unitType"
          :options="angleUnitOpts"
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
const angleUnitOpts = ref([
  { label: '%', value: 1 },
  { label: 'Degree', value: 3 },
]);
const unitLabel = computed(() => {
  return ' ' + angleUnitOpts.value.filter((item) => item.value === formData.value.unitType)[0].label;
});
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

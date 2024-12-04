<template>
  <div class="grid align-items-center">
    <div class="col-12">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="name" class="font-semibold"> Name </label>
        <InputText id="name" v-model="formData.name" class="flex-auto w-full" autocomplete="off" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block"> Voltage Range</span>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="volRangeLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.volRangeLower"
          :suffix="getUnitLabel(formData.unitTypeVolRange)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="volRangeUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.volRangeUpper"
          :suffix="getUnitLabel(formData.unitTypeVolRange)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeVolRange" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeVolRange"
          v-model="formData.unitTypeVolRange"
          :options="unitLabelOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="col-12">
      <span class="p-text-secondary block">Normal Voltage Limit</span>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="normalVolLimitLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.normalVolLimitLower"
          :suffix="getUnitLabel(formData.unitTypeNormalVolLimit)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="normalVolLimitUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.normalVolLimitUpper"
          :suffix="getUnitLabel(formData.unitTypeNormalVolLimit)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeNormalVolLimit" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeNormalVolLimit"
          v-model="formData.unitTypeNormalVolLimit"
          :options="unitLabelOpts"
          optionLabel="label"
          optionValue="value"
          class="flex-auto w-full"
          autocomplete="off"
        />
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

    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="abnormalVolLimitLower" class="font-semibold"> Lower</label>
        <InputNumber
          v-model="formData.abnormalVolLimitLower"
          :disabled="!formData.abnormalActivation"
          :suffix="getUnitLabel(formData.unitTypeAbnormalVolLimit)"
          :maxFractionDigits="10"
        />
      </div>
    </div>
    <div class="col-5">
      <div class="flex flex-column gap-2 mb-3">
        <label for="abnormalVolLimitUpper" class="font-semibold"> Upper</label>
        <InputNumber
          v-model="formData.abnormalVolLimitUpper"
          :disabled="!formData.abnormalActivation"
          :suffix="getUnitLabel(formData.unitTypeAbnormalVolLimit)"
          :maxFractionDigits="10"
        />
      </div>
    </div>

    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3 flex-1">
        <label for="unitTypeAbnormalVolLimit" class="font-semibold"> Unit </label>
        <Dropdown
          id="unitTypeAbnormalVolLimit"
          v-model="formData.unitTypeAbnormalVolLimit"
          :options="unitLabelOpts"
          :disabled="!formData.abnormalActivation"
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
import Checkbox from 'primevue/checkbox';

const formData = defineModel('formData');
const unitLabelOpts = ref([
  { label: 'kV', value: 0 },
  { label: '%', value: 1 },
]);
const getUnitLabel = (unitLabel) => {
  return ' ' + unitLabelOpts.value.filter((item) => item.value === unitLabel)[0].label;
};

onMounted(async () => {
  await nextTick(() => {
    const inputElements = document.querySelectorAll('.p-inputnumber-input');
    inputElements.forEach((input) => {
      input.addEventListener('change', handleChange);
    });
  });
});

const handleChange = (event) => {
  console.log(`Value changed to: ${event.target.value}`, event);
};
</script>
<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

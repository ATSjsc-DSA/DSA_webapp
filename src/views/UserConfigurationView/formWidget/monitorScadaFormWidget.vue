<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadaName" class="font-semibold"> Name </label>
    <InputText id="scadaName" v-model="data.name" class="flex-auto" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadaName" class="font-semibold"> Monitor Scada Name </label>
    <InputText id="scadaName" v-model="data.monitorScadaName" disabled class="flex-auto" autocomplete="off" />
  </div>
  <div class="flex align-items-center gap-3 mb-3">
    <label for="scadaActive" class="font-semibold w-6rem"> Active</label>
    <InputSwitch id="scadaActive" v-model="data.active" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadakFactorCur" class="font-semibold"> K Factor Cur</label>
    <InputNumber id="scadakFactorCur" v-model="data.kFactorCur" :maxFractionDigits="5" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="scadakFactorPower" class="font-semibold"> K Factor Power</label>
    <InputNumber id="scadakFactorPower" v-model="data.kFactorPower" :maxFractionDigits="5" autocomplete="off" />
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

const data = defineModel();
const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
</script>
<style>
.p-autocomplete-input {
  width: 100%;
}
.psAutoComplete button {
  background-color: var(--gray-400);
  border-color: var(--gray-400);
}
</style>

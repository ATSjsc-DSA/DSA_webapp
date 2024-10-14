<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="appName" class="font-semibold"> Name </label>
    <InputText id="appName" v-model="appData.name" class="flex-auto" autocomplete="off" />
  </div>
  <div class="flex flex-column gap-2 mb-3">
    <label for="appName" class="font-semibold"> Start Time </label>
    <Calendar id="calendar-24h" v-model="appData.startTimestamp" showTime hourFormat="24" showSeconds />
  </div>
  <div class="flex align-items-center gap-3 mb-3">
    <label for="appActive" class="font-semibold w-6rem"> Active</label>
    <InputSwitch id="appActive" v-model="appData.active" autocomplete="off" />
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

const appData = defineModel();
</script>

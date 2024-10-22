<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="name" class="font-semibold"> Name </label>
    <InputText id="name" v-model="data.name" class="flex-auto" autocomplete="off" />
  </div>

  <div class="flex align-items-center gap-3 mb-3">
    <label for="active" class="font-semibold w-6rem"> Active</label>
    <InputSwitch id="active" v-model="data.active" autocomplete="off" />
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

const data = defineModel();
</script>

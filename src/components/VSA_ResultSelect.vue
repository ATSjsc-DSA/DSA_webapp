<template>
  <div class="">
    <div class="flex align-items-center mb-3">
      <Checkbox v-model="checked" :binary="true" />
      <label for="ingredient1" class="ml-2"> Only critical result</label>
    </div>
    <div>
      <Dropdown
        v-model="selectedCity"
        :options="cities"
        optionLabel="name"
        placeholder="Select a City"
        class="w-full md:w-14rem"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
const checked = ref(true);
const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
</script>

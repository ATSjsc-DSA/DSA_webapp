<template>
  <div class="w-full flex flex-column align-items-start gap-1">
    <label for="ps" class="font-semibold"> {{ label }}</label>
    <AutoComplete
      v-model="contigenciesSelected"
      inputId="ps"
      optionLabel="name"
      optionValue="_id"
      completeOnFocus
      class="w-full"
      :suggestions="suggestions"
      name="psFilter"
      @complete="searchQueryFilter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ApiContingencies } from '@/views/SystemEvents/api';

const props = defineProps({
  label: { type: String, default: 'Contingencies' },
});
const contigenciesSelected = defineModel();

const suggestions = ref();
const searchQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await ApiContingencies.searchSubsystem(query);
    suggestions.value = res.data;
  } catch (error) {
    console.log('search Contingencies Filter: error ', error);
  }
};
</script>

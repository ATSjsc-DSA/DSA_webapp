<template>
  <div class="w-full flex flex-column align-items-start gap-1">
    <label for="ps" class="font-semibold"> {{ label }}</label>
    <AutoComplete
      v-model="subsytemSelected"
      inputId="ps"
      optionLabel="name"
      optionValue="_id"
      completeOnFocus
      class="w-full"
      :suggestions="subsytemSuggestions"
      name="psFilter"
      @complete="searchsubsytemFilter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ApiSubsystem } from '@/views/SystemEvents/api';

const props = defineProps({
  label: { type: String, default: '' },
});
const subsytemSelected = defineModel();

const subsytemSuggestions = ref();
const searchsubsytemFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await ApiSubsystem.searchSubsystem(query);
    subsytemSuggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
</script>

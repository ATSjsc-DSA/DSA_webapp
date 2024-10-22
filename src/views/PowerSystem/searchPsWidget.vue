<template>
  <div class="w-full flex flex-column align-items-start gap-1">
    <label for="ps" class="font-semibold"> {{ label }}</label>
    <AutoComplete
      v-model="psSelected"
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
import { PowerSystemParameterApi } from '@/views/PowerSystem/api';

const props = defineProps({
  label: { type: String, default: 'Power System' },
  projectVersionId: { type: String, default: '66decf1dcff005199529524b' },
  definitionId: { type: Array, default: () => [] },
});
const psSelected = defineModel();

const suggestions = ref();
const searchQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.projectVersionId, props.definitionId, query);
    suggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
</script>

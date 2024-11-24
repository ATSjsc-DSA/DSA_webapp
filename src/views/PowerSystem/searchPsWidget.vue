<template>
  <div class="w-full flex flex-column align-items-start gap-1">
    <label v-if="label" for="ps" class="font-semibold"> {{ label }}</label>
    <AutoComplete
      v-model="psSelected"
      inputId="ps"
      optionLabel="name"
      optionValue="_id"
      completeOnFocus
      class="w-full"
      :class="{ 'psFilterAutoComplete showMoreViaDot': showViaDotAtTenChild }"
      :suggestions="suggestions"
      :multiple="multipleSelection"
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
  definitionId: { type: Array, default: () => [] },
  multipleSelection: { type: Boolean, default: false },
  showViaDotAtTenChild: { type: Boolean, default: false },
});
const psSelected = defineModel();

const suggestions = ref();
const searchQueryFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await PowerSystemParameterApi.searchPs(props.definitionId, query);
    suggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};
</script>
<style>
.psFilterAutoComplete button {
  background-color: var(--gray-400);
  border-color: var(--gray-400);
}

.p-autocomplete-multiple-container {
  display: flex;
  flex-wrap: auto;
}

.p-autocomplete-input {
  width: 100%;
}

.p-autocomplete-input-token {
  flex-grow: 1;
}
.psFilterAutoComplete .p-autocomplete-token:nth-child(n + 10) {
  display: none;
}

.psFilterAutoComplete.showMoreViaDot .p-autocomplete-token:nth-child(9)::after {
  content: '...';
  position: relative;
  left: 2rem;
}
</style>

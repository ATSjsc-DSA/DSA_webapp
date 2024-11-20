<template>
  <div>
    <div class="p-3">
      query: {{ query }}

      <div class="p-3">==>suggestion: {{ suggestion === '' ? '(empty)' : suggestion }}</div>
    </div>
    <div class="p-3">selected: {{ conjunction }}</div>

    <div class="p-3">filterNameSelected: {{ filterNameSelected }}</div>
    <div class="p-3">filterConjunctionList: {{ filterConjunctionList }}</div>
    <div class="p-3">suggestionArr: {{ suggestionArr }}</div>
  </div>
  <InputGroup>
    <InputText
      v-model="conjunction"
      type="text"
      @input="filterSuggestions"
      @keydown.tab.prevent="selectSuggestionByTab"
    />
    <InputGroupAddon>{{ suggestion }}</InputGroupAddon>
  </InputGroup>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

const props = defineProps({
  filterNameSelected: {
    type: Array,
    required: true,
  },
});
onMounted(() => {
  filterSuggestions();
});
const query = ref('');
const conjunction = ref('');
const suggestion = ref('');
const suggestionArr = ref([]);
const selectSuggestionByTab = () => {
  if (suggestion.value != '') {
    conjunction.value = conjunction.value + ' ' + suggestion.value;
    filterConjunctionList.value.push(suggestion.value);

    suggestion.value = '';
    query.value = '';
    filterSuggestions();
  }
};

const filterConjunctionList = ref([]);
const filterSuggestions = () => {
  let suggestions = [];
  // độ ưu tiên thì NOT, AND, OR
  const conjunctionWithoutAndOr = filterConjunctionList.value.filter(
    (item) => item !== 'and' && item != 'or' && item != 'not',
  );
  if (conjunctionWithoutAndOr.length < props.filterNameSelected.length) {
    if (filterConjunctionList.value.length > 0 && filterConjunctionList.value.length % 2 !== 0) {
      suggestions = ['and', 'or', 'not'];
    } else {
      if (conjunctionWithoutAndOr.length < props.filterNameSelected.length) {
        props.filterNameSelected.forEach((item) => {
          if (!filterConjunctionList.value.includes(item)) {
            suggestions.push(item);
          }
        });
      }
    }
  }
  suggestionArr.value = suggestions;
  suggestion.value = suggestions.length > 0 ? suggestions[0] : '';
};
</script>

<style>
.highlighted {
  background-color: #bde4ff;
}
</style>

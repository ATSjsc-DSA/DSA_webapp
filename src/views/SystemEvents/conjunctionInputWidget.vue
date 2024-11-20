<template>
  <InputGroup>
    <Textarea
      v-model="conjunction"
      :disabled="filterNameSelected.length < 2"
      @change="openMenuSuggestion"
      @focus="openMenuSuggestion"
    />
    <Menu id="overlay_menu" ref="menuSuggestion" :model="suggestionArr" :popup="true" @enter.prevent="onMenuEnterPress">
      <template #item="{ item }">
        <div class="p-3 w-full capitalize" @click="addSuggestion($event, item)">
          {{ item }}
        </div>
      </template>
    </Menu>
  </InputGroup>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import InputGroup from 'primevue/inputgroup';

const props = defineProps({
  filterNameSelected: {
    type: Array,
    required: true,
  },
});

const filterConjunction = defineModel('filterConjunction');
const canDuplicate = defineModel('canDuplicate');

onMounted(() => {
  getFilterSuggestions();
});

watch(
  () => props.filterNameSelected,
  () => {
    console.log('get filterSuggestions');
    getFilterSuggestions();
  },
);
const query = ref('');
const conjunction = ref(filterConjunction.value);
watch(conjunction, () => {
  filterConjunction.value = conjunction.value;
});
const suggestionArr = ref([]);
const menuSuggestion = ref();
const openMenuSuggestion = (event) => {
  getFilterSuggestions();
  if (suggestionArr.value.length > 0) {
    menuSuggestion.value.toggle(event);
  }
};

const onMenuEnterPress = (event) => {
  console.log('onMenuEnterPress', event);
};

const addSuggestion = (event, suggestion) => {
  suggestion = suggestion[0].toUpperCase() + suggestion.slice(1);

  conjunction.value = conjunction.value !== '' ? conjunction.value + ' ' + suggestion : suggestion;
  query.value = '';
  getFilterSuggestions();
  menuSuggestion.value.toggle(event);
};

const filterConjunctionList = computed(() => {
  if (conjunction.value != '') {
    const filterArr = [];
    conjunction.value.split(' ').forEach((item) => {
      filterArr.push(item.replace('(', '').replace(')', '').toLowerCase());
    });
    return filterArr.filter((item) => item != '');
  } else {
    return [];
  }
});
const getFilterSuggestions = () => {
  if (canDuplicate.value) {
    console.log('canDuplicate');
    getFilterSuggestionsCanDuplicate();
    return;
  }

  let suggestions = [];
  // độ ưu tiên thì NOT, AND, OR
  const conjunctionWithoutAndOr = filterConjunctionList.value.filter(
    (item) => item !== 'and' && item != 'or' && item != 'not',
  );
  if (conjunctionWithoutAndOr.length < props.filterNameSelected.length) {
    if (filterConjunctionList.value.length > 0 && filterConjunctionList.value.length % 2 !== 0) {
      suggestions = ['not', 'and', 'or'];
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
};

const getFilterSuggestionsCanDuplicate = () => {
  // độ ưu tiên thì NOT, AND, OR
  if (filterConjunctionList.value.length > 0 && filterConjunctionList.value.length % 2 !== 0) {
    suggestionArr.value = ['not', 'and', 'or'];
  } else {
    suggestionArr.value = props.filterNameSelected;
  }
};
</script>

<style>
.highlighted {
  background-color: #bde4ff;
}
</style>

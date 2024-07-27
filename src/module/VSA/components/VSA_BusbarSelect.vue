<template>
  <div class="">
    <MultiSelect
      v-model="selectedBusbar"
      variant="filled"
      :options="listBusBar"
      optionLabel="name"
      placeholder="Select Cities"
      :maxSelectedLabels="3"
      class="w-full md:w-16rem"
      @update:modelValue="changeListBusbar($event)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import MultiSelect from 'primevue/multiselect';

const selectedBusbar = ref();
const changeListBusbar = (lisBusbar) => {
  emits('changeListBusbar', lisBusbar);
};
const props = defineProps({
  listBusbar: {
    type: Array,
    default: [],
  },
});
const emits = defineEmits(['changeListBusbar']);
const listBusBar = computed(() => props.listBusbar);
</script>
<style scoped>
/* .listboxSubbar {
  height: 45rem;
  overflow-y: scroll;
}
@media screen and (max-width: 1536px) {
  .listboxSubbar {
    height: 30rem;
  }
} */
</style>

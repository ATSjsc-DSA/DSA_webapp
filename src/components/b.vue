<template>
  <div class="">
    <div class="flex align-items-center mb-3">
      <Checkbox v-model="checked" :binary="true" />
      <label for="ingredient1" class="ml-2"> Only critical busbar</label>
    </div>
    <Listbox
      v-model="selectedBusbar"
      :options="listBusBar"
      multiple
      optionLabel="name"
      class="w-full md:w-14rem listboxSubbar"
      listStyle="max-height:400px"
    />
    <div class="mt-3 flex justify-content-end">
      <Button label="Submit" size="small" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';

import Button from 'primevue/button';

import Listbox from 'primevue/listbox';

const checked = ref(true);
const selectedBusbar = ref();
const changeArea = (area) => {
  emits('changeArea', area);
};
const props = defineProps({
  listBusbar: {
    type: Array,
    default: [],
  },
});
const emits = defineEmits(['changeArea']);
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

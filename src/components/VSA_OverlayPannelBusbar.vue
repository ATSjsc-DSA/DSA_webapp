<template>
  <Button
    v-tooltip.bottom="'Busbar Active'"
    type="button"
    icon="pi pi-list"
    size="small"
    class="p-1 border-noround"
    @click="toggle"
  />

  <OverlayPanel ref="op">
    <div class="flex flex-column gap-3">
      <div>
        <span class="font-medium text-900 block mb-2">Busbar List</span>
        <Listbox
          v-model="selectedBusbar"
          :options="listBusBar"
          multiple
          optionLabel="name"
          class="w-full md:w-20rem"
          listStyle="max-height:140px"
        />
        <!-- <MultiSelect
      v-model="selectedBusbar"
      variant="filled"
      :options="listBusBar"
      optionLabel="name"
      placeholder="Select Cities"
      :maxSelectedLabels="3"
      class="w-full md:w-16rem"
      @update:modelValue="changeListBusbar($event)"
    /> -->
        <div class="flex justify-content-end mt-2">
          <Button label="submit" icon="pi pi-undo" size="small" @click="changeListBusbar"></Button>
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import OverlayPanel from 'primevue/overlaypanel';

import Listbox from 'primevue/listbox';

const op = ref();

const changeListBusbar = () => {
  op.value.hide();
  emits('changeListBusbar', selectedBusbar.value);
};
const props = defineProps({
  listBusbar: {
    type: Array,
    default: [],
  },
  busbarsActive: {
    type: Array,
    default: [],
  },
});
const selectedBusbar = ref(props.busbarsActive);
watch(
  () => props.busbarsActive,
  (newBusbarsActive) => {
    selectedBusbar.value = newBusbarsActive;
  },
);
const emits = defineEmits(['changeListBusbar']);
const listBusBar = computed(() => props.listBusbar);
const toggle = (event) => {
  op.value.toggle(event);
};
</script>

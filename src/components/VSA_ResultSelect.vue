<template>
  <div class="">
    <div class="flex align-items-center mb-3">
      <Checkbox v-model="checked" :binary="true" />
      <label for="ingredient1" class="ml-2"> Only critical result</label>
    </div>
    <div>
      <Dropdown
        v-model="selectedArea"
        :options="listDataArea"
        optionLabel="Name"
        placeholder="Select a Area"
        class="w-full md:w-14rem"
        @update:modelValue="changeArea($event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
const checked = ref(true);
const selectedArea = ref();
const changeArea = (area) => {
  emits('changeArea', area);
};
const props = defineProps({
  listDataArea: {
    type: Array,
    default: [],
  },
});
const emits = defineEmits(['changeArea']);
const listDataArea = computed(() => props.listDataArea);
</script>

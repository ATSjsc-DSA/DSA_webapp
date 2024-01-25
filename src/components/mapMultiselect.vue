<template>
  <div class="">
    <Dropdown
      v-model="selectedCriteria"
      :options="criterias"
      optionLabel="name"
      placeholder="Select a Criteria"
      class="w-full md:w-14rem border-noround"
      @update:modelValue="changeSelecet($event)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  selectedCriteria: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['changeSelecet']);
const selectedCriteria = ref();
const criterias = ref([
  { name: 'Line Loading', value: 'LL' },
  { name: 'Tranformer Loading', value: 'TL' },
  { name: 'Generator Loading', value: 'GL' },
  { name: 'Excitation Limiter', value: 'EL' },
  { name: 'Low/High Voltage', value: 'LHV' },
  { name: 'VSA Module', value: 'VSA' },
  { name: 'TSA Module', value: 'TSA' },
  { name: 'SSR Module', value: 'SSR' },
]);

const changeSelecet = (event) => {
  emits('changeSelecet', event.value);
};
</script>

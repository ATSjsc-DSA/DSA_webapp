<template>
  <div class="card flex justify-content-center p-3 border-noround">
    <div class="flex flex-column gap-3">
      <div v-for="layer of listLayer" :key="layer.value" class="flex align-items-center">
        <Checkbox
          v-model="selectedLayer"
          :inputId="layer.label"
          name="label"
          :value="layer.value"
          @input="changeSelecet($event)"
        />
        <label :for="layer.label" class="ml-2">{{ layer.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';

const props = defineProps({
  selectedSubs: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['changeSelecetLayer']);
const listLayer = ref([
  { label: '500KV', value: 500 },
  { label: '345KV', value: 345 },
  { label: '287KV', value: 287 },
  { label: '230kV', value: 230 },
  { label: '138KV', value: 138 },
  { label: '115kV', value: 115 },
  { label: '20KV', value: 20 },
]);
const selectedLayer = ref(props.selectedSubs);

const findDifferentValues = (array1, array2) => {
  let differentValues = array1.filter((value) => !array2.includes(value));
  return differentValues[0];
};

const changeSelecet = (value) => {
  let data = {
    valueFocus: findDifferentValues(value, props.selectedSubs),
    added: true,
  };
  if (props.selectedSubs.length > value.length) {
    data.added = false;
    data.valueFocus = findDifferentValues(props.selectedSubs, value);
  }

  emits('changeSelecetLayer', data, value);
};
</script>

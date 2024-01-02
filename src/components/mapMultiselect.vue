<template>
  <div class="">
    <MultiSelect
      v-model="selectedItem"
      :options="groupedItem"
      optionLabel="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      display="chip"
      placeholder="Select "
      class="w-full md:w-12rem"
      @change="changeSelecet($event)"
    >
      <template #optiongroup="slotProps">
        <div class="flex align-items-center">
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template>
    </MultiSelect>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MultiSelect from 'primevue/multiselect';

const props = defineProps({
  selectedSubs: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['changeSelecet']);
const selectedItem = ref();
const groupedItem = ref([
  {
    label: 'Substation',
    code: 'Sub',
    items: [
      { label: '500KV', value: 500 },
      { label: '345KV', value: 345 },
      { label: '287KV', value: 287 },
      { label: '220kV', value: 220 },
      { label: '138KV', value: 138 },
      { label: '115kV', value: 115 },
      { label: '20KV', value: 20 },
    ],
  },
  {
    label: 'Line',
    code: 'Li',
    items: [],
  },
]);

const findDifferentValues = (array1, array2) => {
  let differentValues = array1.filter((value) => !array2.includes(value));
  return differentValues[0];
};

const changeSelecet = (event) => {

  let data = {
    valueFocus: findDifferentValues(event.value, props.selectedSubs),
    added: true,
  };
  if (props.selectedSubs.length > event.value.length) {
    data.added = false;
    data.valueFocus = findDifferentValues(props.selectedSubs, event.value);
  }
  emits('changeSelecet', data, event.value);
};
</script>

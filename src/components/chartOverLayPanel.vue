<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import RadioButton from 'primevue/radiobutton';
import VirtualScroller from 'primevue/virtualscroller';

const props = defineProps({
  listSub: Object,
  subActive: String,
});

const emits = defineEmits(['changeSubActive']);
const op = ref();
console.log(props, 'props');
const selectedCategory = computed(() => {
  return props.subActive;
});

const categories = computed(() => {
  return props.listSub;
});
const toggle = (event) => {
  op.value.toggle(event);
};
const updateModelValue = (event) => {
  emits('changeSubActive', event);
};
</script>

<template>
  <div class="p-1">
    <Button icon="pi pi-bars" outlined raised @click="toggle" class="button mr-2" />

    <OverlayPanel ref="op" showCloseIcon>
      <div class="flex flex-column gap-3 max-h-20rem overflow-y-scroll surface-overlay p-2">
        <div v-for="category in categories" :key="category.name" class="flex align-items-center">
          <RadioButton
            v-model="selectedCategory"
            :inputId="category.name"
            name="dynamic"
            :value="category.name"
            @update:modelValue="updateModelValue($event)"
          />
          <label :for="category.name" class="ml-2">{{ category.name }}</label>
        </div>
      </div>
    </OverlayPanel>
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.button {
  padding: 4px;
  border-radius: 0;
  border-width: 0;
}
</style>

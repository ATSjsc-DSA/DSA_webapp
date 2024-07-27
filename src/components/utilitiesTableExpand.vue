<template>
  <div>
    <div class="flex justify-content-between">
      <h6>Load List</h6>
      <div class="grid">
        <Button
          size="small"
          text
          v-tooltip.top="{ value: 'Add Load Area' }"
          icon="pi pi-plus"
          aria-label="Filter"
          class="col"
          @click="addDataTypeOnArea()"
        />
        <Button
          size="small"
          text
          class="col"
          v-tooltip.top="{ value: 'Delete Load Active' }"
          icon="pi pi-times"
          severity="danger"
          aria-label="Cancel"
          @click="confirmRemoveDataOnArea($event)"
        />
      </div>
    </div>
    <ScrollPanel style="width: 100%; height: 200px">
      <ul class="values-list">
        <li
          v-for="value in dataPanel"
          :key="value.name"
          :class="{ selected: value.selected }"
          @click="
            () => {
              if (value.selected) {
                value.selected = false;
              } else {
                value.selected = true;
              }
            }
          "
        >
          {{ value.name }}
        </li>
      </ul>
    </ScrollPanel>
  </div>
</template>

<script setup>
const props = defineProps({
  dataPanel: {
    type: Array,
  },
});

const emits = defineEmits();
</script>

<style lang="scss" scoped></style>

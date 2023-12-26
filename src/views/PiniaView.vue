<template>
  <div class="card flex justify-content-center">
    <AutoComplete v-model="value" dropdown :suggestions="items" @complete="search" />
  </div>
</template>

<script setup>
import AutoComplete from 'primevue/autocomplete';
import { ref } from 'vue';

const value = ref('');
const items = ref([]);

const search = (event) => {
  const _items = [...Array(10).keys()];

  items.value = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
};
</script>

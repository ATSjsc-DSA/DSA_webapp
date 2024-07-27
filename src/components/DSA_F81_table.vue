<template>

  <DSA_F_table
    :dataSetting="F81Data"
    name="F81"
    @onRowEditSave="onRowEditSave"
    @onDeleteRow="onDeleteRow"
    @createNewRow="createNewRow"
  ></DSA_F_table>
</template>

<script setup>
import { computed } from 'vue';
import DSA_F_table from './DSA_F_table.vue';
import { useDSAStore } from '@/store';

const dsaStore = useDSAStore();
const { dataProfile } = storeToRefs(dsaStore);
const F81Data = computed(() => dataProfile.value.F81);
const onRowEditSave = (data) => {
  let { newData, index } = data;
  dataProfile.value.F81[index] = newData;
};

const onDeleteRow = (data) => {
  dataProfile.value.F81 = dataProfile.value.F81.filter((item) => item.measurement !== data.measurement);
};

const createNewRow = (data) => {
  dataProfile.value.F81.push(data);
};

</script>

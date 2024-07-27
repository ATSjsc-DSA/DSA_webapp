<template>
  <DSA_F_table
    :dataSetting="dataProfile.F27"
    name="F27 List"
    @onRowEditSave="onRowEditSave"
    @onDeleteRow="onDeleteRow"
    @createNewRow="createNewRow"
  ></DSA_F_table>
</template>

<script setup>
import { useDSAStore } from '@/store';
import DSA_F_table from './DSA_F_table.vue';
const dsaStore = useDSAStore();
const { dataProfile, listLoad } = storeToRefs(dsaStore);

const onRowEditSave = (data) => {
  let { newData, index } = data;
  dataProfile.value.F27[index] = newData;
};

const onDeleteRow = (data) => {
  dataProfile.value.F27 = dataProfile.value.F27.filter((item) => item.measurement !== data.measurement);
};

const createNewRow = (data) => {
  dataProfile.value.F27.push(data);
};
</script>

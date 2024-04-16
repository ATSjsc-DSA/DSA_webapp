<template>
  <DSA_F_table
    :dataSetting="dataSetting.F27"
    name="F27"
    @onRowEditSave="onRowEditSave"
    @onDeleteRow="onDeleteRow"
    @createNewRow="createNewRow"
  ></DSA_F_table>
</template>

<script setup>
import { useDSAStore } from '@/store';
import DSA_F_table from './DSA_F_table.vue';
const dsaStore = useDSAStore();
const { dataSetting } = storeToRefs(dsaStore);

const onRowEditSave = (data) => {
  let { newData, index } = data;
  dataSetting.value.F27[index] = newData;
};

const onDeleteRow = (data) => {
  dataSetting.value.F27 = dataSetting.value.F27.filter((item) => item.measurement !== data.measurement);
};

const createNewRow = (data) => {
  dataSetting.value.F27.push(data);
};
</script>

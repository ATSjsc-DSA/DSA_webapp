<template>
  <DSA_F_table
    :dataSetting="dataSetting.F81"
    name="F81"
    @onRowEditSave="onRowEditSave"
    @onDeleteRow="onDeleteRow"
    @createNewRow="createNewRow"
  ></DSA_F_table>
</template>

<script setup>
import DSA_F_table from './DSA_F_table.vue';
import { useDSAStore } from '@/store';
const dsaStore = useDSAStore();
const { dataSetting } = storeToRefs(dsaStore);

const onRowEditSave = (data) => {
  let { newData, index } = data;
  dataSetting.value.F81[index] = newData;
};

const onDeleteRow = (data) => {
  dataSetting.value.F81 = dataSetting.value.F81.filter((item) => item.measurement !== data.measurement);
};

const createNewRow = (data) => {
  dataSetting.value.F81.push(data);
};
</script>

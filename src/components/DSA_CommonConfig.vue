<template>
  <div class="card">
    <Fieldset :toggleable="true">
      <template #legend>
        <div class="flex align-items-center pl-1">
          <i class="pi pi-cog"></i>
          <span class="font-bold">Common Setting</span>
        </div>
      </template>
      <div class="grid md:gap-8">
        <div class="col">
          <DataTable :value="grLoadings" editMode="cell" @cell-edit-complete="onCellEditCompleteLoading">
            <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-600 font-bold">Loading Limits</span>
              </div>
            </template>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
              <template v-if="col.field === 'color'" #body="{ data, field }">
                <ColorPicker v-model="data[field]" disabled />
              </template>
              <template v-else-if="col.field === 'loadingRange'" #body="{ data, field }">
                {{ data[field] }} %
              </template>
              <template v-if="col.field === 'loadingRange'" #editor="{ data, field }">
                <InputNumber v-model="data[field]" autofocus />
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="col">
          <DataTable :value="lowerLimits" editMode="cell" @cell-edit-complete="onCellEditCompleteLower">
            <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-600 font-bold">Lower Limits</span>
              </div>
            </template>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
              <template v-if="col.field === 'color'" #body="{ data, field }">
                <ColorPicker v-model="data[field]" disabled />
              </template>
              <template v-if="col.field === 'loadingRange'" #editor="{ data, field }">
                <InputNumber v-if="data[field] === 1" v-model="data[field]" disabled />
                <InputNumber v-else v-model="data[field]" autofocus />
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="col">
          <DataTable :value="upperLimits" editMode="cell" @cell-edit-complete="onCellEditCompleteUpper">
            <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-600 font-bold">Upper Limits</span>
              </div>
            </template>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
              <template v-if="col.field === 'color'" #body="{ data, field }">
                <ColorPicker v-model="data[field]" disabled />
              </template>
              <template v-if="col.field === 'loadingRange'" #editor="{ data, field }">
                <InputNumber v-if="data[field] === 1" v-model="data[field]" disabled />
                <InputNumber v-else v-model="data[field]" autofocus />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </Fieldset>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDSAStore } from '@/store';
const dsaStore = useDSAStore();
const { dataSetting } = storeToRefs(dsaStore);
const columns = ref([
  { field: 'code', header: '#' },
  { field: 'loadingRange', header: ' Range' },
  { field: 'color', header: 'Color' },
]);

const grLoadings = ref([]);
const getGrLoadings = () => {
  return [
    {
      code: '=<',
      loadingRange: dataSetting.value.gridcode.loading.step1,
      color: '#46a42d',
    },
    {
      code: '>=',

      loadingRange: dataSetting.value.gridcode.loading.step1,
      color: '#ea831f',
    },
    {
      code: '>=',
      loadingRange: dataSetting.value.gridcode.loading.step2,
      color: '#e3080a',
    },
  ];
};
const lowerLimits = ref([]);
const getLowerLimits = () => {
  return [
    {
      code: '=<',
      loadingRange: 1,
      color: '#46a42d',
    },
    {
      code: '=<',

      loadingRange: dataSetting.value.gridcode.voltage.step2,
      color: '#0dcaf0',
    },
    {
      code: '=<',
      loadingRange: dataSetting.value.gridcode.voltage.step1,
      color: '#30318f',
    },
  ];
};
const upperLimits = ref([]);
const getUpperLimits = () => {
  return [
    {
      code: '>=',
      loadingRange: 1,
      color: '#46a42d',
    },
    {
      code: '>=',

      loadingRange: dataSetting.value.gridcode.voltage.step3,
      color: '#f5bd3b',
    },
    {
      code: '>=',
      loadingRange: dataSetting.value.gridcode.voltage.step4,
      color: '#e3080a',
    },
  ];
};
onMounted(() => {
  grLoadings.value = getGrLoadings();
  lowerLimits.value = getLowerLimits();
  upperLimits.value = getUpperLimits();
});
onUnmounted(() => {
  grLoadings.value = [];
  lowerLimits.value = [];
  upperLimits.value = [];
});
watch(dataSetting, (newValue, oldValue) => {
  grLoadings.value = getGrLoadings();
  lowerLimits.value = getLowerLimits();
  upperLimits.value = getUpperLimits();
});
const onCellEditCompleteLoading = (event) => {
  let { data, newValue, field, index } = event;
  if (index === 0 || index === 1) {
    dataSetting.value.gridcode.loading.step1 = newValue;
  } else {
    dataSetting.value.gridcode.loading.step2 = newValue;
  }
  grLoadings.value = getGrLoadings();
};

const onCellEditCompleteLower = (event) => {
  let { data, newValue, field, index } = event;
  if (index === 1) {
    dataSetting.value.gridcode.voltage.step2 = newValue;
  } else {
    dataSetting.value.gridcode.voltage.step1 = newValue;
  }
  grLoadings.value = getGrLoadings();
};

const onCellEditCompleteUpper = (event) => {
  let { data, newValue, field, index } = event;
  if (index === 1) {
    dataSetting.value.gridcode.voltage.step3 = newValue;
  } else {
    dataSetting.value.gridcode.voltage.step4 = newValue;
  }
  grLoadings.value = getGrLoadings();
};
</script>

<style lang="scss" scoped></style>

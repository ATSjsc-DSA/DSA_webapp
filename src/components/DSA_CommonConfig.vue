<template>
  <div class="card">
    <Fieldset>
      <template #legend>
        <div class="flex align-items-center pl-1">
          <i class="pi pi-cog"></i>
          <span class="font-bold">TSAT</span>
        </div>
      </template>
      <div class="flex flex-wrap gap-6 p-fluid">
        <div class="flex-auto">
          <label for="max_peak" class="font-bold block mb-2"> Max Peak </label>
          <InputNumber v-model="dataProfile.GridCode.TSA.max_peak" inputId="max_peak" />
        </div>
        <div class="flex-auto">
          <label for="time_stability" class="font-bold block mb-2"> Time Stability </label>
          <InputNumber
            v-model="dataProfile.GridCode.TSA.time_stability"
            inputId="time_stability"
            :minFractionDigits="2"
            :maxFractionDigits="5"
          />
        </div>
        <div class="flex-auto">
          <label for="band" class="font-bold block mb-2"> Band </label>
          <InputNumber v-model="dataProfile.GridCode.TSA.band" inputId="band" />
        </div>
      </div>
    </Fieldset>
    <Fieldset>
      <template #legend>
        <div class="flex align-items-center pl-1">
          <i class="pi pi-cog"></i>
          <span class="font-bold">Limit Setting</span>
        </div>
      </template>
      <div class="grid md:gap-8">
        <div class="col">
          <DataTable :value="grLoadings" editMode="cell" @cell-edit-complete="onCellEditComplete">
            <!-- <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-600 font-bold">Loading Limits</span>
              </div>
            </template> -->
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%">
              <template v-if="col.field === 'name'" #body="{ data, field }">
                {{ data[field] }}
              </template>
              <template v-else #body="{ data, field }">
                <span v-if="data['name'] === 'Low/High Voltage'"> {{ data[field] }} </span>
                <span v-else> {{ data[field] }} % </span>
              </template>
              <template v-if="col.field !== 'name'" #editor="{ data, field }">
                <InputNumber v-model="data[field]" autofocus />
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
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Fieldset from 'primevue/fieldset';

const dsaStore = useDSAStore();
const { dataProfile } = storeToRefs(dsaStore);

const columns = ref([
  { field: 'name', header: 'Name' },
  { field: 'rate1', header: 'Rate 1' },
  { field: 'rate2', header: 'Rate 2' },
  { field: 'rate3', header: 'Rate 3' },
]);

const rateString = 'rate';
const grLoadings = ref([]);

const getGrLoadings = () => {
  return dataProfile.value.GridCode.limitSetting.map((item) => ({
    name: item.name,
    rate1: item.rate1,
    rate2: item.rate2,
    rate3: item.rate3,
  }));
};

onMounted(() => {
  console.log(JSON.parse(JSON.stringify(dataProfile.value.GridCode.limitSetting))); // Kiểm tra dữ liệu ban đầu
  grLoadings.value = dataProfile.value.GridCode.limitSetting;
});

watch(dataProfile, () => {
  grLoadings.value = dataProfile.value.GridCode.limitSetting;
  console.log(grLoadings.value, 'grLoadings.value');
});

const onCellEditComplete = (event) => {
  const { data, newValue, field, index } = event;
  dataProfile.value.GridCode.limitSetting[index][field] = newValue;
};
</script>

<style lang="scss" scoped></style>

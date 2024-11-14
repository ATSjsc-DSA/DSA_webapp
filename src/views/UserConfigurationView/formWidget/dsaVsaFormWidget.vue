<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-12 flex justify-content-between">
        <div class="flex flex-column gap-2 mb-3 flex-1">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto w-full" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3 align-items-center">
          <label for="active" class="font-semibold mb-2"> Active</label>
          <InputSwitch id="active" v-model="data.active" autocomplete="off" />
        </div>
      </div>
      <Divider />
    </template>
    <div class="col-12">
      <span class="p-text-secondary block mb-3">Common</span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="maxChange" class="font-semibold"> Max Change </label>
        <InputNumber id="maxChange" v-model="data.maxChange" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="stepChange" class="font-semibold"> Step Change </label>
        <InputNumber id="stepChange" v-model="data.stepChange" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-6">
      <searchSubsystemWidget v-model="sourceSelected" label="Source" />
    </div>

    <div class="col-6">
      <searchSubsystemWidget v-model="sinkSelected" label="Sink" />
    </div>
    <div class="col-6">
      <div class="flex flex-column align-items-start gap-1">
        <label for="ps" class="font-semibold"> Contingencies</label>
        <AutoComplete
          v-model="contingenciesSelected"
          inputId="ps"
          optionLabel="name"
          optionValue="_id"
          completeOnFocus
          class="w-full psFilterAutoComplete"
          :suggestions="contingenciesSuggestions"
          name="psFilter"
          @complete="searchContingenciesFilter"
        />
      </div>
    </div>
    <div class="col-6">
      <searchSubsystemWidget v-model="fixSubPsSelected" label="Fix Sub System" />
    </div>
    <div v-show="false" class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="remedialActionId" class="font-semibold"> Remedial Action</label>
        <InputText
          id="remedialActionId"
          v-model="data.remedialActionId"
          disabled
          class="flex-auto"
          autocomplete="off"
        />
      </div>
    </div>
    <div v-show="false" class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="digsilentSettingId" class="font-semibold"> Digsilent Setting</label>
        <InputText
          id="digsilentSettingId"
          v-model="data.digsilentSettingId"
          disabled
          class="flex-auto"
          autocomplete="off"
        />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Monitor</span>

  <div class="grid item">
    <div class="col-12 flex justify-content-between">
      <searchSubsystemWidget v-model="monitorSubSystemSelected" label="Monitor Sub System " />

      <div class="flex flex-column gap-2 mb-3 px-3 align-items-center">
        <label for="monitor-active" class="font-semibold mb-2"> Active</label>
        <InputSwitch id="monitor-active" v-model="data.monitor.active" autocomplete="off" />
      </div>
    </div>
    <div v-if="data.monitor.active" class="col-12 flex justify-content-center gap-6 px-8 py-4">
      <div class="flex align-items-center gap-3 mb-3">
        <label for="monitor_signalP"> SignalP</label>
        <Checkbox v-model="data.monitor.signalP" inputId="monitor_signalP" name="monitor_signalP" :binary="true" />
      </div>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="monitor_signalQ"> SignalQ </label>
        <Checkbox v-model="data.monitor.signalQ" inputId="monitor_signalQ" name="monitor_signalQ" :binary="true" />
      </div>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="monitor_signalV" class="font-semibold"> SignalV </label>
        <Checkbox v-model="data.monitor.signalV" inputId="monitor_signalV" name="monitor_signalV" :binary="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ApiSubsystem, ApiContingencies } from '@/views/SystemEvents/api';
import { ref, watch } from 'vue';
import searchSubsystemWidget from './searchSubsystemWidget.vue';
const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const toast = useToast();

onMounted(async () => {
  if (data.value) {
    await setDefaultData();
  }
});
const data = defineModel();
watch(data, async (newVal, oldVal) => {
  if (newVal._id !== oldVal.__id) {
    if (newVal) {
      await setDefaultData();
    }
  }
});

const setDefaultData = async () => {
  if (data.value.contingenciesId) {
    await getContingenciesData(data.value.contingenciesId);
  }
  if (data.value.sourceId) {
    sourceSelected.value = await getSubSystemData(data.value.sourceId);
  }
  if (data.value.sinkId) {
    sinkSelected.value = await getSubSystemData(data.value.sinkId);
  }
  if (data.value.fixSubSystemId) {
    fixSubPsSelected.value = await getSubSystemData(data.value.fixSubSystemId);
  }
  if (data.value.monitor.monitorSubSystemId) {
    monitorSubSystemSelected.value = await getSubSystemData(data.value.monitor.monitorSubSystemId);
  }
};

// contingencies

const contingenciesSelected = ref();
const contingenciesSuggestions = ref();

watch(contingenciesSelected, (newVal) => {
  data.value.contingenciesId = newVal._id;
});
const searchContingenciesFilter = async (event) => {
  const query = event ? event.query.trim() : '';
  try {
    const res = await ApiContingencies.searchSubsystem(query);
    contingenciesSuggestions.value = res.data;
  } catch (error) {
    console.log('searchPsQueryFilter: error ', error);
  }
};

const getContingenciesData = async (id) => {
  try {
    const res = await ApiContingencies.getContingenciesData(id);
    contingenciesSelected.value = {
      name: res.data.name,
      _id: res.data._id,
    };
  } catch (error) {
    console.log('getContingenciesData: error ', error);
  }
};

// source

const sourceSelected = ref();

watch(sourceSelected, (newVal) => {
  data.value.sourceId = newVal._id;
});

// sink

const sinkSelected = ref();

watch(sinkSelected, (newVal) => {
  data.value.sinkId = newVal._id;
});

// fixSubPs

const fixSubPsSelected = ref();

watch(fixSubPsSelected, (newVal) => {
  data.value.fixSubSystemId = newVal._id;
});

// monitorSubSystem

const monitorSubSystemSelected = ref();

watch(monitorSubSystemSelected, (newVal) => {
  data.value.monitor.monitorSubSystemId = newVal._id;
});

const getSubSystemData = async (id) => {
  try {
    const res = await ApiSubsystem.getSubsystemData(id);
    return {
      name: res.data.name,
      _id: res.data._id,
    };
  } catch (error) {
    console.log('getSubSystemData: error ', error);
  }
};
</script>

<style>
.p-autocomplete-input,
.p-inputtext {
  width: 100%;
}
</style>

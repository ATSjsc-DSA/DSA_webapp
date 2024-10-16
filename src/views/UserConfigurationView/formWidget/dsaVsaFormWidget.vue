<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-10">
        <div class="flex flex-column gap-2 mb-3">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-2">
        <div class="flex flex-column gap-2 mb-3">
          <label for="active" class="font-semibold w-6rem"> Active</label>
          <InputSwitch id="active" class="mt-2" v-model="data.active" autocomplete="off" />
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
      <div class="flex flex-column gap-2 mb-3">
        <label for="sourceId" class="font-semibold"> Source</label>
        <!-- <InputText id="sourceId" v-model="data.sourceId" class="flex-auto" autocomplete="off" /> -->

        <Dropdown
          v-model="data.sourceId"
          :options="listSubSystem"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Source"
          class="flex-grow-1"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="sinkId" class="font-semibold"> Sink</label>
        <!-- <InputText id="sinkId" v-model="data.sinkId" class="flex-auto" autocomplete="off" /> -->
        <Dropdown
          v-model="data.sinkId"
          :options="listSubSystem"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Sink"
          class="flex-grow-1"
        />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="contingencyId" class="font-semibold"> Contingency</label>
        <!-- <InputText id="contingencyId" v-model="data.contingencyId" class="flex-auto" autocomplete="off" /> -->
        <Dropdown
          v-model="data.contingencyId"
          :options="listContingency"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Contingency"
          class="flex-grow-1"
        />
      </div>
    </div>
    <div class="col-6">
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
    <div class="col-6">
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
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="fixSubSystemId" class="font-semibold"> Fix Sub System</label>
        <!-- <InputText id="fixSubSystemId" v-model="data.fixSubSystemId" class="flex-auto" autocomplete="off" /> -->
        <Dropdown
          v-model="data.fixSubSystemId"
          :options="listSubSystem"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Fix Sub System"
          class="flex-grow-1"
        />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Monitor</span>

  <div class="grid item">
    <div class="col-10">
      <div class="flex flex-column gap-2 mb-3">
        <label for="monitorSubSystemId" class="font-semibold"> Monitor Sub System</label>
        <!-- <InputText
          id="monitorSubSystemId"
          v-model="data.monitor.monitorSubSystemId"
          class="flex-auto"
          autocomplete="off"
        /> -->
        <Dropdown
          v-model="data.monitor.monitorSubSystemId"
          :options="listSubSystem"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Monitor Sub System "
          class="flex-grow-1"
        />
      </div>
    </div>
    <div class="col-2">
      <div class="flex flex-column gap-2 mb-3">
        <label for="monitor-active" class="font-semibold w-6rem"> Active</label>
        <InputSwitch id="monitor-active" class="mt-2" v-model="data.monitor.active" autocomplete="off" />
      </div>
    </div>
    <template v-if="data.monitor.active">
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="monitor_signalP"> Signa lP</label>
          <Checkbox v-model="data.monitor.signalP" inputId="monitor_signalP" name="monitor_signalP" :binary="true" />
        </div>
      </div>
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="monitor_signalQ"> Signa lQ </label>
          <Checkbox v-model="data.monitor.signalQ" inputId="monitor_signalQ" name="monitor_signalQ" :binary="true" />
        </div>
      </div>
      <div class="col-4">
        <div class="flex align-items-center gap-3 mb-3">
          <label for="monitor_signalV" class="font-semibold"> Signa lV </label>
          <Checkbox v-model="data.monitor.signalV" inputId="monitor_signalV" name="monitor_signalV" :binary="true" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ApiSubsystem, ApiContingencies } from '@/views/SystemEvents/api';

const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const toast = useToast();

onMounted(async () => {
  await getListSubSystem();
  await getListContingency();
});
const data = defineModel();

const listSubSystem = ref([]);
const getListSubSystem = async () => {
  try {
    const res = await ApiSubsystem.getListSubsystemOnlyName();
    listSubSystem.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const listContingency = ref([]);

const getListContingency = async () => {
  try {
    const res = await ApiContingencies.getListContingencies();
    listContingency.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

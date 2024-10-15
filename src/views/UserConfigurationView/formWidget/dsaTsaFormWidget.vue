<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-10">
        <div class="flex flex-column gap-2 mb-3 px-3">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto" autocomplete="off" />
        </div>
      </div>
      <div class="col-2">
        <div class="flex flex-column gap-2 mb-3 px-3">
          <label for="active" class="font-semibold"> Active</label>
          <InputSwitch id="active" v-model="data.active" autocomplete="off" />
        </div>
      </div>
      <Divider />
    </template>
    <div class="col-12">
      <span class="p-text-secondary block mb-3">Common</span>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="maxChange" class="font-semibold"> Max Change </label>
        <InputNumber id="maxChange" v-model="data.maxChange" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="stepChange" class="font-semibold"> Step Change </label>
        <InputNumber id="stepChange" v-model="data.stepChange" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
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
      <div class="flex flex-column gap-2 mb-3 px-3">
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
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="disturbanceId" class="font-semibold"> Disturbance</label>
        <!-- <InputText id="disturbanceId" v-model="data.disturbanceId" class="flex-auto" autocomplete="off" /> -->
        <Dropdown
          v-model="data.disturbanceId"
          :options="listDisturance"
          optionValue="_id"
          optionLabel="name"
          placeholder="Select a Disturbance"
          class="flex-grow-1"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
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
      <div class="flex flex-column gap-2 mb-3 px-3">
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
      <div class="flex flex-column gap-2 mb-3 px-3">
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

  <div class="grid">
    <div class="col-10">
      <div class="flex flex-column gap-2 mb-3 px-3">
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
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="monitor-active" class="font-semibold"> Active</label>
        <InputSwitch id="monitor-active" v-model="data.monitor.active" autocomplete="off" />
      </div>
    </div>
  </div>
  <!-- ==== BusConfig -->

  <div class="flex align-items-center gap-3 my-3 font-bold">
    <label for="busConfig-active"> Bus </label>
    <Checkbox
      v-model="data.monitor.busConfig.active"
      inputId="busConfig-active"
      name="busConfig-active"
      class="scale-110"
      :binary="true"
    />
  </div>
  <div class="p-3 grid">
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="busConfig-voltage" class="font-semibold"> Voltage</label>
        <InputNumber
          id="busConfig-voltage"
          v-model="data.monitor.busConfig.voltage"
          :disabled="!data.monitor.busConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="busConfig-freq" class="font-semibold"> Freq</label>
        <InputNumber
          id="busConfig-freq"
          v-model="data.monitor.busConfig.freq"
          :disabled="!data.monitor.busConfig.active"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="busConfig-angle" class="font-semibold"> Angle</label>
        <InputNumber
          id="busConfig-angle"
          v-model="data.monitor.busConfig.angle"
          :disabled="!data.monitor.busConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
  <!-- ==== branchConfig -->

  <div class="flex align-items-center gap-3 mb-3 font-bold">
    <label for="branchConfig-active"> Branch </label>
    <Checkbox
      v-model="data.monitor.branchConfig.active"
      inputId="branchConfig-active"
      name="branchConfig-active"
      class="scale-110"
      :binary="true"
    />
  </div>
  <div class="p-3 grid">
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="branchConfig-activePower" class="font-semibold"> Active Power</label>
        <InputNumber
          id="branchConfig-activePower"
          v-model="data.monitor.branchConfig.activePower"
          :disabled="!data.monitor.branchConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="branchConfig-reActivePower" class="font-semibold"> ReActive Power</label>
        <InputNumber
          id="branchConfig-reActivePower"
          v-model="data.monitor.branchConfig.reActivePower"
          :disabled="!data.monitor.branchConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
  </div>

  <!-- ==== genConfig -->

  <div class="flex align-items-center gap-3 mb-3 font-bold">
    <label for="genConfig-active"> Gen </label>
    <Checkbox
      v-model="data.monitor.genConfig.active"
      inputId="genConfig-active"
      name="genConfig-active"
      class="scale-110"
      :binary="true"
    />
  </div>
  <div class="p-3 grid">
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="genConfig-rotorAngle" class="font-semibold"> Rotor Angle</label>
        <InputNumber
          id="genConfig-rotorAngle"
          v-model="data.monitor.genConfig.rotorAngle"
          :disabled="!data.monitor.genConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="genConfig-electP" class="font-semibold"> Elect P</label>
        <InputNumber
          id="genConfig-electP"
          v-model="data.monitor.genConfig.electP"
          :disabled="!data.monitor.genConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="genConfig-electQ" class="font-semibold"> Elect Q</label>
        <InputNumber
          id="genConfig-electQ"
          v-model="data.monitor.genConfig.electQ"
          :disabled="!data.monitor.genConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="genConfig-mechP" class="font-semibold"> Mech P</label>
        <InputNumber
          id="genConfig-mechP"
          v-model="data.monitor.genConfig.mechP"
          :disabled="!data.monitor.genConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3 px-3">
        <label for="genConfig-efd" class="font-semibold"> Efd</label>
        <InputNumber
          id="genConfig-efd"
          v-model="data.monitor.genConfig.efd"
          :disabled="!data.monitor.genConfig.active"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ApiSubsystem, ApiDisturbance } from '@/views/SystemEvents/api';

const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const toast = useToast();

onMounted(async () => {
  await getListSubSystem();
  await getListDisturbance();
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

const listDisturance = ref([]);

const getListDisturbance = async () => {
  try {
    const res = await ApiDisturbance.getListDisturbanceOnlyName();
    listDisturance.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

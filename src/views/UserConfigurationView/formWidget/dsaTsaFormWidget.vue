<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-12 flex justify-content-between">
        <div class="flex flex-column gap-2 mb-3 px-3 flex-1">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto w-full" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3 px-3 align-items-center">
          <label for="active" class="font-semibold"> Active</label>
          <InputSwitch id="active" v-model="data.active" autocomplete="off" />
        </div>
      </div>
      <!-- <div class="col-10">

      </div>
      <div class="col-2">

      </div> -->
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
  </div>
  <!-- monitor  -->
  <Divider />
  <span class="p-text-secondary block mb-5">Monitor</span>

  <div class="flex justify-content-between align-items-center">
    <div class="flex flex-column gap-2 mb-3 px-3 flex-1">
      <label for="monitorSubSystemId" class="font-semibold"> Monitor Sub System</label>
      <Dropdown
        v-model="data.monitor.monitorSubSystemId"
        :options="listSubSystem"
        optionValue="_id"
        optionLabel="name"
        placeholder="Select a Monitor Sub System "
        class="flex-grow-1"
      />
    </div>
    <div class="flex flex-column gap-2 mb-3 px-3 align-items-center">
      <label for="active" class="font-semibold"> Active</label>
      <InputSwitch id="monitor-active" v-model="data.monitor.active" autocomplete="off" />
    </div>
  </div>

  <div class="grid">
    <Card class="col-12 md:col-4">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Bus Config</span>
          <InputSwitch id="monitor-active" v-model="data.monitor.busConfig.active" autocomplete="off" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-column gap-5 mt-3">
          <FloatLabel>
            <InputNumber
              id="busConfig-voltage"
              v-model="data.monitor.busConfig.voltage"
              :disabled="!data.monitor.busConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-voltage">Voltage</label>
          </FloatLabel>

          <FloatLabel>
            <InputNumber
              id="busConfig-freq"
              v-model="data.monitor.busConfig.freq"
              :disabled="!data.monitor.busConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-freq">Freq</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              id="busConfig-angle"
              v-model="data.monitor.busConfig.angle"
              :disabled="!data.monitor.busConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-angle">Angle</label>
          </FloatLabel>
        </div>
      </template>
    </Card>
    <!-- ==== branchConfig -->
    <Card class="col-12 md:col-4">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Branch Config</span>
          <InputSwitch id="monitor-active" v-model="data.monitor.branchConfig.active" autocomplete="off" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-column gap-5 mt-3">
          <FloatLabel>
            <InputNumber
              id="busConfig-voltage"
              v-model="data.monitor.branchConfig.activePower"
              :disabled="!data.monitor.branchConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-voltage"> Active Power</label>
          </FloatLabel>

          <FloatLabel>
            <InputNumber
              id="busConfig-freq"
              v-model="data.monitor.branchConfig.reActivePower"
              :disabled="!data.monitor.branchConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-freq">ReActive Power</label>
          </FloatLabel>
        </div>
      </template>
    </Card>
    <Card class="col-12 md:col-4">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Gen Config</span>
          <InputSwitch id="monitor-active" v-model="data.monitor.genConfig.active" autocomplete="off" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-column gap-5 mt-3">
          <FloatLabel>
            <InputNumber
              id="busConfig-voltage"
              v-model="data.monitor.genConfig.rotorAngle"
              :disabled="!data.monitor.genConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-voltage">Rotor Angle</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              id="busConfig-freq"
              v-model="data.monitor.genConfig.electP"
              :disabled="!data.monitor.genConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-freq">Elect P</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              id="busConfig-angle"
              v-model="data.monitor.genConfig.electQ"
              :disabled="!data.monitor.genConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-angle">Elect Q</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              id="busConfig-freq"
              v-model="data.monitor.genConfig.mechP"
              :disabled="!data.monitor.genConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-freq">Mech P</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              id="busConfig-angle"
              v-model="data.monitor.genConfig.efd"
              :disabled="!data.monitor.genConfig.active"
              autocomplete="off"
              class="w-full"
            />
            <label for="busConfig-angle">Efd</label>
          </FloatLabel>
        </div>
      </template>
    </Card>
  </div>

  <!-- ==== genConfig -->
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ApiSubsystem, ApiDisturbance, ApiDisturbances } from '@/views/SystemEvents/api';
import FloatLabel from 'primevue/floatlabel';

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
    console.log('getListSubSystem: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const listDisturance = ref([]);

const getListDisturbance = async () => {
  try {
    const res = await ApiDisturbances.getListDisturbances();
    listDisturance.value = res.data;
  } catch (error) {
    console.log('getListDisturbance: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

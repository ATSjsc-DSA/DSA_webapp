<template>
  <div class="grid">
    <template v-if="!isCreateForm">
      <div class="col-12 flex justify-content-between">
        <div class="flex flex-column gap-2 mb-3 px-3 flex-1">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="data.name" class="flex-auto w-full" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3 px-3 align-items-center">
          <label for="active" class="font-semibold mb-2"> Active</label>
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
      <label for="active" class="font-semibold mb-2"> Active</label>
      <InputSwitch id="monitor-active" v-model="data.monitor.active" autocomplete="off" />
    </div>
  </div>

  <div class="flex justify-content-between p-4">
      <div class="flex-1">
        <Chip label="Bus" class="mb-3"></Chip>
        <div class="col-6">
          <div class="grid">
            <label for="monitor_signalP" class="col-6"> Voltage</label>
            <Checkbox class="col-6" v-model="data.monitor.busConfig.voltage" inputId="monitor_signalP" name="monitor_signalP" :binary="true" />
          </div>

          <div class="grid">
            <label for="monitor_signalQ" class="col-6"> Freq </label>
            <Checkbox class="col-6" v-model="data.monitor.busConfig.freq" inputId="monitor_signalQ" name="monitor_signalQ" :binary="true" />
          </div>

          <div class="grid">
            <label for="monitor_signalV" class="col-6"> Angle </label>
            <Checkbox class="col-6" v-model="data.monitor.busConfig.angle" inputId="monitor_signalV" name="monitor_signalV" :binary="true" />
          </div>
      </div>
      </div>
      
    <div class="flex-1">
        <Chip label="Branch" class="mb-3"></Chip>
        <div class="col-8">
            <div class="grid">
              <label for="monitor_signalP" class="col-6"> Active Power</label>
              <Checkbox class="col-6" v-model="data.monitor.branchConfig.activePower" inputId="monitor_signalP" name="monitor_signalP" :binary="true" />
            </div>

            <div class="grid">
              <label for="monitor_signalQ" class="col-6"> ReActive Power </label>
              <Checkbox class="col-6" v-model="data.monitor.branchConfig.reActivePower" inputId="monitor_signalQ" name="monitor_signalQ" :binary="true" />
            </div>
        </div>
    </div>
    <div class="flex-1">
        <Chip label="Gen" class="mb-3"></Chip>
        <div class="grid col-12">
          <div class="flex-1 col-6">
            <div class="grid">
              <label for="monitor_rotorAngle" class="col-6"> Rotor Angle</label>
              <Checkbox class="col-6" v-model="data.monitor.genConfig.rotorAngle" inputId="monitor_rotorAngle" name="monitor_rotorAngle" :binary="true" />
            </div>

            <div class="grid">
              <label class="col-6" for="monitor_efd"> Efd</label>
              <Checkbox class="col-6" v-model="data.monitor.genConfig.efd" inputId="monitor_efd" name="monitor_efd" :binary="true" />
            </div>
          </div>
          <div class="flex-1 col-6">
            <div class="grid">
              <label class="col-6" for="monitor_electP"> Elect P</label>
              <Checkbox class="col-6" v-model="data.monitor.genConfig.electP" inputId="monitor_electP" name="monitor_electP" :binary="true" />
            </div>

            <div class="grid">
              <label class="col-6" for="monitor_electQ"> Elect Q</label>
              <Checkbox class="col-6" v-model="data.monitor.genConfig.electQ" inputId="monitor_electQ" name="monitor_electQ" :binary="true" />
            </div>
            <div class="grid">
              <label class="col-6" for="monitor_mechP"> Mech P</label>
              <Checkbox class="col-6" v-model="data.monitor.genConfig.mechP" inputId="monitor_mechP" name="monitor_mechP" :binary="true" />
            </div>
          </div>
        </div>
    </div>
  </div>

  <!-- ==== genConfig -->
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ApiSubsystem, ApiDisturbance, ApiDisturbances } from '@/views/SystemEvents/api';

const props = defineProps({
  isCreateForm: { type: Boolean, default: true },
});
const toast = useToast();

onMounted(async () => {
  await getListSubSystem();
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


</script>

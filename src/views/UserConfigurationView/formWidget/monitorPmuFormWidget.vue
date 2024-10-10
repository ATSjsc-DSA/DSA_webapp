<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="appName" class="font-semibold"> Name </label>
    <InputText id="appName" v-model="data.name" class="flex-auto" autocomplete="off" />
  </div>
  <div class="grid">
    <div class="col-4">
      <div class="flex align-items-center gap-3">
        <label for="appActive" class="font-semibold w-6rem"> Active</label>
        <InputSwitch id="appActive" v-model="data.active" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex align-items-center gap-3">
        <label for="ip" class="font-semibold w-6rem"> IP</label>
        <InputMask id="ip" v-model="data.pmuIp" autocomplete="off" mask="999.999.99.9" placeholder="192.168.10.1" />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Current</span>

  <div class="grid">
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="anglePhaseA" class="font-semibold"> Angle Phase A </label>
        <InputText id="anglePhaseA" v-model="data.current.anglePhaseA" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="anglePhaseB" class="font-semibold"> Angle Phase B </label>
        <InputText id="anglePhaseB" v-model="data.current.anglePhaseB" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="anglePhaseC" class="font-semibold"> Angle Phase C </label>
        <InputText id="anglePhaseC" v-model="data.current.anglePhaseC" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="phaseA" class="font-semibold"> Phase A </label>
        <InputText id="phaseA" v-model="data.current.phaseA" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="phaseB" class="font-semibold"> Phase B </label>
        <InputText id="phaseB" v-model="data.current.phaseB" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="phaseC" class="font-semibold"> Phase C</label>
        <InputText id="phaseC" v-model="data.current.phaseC" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="kFactorCur" class="font-semibold"> K factor Curr</label>
        <InputNumber id="kFactorCur" v-model="data.current.kFactorCur" class="flex-auto" autocomplete="off" />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Power</span>
  <div class="grid">
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="activePower" class="font-semibold"> Active Power </label>
        <InputText id="activePower" v-model="data.power.activePower" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="kFactorPower" class="font-semibold"> K Factor Power </label>
        <InputNumber id="kFactorPower" v-model="data.power.kFactorPower" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="reactivePower" class="font-semibold"> Reactive Power </label>
        <InputText id="reactivePower" v-model="data.power.reactivePower" class="flex-auto" autocomplete="off" />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Voltage</span>

  <div class="grid mb-3">
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-anglePhaseA" class="font-semibold"> Angle Phase A </label>
        <InputText id="voltage-anglePhaseA" v-model="data.voltage.anglePhaseA" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-anglePhaseB" class="font-semibold"> Angle Phase B </label>
        <InputText id="voltage-anglePhaseB" v-model="data.voltage.anglePhaseB" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-anglePhaseC" class="font-semibold"> Angle Phase C </label>
        <InputText id="voltage-anglePhaseC" v-model="data.voltage.anglePhaseC" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-phaseA" class="font-semibold"> Phase A </label>
        <InputText id="voltage-phaseA" v-model="data.voltage.phaseA" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-phaseB" class="font-semibold"> Phase B </label>
        <InputText id="voltage-phaseB" v-model="data.voltage.phaseB" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex flex-column gap-2 pl-3">
        <label for="voltage-phaseC" class="font-semibold"> Phase C</label>
        <InputText id="voltage-phaseC" v-model="data.voltage.phaseC" class="flex-auto" autocomplete="off" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';
import InputMask from 'primevue/inputmask';

const data = defineModel();
</script>

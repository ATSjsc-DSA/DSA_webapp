<template>
  <div class="flex flex-column gap-2 mb-3">
    <label for="name" class="font-semibold"> Name </label>
    <InputText id="name" v-model="data.name" class="flex-auto" autocomplete="off" />
  </div>

  <div class="flex align-items-center gap-3 mb-3">
    <label for="active" class="font-semibold w-6rem"> Active</label>
    <InputSwitch id="active" v-model="data.active" autocomplete="off" />
  </div>
  <Divider />

  <div class="grid">
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
        <label for="sourceId" class="font-semibold"> Source Id </label>
        <InputText id="sourceId" v-model="data.sourceId" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="sinkId" class="font-semibold"> Sink Id </label>
        <InputText id="sinkId" v-model="data.sinkId" class="flex-auto" autocomplete="off" />
      </div>
    </div>

    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="contingencyId" class="font-semibold"> Contingency Id </label>
        <InputText id="contingencyId" v-model="data.contingencyId" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="remedialActionId" class="font-semibold"> Remedial Action Id </label>
        <InputText id="remedialActionId" v-model="data.remedialActionId" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="digsilentSettingId" class="font-semibold"> Digsilent Setting Id </label>
        <InputText id="digsilentSettingId" v-model="data.digsilentSettingId" class="flex-auto" autocomplete="off" />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="fixSubSystemId" class="font-semibold"> Fix Sub System Id </label>
        <InputText id="fixSubSystemId" v-model="data.fixSubSystemId" class="flex-auto" autocomplete="off" />
      </div>
    </div>
  </div>

  <Divider />
  <span class="p-text-secondary block mb-5">Monitor</span>

  <div class="grid item">
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="monitorSubSystemId" class="font-semibold"> Monitor Sub System Id </label>
        <InputText
          id="monitorSubSystemId"
          v-model="data.monitor.monitorSubSystemId"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="flex flex-column gap-2 mb-3">
        <label for="monitor-active" class="font-semibold w-6rem"> Active</label>
        <InputSwitch id="monitor-active" v-model="data.monitor.active" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex align-items-center gap-3 mb-3">
        <label for="signalP" class="font-semibold"> Signa lP</label>
        <InputSwitch id="monitor-signalP" v-model="data.monitor.signalP" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex align-items-center gap-3 mb-3">
        <label for="signalQ" class="font-semibold"> Signa lQ </label>
        <InputSwitch id="monitor-signalQ" v-model="data.monitor.signalQ" autocomplete="off" />
      </div>
    </div>
    <div class="col-4">
      <div class="flex align-items-center gap-3 mb-3">
        <label for="signalV" class="font-semibold"> Signa lV </label>
        <InputSwitch id="monitor-signalV" v-model="data.monitor.signalV" autocomplete="off" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch';

const data = defineModel();
</script>

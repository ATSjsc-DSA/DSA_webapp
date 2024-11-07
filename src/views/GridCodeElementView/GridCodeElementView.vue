<template>
  <div class="card layout-content">
    <Toast />
    <ConfirmDialog />

    <TabView>
      <TabPanel header="Voltage">
        <voltageWidget :gridcode-id="gridCodeId" />
      </TabPanel>

      <TabPanel header="Frequency">
        <frequencyWidget :gridcode-id="gridCodeId" />
      </TabPanel>

      <TabPanel header="VSA Case">
        <vsaCaseWidget :gridcode-id="gridCodeId" />
      </TabPanel>
      <TabPanel header="Angle Stability">
        <angleStabilityWidget :gridcode-id="gridCodeId" />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

import voltageWidget from './voltageWidget.vue';
import frequencyWidget from './frequencyWidget.vue';
import angleStabilityWidget from './angleStabilityWidget.vue';
import vsaCaseWidget from './vsaCaseWidget.vue';

const route = useRoute();

onMounted(async () => {});
watch(
  () => route.params.id,
  async (newId, oldId) => {
    gridCodeId.value = route.params.id;
  },
);
const gridCodeId = ref(route.params.id);
</script>

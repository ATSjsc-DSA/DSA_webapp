<template>
  <div class="card">
    <TabView>
      <TabPanel header="Information">
        <DSA_TSAT_info></DSA_TSAT_info>
      </TabPanel>
      <TabPanel header="Short-circuit event">
        <DSA_TSAT_SCE></DSA_TSAT_SCE>
      </TabPanel>
      <TabPanel header="Switch event">
        <DSA_TSAT_SE></DSA_TSAT_SE>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import DSA_TSAT_info from './DSA_TSAT_info.vue';
import DSA_TSAT_SCE from './DSA_TSAT_SCE.vue';
import DSA_TSAT_SE from './DSA_TSAT_SE.vue';
</script>

<style lang="scss" scoped></style>

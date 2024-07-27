<script setup>
import DSA_Dashboards from '@/components/DSA_Dashboards.vue';
import BreadcrumbPsm from '@/components/BreadcrumbPsm.vue';
</script>
<template>
  <div class="container_dash w-full flex flex-column gap-1">
    <BreadcrumbPsm></BreadcrumbPsm>
    <DSA_Dashboards class="flex-1"></DSA_Dashboards>
  </div>
</template>
<style scoped>
.container_dash {
  height: calc(100vh - 9rem);
}
.circle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.circleR {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(20px); /* Điều chỉnh giá trị này để thay đổi độ mờ */
  background: radial-gradient(circle, #ff0000, #fe4141);
}

.circleY {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(20px); /* Điều chỉnh giá trị này để thay đổi độ mờ */
  background: radial-gradient(circle, #ffb700, #ffb134);
}
.circleG {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(20px); /* Điều chỉnh giá trị này để thay đổi độ mờ */
  background: radial-gradient(circle, #00ff1a, #47ff4e);
}
</style>

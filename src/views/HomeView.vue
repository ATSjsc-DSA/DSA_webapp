<script setup>
import DSA_Dashboards from '@/components/DSA_Dashboards.vue';
</script>
<template>
  <div class="h-full w-full">
    <DSA_Dashboards></DSA_Dashboards>
  </div>
</template>
<style scoped>
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

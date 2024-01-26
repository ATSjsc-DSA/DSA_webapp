<script setup>
import mainLayout from '@/components/layout/mainLayout.vue';
import mapView from '@/components/mapView.vue';

import anhtdq from '@/components/a.vue';
import anhyd from '@/components/b.vue';
import TSA_F81Chart from '@/components/TSA_F81Chart.vue';
</script>

<template>
  <div class="h-full">
    <!-- <anhtdq></anhtdq> -->
    <!-- <anhyd></anhyd> -->
    <main-layout></main-layout>
    <!-- <TSA_F81Chart></TSA_F81Chart> -->
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

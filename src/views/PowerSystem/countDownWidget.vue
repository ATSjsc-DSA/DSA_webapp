<template>
  <div v-if="countDownVal > showAlarmAt">
    <ProgressBar :value="countDownVal" :showValue="false" style="height: 6px"></ProgressBar>
    <p v-tooltip.bottom="' Storage time'">{{ countDownVal }} seconds remaining.</p>
  </div>

  <div v-else>
    <ProgressBar :value="countDownVal" :showValue="false" class="progressbar-alarm" style="height: 6px"></ProgressBar>
    <p v-tooltip.bottom="`Storage time (${countDownVal})`" class="text-red-500 twinkle">
      Storage time is about to expire.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ProgressBar from 'primevue/progressbar';
import { TIME_COUNT_DOWN_STORAGE_FILE } from './api';
const emit = defineEmits(['timeout']);
const countDownVal = ref(TIME_COUNT_DOWN_STORAGE_FILE);
const showAlarmAt = ref(10);
let interval;

const countdown = () => {
  if (countDownVal.value > 0) {
    countDownVal.value--;
  } else {
    clearInterval(interval);
    emit('timeout');
  }
};

onMounted(() => {
  countDownVal.value = TIME_COUNT_DOWN_STORAGE_FILE;
  interval = setInterval(countdown, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style>
@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.twinkle {
  animation: twinkle 1.5s infinite;
}

.progressbar-alarm .p-progressbar-value {
  background-color: red;
}
</style>

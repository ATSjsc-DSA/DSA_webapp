<template>
  <div class="progress-bar">
    <div class="progress progress-1" :style="{ width: progressBarWidth95 }">
      <div class="progress-label">{{ percent }}%</div>
    </div>
    <div v-if="visible80Progress" class="progress progress-2" :style="{ width: progressBarWidth80 }">
      <div class="progress-label">{{ percent }}%</div>
    </div>
    <div class="ticks">
      <div v-for="tick in ticks" :key="tick" class="tick">
        <span class="tick-label">{{ tick }}</span>
      </div>
      <div class="relative pmax">
        <div class="tick_pmax">
          <span class="tick_pmax-label">{{ Pmax_area }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  dataArea: {
    type: Object,
    required: true,
  },
});
const visible80Progress = ref(false);
const dataAreaName = computed(() => props.dataArea.Name);
const p_area = computed(() => props.dataArea.P_area);
const Pmax_area = computed(() => props.dataArea.Pmax_area);
const progressBarWidth80 = computed(() => {
  let a = (80 / 100) * Pmax_area.value - p_area.value;
  if (a < 0) {
    visible80Progress.value = false;
    return 0;
  } else {
    visible80Progress.value = true;
    let b = Pmax_area.value - p_area.value;
    return ((a / b) * 100).toFixed(1) + '%';
  }
});
const progressBarWidth95 = computed(() => {
  let a = (95 / 100) * Pmax_area.value - p_area.value;
  let b = Pmax_area.value - p_area.value;
  return ((a / b) * 100).toFixed(1) + '%';
});
const ticks = computed(() => {
  const numTicks = 9;
  const tickInterval = parseInt((Pmax_area.value - p_area.value) / numTicks);
  const tickPositions = Array.from({ length: numTicks }, (_, index) => p_area.value + index * tickInterval);
  // tickPositions.push(Pmax_area.value);
  return tickPositions;
});
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 30px;
  background-color: #f0f0f0;
  margin-top: 20px;
  position: relative;
}

.progress {
  height: 100%;
  transition: width 0.3s ease-in-out;
  position: absolute;
}
.progress-1 {
  background-color: #2eb375;
}
.progress-2 {
  background-color: #ad8e38;
}
.progress-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.ticks {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: -20px;
  width: 100%;
}

.tick {
  flex: 1;
  text-align: start;
  position: relative;
}

.tick::before {
  content: '';
  position: absolute;
  bottom: 1.2rem;
  transform: translateX(50%);
  height: 1rem;
  width: 1px;
  background-color: black;
}
.tick-label {
  position: absolute;
  left: -25%;
}
.pmax {
  width: 2px;
}
.tick_pmax {
  display: flex;
  justify-content: s;
}
.tick_pmax::before {
  content: '';
  position: absolute;
  bottom: 1.2rem;
  transform: translateX(50%);
  height: 1rem;
  width: 1px;
  background-color: black;
  z-index: 10;
}
.tick_pmax-label {
  position: absolute;
  /* : -25%; */
  left: -2rem;
}
</style>

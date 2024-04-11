<template>
  <div class="progress-bar">
    <div v-if="visible80Progress" class="progress progress-1" :style="{ width: progressBarWidth80 }">
      <div class="progress-label">
        {{ (80 / 100) * Pmax_area - p_area > 0 ? ((80 / 100) * Pmax_area - p_area).toFixed(2) : zeroData }}
      </div>
    </div>
    <div class="progress progress-2" :style="{ width: progressBarWidth95 }">
      <div class="progress-label">
        {{ (95 / 100) * Pmax_area - p_area > 0 ? ((95 / 100) * Pmax_area - p_area).toFixed(2) : zeroData }}
      </div>
    </div>
    <div class="ticks">
      <div v-for="tick in ticks" :key="tick" class="tick">
        <span class="tick-label">{{ tick }}</span>
      </div>
      <div class="relative pmax">
        <div class="tick_pmax">
          <span class="tick_pmax-label">{{ PmaxZone.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  Pmax_area: {
    type: Number,
    required: true,
  },
  PmaxZone: {
    type: Number,
    required: true,
  },
  P_area: {
    type: Number,
    required: true,
  },
});
const zeroData = ref(0);
const visible80Progress = computed(() => (80 / 100) * Pmax_area.value > p_area.value);
const p_area = computed(() => props.P_area);
const Pmax_area = computed(() => props.Pmax_area);
const PmaxZone = computed(() => props.PmaxZone);
console.log(Pmax_area.value - p_area.value);
const progressBarWidth80 = computed(
  () => ((((80 / 100) * Pmax_area.value - p_area.value) / (Pmax_area.value - p_area.value)) * 100).toFixed(1) + '%',
);
const progressBarWidth95 = computed(
  () => ((((95 / 100) * Pmax_area.value - p_area.value) / (Pmax_area.value - p_area.value)) * 100).toFixed(1) + '%',
);
const ticks = computed(() => {
  const numTicks = 4;
  const tickInterval = parseInt((PmaxZone.value - p_area.value) / numTicks);
  const tickPositions = Array.from({ length: numTicks }, (_, index) =>
    parseFloat((p_area.value + index * tickInterval).toFixed(1)),
  );
  return tickPositions;
});
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 60%;
  background-color: #a51016;
  position: relative;
}

.progress {
  height: 100%;
  transition: width 0.3s ease-in-out;
  position: absolute;
  padding-top: 1rem;
}
.progress-1 {
  background-color: #0a9221;
  z-index: 100;
}
.progress-2 {
  background-color: #dda409;
}
.progress-label {
  position: absolute;
  top: 50%;
  right: -1rem;
  transform: translate(-50%, -50%);
  color: white;
  font-size: small;
}

.ticks {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: -1rem;
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
  bottom: 0.5rem;
  transform: translateX(50%);
  height: 1rem;
  width: 1px;
  background-color: var(--text-color-secondary);
  z-index: 1000;
}
.tick-label {
  position: absolute;
  left: -5%;
  font-size: small;
  color: var(--text-color-secondary);
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
  bottom: 0.5rem;
  transform: translateX(50%);
  height: 1rem;
  width: 1px;
  background-color: var(--text-color-secondary);
  z-index: 1000;
}
.tick_pmax-label {
  position: absolute;
  /* : -25%; */
  left: -2rem;
  font-size: small;
  color: var(--text-color-secondary);
}
</style>

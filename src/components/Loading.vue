<script setup></script>
<template>
  <div wire:loading class="loading-overlay">
    <div class="loading-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;
  overflow: hidden;
  background-color: rgba(55, 65, 81, 0.75); /* bg-gray-700 opacity-75 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* space-x-2 */
}

.dot {
  width: 0.5rem; /* w-2 */
  height: 0.5rem; /* h-2 */
  border-radius: 9999px; /* rounded-full */
  background-color: #2563eb; /* bg-blue-600 */
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

<template>
  <div class="h-full grid">
    <div class="col-6" v-for="fame in dataArea" :key="fame.name">
      <div class="card">
        <b>{{ fame.name }}</b>
        <div class="flex justify-content-end align-items-end">
          <p>
            {{ fame.value }} <i class="text-orange-500">{{ fame.name.includes('P') ? 'MW' : 'MVAR' }}</i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';

const props = defineProps({
  DataArea: {
    type: Object,
    requied: true,
  },
});
const data = computed(() => props.DataArea);
const dataArea = ref([]);
const convertToObjects = (inputObj) => {
  dataArea.value = Object.keys(inputObj)
    .slice(2)
    .map((key) => {
      return { name: key, value: inputObj[key] };
    });
};

watch(data, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    convertToObjects(newValue);
  }
});

onMounted(() => {
  convertToObjects(data.value);
});
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: transparent;
  b {
    color: var(--text-color);
    text-decoration: underline; /* Thêm gạch chân */
    text-decoration-color: rgb(88, 147, 196); /* Màu của gạch chân */
    text-underline-offset: 5px; /* Khoảng cách giữa chữ và gạch chân */
  }

  p {
    font-size: 0.95rem;
    float: right inherit;
    color: var(--text-color);
  }
}

.card:hover {
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
  scale: 1.1;
}
</style>

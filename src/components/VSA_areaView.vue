<template>
  <ul class="semicircle-container">
    <li class="semicircle-item" v-for="(item, index) in dataArea" :key="index">
      <div class="leaderboard__profiles">
        <span class="leaderboard__name">{{ item.name }}</span>
        <span class="leaderboard__value">{{ rouderInit(item.value) }}</span>
        <div></div>
        <span class="leaderboard__Dimensional">{{ item.name.includes('P') ? 'MV' : 'MVAR' }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  DataArea: {
    type: Object,
    requied: true,
  },
});
const loadExcludedKeys = () => {
  if (props.DataArea) {
    switch (props.DataArea.Name) {
      case 'North':
        return [
          'Name',
          'Pmax_area',
          'P_area',
          'P_Central-North',
          'Q_Central-North',
          'P_Central-South',
          'Q_Central-South',
          'P_South-Central',
          'Q_South-Central',
        ];

      case 'Central':
        return [
          'Name',
          'Pmax_area',
          'P_area',
          'P_North-Central',
          'Q_North-Central',
          'P_South-Central',
          'Q_South-Central',
        ];

      case 'South':
        return [
          'Name',
          'Pmax_area',
          'P_area',
          'P_North-Central',
          'Q_North-Central',
          'P_Central-North',
          'Q_Central-North',
          'P_Central-South',
          'Q_Central-South',
        ];
        break;
      default:
        break;
    }
  }
};
const dataArea = computed(() => {
  const excludedKeys = loadExcludedKeys();
  if (props.DataArea) {
    return Object.entries(props.DataArea)
      .filter(([name]) => !excludedKeys.includes(name))
      .map(([name, value]) => ({ name, value }));
  } else {
    return [];
  }
});
const rouderInit = (data) => {
  return parseFloat(data.toFixed(2)).toLocaleString();
};
</script>

<style lang="scss" scoped>
.semicircle-container {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  top: 0;
  bottom: 0;
  // top: 25%;
  gap: 0.7rem;
}
.leaderboard {
  &__profiles {
    display: grid;
    row-gap: 0.1rem;
    align-items: center;
    margin-top: 0.2rem;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--surface-border);
    box-shadow: 10px 5px 7px -1px rgba(12, 12, 12, 0.23);
    grid-template-columns: 3fr 0.5fr 1fr 0.2fr;

    cursor: pointer;
    transition:
      transform 0.25s cubic-bezier(0.7, 0.98, 0.86, 0.98),
      box-shadow 0.25s cubic-bezier(0.7, 0.98, 0.86, 0.98);
    background-color: var(--surface-overlay);

    &:hover {
      transform: scale(1.3);
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
      z-index: 100;
    }
  }

  &__name {
    color: var(--text-color);
    font-weight: 600;
    font-size: 0.7rem;
    letter-spacing: 0.64px;
    margin-left: 0.2rem;
  }

  &__value {
    color: #35d8ac;
    font-weight: 700;
    font-size: 0.9rem;
    text-align: center;

    & > span {
      opacity: 0.8;
      font-weight: 600;
      font-size: 0.8rem;
      margin-left: 0.2rem;
    }
  }
  &__Dimensional {
    color: var(--text-color-secondary);
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.64px;
    margin-left: 0.2rem;
  }
}

@media (max-width: 1600px) {
  .semicircle-container {
    gap: 0.5rem;
  }
  .leaderboard {
    font-size: 0.7rem;
  }
}
</style>

<template>
  <ul class="semicircle-container-left z-5">
    <li class="semicircle-item__left" v-for="(item, index) in P_array" :key="index">
      <div class="flex justify-content-end">
        <span class="leaderboard__name__left">{{ rouderName(item.name) }}</span>
      </div>
      <div class="leaderboard__profile__left">
        <span class="leaderboard__value__left">{{ rouderInit(item.value) }}</span>
        <div></div>
        <span class="leaderboard__Dimensional">MW</span>
      </div>
    </li>
  </ul>
  <ul class="semicircle-container-right z-5">
    <li class="semicircle-item__right" v-for="(item, index) in Q_array" :key="index">
      <span class="leaderboard__name__right mb-2">{{ rouderName(item.name) }}</span>
      <div class="leaderboard__profile__right">
        <span class="leaderboard__value__right">{{ rouderInit(item.value) }}</span>
        <div></div>
        <span class="leaderboard__Dimensional">MVAR</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import Tag from 'primevue/tag';
import { computed } from 'vue';

const props = defineProps({
  DataArea: {
    type: Object,
    requied: true,
  },
});
const excludedKeys = ['Name', 'Pmax_area', 'P_area'];
const dataArea = computed(() => {
  if (props.DataArea) {
    return Object.entries(props.DataArea)
      .filter(([name]) => !excludedKeys.includes(name))
      .map(([name, value]) => ({ name, value }));
  } else {
    return [];
  }
});
const P_array = computed(() => {
  console.log(dataArea.value, 'dataArea.value.');
  return dataArea.value.filter((item) => item.name.includes('P'));
});
const Q_array = computed(() => {
  return dataArea.value.filter((item) => item.name.includes('Q'));
});
const rouderInit = (data) => {
  return parseFloat(data.toFixed(2)).toLocaleString();
};
const rouderName = (data) => {
  switch (data) {
    case 'Total_P_gen':
      return 'Gen P';
    case 'Total_Q_gen':
      return 'Gen Q';
    case 'Total_P_load':
      return 'Load P';
    case 'Total_Q_load':
      return 'Load Q';
    case 'Export_P':
      return 'Export P';
    case 'Export_Q':
      return 'Export Q';
    case 'Import_P':
      return 'Import P';
    case 'Import_Q':
      return 'Import Q';
  }
};
</script>

<style lang="scss" scoped>
.semicircle-container {
  &-left,
  &-right {
    position: absolute;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    top: 0;
    bottom: 0;
    // top: 25%;
    gap: 1.2rem;
  }

  &-left {
    left: 0;
  }

  &-right {
    right: 0;
  }
}

.semicircle-item__right:nth-child(1),
.semicircle-item__right:nth-child(4) {
  left: 50%;
  margin: 0px 0px 0px calc(50% - 12.5rem);
}

.semicircle-item__left:nth-child(1),
.semicircle-item__left:nth-child(4) {
  left: 50%;
  margin: 0px calc(50% - 12.5rem) 0px 0px;
}

.semicircle-item__right:nth-child(2),
.semicircle-item__right:nth-child(3) {
  left: 50%;
  margin: 0px 0px 0px calc(50% - 11rem);
}

.semicircle-item__left:nth-child(2),
.semicircle-item__left:nth-child(3) {
  left: 50%;
  margin: 0px calc(50% - 11rem) 0px 0px;
}

.leaderboard {
  &__profiles {
    border-radius: 0 0 12px 12px;
    padding: 10px 5px 10px;
    display: grid;
    row-gap: 8px;
  }

  &__profile {
    &__left,
    &__right {
      display: grid;
      row-gap: 0.2rem;
      align-items: center;
      margin-top: 0.2rem;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid var(--surface-border);
      box-shadow: 10px 5px 7px -1px rgba(12, 12, 12, 0.23);
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
    &__left {
      grid-template-columns: 3fr 0.5fr 1fr 0.2fr;
    }
    &__right {
      grid-template-columns: 3fr 0.5fr 1fr 0.2fr;
    }
  }
  &__name {
    &__left,
    &__right {
      color: var(--text-color);
      font-weight: 600;
      font-size: 0.7rem;
      letter-spacing: 0.64px;
      margin-left: 0.2rem;
    }
    &__left {
    }
    &__right {
    }
  }

  &__value {
    &__left,
    &__right {
      color: #35d8ac;
      font-weight: 700;
      font-size: 0.9rem;
    }
    &__left {
      text-align: center;
    }
    &__right {
      text-align: center;
    }

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
    &-left,
    &-right {
      gap: 0.5rem;
    }
  }
  .leaderboard {
    &__value {
      &__left,
      &__right {
        font-size: 0.7rem;
      }
    }
  }
  .semicircle-item__right:nth-child(1),
  .semicircle-item__right:nth-child(4) {
    left: 50%;
    margin: 0px 0px 0px calc(50% - 8rem);
  }

  .semicircle-item__left:nth-child(1),
  .semicircle-item__left:nth-child(4) {
    left: 50%;
    margin: 0px calc(50% - 8rem) 0px 0px;
  }

  .semicircle-item__right:nth-child(2),
  .semicircle-item__right:nth-child(3) {
    left: 50%;
    margin: 0px 0px 0px calc(50% - 6.5rem);
  }

  .semicircle-item__left:nth-child(2),
  .semicircle-item__left:nth-child(3) {
    left: 50%;
    margin: 0px calc(50% - 6.5rem) 0px 0px;
  }
}
</style>

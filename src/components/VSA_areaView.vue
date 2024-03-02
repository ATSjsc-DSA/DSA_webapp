<template>
  <ul class="semicircle-container z-5">
    <li class="semicircle-item" v-for="(item, index) in dataArea" :key="index">
      <div class="leaderboard__profile">
        <span class="leaderboard__name">{{ rouderName(item.name) }}</span>
        <span class="leaderboard__value">{{ rouderInit(item.value) }}</span>
      </div>
      <!-- <Tag severity="success" value="Success">{{ rouderName(item.name) }}: {{ rouderInit(item.value) }}</Tag> -->
    </li>
  </ul>
</template>

<script setup>
import Tag from 'primevue/tag';

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
const rouderInit = (data) => {
  return parseFloat((data * 100).toFixed(2));
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

<style lang="scss">
/* Add your styles for the semicircles here */
.semicircle-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
}

.semicircle-item {
}

.semicircle-item:nth-child(odd) {
  /* background-color: #fff;
  color: #3498db; */
}

.semicircle-item:hover {
  transform: scale(1.2);
}

.semicircle-item:nth-child(1),
.semicircle-item:nth-child(8) {
  left: 50%;
  margin: 0px 0px 0px calc(50% - 10rem);
}
.semicircle-item:nth-child(8) {
  margin-top: 10px;
}

.semicircle-item:nth-child(2),
.semicircle-item:nth-child(7) {
  margin: 10px 0px 0px calc(50% - 9rem);
}

.semicircle-item:nth-child(3),
.semicircle-item:nth-child(6) {
  margin: 10px 0px 0px calc(50% - 8rem);
}

.semicircle-item:nth-child(4),
.semicircle-item:nth-child(5) {
  margin: 10px 0px 0px calc(50% - 7rem);
}

.leaderboard {
  &__profiles {
    border-radius: 0 0 12px 12px;
    padding: 10px 5px 10px;
    display: grid;
    row-gap: 8px;
  }

  &__profile {
    display: grid;
    grid-template-columns: 2fr 3fr 0.5fr;
    align-items: center;
    // padding: 10px 30px 10px 10px;
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
      transform: scale(1.2);
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
    }
  }
  &__name {
    color: #979cb0;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.64px;
    margin-left: 12px;
  }

  &__value {
    color: #35d8ac;
    font-weight: 700;
    font-size: 14px;
    text-align: right;

    & > span {
      opacity: 0.8;
      font-weight: 600;
      font-size: 13px;
      margin-left: 3px;
    }
  }
}
</style>

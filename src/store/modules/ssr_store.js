import { defineStore } from 'pinia';

import SSR_api from '@/api/ssr_api';

export const useSSRStore = defineStore('SSR_Store', () => {
  const listSub = ref([]);

  return { listSub };
});

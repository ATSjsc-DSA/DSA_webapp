import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

export const useDSAStore = defineStore('DSA_Store', () => {
  const listSub = ref([]);

  return { listSub };
});

import { defineStore } from 'pinia';
import DSA_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';

export const useCommonStore = defineStore('common', () => {
  const isLoading = ref(false);
  const psm_automatic = ref(true);
  const psm_active = ref({});
  const psmList = ref([]);
  let intervalId = null;

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const getPsmIdActive = async () => {
    try {
      const res = await DSA_api.getPSMIdActive();
      psm_active.value = res.data;
    } catch (error) {}
  };

  const getListPsm = async () => {
    try {
      const res = await DSA_api.getListPsm();
      psmList.value = res.data;
    } catch (error) {}
  };

  const startAutoUpdate = () => {
    if (intervalId) return; // Prevent multiple intervals
    intervalId = setInterval(() => {
      getPsmIdActive();
    }, intervalTime);
  };

  const stopAutoUpdate = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  //watch
  watch(psm_automatic, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        startAutoUpdate();
      } else {
        stopAutoUpdate();
      }
    }
  });

  return {
    psm_automatic,
    isLoading,
    setLoading,
    psm_active,
    getPsmIdActive,
    psmList,
    getListPsm,
    startAutoUpdate,
    stopAutoUpdate,
  };
});

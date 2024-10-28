import { defineStore } from 'pinia';
import DSA_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';
import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

export const useCommonStore = defineStore('common', () => {
  const isLoading = ref(false);
  const psm_automatic = ref(true);
  const psm_active = ref({});
  const psmList = ref([]);
  const projectData = ref(JSON.parse(localStorage.getItem('projectData') || '{}'));
  const userConfigVersionId = ref(localStorage.getItem('userConfigVersionId') || '');
  const powerSystemVersionId = ref(localStorage.getItem('powerSystemVersionId') || '');
  const additionVersionId = ref(localStorage.getItem('additionVersionId') || '');
  const hmiTaskId = ref('67175dd23a41cf97c7e4bd21');

  const editVersionData = ref({});
  let intervalId = null;

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const getPsmIdActive = async () => {
    try {
      const res = await DSA_api.getVersionManagement(projectData.value._id);
      psm_active.value = res.data;
      updateConfigVersionId(res.data.userConfigVersionId);
      updatePsVersionId(res.data.powerSystemVersionId);
      updateAdditionVersionId(res.data.additionVersionId);
    } catch (error) {}
  };
  const updateConfigVersionId = (newId) => {
    if (userConfigVersionId.value != newId) {
      userConfigVersionId.value = newId;
      localStorage.setItem('userConfigVersionId', newId);
    }
  };
  const updatePsVersionId = (newId) => {
    if (powerSystemVersionId.value != newId) {
      powerSystemVersionId.value = newId;
      localStorage.setItem('powerSystemVersionId', newId);
    }
  };
  const updateAdditionVersionId = (newId) => {
    if (additionVersionId.value != newId) {
      additionVersionId.value = newId;
      localStorage.setItem('additionVersionId', newId);
    }
  };

  const getListPsm = async (time1 = 0, time2 = 0) => {
    try {
      const res = await DSA_api.getListPsm({
        startTime: time1 === 0 ? 0 : convertTimeStringToInt(time1),
        endTime: time2 === 0 ? 0 : convertTimeStringToInt(time2),
      });
      psmList.value = res.data;
    } catch (error) {
      console.log(error);
    }
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

  const clearData = () => {
    psmList.value = [];
  };
  return {
    projectData: projectData,
    psm_automatic,
    isLoading,
    setLoading,
    psm_active,
    getPsmIdActive,
    psmList,
    getListPsm,
    startAutoUpdate,
    stopAutoUpdate,
    clearData,
    editVersionData,
    userConfigVersionId,
    powerSystemVersionId,
    additionVersionId,
    hmiTaskId,
  };
});

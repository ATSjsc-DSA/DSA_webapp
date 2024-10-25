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
  const userConfigVersionId = ref('5eb7cf5a86d9755df3a6c593');
  const powerSystemVersionId = ref('66decf1dcff005199529524b');
  const additionVersionId = ref('5eb7cf5a86d9755df3a6c593');
  const editVersionData = ref({});
  let intervalId = null;

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const getPsmIdActive = async () => {
    try {
      const res = await DSA_api.getVersionActive(projectData.value._id);
      psm_active.value = res.data;
      userConfigVersionId.value = res.data.userConfigVersionId;
      powerSystemVersionId.value = res.data.powerSystemVersionId;
      additionVersionId.value = res.data.additionVersionId;
    } catch (error) {}
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
  };
});

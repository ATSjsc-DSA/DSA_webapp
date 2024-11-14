import { defineStore } from 'pinia';
import DSA_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';
import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

export const useCommonStore = defineStore('common', () => {
  const isLoading = ref(false);
  const measInfo_automatic = ref(true);
  const measInfoList = ref([]);
  const projectData = ref(JSON.parse(localStorage.getItem('projectData') || '{}'));
  const profileData = ref(JSON.parse(localStorage.getItem('profileData') || '{}'));

  const powerSystemVersionId = ref(localStorage.getItem('powerSystemVersionId') || '66decf1dcff005199529524b');
  const additionVersionId = ref(localStorage.getItem('additionVersionId') || '66decf1dcff005199529524b');
  const hmiTaskId = ref(localStorage.getItem('hmiTaskId') || '67175dd23a41cf97c7e4bd21');
  const measInfoActiveId = ref(localStorage.getItem('measInfoActiveId'));
  // const hmiTaskId = ref('67175dd23a41cf97c7e4bd21');
  const editVersionData = ref({});

  const userConfigProfileIdActive = ref(localStorage.getItem('userConfigProfileIdActive'));
  let intervalId = null;
  const setLoading = (loading) => {
    isLoading.value = loading;
  };
  const getDsaServiceInfo = async () => {
    try {
      const res = await DSA_api.getDsaService();
      updateUserConfigProfileIdActive(res.data.dataVersion.userConfigProfileId);
    } catch (error) {}
  };

  const updateUserConfigProfileIdActive = (newId) => {
    if (userConfigProfileIdActive.value != newId) {
      userConfigProfileIdActive.value = newId;
      localStorage.setItem('userConfigProfileIdActive', newId);
    }
  };

  const getMeasInfoActive = async () => {
    try {
      const res = await DSA_api.getMeasInfoActive(projectData.value._id);
      updateMeasInfoActiveId(res.data._id);
    } catch (error) {}
  };
  const updateMeasInfoActiveId = (newId) => {
    if (measInfoActiveId.value != newId) {
      measInfoActiveId.value = newId;
      localStorage.setItem('measInfoActiveId', newId);
    }
  };

  const getListMeasInfo = async (time1 = 0, time2 = 0) => {
    try {
      const res = await DSA_api.getListMeasInfo(projectData.value._id, {
        startTime: time1 === 0 ? 0 : convertTimeStringToInt(time1),
        endTime: time2 === 0 ? 0 : convertTimeStringToInt(time2),
      });
      measInfoList.value = res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const startAutoUpdate = () => {
    if (intervalId) return; // Prevent multiple intervals
    intervalId = setInterval(() => {
      getDsaServiceInfo();
      getMeasInfoActive();
    }, intervalTime);
  };

  const stopAutoUpdate = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  //watch
  watch(measInfo_automatic, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        startAutoUpdate();
      } else {
        stopAutoUpdate();
      }
    }
  });

  const clearData = () => {
    measInfoList.value = [];
  };

  return {
    projectData: projectData,
    measInfo_automatic,
    isLoading,
    setLoading,
    startAutoUpdate,
    stopAutoUpdate,
    clearData,
    editVersionData,
    powerSystemVersionId,
    additionVersionId,
    hmiTaskId,
    getMeasInfoActive,
    getDsaServiceInfo,
    getListMeasInfo,
    userConfigProfileIdActive,
    measInfoActiveId,
    measInfoList,

    profileData,
  };
});

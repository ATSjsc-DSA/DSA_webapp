import { defineStore } from 'pinia';
import DSA_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';
import DSA_Common from '@/combosables/DSA_common';
import { timestamp } from '@vueuse/core';
const { convertTimeStringToInt } = DSA_Common();

export const useCommonStore = defineStore('common', () => {
  const isLoading = ref(false);
  const measInfo_automatic = ref(JSON.parse(localStorage.getItem('measInfo_automatic') || true));
  const measInfoList = ref([]);
  const projectData = ref(JSON.parse(localStorage.getItem('projectData') || '{}'));
  const profileData = ref(JSON.parse(localStorage.getItem('profileData') || '{}'));
  const slotData = ref(JSON.parse(localStorage.getItem('slotData') || '{}'));

  const measInfoActive = ref(JSON.parse(localStorage.getItem('measInfoActive')));
  const editVersionData = ref({});

  let intervalId = null;
  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const getMeasInfoActive = async () => {
    try {
      const { data } = await DSA_api.getMeasInfoActive(projectData.value._id);
      if (measInfoActive.value?._id !== data._id) {
        const MeasInfoActive = {
          _id: data._id,
          createdTimestamp: data.createdTimestamp,
        };
        updateMeasInfoActive(MeasInfoActive);
      }
    } catch (error) {
      // console.error('Error fetching active measurement info:', error);
    }
  };

  const updateMeasInfoActive = (newInfo) => {
    // console.log(newInfo, 'console.log(newInfo);');

    measInfoActive.value = newInfo;
    localStorage.setItem('measInfoActive', JSON.stringify(newInfo));
  };

  const updateMeasInfoAutomatic = (newId) => {
    if (measInfo_automatic.value != newId) {
      measInfo_automatic.value = newId;
      localStorage.setItem('measInfo_automatic', newId);
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
    profileData,
    slotData,
    measInfo_automatic,
    isLoading,
    setLoading,
    startAutoUpdate,
    stopAutoUpdate,
    clearData,
    editVersionData,
    getMeasInfoActive,
    getListMeasInfo,
    measInfoActive,
    measInfoList,
    updateMeasInfoAutomatic,
    updateMeasInfoActive,
    profileData,
  };
});

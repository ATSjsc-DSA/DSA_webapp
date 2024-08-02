import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

export const useDSAStore = defineStore('DSA_Store', () => {
  const dataProfile = ref();
  const listGen = ref([]);
  const totalSizeGen = ref(0);
  const listLoad = ref([]);
  const totalSizeLoad = ref(0);
  const listBranch = ref([]);
  const totalSizeBranch = ref(0);
  const listArea = ref([]);
  const listMonitor = ref([]);
  const listDisturbances = ref([]);
  const listContingencies = ref([]);
  const listEquipment = ref([]);
  const getListGen = async (pageNumber = 1) => {
    try {
      const res = await DSA_api.getListGen({ page: pageNumber });
      listGen.value = res.data.items;
      if (res.data.total !== totalSizeGen.value) {
        totalSizeGen.value = res.data.total;
      }
    } catch (error) {}
  };

  const getListLoad = async (pageNumber = 1) => {
    try {
      const res = await DSA_api.getListLoad({ page: pageNumber });
      listLoad.value = res.data.items;
      if (res.data.total !== totalSizeLoad.value) {
        totalSizeLoad.value = res.data.total;
      }
    } catch (error) {}
  };

  const getListBranch = async (pageNumber = 1) => {
    try {
      const res = await DSA_api.getListBranch({ page: pageNumber });
      listBranch.value = res.data.items;
      if (res.data.total !== totalSizeBranch.value) {
        totalSizeBranch.value = res.data.total;
      }
    } catch (error) {}
  };

  const getListEquipment = async (queryString, typeString, listDataOut) => {
    try {
      const res = await DSA_api.getSearchEquipment(
        { listData: listDataOut ? listDataOut : [] },
        { query: queryString, type: typeString },
      );
      listEquipment.value = res.data.map((item) => item.name);
    } catch (error) {}
  };

  const getListAreaWithoutEquip = async () => {
    try {
      const res = await DSA_api.getAreaWithoutEquip();
      listArea.value = res.data;
    } catch (error) {}
  };
  const getListMonitorWithoutEquip = async () => {
    try {
      const res = await DSA_api.getMonitorWithoutEquip();
      listMonitor.value = res.data;
    } catch (error) {}
  };
  const getListDisturbanceWithoutData = async () => {
    try {
      const res = await DSA_api.getDisturbancesWithoutData();
      listDisturbances.value = res.data;
    } catch (error) {}
  };
  const getContingenciesWithoutEquip = async () => {
    try {
      const res = await DSA_api.getContingenciesWithoutEquip();
      listContingencies.value = res.data;
    } catch (error) {}
  };

  // const getProfile = async () => {
  //   try {
  //     const a = new Date();
  //     const timestamp = a.getTime(); // Lấy thời gian dưới dạng số int
  //     const res = await DSA_api.getProfileWithTime(timestamp);
  //     dataProfile.value = res.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const createNewProfile = async () => {
    try {
      const res = await DSA_api.createProfile(dataProfile.value);
      return res;
    } catch (error) {
      return error;
    }
  };
  return {
    createNewProfile,
    dataProfile,
    getListGen,
    getListLoad,
    getListBranch,
    listGen,
    totalSizeGen,
    listLoad,
    totalSizeLoad,
    listBranch,
    totalSizeBranch,
    getListAreaWithoutEquip,
    getListMonitorWithoutEquip,
    listArea,
    listMonitor,
    listContingencies,
    getListDisturbanceWithoutData,
    listDisturbances,
    getContingenciesWithoutEquip,
    listEquipment,
    getListEquipment,
  };
});

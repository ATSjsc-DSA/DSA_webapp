import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

export const useDSAStore = defineStore('DSA_Store', () => {
  const dataProfile = ref({
    F81: [
      {
        measurement: '1001A',
        enabled: true,
        F_Threshold: 49,
        F_Delay: 0,
        Trip: [],
      },
    ],
    F27: [
      {
        measurement: '1403A',
        enabled: true,
        V_Threshold: 49,
        F_Delay: 0,
        Trip: [],
      },
    ],
    PT: [],
    SSR_setting: {
      f_min: 10,
      f_max: 100,
      step: 0.5,
    },
    SSR_Gen: [
      {
        gen: '1403A',
        enabled: true,
        f: 25,
        dmin: 1,
        dmax: 0.01,
        MVA_Gen: 635,
        Xd_sub: 0.2,
        Xq_sub: 0.2,
        Td0_sub: 0.04,
        Tq0_sub: 0.06,
        Rgen: 0.0009,
        Xgen: 0.2,
        Contingencies_id: [],
      },
    ],
    TSA_Case: [
      {
        mon_id: '',
        stop_time: 25,
        max_peak: 1,
        time_stability: 0.01,
        gen_scale_pos_id: '',
        load_scale_pos_id: '',
        MW_max_pos: 0.2,
        gen_scale_neg_id: '',
        load_scale_neg_id: '',
        MW_max_neg: 0.2,
        contingencies: [],
        MV_step: 200,
      },
    ],
    TSA_SCE: [
      {
        case: 'Area1-Area2',
        time: 1,
        target: 'lne_4004_4092_1',
        FL: 1,
        FT: 1,
      },
    ],
    TSA_SE: [
      {
        case: 'Area1-Area2',
        time: 0.18,
        target: 'lne_4004_4092_1',
        open: true,
        all_phase: false,
        phaseA: false,
        phaseB: false,
        phaseC: false,
      },
    ],

    TSA_Common: {
      F27: [
        {
          name: 'F27_North',
          Require: 10000,
        },
        {
          name: 'F27_Central',
          Require: 10000,
        },
        {
          name: 'F27_South',
          Require: 10000,
        },
      ],
      F81: [
        {
          name: '49Hz',
          Require: 6259,
        },
        {
          name: '48.6Hz',
          Require: 6259,
        },
        {
          name: '48.4Hz',
          Require: 6259,
        },
        {
          name: '48.2Hz',
          Require: 6259,
        },
        {
          name: '48Hz',
          Require: 6259,
        },
        {
          name: '47.8Hz',
          Require: 6259,
        },
        {
          name: '47.6Hz',
          Require: 6259,
        },
        {
          name: '47.4Hz',
          Require: 6259,
        },
      ],
      PT: [
        {
          name: 'PowerTransfer_C_N',
          Require: 10000,
        },
        {
          name: 'PowerTransfer_N_C',
          Require: 10000,
        },
        {
          name: 'PowerTransfer_C_S',
          Require: 10000,
        },
        {
          name: 'PowerTransfer_S_C',
          Require: 10000,
        },
      ],
      TC: [
        {
          name: 'North-Central',
          detail: [
            {
              name: 'thermal',
              offline: 7000,
              current: 1251,
            },
            {
              name: 'pv',
              offline: 7000,
              current: 1251,
            },
            {
              name: 'TSAT',
              offline: 7000,
              current: 1251,
            },
          ],
        },
        {
          name: 'Central-North',
          detail: [
            {
              name: 'thermal',
              offline: 7000,
              current: 1251,
            },
            {
              name: 'pv',
              offline: 7000,
              current: 1251,
            },
            {
              name: 'TSAT',
              offline: 7000,
              current: 1251,
            },
          ],
        },
      ],
    },
    rate_criteria: [
      {
        name: 'Line Loading',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'Tranformer Loading',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'Generator Loading',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'Excitation Limiter',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'Low/High Voltage',
        rate1: 0,
        rate2: 0.05,
        rate3: 0.1,
      },
      {
        name: 'VSA Module',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'TSA Module',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
      {
        name: 'SSR Module',
        rate1: 90,
        rate2: 95,
        rate3: 100,
      },
    ],

    profileName: 'Anhtdq',
    active: true,
  });

  const listGen = ref([]);
  const totalSizeGen = ref(0);
  const listLoad = ref([]);
  const totalSizeLoad = ref(0);
  const listBranch = ref([]);
  const totalSizeBranch = ref(0);
  const listArea = ref([]);
  const listMonitor = ref([]);

  const listContingencies = ref([]);
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

  const getListContingencies = async (queryString, typeString, listDataOut) => {
    try {
      const res = await DSA_api.getSearchContingencies(
        { listData: listDataOut ? listDataOut : [] },
        { query: queryString, type: typeString },
      );
      console.log(res, 'rés');
      listContingencies.value = res.data.map((item) => item.name);
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
    getListContingencies,
  };
});

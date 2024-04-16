import { defineStore } from 'pinia';

import DSA_api from '@/api/dsa_api';

export const useDSAStore = defineStore('DSA_Store', () => {
  const dataSetting = ref({
    _id: String,
    timestamp: '2024-03-26T08:48:24.203Z',
    F81: [
      {
        F_Delay: 0,
        F_Threshold: 49,
        Trip: ['lod_1101_1', 'lod_2400_1', 'lod_3103_1'],
        enabled: true,
        measurement: '1001A',
      },
    ],
    F27: [
      {
        F_Delay: 0,
        V_Threshold: 49,
        Trip: ['lod_1101_1', 'lod_2400_1', 'lod_3103_1'],
        enabled: true,
        measurement: '1403A',
      },
    ],
    PT: [{}],
    SSR_setting: {
      f_max: 90,
      f_min: 10,
      step: 0.2,
    },
    SSR_Gen: [
      {
        Contingencies_id: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
        MVA_Gen: 635,
        Rgen: 0.0009,
        Td0_sub: 0.04,
        Tq0_sub: 0.06,
        Xd_sub: 0.2,
        Xgen: 0.2,
        Xq_sub: 0.2,
        dmax: 0.01,
        dmin: 1,
        enabled: true,
        f: 25,
        gen: '1403A',
      },
    ],
    TSA_Case: [
      {
        APD: 'rated',
        MW_scale: 0.2,
        case: 'Area1-Area2',
        enabled: true,
        gen_scale: 'sys_3133',
        lines: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
        load_scale: ['lod_4001', 'lne_4002_1', 'lne_4009_1'],
        max_peak: 1,
        num_steps: 0.2,
        stop_time: 25,
        time_stability: 0.01,
      },
    ],
    TSA_SCE: [
      {
        FL: 1,
        FT: 1,
        case: 'Area1-Area2',
        target: 'lne_4004_4092_1',
        time: true,
      },
    ],
    TSA_SE: [
      {
        all_phase: false,
        case: 'Area1-Area2',
        open: true,
        phaseA: false,
        phaseB: false,
        phaseC: false,
        target: 'lne_4004_4092_1',
        time: 0.18,
      },
    ],
    VSA_Case: [
      {
        Contingencies_id: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
        Distribution: 'mo',
        case: 'Area1-Area2',
        enabled: true,
        gen_scale: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
        lines: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
        load_scale: ['lne_1101_4001', 'lne_1201_4001', 'lne_1131_4002'],
      },
    ],
    gridcode: {
      loading: {
        step1: 80,
        step2: 85,
        step3: 95,
      },
      voltage: {
        step1: 0.8,
        step2: 0.95,
        step3: 1.05,
        step4: 1.1,
      },
    },
  });

  const getSetting = async () => {
    try {
      const a = new Date();
      const res = await DSA_api.getSettingWithTime(a.toISOString());
      dataSetting.value = res.data;
    } catch (error) {}
  };

  const createNewSetting = async () => {
    try {
      const res = await DSA_api.createSetting(dataSetting.value);
    } catch (error) {}
  };

  return { dataSetting, getSetting, createNewSetting };
});

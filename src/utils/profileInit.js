const profile =
  /**
   * Paste one or more documents here
   */
  {
    profileName: '',
    active: false,
    F81: [],
    F27: [],
    PT: [],
    SSR_setting: {
      f_min: 0,
      f_max: 0,
      step: 0,
    },
    SSR_Gen: [],
    TSA_Case: [],
    SPSCheck: {
      F27: [],
      F81: [],
      PT: [],
      TC: [],
    },
    GridCode: {
      limitSetting: [
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
      TSA: {
        max_peak: 0,
        time_stability: 0,
        band: 0,
      },
    },
  };

export default profile;

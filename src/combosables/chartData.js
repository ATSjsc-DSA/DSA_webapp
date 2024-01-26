import SSR_api from '@/api/ssr_api';

const chartComposable = () => {
  const getDataSub = async (subName) => {
    try {
      const res = await SSR_api.getSubInfo(subName);

      if (!res.data.success) {
        throw res.data.error;
      } else {
        return res.data.payload;
      }
    } catch (error) {
      throw error;
    }
  };
  const zoomOptions = () => {
    return {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'x',
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
    };
  };
  const convertDateTimeToString = (t) => {
    if (t !== null) {
      let dateTimeConvert = new Date(t);
      let date = dateTimeConvert.toLocaleDateString();
      let time = dateTimeConvert.toLocaleTimeString('es-AR');
      let result = date + ' ' + time;
      return result;
    } else {
      return 'None';
    }
  };
  return {
    getDataSub,
    zoomOptions,
    convertDateTimeToString,
  };
};
export default chartComposable;

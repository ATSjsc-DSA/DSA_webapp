import SSR_api from '@/api/ssr_api';
import TSA_api from '@/api/tsa_api';

const chartComposable = () => {
  const baseSPSValueChart = {
    name: '',
    Key: [],
    data: {
      Require: [],
      Estimated: [],
    },
    modificationTime: 0,
  };

  const fetchChartData = async (apiMethod, chartName) => {
    try {
      const res = await apiMethod;
      return {
        name: chartName,
        Key: res.data.data.map((item) => item.name),
        data: {
          Require: res.data.data.map((item) => item.Require),
          Estimated: res.data.data.map((item) => item.Estimated),
        },
        modificationTime: res.data.modificationTime,
      };
    } catch (error) {
      // Handle error, e.g., show a toast message
      return { ...baseSPSValueChart };
    }
  };

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
      const dateTimeConvert = new Date(parseInt(t) * 1000);
      if (isNaN(dateTimeConvert.getTime())) return 'Invalid Date';
      const date = dateTimeConvert.toLocaleDateString('es-AR');
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const time = dateTimeConvert.toLocaleTimeString('es-AR', options);
      const ms = dateTimeConvert.getMilliseconds();

      let result = `${date} ${time}`;
      if (ms !== 0) result += `.${ms}`;

      return result;
    } else {
      return 'None';
    }
  };
  const nodataAnnotationOption = (textcolor) => {
    return {
      annotations: {
        label1: {
          type: 'label',
          position: 'center',
          backgroundColor: 'transparent ',
          color: textcolor,
          content: ['No data'],
          font: {
            size: 12,
          },
        },
      },
    };
  };
  return {
    getDataSub,
    zoomOptions,
    convertDateTimeToString,
    fetchChartData,
    nodataAnnotationOption,
  };
};
export default chartComposable;

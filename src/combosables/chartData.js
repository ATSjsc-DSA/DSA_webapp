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
  return {
    getDataSub,
  };
};
export default chartComposable;

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import radarChart from '@/components/radarChart.vue';
import { intervalTime } from '@/Constants/';
import { ApplicationApi } from '@/views/DashboardView/api';

const props = defineProps({
  applicationId: {
    type: String,
    default: '',
  },
});

watch(
  () => props.applicationId,
  async () => {
    await getDataCriteria();
  },
);

const chartData = ref({
  Key: [
    'Line Loading',
    'Tranformer Loading',
    'Generator Loading',
    'Excitation Limiter',
    'Low/High Voltage',
    'VSA Module',
    'TSA Module',
    'SSR Module',
  ],
  data: {
    Rate1: [], //[90, 90, 90, 90, 90, 90, 90, 0],
    Rate2: [], //[95, 95, 95, 95, 95, 95, 95, 0],
    Rate3: [], //[100, 100, 100, 100, 100, 100, 100, 0],
    CurentState: [], //[99, 81, 81, 81, 81, 81, 81, 0],
  },
  modificationTime: '',
});

// Function to transform API response and ensure chartData always has 7 keys
const transformApiResponse = (apiResponse, modificationTime) => {
  // console.log(apiResponse, 'apiResponse');
  const result = {
    Key: apiResponse.Key.slice(0, 7), // If there are more than 7 keys, we take the first 7
    data: {
      Rate1: apiResponse.data.Rate1.slice(0, 7),
      Rate2: apiResponse.data.Rate2.slice(0, 7),
      Rate3: apiResponse.data.Rate3.slice(0, 7),
      CurentState: apiResponse.data.CurentState.slice(0, 7),
    },
    modificationTime: modificationTime,
  };
  // console.log(result, 'result');
  // Add missing slots if there are fewer than 7 keys
  const additionalSlots = 7 - result.Key.length;
  for (let i = 0; i < additionalSlots; i++) {
    result.Key.push(`slot${i + 1}`);
    result.data.Rate1.push(90);
    result.data.Rate2.push(95);
    result.data.Rate3.push(100);
    result.data.CurentState.push(0);
  }

  return result;
};

const getDataCriteria = async () => {
  try {
    const res = await ApplicationApi.getRadarChartData(props.applicationId);
    chartData.value = transformApiResponse(res.data, res.data.modificationTime);
    // chartData.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

onMounted(async () => {
  if (props.applicationId) {
    await getDataCriteria();
  }
});

const refeshData = () => {
  getDataCriteria();
};
</script>

<template>
  <!--  <Toast></Toast> -->
  <div class="radarChartContainer">
    <radar-chart :chartData="chartData" @refeshData="refeshData"></radar-chart>
  </div>
</template>
<style lang="scss" scoped>
.radarChartContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

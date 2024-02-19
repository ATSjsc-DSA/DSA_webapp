<template>
  <div class="w-full h-full border-noround">
    <DataTable :value="data" scrollable scrollHeight="430px" tableStyle="min-width: 50rem">
      <Column field="Timestamp" header="Timestamp" style="width: 25%"></Column>
      <Column field="Event" header="Event" style="width: 75%"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row'; // optional
import chartComposable from '@/combosables/chartData';
import dsa_api from '@/api/dsa_api';
import { intervalTime } from '@/Constants/';
const { convertDateTimeToString } = chartComposable();
const toast = useToast();

const data = ref();
const interval = ref(null);

const getLogs = async () => {
  try {
    const res = await dsa_api.getLogs();
    if (!res.data.success) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      let dataload = res.data.payload;
      dataload.forEach((element) => {
        element.Timestamp = convertDateTimeToString(element.Timestamp);
      });
      data.value = dataload;
      console.log(dataload, 'dataload');
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};
onMounted(async () => {
  await getLogs();
  interval.value = setInterval(() => {
    getLogs();
  }, intervalTime);
});
onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

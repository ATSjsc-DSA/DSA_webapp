<template>
  <div class="w-full card border-noround p-1 dialogTable">
    <DataTable :value="data" size="small" tableStyle="min-width: 30rem">
      <Column field="Timestamp" header="Timestamp" style="width: 30%"></Column>
      <Column field="Event" header="Event" style="width: 70%"></Column>
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
      // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    } else {
      let dataload = res.data.payload;
      dataload.forEach((element) => {
        element.Timestamp = convertDateTimeToString(element.Timestamp);
      });
      data.value = dataload;
    }
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
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
<style scoped>
.dialogTable {
  height: 100%;
  /* height: inherit; */
  /* overflow: scroll; */
}
</style>

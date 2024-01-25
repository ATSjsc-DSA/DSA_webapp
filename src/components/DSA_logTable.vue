<template>
  <div class="w-full h-full border-noround">
    <DataTable :value="data" scrollable scrollHeight="430px" tableStyle="min-width: 50rem">
      <Column field="time" header="Timestamp" style="width: 25%"></Column>
      <Column field="content" header="Content" style="width: 75%"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row'; // optional
onMounted(() => {
  data.value = [
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
    { time: '14:25:15 20/1/2024', content: 'set source is on' },
    { time: '14:18:22 20/1/2024', content: 'time log set true' },
    { time: '18:05:50 20/1/2024', content: 'time log set false' },
  ];
});

const data = ref();
</script>

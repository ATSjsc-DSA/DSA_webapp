<template>
  <div class="card layout-content m-4">
    <Toast />

    <DataTable
      :value="globaldefinitionList"
      paginator
      :rows="10"
      :totalRecords="globaldefinitionTotal"
      dataKey="_id"
      tableStyle="min-width: 50rem"
      :lazy="true"
      :sortOrder="1"
      rowHover
      @page="onGlobaldefinitionPageChange"
    >
      <template #header>
        <div class="flex justify-content-end gap-3">
          <Button type="button" label="Create" icon="pi pi-plus" />
        </div>
      </template>

      <Column field="name" header="Name"> </Column>

      <Column field="active" header="Active">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <Tag :value="data.active ? 'True' : 'False'" :severity="data.active ? 'success' : 'secondary'" />
          </div>
        </template>
      </Column>
      <Column field="createdTimestamp" header="Created At">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.createdTimestamp) }}
          </div>
        </template>
      </Column>
      <Column field="modifiedTimestamp" header="Modified At">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            {{ convertDateTimeToString(data.modifiedTimestamp) }}
          </div>
        </template>
      </Column>
      <Column style="width: 1%; min-width: 5rem">
        <template #body="{ data }">
          <div class="flex justify-content-between">
            <router-link :to="`/globaldefinition/${data._id}`" rel="globaldefinition">
              <Button icon="pi pi-pencil" severity="success" text rounded />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import router from '@/router';

const { convertDateTimeToString } = chartComposable();

onMounted(async () => {
  await setGlobaldefinitionList();
});

// --- globaldefinition List ---

const globaldefinitionList = ref([]);
const globaldefinitionCurrentPage = ref(1);
const globaldefinitionTotal = ref(0);
const onGlobaldefinitionPageChange = (event) => {
  globaldefinitionCurrentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  setGlobaldefinitionList();
};
const setGlobaldefinitionList = async () => {
  try {
    const res = await api.getGlobaldefinitionList(globaldefinitionCurrentPage.value);
    globaldefinitionList.value = res.data.items;
    globaldefinitionTotal.value = res.data.total;
  } catch (error) {
    console.error('setGlobaldefinitionList error', error);
  }
};
</script>

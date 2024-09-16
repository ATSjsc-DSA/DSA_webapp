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
          <Button type="button" label="Import" severity="secondary" icon="pi pi-upload" />
          <Button type="button" label="Export" severity="secondary" icon="pi pi-download" />
          <Divider layout="vertical" />

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
            <Button icon="pi pi-pencil" severity="success" text rounded @click="handleEditGlobaldefinition(data)" />
            <Button icon="pi pi-trash" severity="danger" text rounded />
          </div>
        </template>
      </Column>
      <template #empty> No Data </template>
    </DataTable>

    <!-- this is for test  -->

    <!-- end test  -->
  </div>

  <Dialog
    v-model:visible="visibleEditGlobaldefinition"
    maximizable
    modal
    header="Edit Global definition"
    :style="{ width: '100rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <TabView>
      <TabPanel header=" Global Dynamic Model Definition">
        <DataTable :value="dynamicDefinintion" tableStyle="min-width: 50rem">
          <Column field="name" header="Name"></Column>

          <Column field="modeltype" header="Type">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                <Tag :value="data.modeltype" :severity="getSeverityModelType(data.modeltype)" />
              </div>
            </template>
          </Column>
          <Column header="Values">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                {{ data.values }}
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
        </DataTable>
      </TabPanel>

      <TabPanel header=" Global Dynamic Model Mapping">
        <DataTable :value="dynamicMapping" tableStyle="min-width: 50rem">
          <Column field="name" header="Name"></Column>

          <Column field="globalDynamicModelDefitionId" header=" Dynamic Defition">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                {{ getNameDynamicDefinintionFromId(data.globalDynamicModelDefitionId) }}
              </div>
            </template>
          </Column>
          <Column header="Values">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                {{ data.mapOrder }}
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
        </DataTable>
      </TabPanel>
    </TabView>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visibleEditGlobaldefinition = false"></Button>
      <Button type="button" label="Update" @click="editGlobaldefinition"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartComposable from '@/combosables/chartData';
import api from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';
import { useCommonStore } from '@/store';
import router from '@/router';

const { convertDateTimeToString } = chartComposable();
const toast = useToast();
const confirm = useConfirm();
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);

onMounted(async () => {
  await setGlobaldefinitionList();
  // this is for test
  globaldefinitionEdit.value = globaldefinitionList.value[0];
  await setDynamicDefinintion(globaldefinitionEdit.value._id);
  await setDynamicMapping(globaldefinitionEdit.value._id);
  // end test
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

// --- EDIT
const globaldefinitionEdit = ref();

const visibleEditGlobaldefinition = ref(false);
const dynamicDefinintion = ref();
const dynamicMapping = ref();
const pageRowNumber = ref(10);

const setDynamicDefinintion = async (globaldefinition_id) => {
  try {
    const res = await api.getGlobalDynamicModelDefinitionList(globaldefinition_id, 1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await api.getGlobalDynamicModelDefinitionList(globaldefinition_id, page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicDefinintion.value = data;
  } catch (error) {
    console.error('setGlobaldefinitionList error', error);
  }
};

const getNameDynamicDefinintionFromId = (id) => {
  const dynamicDefinintionData = dynamicDefinintion.value.filter((val) => val._id === id)[0];
  return dynamicDefinintionData ? dynamicDefinintionData.name : '';
};

const setDynamicMapping = async (globaldefinition_id) => {
  try {
    const res = await api.getGlobalDynamicModelMappingList(globaldefinition_id, 1);
    let data = res.data.items;
    if (res.data.total > pageRowNumber.value) {
      for (let row = 0; row < res.data.total; row += pageRowNumber.value) {
        const page = Math.floor(row / 10) + 1;
        if (page === 1) {
          continue;
        }
        const resPgae = await api.getGlobalDynamicModelDefinitionList(globaldefinition_id, page);
        data = data.concat(resPgae.data.items);
      }
    }
    dynamicMapping.value = data;
  } catch (error) {
    console.error('setGlobaldefinitionList error', error);
  }
};

const handleEditGlobaldefinition = (updateData) => {
  visibleEditGlobaldefinition.value = true;
  globaldefinitionEdit.value = updateData;
  setDynamicDefinintion(globaldefinitionEdit.value._id);
  setDynamicMapping(globaldefinitionEdit.value._id);
};
const editGlobaldefinition = () => {
  visibleEditGlobaldefinition.value = false;
  toast.add({ severity: 'success', summary: 'Update Global definition', detail: 'this is for test', life: 3000 });
};

const getSeverityModelType = (type) => {
  const isTraditionalType = Object.entries(api.TypeGlobalDynamicModelDefinition.Traditional).find(
    ([key, value]) => value === type,
  )?.[0];
  return isTraditionalType ? 'info' : 'primary';
};
</script>

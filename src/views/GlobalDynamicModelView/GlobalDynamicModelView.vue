<template>
  <div class="card layout-content m-4">
    <Toast />

    <!-- this is for test  -->

    <!-- end test  -->

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
  </div>
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
import { useRoute } from 'vue-router';
const route = useRoute();

const { convertDateTimeToString } = chartComposable();
const toast = useToast();
const confirm = useConfirm();
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);

onMounted(async () => {
  await setDynamicDefinintion(globaldefinitionId.value);
  await setDynamicMapping(globaldefinitionId.value);
});

watch(
  () => route.params.id,
  (newId, oldId) => {
    // react to route changes...
  },
);
// --- EDIT
const globaldefinitionId = ref(route.params.id);

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

const editGlobaldefinition = () => {
  toast.add({ severity: 'success', summary: 'Update Global definition', detail: 'this is for test', life: 3000 });
};

const getSeverityModelType = (type) => {
  const isTraditionalType = Object.entries(api.TypeGlobalDynamicModelDefinition.Traditional).find(
    ([key, value]) => value === type,
  )?.[0];
  return isTraditionalType ? 'info' : 'primary';
};
</script>

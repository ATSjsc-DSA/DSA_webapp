<template>
  <div class="card layout-content m-4">
    <Toast />

    <!-- this is for test  -->

    <!-- end test  -->

    <TabView>
      <TabPanel header=" Global Dynamic Model Definition">
        <DataTable :value="dynamicDefinintion" tableStyle="min-width: 50rem">
          <template #header>
            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Import" icon="pi pi-upload" severity="secondary" />
              <Button type="button" label="Export" icon="pi pi-download" severity="secondary" />
              <Divider layout="vertical" />
              <Button type="button" label="Create " icon="pi pi-plus" text />
            </div>
          </template>

          <Column field="name" header="Name" sortable></Column>
          <Column field="modeltype" header="Type">
            <template #body="{ data }">
              <div class="flex justify-content-between">
                <Tag :value="data.modeltype" :severity="getSeverityModelType(data.modeltype)" />
              </div>
            </template>
          </Column>
          <Column style="width: 50%">
            <template #header>
              <div
                class="flex justify-content-start w-full gap-3 align-items-center"
                @click="isGroupedValueByFirstLetter = !isGroupedValueByFirstLetter"
              >
                <div>Values</div>
                <div>
                  <Button
                    type="button"
                    :icon="isGroupedValueByFirstLetter ? 'pi pi-sort-alpha-down' : 'pi pi-sort-alt-slash'"
                    :severity="isGroupedValueByFirstLetter ? 'primary' : 'secondary'"
                    text
                  />
                </div>
              </div>
            </template>

            <template #body="{ data }">
              <template v-if="isGroupedValueByFirstLetter">
                <div
                  v-for="(letterArr, key, index) in groupedByFirstLetter(data.values)"
                  :key="key"
                  class="py-2 m-1 border-round-sm"
                  :style="{ backgroundColor: index % 2 === 0 ? 'var(--surface-50)' : 'var(--surface-0)' }"
                >
                  {{ letterArr.join(', ') }}
                </div>
              </template>
              <template v-else>
                <div class="flex flex-wrap">
                  <div
                    v-for="(val, index) in data.values.sort()"
                    :key="val"
                    class="px-2 m-1 border-round-sm"
                    :style="{ backgroundColor: index % 2 === 0 ? 'var(--surface-50)' : 'var(--surface-0)' }"
                  >
                    {{ val }}
                  </div>
                </div>
              </template>
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
          <template #header>
            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Create " icon="pi pi-plus" text />
            </div>
          </template>
          <Column field="name" header="Name" sortable></Column>

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
                {{ data.mapOrder.join(', ') }}
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
import { Background } from '@vue-flow/background';
const route = useRoute();

const { convertDateTimeToString } = chartComposable();
const toast = useToast();
const confirm = useConfirm();
const commonStore = useCommonStore();

onMounted(async () => {
  await getDynamicDefinintion(globaldefinitionId.value);
  await getDynamicMapping(globaldefinitionId.value);
});

watch(
  () => route.params.id,
  (newId, oldId) => {
    // react to route changes...
  },
);
// --- Get data
const globaldefinitionId = ref(route.params.id);
const pageRowNumber = ref(10);

// dynamicDefinintion
const dynamicDefinintion = ref();
const isGroupedValueByFirstLetter = ref(false);
const getDynamicDefinintion = async (globaldefinition_id) => {
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

const groupedByFirstLetter = (arr) => {
  return arr.reduce((acc, word) => {
    const firstLetter = word[0].toLowerCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});
};

// dynamicMapping
const dynamicMapping = ref();
const getDynamicMapping = async (globaldefinition_id) => {
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

const getSeverityModelType = (type) => {
  const isTraditionalType = Object.entries(api.TypeGlobalDynamicModelDefinition.Traditional).find(
    ([key, value]) => value === type,
  )?.[0];
  return isTraditionalType ? 'info' : 'primary';
};
</script>

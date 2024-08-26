<template>
  <div class="card layout-content">
    <TabView @tab-change="onTabChange">
      <TabPanel header="">
        <template #header>
          <div>General</div>
        </template>
        <generalTabWidget
          :data="powersystemData"
          :currentPage="currentPage"
          @update:currentPage="onPageChange"
          @getData="getPSDEdit"
          @editData="editPSE"
          @deleteData="deletePSE"
        />
      </TabPanel>
      <TabPanel>
        <template #header>
          <div>Engine</div>
        </template>
        <engineInfoTabWidget
          :data="powersystemData"
          :currentPage="currentPage"
          @update:currentPage="onPageChange"
          @getData="getPSDEdit"
          @editData="editPSE"
          @deleteData="deletePSE"
        />
      </TabPanel>
      <TabPanel>
        <template #header>
          <div>Scada</div>
        </template>
        <scadaInfoTabWidget
          :data="powersystemData"
          :currentPage="currentPage"
          @update:currentPage="onPageChange"
          @getData="getPSDEdit"
          @editData="editPSE"
          @deleteData="deletePSE"
        />
      </TabPanel>
      <TabPanel>
        <template #header>
          <div><i class="pi pi-history"></i> History</div>
        </template>
        <compareTabWidget :data="powersystemCompareData" @get-data="getComparePSD" />
      </TabPanel>
      <TabPanel>
        <template #header>
          <div><i class="pi pi-list"></i> Version</div>
        </template>
        <p class="m-0">Version</p>
      </TabPanel>
    </TabView>

    <Toast />

    <!-- Compare dialog  -->
    <Dialog
      v-model:visible="showCompareDialog"
      header="History "
      :modal="true"
      maximizable
      :style="{ width: '80%' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex align-items-center justify-content-between gap-2 w-full">
          <span class="font-bold white-space-nowrap">History</span>
          <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="getComparePSD()" />
        </div>
      </template>

      <div style="height: 60vh">
        <!-- Add  -->
        <Panel v-if="powersystemCompareData.Add.length > 0" toggleable>
          <template #header>
            <div class="my-3 text-green-500">New Power System ({{ powersystemCompareData.Add.length }})</div>
          </template>
          <div class="pl-6">
            <DataTable
              :value="powersystemCompareData.Add"
              dataKey="_id"
              tableStyle="min-width: 50rem"
              :rowClass="rowClass"
              :lazy="true"
              :sortOrder="1"
              rowHover
            >
              <Column field="generalInfo.name" header="Name" style="width: 15%"></Column>
              <Column field="generalInfo.emsName" header="Ems Name" style="width: 15%"></Column>
              <Column field="generalInfo.emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
              <Column field="generalInfo.operationName" header="Operation Name" style="width: 15%"></Column>
              <Column field="generalInfo.softwareName" header="Software Name" style="width: 15%"></Column>
              <Column field="scadaInfo.scadaName" header="Scada Name" style="width: 15%"> </Column>
            </DataTable>
          </div>
        </Panel>

        <!-- Edit  -->

        <Panel v-if="powersystemCompareData.Update.length > 0" toggleable>
          <template #header>
            <div class="my-3 text-orange-500">Update Power System ({{ powersystemCompareData.Update.length }})</div>
          </template>
          <div class="pl-6">
            <DataTable
              :value="powersystemCompareData.Update"
              dataKey="_id"
              tableStyle="min-width: 50rem"
              :rowClass="rowClass"
              :lazy="true"
              :sortOrder="1"
              rowHover
            >
              <Column header="Name" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{ slotProps.data.changes.generalInfo ? slotProps.data.changes.generalInfo[''].name : '' }}
                    </div>
                  </div>
                </template>
              </Column>
              <Column header="Ems Name" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{ slotProps.data.changes.generalInfo ? slotProps.data.changes.generalInfo[''].emsName : '' }}
                    </div>
                  </div>
                </template>
              </Column>

              <Column header="Ems UniqueId" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{ slotProps.data.changes.generalInfo ? slotProps.data.changes.generalInfo[''].emsUniqueId : '' }}
                    </div>
                  </div>
                </template>
              </Column>

              <Column header="Operation Name" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{
                        slotProps.data.changes.generalInfo ? slotProps.data.changes.generalInfo[''].operationName : ''
                      }}
                    </div>
                  </div>
                </template>
              </Column>
              <Column header="Software Name" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{
                        slotProps.data.changes.generalInfo ? slotProps.data.changes.generalInfo[''].softwareName : ''
                      }}
                    </div>
                  </div>
                </template>
              </Column>

              <Column header="Scada Name" style="width: 15%">
                <template #body="slotProps">
                  <div>
                    <div class="text-green-500">
                      {{ slotProps.data.changes.scadaInfo ? slotProps.data.changes.scadaInfo[''].scadaName : '' }}
                    </div>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </Panel>

        <!-- Delete  -->
        <Panel v-if="powersystemCompareData.Delete.length > 0" toggleable>
          <template #header>
            <div class="my-3 text-red-500">Delete Power System ({{ powersystemCompareData.Delete.length }})</div>
          </template>
          <div class="pl-6">
            <DataTable
              :value="powersystemCompareData.Delete"
              dataKey="_id"
              tableStyle="min-width: 50rem"
              :rowClass="rowClass"
              :lazy="true"
              :sortOrder="1"
              rowHover
            >
              <Column field="generalInfo.name" header="Name" style="width: 15%"></Column>
              <Column field="generalInfo.emsName" header="Ems Name" style="width: 15%"></Column>
              <Column field="generalInfo.emsUniqueId" header="Ems UniqueId" style="width: 15%"> </Column>
              <Column field="generalInfo.operationName" header="Operation Name" style="width: 15%"></Column>
              <Column field="generalInfo.softwareName" header="Software Name" style="width: 15%"></Column>
              <Column field="scadaInfo.scadaName" header="Scada Name" style="width: 15%"> </Column>
            </DataTable>
          </div>
        </Panel>
      </div>
      <template #footer>
        <Button type="button" label="Cancel" severity="secondary" @click="showCompareDialog = false"></Button>
        <Button type="button" label="Submit" @click="updatePS()"></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from './api';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import generalTabWidget from './generalTabWidget.vue';
import engineInfoTabWidget from './engineInfoTabWidget.vue';
import scadaInfoTabWidget from './scadaInfoTabWidget.vue';
import compareTabWidget from './compareTabWidget.vue';

const toast = useToast();

const listPSD = ref([]);
const totalList = ref(0);
const currentPage = ref(1);
const powersystemData = ref([]);

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  getPSDEdit();
};

onMounted(() => {
  getPSDEdit();
});

const onTabChange = (event) => {
  if (event.index === 3) {
    // compare tab
    getComparePSD();
  }
};
const getPSDEdit = async () => {
  try {
    const res = await api.getPSDEdit({ page: currentPage.value });
    powersystemData.value = res.data[0];
    totalList.value = powersystemData.value.length;
  } catch (error) {
    console.log('getPSDEdit: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

//compare
const powersystemCompareData = ref();

const getComparePSD = async () => {
  try {
    const res = await api.getComparePSD();
    powersystemCompareData.value = res.data;
  } catch (error) {
    powersystemCompareData.value = undefined;

    console.log('getComparePSD: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Edit
const editPSE = async (pseUpdate) => {
  try {
    await api.editPSE(pseUpdate);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
  } catch (error) {
    console.log('editPS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Delete
const deletePSE = async (pseId) => {
  try {
    await api.deletePSE(pseId);
    getPSDEdit();
    toast.add({ severity: 'success', summary: 'Delete successfully', life: 3000 });
  } catch (error) {
    console.log('deletePSE: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

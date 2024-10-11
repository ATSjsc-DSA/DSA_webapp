<template>
  <TabView>
    <TabPanel header="Common">
      <monitorFormWidget v-model="monitorData" :is-create-form="false" />
      <div class="flex justify-content-end gap-3">
        <Button type="button" label="Update" @click="updateMonitor"></Button>
      </div>
    </TabPanel>

    <TabPanel header="Scada">
      <DataTable :value="scadaList" tableStyle="min-width: 50rem" rowHover scrollable showGridlines :loading="loading">
        <Column field="name" header="Name" />
        <Column field="active" header="Active">
          <template #body="{ data }">
            <Tag :severity="data.active ? 'primary' : 'secondary'" :value="String(data.active)"></Tag>
          </template>
        </Column>
        <Column field="kFactorCur" header="K Factor Cur" />
        <Column field="kFactorPower" header="K Factor Power" />
        <Column style="width: 1%; min-width: 5rem">
          <template #body="{ data }">
            <div class="flex justify-content-end">
              <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdateScada(data)" />
              <Button
                icon="pi pi-trash"
                severity="danger"
                disabled
                text
                rounded
                @click="confirmDeleteScada($event, data)"
              />
            </div>
          </template>
        </Column>

        <template #empty> No Data </template>
      </DataTable>
    </TabPanel>
    <TabPanel header="PMU">
      <DataTable
        id="pmuTable"
        :value="pmuList"
        tableStyle="min-width: 50rem"
        rowHover
        scrollable
        showGridlines
        :loading="loading"
      >
        <!-- <template #header>
          <div class="flex align-items-center justify-content-end">
            <Button type="button" icon="pi pi-plus" text @click="createPmuVisibleDialog = true" />
          </div>
        </template> -->
        <ColumnGroup type="header">
          <Row>
            <Column style="text-wrap: nowrap" header="Name" :rowspan="2" />
            <Column style="text-wrap: nowrap" header="Active" :rowspan="2" />

            <Column style="text-wrap: nowrap" :colspan="6">
              <template #header>
                <div class="flex-1 text-center">Voltage</div>
              </template>
            </Column>
            <Column style="text-wrap: nowrap" :colspan="7">
              <template #header>
                <div class="flex-1 text-center">Current</div>
              </template>
            </Column>
            <Column style="text-wrap: nowrap" :colspan="3">
              <template #header>
                <div class="flex-1 text-center">Power</div>
              </template>
            </Column>
            <Column :rowspan="2" />
          </Row>
          <Row>
            <!-- Voltage -->
            <Column style="text-wrap: nowrap" header="Phase A" field="phaseA" />

            <Column style="text-wrap: nowrap" header="Angle Phase A" field="anglePhaseA" />
            <Column style="text-wrap: nowrap" header="Phase B" field="phaseB" />
            <Column style="text-wrap: nowrap" header="Angle Phase B" field="anglePhaseB" />
            <Column style="text-wrap: nowrap" header="Phase C" field="phaseC" />
            <Column style="text-wrap: nowrap" header="Angle Phase C" field="anglePhaseC" />

            <!-- current -->
            <Column style="text-wrap: nowrap" header="K Factor Cur" field="kFactorCur" />
            <Column style="text-wrap: nowrap" header="Phase A" field="phaseA" />
            <Column style="text-wrap: nowrap" header="Angle Phase A" field="anglePhaseA" />
            <Column style="text-wrap: nowrap" header="Phase B" field="phaseB" />
            <Column style="text-wrap: nowrap" header="Angle Phase B" field="anglePhaseB" />
            <Column style="text-wrap: nowrap" header="Phase C" field="phaseC" />
            <Column style="text-wrap: nowrap" header="Angle Phase C" field="anglePhaseC" />

            <!-- power -->
            <Column style="text-wrap: nowrap" header="K Factor Power" field="kFactorPower" />
            <Column style="text-wrap: nowrap" header="Active Power" field="activePower" />
            <Column style="text-wrap: nowrap" header="Reactive Power" field="reactivePower" />
          </Row>
        </ColumnGroup>

        <Column field="name" header="Name" frozen style="width: 10%; min-width: 5rem" />
        <Column field="active" header="Active">
          <template #body="{ data }">
            <Tag :severity="data.active ? 'primary' : 'secondary'" :value="String(data.active)"></Tag>
          </template>
        </Column>
        <!-- Voltage -->
        <Column style="text-wrap: nowrap" header="Phase A" field="phaseA" />
        <Column style="text-wrap: nowrap" header="Angle Phase A" field="anglePhaseA" />
        <Column style="text-wrap: nowrap" header="Phase B" field="phaseB" />
        <Column style="text-wrap: nowrap" header="Angle Phase B" field="anglePhaseB" />
        <Column style="text-wrap: nowrap" header="Phase C" field="phaseC" />
        <Column style="text-wrap: nowrap" header="Angle Phase C" field="anglePhaseC" />

        <!-- current -->
        <Column style="text-wrap: nowrap" header="K Factor Cur" field="kFactorCur" />
        <Column style="text-wrap: nowrap" header="Phase A" field="phaseA" />
        <Column style="text-wrap: nowrap" header="Angle Phase A" field="anglePhaseA" />
        <Column style="text-wrap: nowrap" header="Phase B" field="phaseB" />
        <Column style="text-wrap: nowrap" header="Angle Phase B" field="anglePhaseB" />
        <Column style="text-wrap: nowrap" header="Phase C" field="phaseC" />
        <Column style="text-wrap: nowrap" header="Angle Phase C" field="anglePhaseC" />

        <!-- power -->
        <Column style="text-wrap: nowrap" header="K Factor Power" field="kFactorPower" />
        <Column style="text-wrap: nowrap" header="Active Power" field="activePower" />
        <Column style="text-wrap: nowrap" header="Reactive Power" field="reactivePower" />

        <Column>
          <template #body="{ data }">
            <div class="flex justify-content-end">
              <Button icon="pi pi-pencil " severity="success" text rounded @click="handleUpdatePmu(data)" />
              <Button
                icon="pi pi-trash"
                severity="danger"
                disabled
                text
                rounded
                @click="confirmDeletePmu($event, data)"
              />
            </div>
          </template>
        </Column>

        <template #empty> No Data </template>
      </DataTable>
    </TabPanel>
  </TabView>

  <!-- Scada Dialog -->

  <Dialog v-model:visible="createScadaVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor Scada Configuration</span>
      </div>
    </template>

    <monitorScadaFormWidget v-model="newScadaData" :project-version-id="projectVersionId" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createScadaVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newScadaData.name" @click="createScada"></Button>
    </template>
  </Dialog>

  <Dialog v-model:visible="updataScadaVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Update Monitor Scada Configuration</span>
      </div>
    </template>
    <monitorScadaFormWidget v-model="editScadaData" :project-version-id="projectVersionId" :isCreateForm="false" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="updataScadaVisibleDialog = false"></Button>
      <Button type="button" label="Update" :disabled="!editScadaData.name" @click="updateScada"></Button>
    </template>
  </Dialog>

  <!-- pmu Dialog -->

  <Dialog v-model:visible="createPmuVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor PMU Configuration</span>
      </div>
    </template>

    <monitorPmuFormWidget v-model="newPmuData" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createPmuVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newPmuData.name" @click="createPmu"></Button>
    </template>
  </Dialog>

  <Dialog v-model:visible="updataPmuVisibleDialog" :style="{ width: '48rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Monitor PMU Configuration</span>
      </div>
    </template>

    <monitorPmuFormWidget v-model="editPmuData" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="updataPmuVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!editPmuData.name" @click="updatePmu"></Button>
    </template>
  </Dialog>
</template>
<script setup>
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import monitorFormWidget from './formWidget/monitorFormWidget.vue';
import monitorScadaFormWidget from './formWidget/monitorScadaFormWidget.vue';
import monitorPmuFormWidget from './formWidget/monitorPmuFormWidget.vue';

import { ApiMonitor } from '@/views/UserConfigurationView/api';
import { onMounted } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  projectVersionId: {
    type: String,
    default: '',
  },
  nodeMonitorSelected: {
    type: {},
    default: () => {},
  },
});

const emit = defineEmits(['updateLabelMonitorLeaf']);

onMounted(async () => {
  await getMonitorData();
  await getScadaList();
  await getPmuList();
});

const monitorData = ref({});

const getMonitorData = async () => {
  try {
    const res = await ApiMonitor.getMonitor(props.nodeMonitorSelected._id);
    monitorData.value = res.data;
  } catch (error) {
    console.log('getMonitorData: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const updateMonitor = async () => {
  try {
    const res = await ApiMonitor.updateMonitor(monitorData.value._id, monitorData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    emit('updateLabelMonitorLeaf', props.nodeMonitorSelected.appId, monitorData.value._id, res.data.name);
  } catch (error) {
    console.log('updateMonitor: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ------ Scada

const scadaList = ref([]);

const getScadaList = async () => {
  try {
    const res = await ApiMonitor.getScadaList(props.projectVersionId, monitorData.value._id);
    scadaList.value = res.data;
  } catch (error) {
    console.log('getScadaList: error ', error);
    scadaList.value = [];
  }
};

const createScadaVisibleDialog = ref(false);
const newScadaData = ref({
  active: true,
  kFactorCur: 0,
  kFactorPower: 0,
  monitorScadaId: '',
  name: '',
});

const createScada = async () => {
  try {
    const res = await ApiMonitor.createMonitorScada(
      props.projectVersionId,
      props.nodeMonitorSelected._id,
      newScadaData.value,
    );
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createScadaVisibleDialog.value = false;
    scadaList.value.push(res.data);
  } catch (error) {
    console.log('createScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const editScadaData = ref();
const updataScadaVisibleDialog = ref(false);
const handleUpdateScada = (data) => {
  editScadaData.value = JSON.parse(JSON.stringify(data));
  updataScadaVisibleDialog.value = true;
};
const updateScada = async () => {
  try {
    await ApiMonitor.updateMonitorScada(editScadaData.value._id, editScadaData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    updataScadaVisibleDialog.value = false;
    await getScadaList();
  } catch (error) {
    console.log('updateScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
const delScadaData = ref();
const confirmDeleteScada = async (event, data) => {
  delScadaData.value = data;
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Scada',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delScada();
    },
  });
};
const delScada = async () => {
  try {
    await ApiMonitor.delMonitorScada(delScadaData.value._id);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    await getScadaList();
  } catch (error) {
    console.log('delScada: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// ---- PMU
const pmuList = ref([]);
const createPmuVisibleDialog = ref(false);
const pmuData = ref();
const newPmuData = ref({
  active: true,
  current: {
    anglePhaseA: '',
    anglePhaseB: '',
    anglePhaseC: '',
    phaseA: '',
    phaseB: '',
    phaseC: '',
    kFactorCur: 1,
  },
  pmuIp: '',
  name: '',
  power: {
    activePower: '',
    kFactorPower: 1,
    reactivePower: '',
  },
  voltage: {
    anglePhaseA: '',
    anglePhaseB: '',
    anglePhaseC: '',
    phaseA: '',
    phaseB: '',
    phaseC: '',
  },
});
const getPmuList = async () => {
  try {
    const res = await ApiMonitor.getPmuList(props.projectVersionId, monitorData.value._id);
    pmuList.value = res.data;
  } catch (error) {
    console.log('getPmuList: error ', error);
    pmuList.value = [];
  }
};

const createPmu = async () => {
  try {
    const res = await ApiMonitor.createMonitorPmu(props.projectVersionId, monitorData.value._id, newPmuData.value);
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    createPmuVisibleDialog.value = false;
    pmuList.value.push(res.data);
  } catch (error) {
    console.log('createPmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const editPmuData = ref();
const updataPmuVisibleDialog = ref(false);
const handleUpdatePmu = (data) => {
  editPmuData.value = JSON.parse(JSON.stringify(data));
  updataPmuVisibleDialog.value = true;
};
const updatePmu = async () => {
  try {
    await ApiMonitor.updateMonitorPmu(editPmuData.value._id, editPmuData.value);
    toast.add({ severity: 'success', summary: 'Updated successfully', life: 3000 });
    await getPmuList();
  } catch (error) {
    console.log('updatePmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const delPmuData = ref();

const confirmDeletePmu = async (event, data) => {
  delPmuData.value = data;
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Monitor Pmu',
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await delPmu();
    },
  });
};
const delPmu = async () => {
  try {
    await ApiMonitor.delMonitorPmu(delPmuData.value._id);
    toast.add({ severity: 'success', summary: 'Deleted successfully', life: 3000 });
    await getPmuList();
  } catch (error) {
    console.log('delPmu: error ', error);
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style>
#pmuTable .frozen-column {
  position: sticky;
  width: 8rem;
  z-index: 3;
  text-align: center;
  background-color: var(--surface-card);
}

#pmuTable .frozen-column.frozen-left-column {
  left: 0;
}
#pmuTable .frozen-column.frozen-right-column {
  right: 0;
}
</style>

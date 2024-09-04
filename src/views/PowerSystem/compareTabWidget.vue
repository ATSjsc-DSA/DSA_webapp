<template>
  <div class="flex align-items-center justify-content-end gap-2 w-full mb-3">
    <Button severity="secondary" icon="pi pi-sync" label="Reload" @click="emit('getData', true)" />

    <Button severity="success" icon="pi pi-save" label="Build" @click="createVisibleDialog = true" />
  </div>
  <!-- Add  -->
  <Panel toggleable>
    <template #header>
      <div class="my-3 text-green-500">New Power System ({{ data.Add.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Add"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="Operation Name" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" field="scadaInfo.skey" />
            <Column header="Scada Name" field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold">
              {{ slotProps.data.generalInfo.emsUniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey" />
        <Column header="Scada Name" field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Update  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-yellow-500">Update Power System ({{ data.Update.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Update"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="Operation Name" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" />
            <Column header="Scada Name" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold">
              {{ slotProps.data.emsUniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.name">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.name.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.name.old }}
              </div>
            </div>
          </template>
        </Column>
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.emsName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.emsName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.emsName.old }}
              </div>
            </div>
          </template>
        </Column>
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.operationName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.operationName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.operationName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.softwareName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.softwareName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.softwareName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.scadaInfo || !slotProps.data.changes.scadaInfo.skey">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.scadaInfo.skey.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.scadaInfo.skey.old }}
              </div>
            </div>
          </template>
        </Column>

        <Column header="Scada Name" field="scadaInfo.scadaName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.scadaInfo || !slotProps.data.changes.scadaInfo.scadaName">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.scadaInfo.scadaName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.scadaInfo.scadaName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Delete  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-red-500">Delete Power System ({{ data.Delete.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="data.Delete"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
            <Column header="Operation Name" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" field="scadaInfo.skey" />
            <Column header="Scada Name" field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold">
              {{ slotProps.data.generalInfo.emsUniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.emsUniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey" />
        <Column header="Scada Name" field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '32rem' }" header="Create New " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Create new Version</span>
      </div>
    </template>

    <div class="my-3">
      <div class="flex flex-column gap-2 mb-3">
        <label :for="nameVersion" class="font-semibold"> Name Version</label>
        <InputText :id="nameVersion" v-model="nameVersion" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex flex-column gap-2 mb-3">
        <label :for="scheduledOperationTime" class="font-semibold"> Scheduled Operation Time</label>
        <InputNumber
          :id="scheduledOperationTime"
          v-model="scheduledOperationTime"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button
        type="button"
        label="Submit"
        :disabled="!nameVersion || !scheduledOperationTime"
        @click="createNewVersion"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from './api';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['getData']);
const data = computed(() => {
  if (!props.data.Add) {
    return {
      Add: [],
      Update: [],
      Delete: [],
    };
  }
  return props.data;
});

const createVisibleDialog = ref(false);
const nameVersion = ref('');
const scheduledOperationTime = ref();
const createNewVersion = async () => {
  try {
    await api.createNewVersion(nameVersion.value);
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    emit('getData');
  } catch (error) {
    console.log('createPS: error ', error);
    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

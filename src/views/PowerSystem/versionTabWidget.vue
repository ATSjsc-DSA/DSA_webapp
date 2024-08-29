<template>
  <Toast />
  <ConfirmPopup />

  <DataTable :value="data" tableStyle="min-width: 50rem">
    <Column field="name" header="Name"></Column>
    <Column field="version" header="Version"></Column>
    <Column field="category" header="Category"></Column>
    <Column header="Created Time">
      <template #body="slotProps">
        {{ convertDateTimeToString(slotProps.data.createdTimestamp) }}
      </template>
    </Column>
    <Column style="width: 10%" header="Rollback">
      <template #body="slotProps">
        <Button
          icon="pi pi-reload "
          label="Rollback"
          outlined
          @click="rollbackConfirmation($event, slotProps.data._id)"
        ></Button>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>
</template>

<script setup>
import chartComposable from '@/combosables/chartData';
import ConfirmPopup from 'primevue/confirmpopup';
import api from './api';

const { convertDateTimeToString } = chartComposable();
import { useToast } from 'primevue/usetoast';
const toast = useToast();

import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const rollbackConfirmation = (event, versionId) => {
  console.log('rollbackConfirmation', versionId, event);
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Save',
    },
    accept: () => {
      rollbackVersion(versionId);
    },
    reject: () => {},
  });
};
const rollbackVersion = async (versionId) => {
  try {
    await api.rollbackVersion(versionId);
    toast.add({ severity: 'info', summary: 'Rollback', detail: 'Rollback Successfully', life: 1000 });
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.log('getVersionList: error ', error);

    toast.add({ severity: 'error', summary: 'Rollback Version ', detail: error.data.detail, life: 3000 });
  }
};
</script>

<template>
  <ConfirmPopup />
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <Column field="name" header="Name"></Column>
    <Column field="version" header="Version"></Column>
    <Column field="type" header="Type">
      <template #body="{ data }">
        <Tag :value="getTypeValue(data.type)" :severity="getTypeSeverity(data.type)" />
      </template>
    </Column>
    <Column field="state" header="State">
      <template #body="{ data }">
        <Tag :value="getStateValue(data.state)" :severity="getStateSeverity(data.state)" />
      </template>
    </Column>
    <Column header="Created Time">
      <template #body="{ data }">
        {{ convertDateTimeToString(data.createdTimestamp) }}
      </template>
    </Column>
    <Column style="width: 10%" header="">
      <template #body="{ data }">
        <Button icon="pi pi-pencil " label="Edit" outlined @click="rollbackConfirmation($event, data._id)"></Button>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>
  <Paginator :rows="10" :totalRecords="totalRecord" @page="onPageChange"></Paginator>
</template>

<script setup>
import chartComposable from '@/combosables/chartData';
import ConfirmPopup from 'primevue/confirmpopup';
import Paginator from 'primevue/paginator';

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
  totalRecord: {
    type: Number,
    required: true,
  },
});
const currentPage = ref(1);
const emit = defineEmits(['getVersionList', 'reloadAll']);
const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  emit('getVersionList', currentPage.value);
};

const getTypeValue = (type) => {
  return type === 0 ? 'ONLINE' : 'FUTURE';
};
const getTypeSeverity = (type) => {
  return type === 0 ? 'primary' : 'info';
};

const getStateValue = (state) => {
  switch (state) {
    case 0:
      return 'OLD';

    case 1:
      return 'EDITING';

    case 2:
      return 'RUNNING';
    default:
      return 'OLD';
  }
};
const getStateSeverity = (state) => {
  switch (state) {
    case 0:
      return 'secondary';

    case 1:
      return 'warning';

    case 2:
      return 'primary';
    default:
      return 'secondary';
  }
};
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
      emit('reloadAll');
    }, 500);
  } catch (error) {
    console.log('getVersionList: error ', error);

    toast.add({ severity: 'error', summary: 'Rollback Version ', detail: error.data.detail, life: 3000 });
  }
};
</script>

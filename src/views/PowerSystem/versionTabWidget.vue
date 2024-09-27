<template>
  <ConfirmPopup />
  <DataTable :value="data" tableStyle="min-width: 50rem" :rowStyle="rowStyle">
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
        <Button icon="pi pi-pencil " label="Edit" outlined @click="openVersionConfirmation($event, data)"></Button>
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

import { api } from '@/views/PowerSystem/api';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { editVersionData } = storeToRefs(commonStore);

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
  return type === 0 ? 'Present' : 'future';
};
const getTypeSeverity = (type) => {
  return type === 0 ? 'primary' : 'info';
};

const getStateValue = (state) => {
  switch (state) {
    case 0:
      return 'OLD';
    case 1:
      return 'EDIT';
    case 2:
      return 'RUN';
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

const rowStyle = (data) => {
  if (data._id === editVersionData.value._id) {
    return { fontWeight: 'bold', fontStyle: 'italic', backgroundColor: 'var( --highlight-bg)' };
  }
};
const openVersionConfirmation = (event, versionData) => {
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
      openVersion(versionData);
    },
    reject: () => {},
  });
};

const openVersion = async (versionData) => {
  try {
    await api.openVersion(versionData._id);
    commonStore.editVersionData = versionData;
    toast.add({ severity: 'info', summary: 'Version', detail: versionData.name, life: 3000 });
    setTimeout(() => {
      emit('reloadAll');
    }, 500);
  } catch (error) {
    console.log('openVersion: error ', error);

    toast.add({ severity: 'error', summary: 'Rollback Version ', detail: error.data.detail, life: 3000 });
  }
};
</script>

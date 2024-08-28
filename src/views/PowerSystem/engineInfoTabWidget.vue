<template>
  <DataTable
    :value="data"
    :totalRecords="data.length"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :rowClass="rowClass"
    :lazy="true"
    :sortOrder="1"
    rowHover
  >
    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)">
        <template #body="slotProps">
          <div>{{ slotProps.data.engineInfo.values[col.index] }}</div>
        </template>
      </Column>
    </template>

    <Column style="width: 1%; min-width: 5rem">
      <template #body="slotProps">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPSE(slotProps.data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
        </div>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>

  <Toast />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import api from './api';
import { forEach } from 'lodash';
const toast = useToast();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  psdData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['getData', 'editData', 'deleteData']);
const columnList = computed(() => {
  if (props.psdData) {
    const cols = [];
    for (let ind = 0; ind < props.psdData.inputAttributes.length; ind++) {
      const data = props.psdData.inputAttributes[ind];
      cols.push({ index: ind, header: data.name, visible: data.display });
    }
    return cols;
  }
  return [];
});
// create
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

const randomString = generateRandomString(10);
const createVisibleDialog = ref(false);
const psCreate = ref();

const psCreateForm = computed(() => {
  if (props.psdData) {
    const forms = [];
    const formData = {};
    for (let ind = 0; ind < props.psdData.inputAttributes.length; ind++) {
      const data = props.psdData.inputAttributes[ind];
      forms.push({ index: ind, name: data.name, visible: data.display, datatype: data.datatype });
    }
    return forms;
  }
  return [];
});

const idExisted = ref(false);

const createPS = async () => {
  try {
    await api.createGeneralPSE(
      psCreate,
      props.psdData.inputAttributes.map((val) => val.name && val.display),
    );
    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Created successfully', life: 3000 });
    emit('getData');
  } catch (error) {
    console.log('handleCreatePS: error ', error);
    if (error.data.detail.includes('duplicate key error')) {
      console.log('duplicate key error');
      idExisted.value = true;
    }

    // progressSpinnerModal.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

// Edit
const editVisibleDialog = ref(false);
const pseEdit = ref({});
const handleEditPSE = (pseData) => {
  pseEdit.value = pseData;
  editVisibleDialog.value = true;
};

const editPSE = async () => {
  emit('editData', pseEdit.value);
  editVisibleDialog.value = false;
};

// Delete
const deleteVisibleDialog = ref(false);
const pseDelete = ref({});
const handleDeletePSE = (pseData) => {
  pseDelete.value = pseData;
  deleteVisibleDialog.value = true;
};

const deletePSE = async () => {
  emit('deleteData', pseDelete.value._id);
  deleteVisibleDialog.value = false;
};

function capitalizeFirstLetter(string) {
  return string
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

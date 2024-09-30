<template>
  <DataTable
    :value="data"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    showGridlines
    :loading="loading"
  >
    <Column field="name" header="Name" style="text-wrap: nowrap"></Column>
    <Column field="poleOrder" header="Order" style="text-wrap: nowrap"></Column>
    <Column field="Longitude" header="Longitude" style="text-wrap: nowrap"></Column>
    <Column field="Latitude" header="Latitude" style="text-wrap: nowrap"></Column>

    <Column frozen alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
      <template #body="{ data }">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPole(data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePole(data)" />
        </div>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>

  <!-- pole dialog -->
  <Dialog v-model:visible="poleVisibleDialog" :style="{ width: '36rem' }" header="Add Pole" :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Add Pole</span>
      </div>
    </template>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-12rem"> Name</label>
      <InputText
        id="name"
        v-model="poleData.name"
        :disabled="changeMode === 'Delete'"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="poleOrder" class="font-semibold w-12rem"> Order</label>
      <InputNumber
        id="poleOrder"
        v-model="poleData.poleOrder"
        :disabled="changeMode === 'Delete'"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Longitude" class="font-semibold w-12rem"> Longitude</label>
      <InputNumber
        id="Longitude"
        v-model="poleData.Longitude"
        :disabled="changeMode === 'Delete'"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="Latitude" class="font-semibold w-12rem"> Latitude</label>
      <InputNumber
        id="Latitude"
        v-model="poleData.Latitude"
        :disabled="changeMode === 'Delete'"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="poleVisibleDialog = false"></Button>
      <Button type="button" :label="submitBtnLabel" :severity="submitBtnSeverity" @click="changePole()"></Button>
    </template>
  </Dialog>

  <!-- Edit dialog data -->
</template>
<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { SubLineApi } from '../api';
const toast = useToast();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  nodeSelected: { type: Object, default: () => {} },
  projectVersionId: { type: String, default: '' },
  currentPage: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['reloadData']);
//pole dialog
const poleVisibleDialog = ref(false);
const changeMode = ref();
const poleData = ref({});

const handleEditPole = (data) => {
  changeMode.value = 'Update';
  poleData.value = data;
  poleVisibleDialog.value = true;
};

const handleDeletePole = (data) => {
  changeMode.value = 'Delete';
  poleData.value = data;
  poleVisibleDialog.value = true;
};

const submitBtnLabel = ref();
const submitBtnSeverity = ref();
watch(changeMode, (newMode) => {
  if (newMode === 'Update') {
    submitBtnLabel.value = 'Update';
    submitBtnSeverity.value = 'info';
  }
  if (newMode === 'Delete') {
    submitBtnLabel.value = 'Delete';
    submitBtnSeverity.value = 'danger';
  }
});
const changePole = () => {
  if (changeMode.value === 'Update') {
    updatePole();
  }
  if (changeMode.value === 'Delete') {
    deletePole();
  }
};

const updatePole = async () => {
  try {
    const updateData = JSON.parse(JSON.stringify(poleData.value));
    delete updateData.powersystemName;
    await SubLineApi.update(
      {
        _id: poleData.value._id,
        currentPowerSystemVersionId: poleData.value.currentPowerSystemVersionId,
        powersystemId: poleData.value.powersystemId,
        name: poleData.value.name,
        poleOrder: poleData.value.poleOrder,
        Longitude: poleData.value.Longitude,
        Latitude: poleData.value.Latitude,
      },
      props.projectVersionId,
    );
    // emit('reloadData');
    poleVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Pole', detail: 'Update Successfully', life: 3000 });
  } catch (error) {
    console.log('Update pole error', error);
    toast.add({ severity: 'error', summary: 'Update Power System - Pole', detail: error.data.detail, life: 3000 });
  }
};

const deletePole = async () => {
  try {
    await SubLineApi.delete(poleData.value._id, props.projectVersionId);
    emit('reloadData');
    poleVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Pole', detail: 'Delete Successfully', life: 3000 });
  } catch (error) {
    console.log('delete pole error', error);
    toast.add({ severity: 'error', summary: 'Delete Power System - Pole', detail: error.data.detail, life: 3000 });
  }
};
</script>

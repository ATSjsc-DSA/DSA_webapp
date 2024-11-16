<template>
  <DataTable
    :value="data"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    showGridlines
    scrollable
    :loading="loading"
  >
    <Column field="generalInfo.uniqueId" frozen header="Unique Id" style="text-wrap: nowrap">
      <template #body="slotProps">
        <div class="font-bold" style="min-width: 6rem">
          {{ slotProps.data.generalInfo.uniqueId }}
        </div>
      </template>
    </Column>
    <Column field="scadaInfo.skey" header="Skey" style="text-wrap: nowrap"></Column>
    <Column field="scadaInfo.scadaName" header="Scada Name" style="text-wrap: nowrap"></Column>
    <Column field="scadaInfo.scadaUniqueId" header="Scada Unique Id" style="text-wrap: nowrap"> </Column>
    <Column
      v-if="showChangeColumn"
      frozen
      alignFrozen="right"
      style="text-wrap: nowrap; width: 1%; min-width: 5rem"
      bodyClass="p-1"
    >
      <template #body="slotProps">
        <div class="flex justify-content-between">
          <Button icon="pi pi-pencil " severity="success" text rounded @click="handleEditPSE(slotProps.data)" />
          <Button icon="pi pi-trash" severity="danger" text rounded @click="handleDeletePSE(slotProps.data)" />
        </div>
      </template>
    </Column>
    <template #empty> No Data </template>
  </DataTable>

  <!-- Edit dialog data -->
  <Dialog v-model:visible="editVisibleDialog" :style="{ width: '32rem' }" header="Edit " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Update Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">Scada information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem"> Unique Id</label>
      <InputText id="areaname" v-model="pseEdit.generalInfo.uniqueId" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="skey" class="font-semibold w-12rem"> Skey</label>
      <InputText id="skey" v-model="pseEdit.scadaInfo.skey" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="scadaName" class="font-semibold w-12rem"> Ems Name</label>
      <InputText id="scadaName" v-model="pseEdit.scadaInfo.scadaName" class="flex-auto" autocomplete="off" />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="editPSE()"></Button>
    </template>
  </Dialog>

  <!-- Delete dialog data -->
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '32rem' }" header="Delete " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Delete Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">Scada information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-12rem">Unique Id</label>
      <InputText id="areaname" v-model="pseDelete.generalInfo.uniqueId" disabled class="flex-auto" autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="skey" class="font-semibold w-12rem"> Skey</label>
      <InputText id="skey" v-model="pseDelete.scadaInfo.skey" class="flex-auto" autocomplete="off" disabled />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="scadaName" class="font-semibold w-12rem"> Ems Name</label>
      <InputText id="scadaName" v-model="pseDelete.scadaInfo.scadaName" class="flex-auto" autocomplete="off" disabled />
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="deleteVisibleDialog = false"></Button>
      <Button type="button" label="Submit" severity="danger" @click="deletePSE()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showChangeColumn: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['editData', 'deleteData']);

// Edit
const editVisibleDialog = ref(false);
const pseEdit = ref({});
const handleEditPSE = (pseData) => {
  pseEdit.value = JSON.parse(JSON.stringify(pseData));
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
</script>

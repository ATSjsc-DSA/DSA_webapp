<template>
  <DataTable
    :value="data"
    dataKey="_id"
    tableStyle="min-width: 50rem"
    :lazy="true"
    :sortOrder="1"
    rowHover
    scrollable
    showGridlines
    :loading="loading"
  >
    <Column field="generalInfo.uniqueId" frozen header="Unique Id" style="text-wrap: nowrap">
      <template #body="slotProps">
        <div class="font-bold" style="min-width: 6rem">
          {{ slotProps.data.generalInfo.uniqueId }}
        </div>
      </template>
    </Column>
    <Column field="generalInfo.name" header="Name" style="text-wrap: nowrap"></Column>
    <Column field="generalInfo.operationName" header="Operation Name" style="text-wrap: nowrap"></Column>

    <template v-for="col of columnList" :key="col.field">
      <Column v-if="col.visible" :header="capitalizeFirstLetter(col.header)" style="text-wrap: nowrap">
        <template #body="slotProps">
          <div class="flex justify-content-between align-items-center">
            {{ slotProps.data.engineInfo.values[col.index] }}
          </div>
        </template>
      </Column>
    </template>
    <Column v-if="showChangeColumn" frozen alignFrozen="right" style="width: 1%; min-width: 5rem" bodyClass="p-1">
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
  <Dialog v-model:visible="editVisibleDialog" :style="{ width: '42rem' }" header="Edit " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Update Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-16rem"> Unique Id</label>
      <InputText id="areaname" v-model="pseEdit.generalInfo.uniqueId" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-16rem"> Name</label>
      <InputText id="areaname" v-model="pseEdit.generalInfo.name" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-16rem"> Operation Name</label>
      <InputText id="areaname" v-model="pseEdit.generalInfo.operationName" class="flex-auto" autocomplete="off" />
    </div>

    <span class="p-text-secondary block my-5`">Energy information.</span>

    <template v-for="col of columnList" :key="col.field">
      <div v-if="col.visible" class="flex align-items-center gap-3 mb-3">
        <label :for="col" class="font-semibold w-16rem"> {{ capitalizeFirstLetter(col.header) }}</label>
        <InputText :id="col" v-model="pseEdit.engineInfo.values[col.index]" class="flex-auto" autocomplete="off" />
      </div>
    </template>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="editVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="editPSE()"></Button>
    </template>
  </Dialog>

  <!-- Delete dialog data -->
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '42rem' }" header="Delete " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Delete Power Systwem</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">General information.</span>

    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-16rem"> Unique Id</label>
      <InputText id="areaname" v-model="pseDelete.generalInfo.uniqueId" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-16rem"> Name</label>
      <InputText id="areaname" v-model="pseDelete.generalInfo.name" disabled class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3 cursor-not-allowed">
      <label for="areaname" class="font-semibold w-16rem"> Operation Name</label>
      <InputText
        id="areaname"
        v-model="pseDelete.generalInfo.operationName"
        class="flex-auto"
        disabled
        autocomplete="off"
      />
    </div>

    <span class="p-text-secondary block my-5">Energy information.</span>

    <template v-for="col of columnList" :key="col.field">
      <div v-if="col.visible" class="flex align-items-center gap-3 mb-3">
        <label :for="col" class="font-semibold w-16rem"> {{ capitalizeFirstLetter(col.header) }}</label>
        <InputText
          :id="col"
          v-model="pseDelete.engineInfo.values[col.index]"
          class="flex-auto"
          disabled=""
          autocomplete="off"
        />
      </div>
    </template>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="deleteVisibleDialog = false"></Button>
      <Button type="button" label="Submit" severity="danger" @click="deletePSE()"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headerData: {
    type: Object,
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

const columnList = computed(() => {
  if (props.headerData.inputAttributes) {
    const dataHeader = props.headerData.inputAttributes;
    const cols = [];
    for (let ind = 0; ind < dataHeader.length; ind++) {
      const data = dataHeader[ind];
      cols.push({ index: ind, header: data.name, visible: data.display });
    }
    return cols;
  }
  return [];
});

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

function capitalizeFirstLetter(string) {
  return string
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Angle Stability</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreate" />
      </div>

      <ScrollPanel style="width: 100%; height: 46rem">
        <DataView :value="angleStabilityList" class="w-full flex-1">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': angleStabilitySelected && angleStabilitySelected.name === item.name,
                  }"
                  @click="angleStabilityClick(item)"
                >
                  <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1 ml-2">
                    <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2">
                      <i class="pi pi-folder text-yellow-400"></i>{{ item.name }}
                    </div>
                    <Button
                      class="item-button"
                      icon="pi pi-trash"
                      text
                      size="small"
                      rounded
                      severity="danger"
                      @click="confirmDelete($event, item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </ScrollPanel>
    </SplitterPanel>

    <SplitterPanel class="h-full" :size="75">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold">Configuration </span>
      </div>
      <div v-if="angleStabilityData._id" class="p-6">
        <div class="grid align-items-center">
          <div class="col-12 flex justify-content-between gap-3">
            <div class="flex flex-column gap-2 mb-3 flex-1">
              <label for="name" class="font-semibold"> Name </label>
              <InputText id="name" v-model="angleStabilityData.name" class="flex-auto w-full" autocomplete="off" />
            </div>
            <div class="flex flex-column gap-2 mb-3 align-items-center">
              <label for="active" class="font-semibold mb-2"> Active</label>
              <InputSwitch id="active" v-model="angleStabilityData.active" autocomplete="off" />
            </div>
          </div>
          <div class="col-6">
            <div class="flex flex-column gap-2 mb-3">
              <label for="limitationReserve" class="font-semibold"> Instantaneous Min</label>
              <InputNumber v-model="angleStabilityData.instantaneousMin" />
            </div>
          </div>
          <div class="col-6">
            <div class="flex flex-column gap-2 mb-3">
              <label for="limitationReserve" class="font-semibold"> Instantaneous Max</label>
              <InputNumber v-model="angleStabilityData.instantaneousMax" />
            </div>
          </div>
        </div>
        <div class="flex justify-content-end gap-3">
          <Button type="button" label="Update" @click="updateVsaCase"></Button>
        </div>
      </div>
    </SplitterPanel>
  </Splitter>

  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '48rem' }" header="Create Dialog " :modal="true">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Angle Stability</span>
      </div>
    </template>

    <div class="grid align-items-center">
      <div class="col-12 flex justify-content-between gap-3">
        <div class="flex flex-column gap-2 mb-3 flex-1">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="newData.name" class="flex-auto w-full" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3 align-items-center">
          <label for="active" class="font-semibold mb-2"> Active</label>
          <InputSwitch id="active" v-model="newData.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="limitationReserve" class="font-semibold"> Instantaneous Min</label>
          <InputNumber v-model="newData.instantaneousMin" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="limitationReserve" class="font-semibold"> Instantaneous Max</label>
          <InputNumber v-model="newData.instantaneousMax" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newData.name" @click="createAngleStability"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ScrollPanel from 'primevue/scrollpanel';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import { ApiAngleStability } from './api';
import { onMounted } from 'vue';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  gridcodeId: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  await getAngleStabilityList();
});
const angleStabilityList = ref([]);

const getAngleStabilityList = async () => {
  try {
    const res = await ApiAngleStability.getList(props.gridcodeId);
    angleStabilityList.value = res.data;
  } catch (error) {
    console.log('getVsaCaseList error', error);
  }
};

const angleStabilitySelected = ref({});
const angleStabilityData = ref({});
const angleStabilityClick = async (item) => {
  angleStabilitySelected.value = item;
  await getAngleStabilityData();
};
// -- angleStability- crud

const getAngleStabilityData = async () => {
  try {
    const res = await ApiAngleStability.getAngleStabilityById(angleStabilitySelected.value._id);
    angleStabilityData.value = res.data;
  } catch (error) {
    angleStabilityData.value = {};
    console.log('getAngleStabilityData error', error);
  }
};
const newData = ref();
const createVisibleDialog = ref(false);

const handlerCreate = () => {
  newData.value = {
    active: true,
    instantaneousMax: 1,
    instantaneousMin: -1,
    name: '',
  };
  createVisibleDialog.value = true;
};

const createAngleStability = async () => {
  try {
    const res = await ApiAngleStability.create(props.gridcodeId, newData.value);
    await getAngleStabilityList();
    angleStabilityData.value = res.data;
    angleStabilitySelected.value = res.data;

    createVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const updateVsaCase = async () => {
  try {
    await ApiAngleStability.update(angleStabilityData.value._id, angleStabilityData.value);
    await getAngleStabilityList();
    await getAngleStabilityData();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateVsaCase error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDelete = (event, angleStability) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Angle Stability - ' + angleStability.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteAngleStabilityData(angleStability._id);
    },
    reject: () => {},
  });
};

const deleteAngleStabilityData = async (id) => {
  try {
    await ApiAngleStability.deleteAngleStability(id);
    await getAngleStabilityList();
    angleStabilityData.value = {};
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};
</script>

<style>
.item-data:hover {
  cursor: pointer;
  background-color: var(--highlight-bg);
}

.selected-item {
  background-color: var(--highlight-bg);
}
</style>

<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List VSA case</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateVsaCase" />
      </div>

      <ScrollPanel style="width: 100%; height: 46rem">
        <DataView :value="vsaCaseList" class="w-full flex-1">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': vsaCaseSelected && vsaCaseSelected.name === item.name,
                  }"
                  @click="vsaCaseClick(item)"
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
                      @click="confirmDeleteVsaCase($event, item)"
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
      <div v-if="vsaCaseData._id" class="p-6">
        <div class="grid align-items-center">
          <div class="col-12 flex justify-content-between gap-3">
            <div class="flex flex-column gap-2 mb-3 flex-1">
              <label for="name" class="font-semibold"> Name </label>
              <InputText id="name" v-model="vsaCaseData.name" class="flex-auto w-full" autocomplete="off" />
            </div>
            <div class="flex flex-column gap-2 mb-3 align-items-center">
              <label for="active" class="font-semibold mb-2"> Active</label>
              <InputSwitch id="active" v-model="vsaCaseData.active" autocomplete="off" />
            </div>
          </div>

          <div class="col-6">
            <div class="flex flex-column gap-2 mb-3">
              <label for="contingencyType" class="font-semibold">Contingency Type</label>
              <Dropdown
                id="contingencyType"
                v-model="vsaCaseData.contingencyType"
                :options="contingencyTypeOpts"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="flex flex-column gap-2 mb-3">
              <label for="limitationReserve" class="font-semibold"> Limitation Reserve</label>
              <InputNumber v-model="vsaCaseData.limitationReserve" />
            </div>
          </div>
        </div>

        <div class="flex justify-content-end gap-3">
          <Button type="button" label="Update" @click="updateVsaCase"></Button>
        </div>
      </div>
    </SplitterPanel>
  </Splitter>

  <Dialog
    v-model:visible="createVsaCaseVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - VSA case</span>
      </div>
    </template>

    <div class="grid align-items-center">
      <div class="col-12 flex justify-content-between gap-3">
        <div class="flex flex-column gap-2 mb-3 flex-1">
          <label for="name" class="font-semibold"> Name </label>
          <InputText id="name" v-model="newVsaCase.name" class="flex-auto w-full" autocomplete="off" />
        </div>
        <div class="flex flex-column gap-2 mb-3 align-items-center">
          <label for="active" class="font-semibold mb-2"> Active</label>
          <InputSwitch id="active" v-model="newVsaCase.active" autocomplete="off" />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="contingencyType" class="font-semibold">Contingency Type</label>
          <Dropdown
            id="contingencyType"
            v-model="newVsaCase.contingencyType"
            :options="contingencyTypeOpts"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column gap-2 mb-3">
          <label for="limitationReserve" class="font-semibold"> Limitation Reserve</label>
          <InputNumber v-model="newVsaCase.limitationReserve" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVsaCaseVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newVsaCase.name" @click="createVsaCase"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ScrollPanel from 'primevue/scrollpanel';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import { ApiVsaCase } from './api';
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
  await getVsaCaseList();
});
const vsaCaseList = ref([]);

const getVsaCaseList = async () => {
  try {
    const res = await ApiVsaCase.getList(props.gridcodeId);
    vsaCaseList.value = res.data;
  } catch (error) {
    console.log('getVsaCaseList error', error);
  }
};

const vsaCaseSelected = ref({});
const vsaCaseData = ref({});
const vsaCaseClick = async (item) => {
  vsaCaseSelected.value = item;
  await getVsaCaseData();
};
// -- VSA case  - crud

const getVsaCaseData = async () => {
  try {
    const res = await ApiVsaCase.getVsaCaseById(vsaCaseSelected.value._id);
    vsaCaseData.value = res.data;
  } catch (error) {
    vsaCaseData.value = {};
    console.log('getVsaCaseList error', error);
  }
};
const newVsaCase = ref();
const createVsaCaseVisibleDialog = ref(false);
const contingencyTypeOpts = ref([
  { label: 'N-1', value: 0 },
  { label: 'N-2', value: 1 },
  { label: 'Base', value: 2 },
]);
const handlerCreateVsaCase = () => {
  newVsaCase.value = {
    name: '',
    contingencyType: 0,
    active: true,
    limitationReserve: 0,
  };
  createVsaCaseVisibleDialog.value = true;
};

const createVsaCase = async () => {
  try {
    const res = await ApiVsaCase.create(props.gridcodeId, newVsaCase.value);
    await getVsaCaseList();
    vsaCaseData.value = res.data;
    vsaCaseSelected.value = res.data;
    createVsaCaseVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('getVsaCaseList error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const updateVsaCase = async () => {
  try {
    await ApiVsaCase.update(vsaCaseData.value._id, vsaCaseData.value);
    await getVsaCaseList();
    await getVsaCaseData();
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('getVsaCaseList error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteVsaCase = (event, vsaCase) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete VSA Case - ' + vsaCase.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteVsaCaseData(vsaCase._id);
    },
    reject: () => {},
  });
};

const deleteVsaCaseData = async (id) => {
  try {
    await ApiVsaCase.deleteVsaCase(id);
    await getVsaCaseList();
    vsaCaseData.value = {};
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('getVsaCaseList error', error);
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

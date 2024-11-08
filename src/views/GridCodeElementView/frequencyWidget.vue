<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Frequency</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateFrequency" />
      </div>

      <ScrollPanel style="width: 100%; height: 46rem">
        <DataView :value="frequencyList" class="w-full flex-1" :class="{ 'p-3': frequencyList.length === 0 }">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': index === frequencyIndexSelected,
                  }"
                  @click="frequencyClick(index)"
                >
                  <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1 ml-2">
                    <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2 capitalize">
                      <i class="pi pi-folder text-yellow-400"></i>
                      {{ item.name }}
                    </div>
                    <Button
                      class="item-button"
                      icon="pi pi-trash"
                      text
                      size="small"
                      rounded
                      severity="danger"
                      @click="confirmDeleteFrequency($event, item, index)"
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
      <TabView>
        <TabPanel header="Common">
          <div v-if="frequencyData._id" class="p-3">
            <frequencyForm v-model:form-data="frequencyData" />
            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Update" @click="updateFrequency"></Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Contigency">
          <contigencyWidget v-if="frequencyData._id" :standard-id="frequencyData._id" />
        </TabPanel>
      </TabView>
    </SplitterPanel>
  </Splitter>

  <Dialog
    v-model:visible="createFrequencyVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Frequency</span>
      </div>
    </template>
    <frequencyForm v-model:form-data="newFrequency" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createFrequencyVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newFrequency.name" @click="createFrequency"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ScrollPanel from 'primevue/scrollpanel';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import frequencyForm from './frequencyForm.vue';
import contigencyWidget from './contigencyWidget.vue';
import { ApiFrequency } from './api';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  gridcodeId: {
    type: String,
    required: true,
  },
});
onMounted(async () => {
  await getFrequencyList();
});
const frequencyList = ref([]);
const getFrequencyList = async () => {
  try {
    const res = await ApiFrequency.getFrequencyList(props.gridcodeId);
    frequencyList.value = res.data;
  } catch (error) {
    console.log('getfrequencyList error', error);
  }
};

// ------ frequency - CRUD
const frequencyIndexSelected = ref();
const frequencyData = ref({});
const frequencyClick = async (index) => {
  frequencyIndexSelected.value = index;
  await getFrequencyData();
};

const getFrequencyData = async () => {
  try {
    const res = await ApiFrequency.getFrequencyById(frequencyList.value[frequencyIndexSelected.value]._id);
    frequencyData.value = res.data;
  } catch (error) {
    frequencyData.value = {};
    console.log('getfrequencyList error', error);
  }
};

const newFrequency = ref();
const createFrequencyVisibleDialog = ref(false);

const handlerCreateFrequency = () => {
  newFrequency.value = {
    active: true,
    name: '',
    unitType: 2,
    normalVolLimitLower: 0,
    normalVolLimitUpper: 0,
    norminalFreq: 0,
  };
  createFrequencyVisibleDialog.value = true;
};
const createFrequency = async () => {
  try {
    const res = await ApiFrequency.createFrequency(props.gridcodeId, newFrequency.value);
    frequencyList.value.push(res.data);
    frequencyData.value = res.data;
    frequencyIndexSelected.value = frequencyList.value.length - 1;
    createFrequencyVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
const updateFrequency = async () => {
  try {
    const res = await ApiFrequency.updateFrequency(frequencyData.value._id, frequencyData.value);
    // await getFrequencyList();
    frequencyList.value[frequencyIndexSelected.value] = res.data;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateFrequency error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteFrequency = (event, frequency, index) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Frequency - ' + frequency.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteFrequency(frequency._id, index);
    },
  });
};

const deleteFrequency = async (id, delIndex) => {
  try {
    await ApiFrequency.deleteFrequency(id);
    frequencyList.value.splice(delIndex, 1);
    frequencyIndexSelected.value = undefined;
    frequencyData.value = {};
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};

// contingency
</script>

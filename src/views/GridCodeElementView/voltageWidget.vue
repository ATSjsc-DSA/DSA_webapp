<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Voltage</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateVoltage" />
      </div>

      <ScrollPanel style="width: 100%; height: 46rem">
        <DataView :value="voltageList" class="w-full flex-1" :class="{ 'p-3': voltageList.length === 0 }">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': index === voltageIndexSelected,
                  }"
                  @click="voltageClick(index)"
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
                      @click="confirmDeleteVoltage($event, item, index)"
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
          <div v-if="voltageData._id" class="p-3">
            <voltageForm v-model:form-data="voltageData" />
            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Update" @click="confirmUpdate"></Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Contigency">
          <contigencyWidget v-if="voltageData._id" :standard-id="voltageData._id" />
        </TabPanel>
      </TabView>
    </SplitterPanel>
  </Splitter>

  <Dialog
    v-model:visible="createVoltageVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Voltage</span>
      </div>
    </template>
    <voltageForm v-model:form-data="newVoltage" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createVoltageVisibleDialog = false"></Button>
      <Button type="button" label="Save" :disabled="!newVoltage.name" @click="createVoltage"></Button>
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

import voltageForm from './voltageForm.vue';
import contigencyWidget from './contigencyWidget.vue';
import { ApiVoltage } from './api';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  gridcodeId: {
    type: String,
    required: true,
  },
});
onMounted(async () => {
  await getVoltageList();
});

const voltageList = ref([]);
const getVoltageList = async () => {
  try {
    const res = await ApiVoltage.getVoltageList(props.gridcodeId);
    voltageList.value = res.data;
  } catch (error) {
    console.log('getvoltageList error', error);
  }
};

// ------ voltage - CRUD
const voltageIndexSelected = ref();
const voltageData = ref({});
const voltageClick = async (index) => {
  if (voltageIndexSelected.value !== index) {
    voltageIndexSelected.value = index;
    await getVoltageData();
  }
};

const getVoltageData = async () => {
  try {
    const res = await ApiVoltage.getVoltageById(voltageList.value[voltageIndexSelected.value]._id);
    voltageData.value = res.data;
  } catch (error) {
    voltageData.value = {};
    console.log('getvoltageList error', error);
  }
};

const newVoltage = ref();
const createVoltageVisibleDialog = ref(false);

const handlerCreateVoltage = () => {
  newVoltage.value = {
    active: true,
    name: '',
    abnormalActivation: true,
    abnormalVolLimitLower: null,
    abnormalVolLimitUpper: null,
    unitTypeAbnormalVolLimit: 0,

    normalVolLimitLower: null,
    normalVolLimitUpper: null,
    unitTypeNormalVolLimit: 0,

    volRangeLower: null,
    volRangeUpper: null,
    unitTypeVolRange: 0,
  };
  createVoltageVisibleDialog.value = true;
};
const createVoltage = async () => {
  try {
    const newValue = JSON.parse(JSON.stringify(newVoltage.value));
    Object.keys(newValue).forEach((key) => (newValue[key] = newValue[key] === null ? 0 : newValue[key]));

    const res = await ApiVoltage.createVoltage(props.gridcodeId, newValue);
    // await getVoltageList();
    voltageList.value.push(res.data);
    voltageIndexSelected.value = voltageList.value.length - 1;
    voltageData.value = res.data;
    createVoltageVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmUpdate = async (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'updateDialog',
    header: 'Update Voltage - ' + voltageData.value.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Update',
    accept: async () => {
      await updateVoltage();
    },
  });
};
const updateVoltage = async () => {
  try {
    const res = await ApiVoltage.updateVoltage(voltageData.value._id, voltageData.value);
    // await getVoltageList();
    voltageList.value[voltageIndexSelected.value] = res.data;
    voltageData.value = res.data;

    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateVoltage error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteVoltage = (event, voltage, index) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Voltage - ' + voltage.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteVoltage(voltage._id, index);
    },
    reject: () => {},
  });
};

const deleteVoltage = async (id, index) => {
  try {
    await ApiVoltage.deleteVoltage(id);
    // await getVoltageList();
    voltageIndexSelected.value = undefined;
    voltageData.value = {};
    voltageList.value.splice(index, 1);
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};

// contingency
</script>

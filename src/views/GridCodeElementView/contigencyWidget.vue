<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Contingency</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateContingency" />
      </div>

      <ScrollPanel style="width: 100%; height: 41rem">
        <DataView :value="contingencyList" class="w-full flex-1">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': contingencySelected && contingencySelected.name === item.name,
                  }"
                  @click="contingencyClick(item)"
                >
                  <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1 ml-2">
                    <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2 capitalize">
                      <Tag
                        :value="getContingencyTypeLabel(item.contingencyType)"
                        :severity="getSeverityContingencyType(item.contingencyType)"
                        class="w-3rem"
                      />
                      {{ item.name }}
                    </div>
                    <Button
                      class="item-button"
                      icon="pi pi-trash"
                      text
                      size="small"
                      rounded
                      severity="danger"
                      @click="confirmDeleteContingency($event, item)"
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
          <div v-if="contingencyData._id" class="p-3">
            <contingencyForm v-model:form-data="contingencyData" />
            <div class="flex justify-content-end gap-3">
              <Button type="button" label="Update" @click="updateContingency"></Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Dynamic"> tôi là dynamic </TabPanel>
      </TabView>
    </SplitterPanel>
  </Splitter>

  <Dialog
    v-model:visible="createContingencyVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Grid Code - Contingency</span>
      </div>
    </template>
    <contingencyForm v-model:form-data="newContingency" />
    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="createContingencyVisibleDialog = false"
      ></Button>
      <Button type="button" label="Save" :disabled="!newContingency.name" @click="createContingency"></Button>
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

import contingencyForm from './contingencyForm.vue';
import { ApiContingency } from './api';
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  standardId: {
    type: String,
    required: true,
  },
});
onMounted(async () => {
  await getContingencyList();
});
const contingencyList = ref([]);
const getContingencyList = async () => {
  try {
    console.log(props.standardId);
    const res = await ApiContingency.getContingencyList(props.standardId);
    contingencyList.value = res.data;
  } catch (error) {
    console.log('getcontingencyList error', error);
  }
};

// ------ contingency - CRUD
const contingencySelected = ref({});
const contingencyData = ref({});
const contingencyClick = async (item) => {
  contingencySelected.value = item;
  await getContingencyData();
};

const getContingencyData = async () => {
  try {
    const res = await ApiContingency.getContingencyById(contingencySelected.value._id);
    contingencyData.value = res.data;
  } catch (error) {
    contingencyData.value = {};
    console.log('getcontingencyList error', error);
  }
};

const newContingency = ref();
const createContingencyVisibleDialog = ref(false);

const handlerCreateContingency = () => {
  newContingency.value = {
    name: '',
    active: true,
    contingencyType: 0,
    criticalLower: 0,
    criticalUpper: 0,
  };
  createContingencyVisibleDialog.value = true;
};
const createContingency = async () => {
  try {
    const res = await ApiContingency.createContingency(props.standardId, newContingency.value);
    await getContingencyList();
    contingencySelected.value = res.data;
    contingencyData.value = res.data;
    createContingencyVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};
const updateContingency = async () => {
  try {
    const res = await ApiContingency.updateContingency(contingencyData.value._id, contingencyData.value);
    await getContingencyList();
    contingencySelected.value = res.data;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateContingency error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteContingency = (event, contingency) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Contingency - ' + contingency.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteContingency(contingency._id);
    },
    reject: () => {},
  });
};

const deleteContingency = async (id) => {
  try {
    await ApiContingency.deleteContingency(id);
    await getContingencyList();
    contingencySelected.value = {};
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteAngleStabilityData error', error);
  }
};
const getContingencyTypeLabel = (typeValue) => {
  switch (typeValue) {
    case 0:
      return 'N-1';
    case 1:
      return 'N-2';
    case 2:
      return 'Base';
    default:
      return 'N-1';
  }
};

const getSeverityContingencyType = (typeValue) => {
  switch (typeValue) {
    case 0:
      return 'primary';
    case 1:
      return 'info';
    case 2:
      return 'secondary';
    default:
      return 'primary';
  }
};
// contingency
</script>

<template>
  <Splitter>
    <SplitterPanel :size="25" :minSize="10">
      <div class="py-4 px-3 flex justify-content-between align-items-center">
        <span class="text-xl font-semibold"> List Contingency</span>
        <Button icon="pi pi-plus" text rounded aria-label="create" @click="handlerCreateContingency" />
      </div>

      <ScrollPanel style="width: 100%; height: 41rem">
        <DataView :value="contingencyList" class="w-full flex-1" :class="{ 'p-3': contingencyList.length === 0 }">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                  :class="{
                    'border-top-1 surface-border': index !== 0,
                    'selected-item': index === contingencyIndexSelected,
                  }"
                  @click="contingencyClick(index)"
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
                      @click="confirmDeleteContingency($event, item, index)"
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
              <Button type="button" label="Update" @click="confirmUpdateContingency"></Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Dynamic">
          <div style="height: 34rem; margin-top: 2rem">
            <DataTable
              id="gridcodeTable"
              class="w-full h-full"
              :value="dynamicStdList"
              showGridlines
              :loading="isLoadingDynamicStd"
              size="small"
            >
              <template #header>
                <div class="flex justify-content-between align-items-center gap-3">
                  <div class="font-semibold white-space-nowrap text-lg">Dynamic Std</div>
                  <Button
                    type="button"
                    icon="pi pi-plus"
                    text
                    :disabled="!contingencyData._id"
                    @click="handleCreateDynamicStd"
                  />
                </div>
              </template>

              <ColumnGroup type="header">
                <Row>
                  <Column header="Name" :rowspan="2" />
                  <Column header="Active" :rowspan="2" />
                  <Column header="Restore Time" :rowspan="2" />
                  <Column :colspan="2">
                    <template #header>
                      <div class="block w-full text-center">Stable Range</div>
                    </template>
                  </Column>
                  <Column :colspan="2">
                    <template #header>
                      <div class="block w-full text-center">Error</div>
                    </template>
                  </Column>

                  <Column :rowspan="2" />
                </Row>
                <Row>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Lower</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Upper</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Lower</div>
                    </template>
                  </Column>
                  <Column>
                    <template #header>
                      <div class="block w-full text-center">Upper</div>
                    </template>
                  </Column>
                </Row>
              </ColumnGroup>

              <Column header="Name" field="name" class="capitalize">
                <template #body="{ data }">
                  <div style="min-width: 6rem">{{ data.name }}</div>
                </template>
              </Column>
              <Column field="active" header="Active">
                <template #body="{ data }">
                  <Tag
                    :severity="data.active ? 'primary' : 'secondary'"
                    class="capitalize"
                    :value="String(data.active)"
                  ></Tag>
                </template>
              </Column>

              <Column field="restoreTime" header="Restore Time" style="text-wrap: nowrap" />
              <Column field="stableRangeLower" style="text-wrap: nowrap">
                <template #body="{ data }">
                  <div class="block w-full text-center">
                    {{ data.stableRangeLower }} {{ getUnitLabel(data.unitTypeStable) }}
                  </div>
                </template>
              </Column>
              <Column field="stableRangeUpper" style="text-wrap: nowrap">
                <template #body="{ data }">
                  <div class="block w-full text-center">
                    {{ data.stableRangeUpper }} {{ getUnitLabel(data.unitTypeStable) }}
                  </div>
                </template>
              </Column>
              <Column field="lowerError" style="text-wrap: nowrap">
                <template #body="{ data }">
                  <div class="block w-full text-center">
                    {{ data.lowerError }} {{ getUnitLabel(data.unitTypeError) }}
                  </div>
                </template>
              </Column>
              <Column field="upperError" style="text-wrap: nowrap">
                <template #body="{ data }">
                  <div class="block w-full text-center">
                    {{ data.upperError }} {{ getUnitLabel(data.unitTypeError) }}
                  </div>
                </template>
              </Column>

              <Column style="width: 4rem; padding-top: 0; padding-bottom: 0">
                <template #body="{ data }">
                  <div class="flex w-full justify-content-between align-items-center">
                    <Button
                      icon="pi pi-pencil"
                      severity="success"
                      text
                      rounded
                      @click="confirmUpdateDynamicStd($event, data)"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      @click="confirmDeleteDynamicStd($event, data)"
                    />
                  </div>
                </template>
              </Column>
              <template #empty> No data </template>
            </DataTable>
          </div>
          <div class="flex justify-content-end align-items-center mt-3">
            <Paginator
              v-if="totalDynamicStdRecord > pageRowNumber"
              v-model:first="paginatorOffsetDynamicStd"
              class="flex-grow-1"
              :rows="pageRowNumber"
              :totalRecords="totalDynamicStdRecord"
              :page="currentDynamicStdPage"
              @page="onDynamicStdPageChange"
            ></Paginator>
            <div class="mr-3">Total: {{ totalDynamicStdRecord }}</div>
          </div>
        </TabPanel>
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

  <Dialog
    v-model:visible="createDynamicStdVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Contingency - Dynamic Std</span>
      </div>
    </template>

    <contingencyDynamicStdForm v-model:form-data="newDynamicStd" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="createDynamicStdVisibleDialog = false"></Button>
      <Button type="button" label="Save" @click="createDynamicStd"></Button>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="updateDynamicStdVisibleDialog"
    :style="{ width: '48rem' }"
    header="Create Dialog "
    :modal="true"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Contingency - Dynamic Std</span>
      </div>
    </template>

    <contingencyDynamicStdForm v-model:form-data="editDynamicStd" />
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="updateDynamicStdVisibleDialog = false"></Button>
      <Button type="button" label="Save" @click="updateDynamicStd"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ScrollPanel from 'primevue/scrollpanel';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import contingencyForm from './contingencyForm.vue';
import contingencyDynamicStdForm from './contingencyDynamicStdForm.vue';
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
watch(
  () => props.standardId,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      await getContingencyList();
    }
  },
);

const contingencyList = ref([]);
const getContingencyList = async () => {
  try {
    const res = await ApiContingency.getContingencyList(props.standardId);
    contingencyList.value = res.data;
  } catch (error) {
    console.log('getcontingencyList error', error);
  }
};

// ------ contingency - CRUD
const contingencyIndexSelected = ref({});
const contingencyData = ref({});
const contingencyClick = async (index) => {
  if (contingencyIndexSelected.value !== index) {
    contingencyIndexSelected.value = index;
    await getContingencyData();
    await getDynamicStdList();
  }
};

const getContingencyData = async () => {
  try {
    const res = await ApiContingency.getContingencyById(contingencyList.value[contingencyIndexSelected.value]._id);
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
    unitType: 1,
  };
  createContingencyVisibleDialog.value = true;
};
const createContingency = async () => {
  try {
    const res = await ApiContingency.createContingency(props.standardId, newContingency.value);
    // await getContingencyList();
    contingencyList.value.push(res.data);
    contingencyIndexSelected.value = contingencyList.value.length - 1;
    contingencyData.value = res.data;
    createContingencyVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createAngleStability error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmUpdateContingency = async (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'updateDialog',
    header: 'Update Conrigency - ' + contingencyData.value.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Update',
    accept: async () => {
      await updateContingency();
    },
    reject: async () => {
      await getContingencyData();
    },
  });
};
const updateContingency = async () => {
  try {
    const res = await ApiContingency.updateContingency(contingencyData.value._id, contingencyData.value);
    // await getContingencyList();
    contingencyList.value[contingencyIndexSelected.value] = res.data;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateContingency error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};

const confirmDeleteContingency = (event, contingency, index) => {
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
      await deleteContingency(contingency._id, index);
    },
    reject: () => {},
  });
};

const deleteContingency = async (id, index) => {
  try {
    await ApiContingency.deleteContingency(id);
    // await getContingencyList();
    contingencyIndexSelected.value = undefined;
    contingencyData.value = {};
    contingencyList.value.splice(index, 1);
    dynamicStdList.value = [];
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

const typeUnitOpts = ref([
  { label: '%', value: 1 },
  { label: 'Hz', value: 2 },
]);
const getUnitLabel = (unitType) => {
  return ' ' + typeUnitOpts.value.filter((item) => item.value === unitType)[0].label;
};
// DynacmicStd

const dynamicStdList = ref([]);

const isLoadingDynamicStd = ref(false);
const pageRowNumber = ref(10);
const currentDynamicStdPage = ref(1);
const totalDynamicStdRecord = ref(0);
const paginatorOffsetDynamicStd = computed(() => pageRowNumber.value * currentDynamicStdPage.value - 1);
const onDynamicStdPageChange = async (event) => {
  currentDynamicStdPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  await getDynamicStdList();
};
const getDynamicStdList = async () => {
  try {
    const res = await ApiContingency.getDynacmicStdList(contingencyData.value._id, currentDynamicStdPage.value);
    dynamicStdList.value = res.data.items;
    totalDynamicStdRecord.value = res.data.total;
  } catch (error) {
    dynamicStdList.value = [];
    console.log('getVsaCaseList error', error);
  }
};

const newDynamicStd = ref();
const createDynamicStdVisibleDialog = ref(false);

const handleCreateDynamicStd = () => {
  newDynamicStd.value = {
    active: true,
    name: '',
    restoreTime: 5,
    lowerError: 0.1,
    upperError: 0.1,
    unitTypeError: 1,

    stableRangeLower: -1,
    stableRangeUpper: 1,
    unitTypeStable: 1,
  };
  createDynamicStdVisibleDialog.value = true;
};

const createDynamicStd = async () => {
  try {
    await ApiContingency.createDynacmicStd(contingencyData.value._id, newDynamicStd.value);
    await getDynamicStdList();
    createDynamicStdVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Create Successfully', life: 3000 });
  } catch (error) {
    console.log('createDynamicStd error', error);
    toast.add({ severity: 'error', summary: 'Create Message', detail: error.data.detail, life: 3000 });
  }
};

const editDynamicStd = ref();
const updateDynamicStdVisibleDialog = ref(false);

const confirmUpdateDynamicStd = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    group: 'updateDialog',
    header: 'Update Contigency Dynamic - ' + data.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Continue',
    accept: () => {
      handleUpdateDynamicStd(data);
    },
  });
};
const handleUpdateDynamicStd = (data) => {
  editDynamicStd.value = JSON.parse(JSON.stringify(data));
  updateDynamicStdVisibleDialog.value = true;
};
const updateDynamicStd = async () => {
  try {
    await ApiContingency.updateDynacmicStd(editDynamicStd.value._id, editDynamicStd.value);
    await getDynamicStdList();
    updateDynamicStdVisibleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Updated Successfully', life: 3000 });
  } catch (error) {
    console.log('updateVsaCase error', error);
    toast.add({ severity: 'error', summary: 'Updated Message', detail: error.data.detail, life: 3000 });
  }
};
const confirmDeleteDynamicStd = (event, dynamicStd) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Delete Dynamic Std - ' + dynamicStd.name,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      await deleteDynamicStd(dynamicStd._id);
    },
    reject: () => {},
  });
};

const deleteDynamicStd = async (id) => {
  try {
    await ApiContingency.deleteDynacmicStd(id);
    await getDynamicStdList();
    toast.add({ severity: 'success', summary: 'Deleted Successfully', life: 3000 });
  } catch (error) {
    console.log('deleteDynamicStd error', error);
  }
};
</script>

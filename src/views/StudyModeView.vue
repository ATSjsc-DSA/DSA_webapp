<template>
  <div class="h-full flex flex-column layout-content">
    <div class="card flex flex-wrap gap-5 p-fluid">
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time start </label>
        <Calendar id="calendar-24h" v-model="timeStart" showTime hourFormat="24" />
      </div>
      <div class="flex-auto">
        <label for="calendar-24h" class="font-bold block mb-2"> Date-time end </label>
        <Calendar id="calendar-24h" v-model="timeEnd" showTime hourFormat="24" @update:modelValue="updatePSMList" />
      </div>
      <div class="flex-auto">
        <label for="templatedisplay" class="font-bold block mb-2"> Power System Model </label>
        <Dropdown
          id="profile"
          v-model="psmSelect"
          :options="psmList"
          optionLabel="name"
          :placeholder="loadingPSM ? 'Loading...' : 'Select a PSM'"
          class="!w-full"
          :loading="loadingPSM"
          @update:modelValue="changePSModel"
        >
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ slotProps.option.name }} - {{ convertDateTimeToString(slotProps.option.createdTimestamp) }}</div>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="card flex-1 relative overflow-auto pt-6">
      <div class="group-block flex flex-wrap justify-content-end gap-2">
        <Button severity="secondary" text icon="pi pi-download" label="Download" @click="downloadFile()" />

        <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadTemplate" />
      </div>
      <LoadingContainer v-show="progressSpinnerModal1"></LoadingContainer>

      <Splitter class="h-full">
        <SplitterPanel
          class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
          :size="15"
          :minSize="10"
        >
          <DataView :value="listDatatree" class="w-full">
            <template #list="slotProps">
              <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                  <div
                    class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-3"
                    :class="{
                      'border-top-1 surface-border': index !== 0,
                      'selected-item': selectedItem && selectedItem.name === item.name,
                    }"
                    @click="handleRowClick(item)"
                  >
                    <div class="flex flex-row justify-content-start align-items-center gap-2 flex-1 ml-2">
                      <i class="pi pi-code text-cyan-300"></i>{{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </SplitterPanel>
        <SplitterPanel class="flex align-items-center justify-content-center relative h-full" :size="85">
          <LoadingContainer v-show="progressSpinnerModal2"></LoadingContainer>

          <div v-if="selectedItem._id" class="relative h-full w-full p-3">
            <DataTable
              v-model:editingRows="editingRows"
              :value="formattedDataTable"
              editMode="row"
              dataKey="_id"
              @row-edit-save="onRowEditSave"
              scrollable
              scrollHeight="flex"
              rowHover
              :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                  bodycell: ({ state }) => ({
                    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem',
                  }),
                },
              }"
            >
              <Column
                v-for="(header, index) in selectedItem.inputAttributes"
                :key="index"
                :field="header.engineAttributeId"
                :header="header.name"
              >
                <template #editor="{ data, field }" class="input-column">
                  <InputNumber
                    v-if="ListDataTypeHeader.includes(header.datatype)"
                    v-model="data[field]"
                    inputClass="w-full"
                    :inputStyle="{ minWidth: '8rem' }"
                    showButtons
                  />
                  <InputText v-else v-model="data[field]" class="input-column" />
                </template>
              </Column>
              <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem; color: 'greenyellow'"
                bodyStyle="text-align:center"
              ></Column>
            </DataTable>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore } from '@/store';
import chartComposable from '@/combosables/chartData';
import LoadingContainer from '@/components/LoadingContainer.vue';
import { computed, onMounted, onUnmounted } from 'vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import DSA_api from '@/api/dsa_api';
const confirm = useConfirm();
const loadingPSM = ref(false);
const { convertDateTimeToString } = chartComposable();
const visible = ref(false);
const commonStore = useCommonStore();
const { psmList } = storeToRefs(commonStore);
const psmSelect = ref();
const timeStart = ref();
const timeEnd = ref();
const listDatatree = ref([]);
const progressSpinnerModal1 = ref(false);
const progressSpinnerModal2 = ref(false);
const selectedItem = ref({});
const dataTable = ref([]);
const editingRows = ref([]);
const ListDataTypeHeader = ['integer', 'double'];
const updatePSMList = async () => {
  try {
    loadingPSM.value = true;
    await commonStore.getListPsm(timeStart.value, timeEnd.value);
    setTimeout(() => {
      loadingPSM.value = false;
    }, 1000);
  } catch (error) {}
};

onMounted(async () => {
  await commonStore.getListPsm();
});

const formattedDataTable = computed(() => {
  return dataTable.value.map((row) => {
    const data = { _id: row._id };
    selectedItem.value.inputAttributes.forEach((attribute, index) => {
      data[attribute.engineAttributeId] = row.values[index];
    });
    return data;
  });
});

// method

const changePSModel = async () => {
  try {
    progressSpinnerModal1.value = true;
    const res = await DSA_api.getElementsDefinition(psmSelect.value.elementsDefinitionId);
    listDatatree.value = res.data;
    console.log(listDatatree.value);

    setTimeout(() => {
      progressSpinnerModal1.value = false;
    }, 500);
  } catch (error) {}
};
const handleRowClick = async (item) => {
  await getElementsData(item._id);
  selectedItem.value = item;
};

//table
const onRowEditSave = (event) => {
  let { newData, index } = event;

  products.value[index] = newData;
};

const getElementsData = async (selectedItem_id) => {
  try {
    progressSpinnerModal2.value = true;
    const res = await DSA_api.getElementsData(
      psmSelect.value._id,
      selectedItem_id,
    );
    dataTable.value = res.data;
    console.log(listDatatree.value);

    setTimeout(() => {
      progressSpinnerModal2.value = false;
    }, 500);
  } catch (error) {}
};
</script>
<style scoped>
.item-data:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  background-color: var(--surface-hover);
}

.selected-item {
  background-color: var(--highlight-bg) !important;
}
.values-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; /* Khoảng cách giữa các mục danh sách */
  list-style-type: none; /* Loại bỏ dấu chấm đầu dòng của danh sách */
  padding: 0;
  margin: 0;
}

.values-list li {
  background-color: var(--surface-ground); /* Màu nền */
  padding: 0.5rem; /* Khoảng cách bên trong mục */
  border-radius: 5px; /* Bo góc */
  text-align: center; /* Căn giữa văn bản */
}
.values-list li:hover {
  cursor: pointer;
}
.values-list li.selected {
  background-color: var(--highlight-bg); /* Màu nền */
}
.indexauto {
  z-index: 100;
}
.input-column {
  min-width: 8rem;
  width: 100%;
}
.group-block {
  position: absolute;
  top: 0.2rem;
  right: 2rem;
}
</style>

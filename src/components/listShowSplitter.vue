<template>
  <div class="card h-full">
    <div class="flex flex-wrap justify-content-end gap-2">
      <Button severity="secondary" text icon="pi pi-download" label="Download Template" @click="downloadFile()" />

      <Button severity="info" text icon="pi pi-upload" label="Upload" @click="uploadTemplate" />
      <Button text icon="pi pi-plus" label="Create" @click="handleCreateDevice" />
    </div>
    <Splitter style="height: 100%">
      <SplitterPanel
        class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
        :size="20"
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
                  <div class="flex flex-row justify-content-between align-items-center gap-2 flex-1">
                    <Chip :label="item.name" image="/img/global.jpg" />
                  </div>
                  <div class="flex flex-column md:align-items-end indexauto">
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      severity="danger"
                      @click="(event) => confirmDeleteItem(event, item.name, item._id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </SplitterPanel>
      <SplitterPanel class="flex align-items-center justify-content-center" :size="80">
        <div v-if="selectedItem._id" class="h-full w-full p-3">
          <div v-if="type === 'area'" class="grid gap-4 h-full w-full">
            <div class="col h-full">
              <div class="flex justify-content-between">
                <h6>Gen List</h6>
                <div class="grid">
                  <Button
                    size="small"
                    text
                    v-tooltip.top="{ value: 'Add Gen Area' }"
                    icon="pi pi-plus"
                    aria-label="Filter"
                    class="col"
                    @click="addDataTypeOnDevice('gen')"
                  />
                  <Button
                    size="small"
                    text
                    class="col"
                    v-tooltip.top="{ value: 'Delete Gen Active' }"
                    icon="pi pi-times"
                    severity="danger"
                    aria-label="Cancel"
                    @click="confirmRemoveDataOnDevice($event, 'gen')"
                  />
                </div>
              </div>
              <ScrollPanel style="width: 100%; height: 100%" class="py-4">
                <ul class="values-list">
                  <li
                    v-for="value in selectedItem.gens_name"
                    :key="value.name"
                    :class="{ selected: value.selected }"
                    @click="
                      () => {
                        if (value.selected) {
                          value.selected = false;
                        } else {
                          value.selected = true;
                        }
                      }
                    "
                  >
                    {{ value.name }}
                  </li>
                </ul>
              </ScrollPanel>
            </div>
            <div class="col h-full">
              <div class="flex justify-content-between">
                <h6>Load List</h6>
                <div class="grid">
                  <Button
                    size="small"
                    text
                    v-tooltip.top="{ value: 'Add Load Area' }"
                    icon="pi pi-plus"
                    aria-label="Filter"
                    class="col"
                    @click="addDataTypeOnDevice('load')"
                  />
                  <Button
                    size="small"
                    text
                    class="col"
                    v-tooltip.top="{ value: 'Delete Load Active' }"
                    icon="pi pi-times"
                    severity="danger"
                    aria-label="Cancel"
                    @click="confirmRemoveDataOnDevice($event, 'load')"
                  />
                </div>
              </div>
              <ScrollPanel style="width: 100%; height: 100%" class="py-4">
                <ul class="values-list">
                  <li
                    v-for="value in selectedItem.loads_name"
                    :key="value.name"
                    :class="{ selected: value.selected }"
                    @click="
                      () => {
                        if (value.selected) {
                          value.selected = false;
                        } else {
                          value.selected = true;
                        }
                      }
                    "
                  >
                    {{ value.name }}
                  </li>
                </ul>
              </ScrollPanel>
            </div>
          </div>
          <div v-else-if="type === 'monitor'" class="col h-full">
            <div class="flex justify-content-between">
              <h6>Branch List</h6>
              <div class="grid">
                <Button
                  size="small"
                  text
                  v-tooltip.top="{ value: 'Add Gen Area' }"
                  icon="pi pi-plus"
                  aria-label="Filter"
                  class="col"
                  @click="addDataTypeOnDevice('branch')"
                />
                <Button
                  size="small"
                  text
                  class="col"
                  v-tooltip.top="{ value: 'Delete Gen Active' }"
                  icon="pi pi-times"
                  severity="danger"
                  aria-label="Cancel"
                  @click="confirmRemoveDataOnDevice($event, 'branch')"
                />
              </div>
            </div>
            <ScrollPanel style="width: 100%; height: 100%" class="py-4">
              <ul class="values-list">
                <li
                  v-for="value in selectedItem.branches_name"
                  :key="value.name"
                  :class="{ selected: value.selected }"
                  @click="
                    () => {
                      if (value.selected) {
                        value.selected = false;
                      } else {
                        value.selected = true;
                      }
                    }
                  "
                >
                  <div class="flex justify-content-around">
                    <span> {{ value.name }}</span>
                    <Tag icon="pi pi-directions" :severity="value.direction === 1 ? 'success' : 'danger'"></Tag>
                  </div>
                </li>
              </ul>
            </ScrollPanel>
          </div>
          <div v-else class="col h-full">
            <div class="flex justify-content-between">
              <h6>Equipment List</h6>
              <div class="grid">
                <Button
                  size="small"
                  text
                  v-tooltip.top="{ value: 'Add Gen Area' }"
                  icon="pi pi-plus"
                  aria-label="Filter"
                  class="col"
                  @click="addDataTypeOnDevice('')"
                />
                <Button
                  size="small"
                  text
                  class="col"
                  v-tooltip.top="{ value: 'Delete Gen Active' }"
                  icon="pi pi-times"
                  severity="danger"
                  aria-label="Cancel"
                  @click="confirmRemoveDataOnDevice($event, '')"
                />
              </div>
            </div>
            <ScrollPanel style="width: 100%; height: 100%" class="py-4">
              <ul class="values-list">
                <li
                  v-for="value in selectedItem.equips_name"
                  :key="value.name"
                  :class="{ selected: value.selected }"
                  @click="
                    () => {
                      if (value.selected) {
                        value.selected = false;
                      } else {
                        value.selected = true;
                      }
                    }
                  "
                >
                  {{ value.name }}
                </li>
              </ul>
            </ScrollPanel>
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
  <ConfirmPopup></ConfirmPopup>
  <Dialog v-model:visible="deleteVisibleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="deviceActiveNameDelete !== ''"
        >Are you sure you want to delete <b>{{ deviceActiveNameDelete }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteVisibleDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteItem()" />
    </template>
  </Dialog>
  <!-- create dialog data -->
  <Dialog v-model:visible="createVisibleDialog" :style="{ width: '30rem' }" header="Create New " :modal="true">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem"> Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="dataNameCreate" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createVisibleDialog = false"></Button>
      <Button type="button" label="Submit" @click="createDevice()"></Button>
    </div>
  </Dialog>
  <!-- add data on devie -->
  <Dialog
    v-model:visible="createDataOnDeviceDialog"
    modal
    header="Add Item"
    @hide="onHideDataOnDeviceDialog"
    :style="{ width: '25rem' }"
  >
    <div class="p-fluid mb-4">
      <div class="field">
        <label for="branch">Name</label>
        <AutoComplete
          completeOnFocus
          v-model="dataAddOnArea"
          forceSelection
          :suggestions="listEquipment"
          @complete="search"
        />
      </div>
      <div class="field" v-if="type === 'monitor'">
        <label for="Direction">Direction</label>
        <Dropdown
          id="Direction"
          v-model="dataDicAddOnMonitor"
          :options="optionsDic"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a Area"
        >
        </Dropdown>
      </div>
    </div>

    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createDataOnAreaDialog = false"></Button>
      <Button type="button" label="Submit" @click="addDataOnDevice()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import ConfirmPopup from 'primevue/confirmpopup';
import { useDSAStore } from '@/store';

import { useConfirm } from 'primevue/useconfirm';
import { watch } from 'vue';
const confirm = useConfirm();
const dsaStore = useDSAStore();
const { listEquipment } = storeToRefs(dsaStore);

const props = defineProps({
  listDatatree: {
    type: Array,
  },
  deleteVisibleDialog: Boolean,
  createVisibleDialog: Boolean,
  createDataOnDeviceDialog: Boolean,
  type: {
    type: String,
    default: 'area',
  },
});

const emits = defineEmits([
  'deleteDevice',
  'createDevice',
  'downloadFile',
  'uploadFile',
  'addDataOnDevice',
  'removeDataOnDevice',
  'onHideDataOnDeviceDialog',
  'update:deleteVisibleDialog',
  'update:createVisibleDialog',
  'update:createDataOnDeviceDialog',
]);

// define initializeData
const selectedItem = ref({
  gens_name: [],
  loads_name: [],
});

const deviceActiveNameDelete = ref();
const deviceActiveIdDelete = ref();
const dataNameCreate = ref();
const gens_name = ref([]);
const loads_name = ref([]);
const dataDicAddOnMonitor = ref(1);
const deleteVisibleDialog = computed({
  get: () => {
    return props.deleteVisibleDialog;
  },
  set: (v) => {
    emits('update:deleteVisibleDialog', v);
  },
});

const createDataOnDeviceDialog = computed({
  get: () => {
    return props.createDataOnDeviceDialog;
  },
  set: (v) => {
    emits('update:createDataOnDeviceDialog', v);
  },
});
const createVisibleDialog = computed({
  get: () => {
    return props.createVisibleDialog;
  },
  set: (v) => {
    emits('update:createVisibleDialog', v);
  },
});
const listDatatree = computed(() => props.listDatatree);
const type = computed(() => props.type);
const optionsDic = [
  {
    label: 'Forward',
    value: 1,
  },
  {
    label: 'Reverse',
    value: -1,
  },
];

///
watch(listDatatree, (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    newValue.forEach((device) => {
      if (device._id === selectedItem.value._id) {
        selectedItem.value = device;
      }
    });
  }
});
const handleRowClick = (item) => {
  selectedItem.value = item;
  gens_name.value = item.gens_name;
  loads_name.value = item.loads_name;
};

const confirmDeleteItem = (event, name, id) => {
  console.log(event, 'event');
  event.stopPropagation();
  console.log(name, 'name');
  console.log(id, 'id');

  deviceActiveNameDelete.value = name;
  deviceActiveIdDelete.value = id;

  deleteVisibleDialog.value = true;
};

const deleteItem = () => {
  emits('deleteDevice', deviceActiveIdDelete.value);
  deviceActiveNameDelete.value = '';
};

const handleCreateDevice = () => {
  dataNameCreate.value = '';
  createVisibleDialog.value = true;
};

const createDevice = () => {
  emits('createDevice', dataNameCreate.value);
};

const downloadFile = () => {
  emits('downloadFile');
};

const uploadTemplate = () => {
  emits('uploadFile');
};

const dataAddOnArea = ref('');
const typeUpdateArea = ref('gen');
const datalistOnArea = ref([]);
const addDataTypeOnDevice = (type) => {
  dataAddOnArea.value = '';
  typeUpdateArea.value = type;
  switch (type) {
    case 'gen':
      datalistOnArea.value = selectedItem.value.gens_name;

      break;
    case 'load':
      datalistOnArea.value = selectedItem.value.loads_name;
      break;

    case 'branch':
      datalistOnArea.value = selectedItem.value.branches_name;
      break;

    default:
      datalistOnArea.value = selectedItem.value.equips_name;
      break;
  }
  createDataOnDeviceDialog.value = true;
};

const addDataOnDevice = () => {
  emits(
    'addDataOnDevice',
    selectedItem.value._id,
    dataAddOnArea.value,
    typeUpdateArea.value,
    dataDicAddOnMonitor.value,
  );
  dataAddOnArea.value = '';
};

const onHideDataOnDeviceDialog = () => {
  emits('onHideDataOnDeviceDialog');
};

const confirmRemoveDataOnDevice = (event, type) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      if (type === 'gen') {
        console.log();
        const selectedName = selectedItem.value.gens_name
          .filter((item) => item.selected) // Lọc các item có selected = true
          .map((item) => item.name); // Lấy giá trị _id của các item đã lọc
        emits('removeDataOnDevice', selectedItem.value._id, selectedName, type);
      } else if (type === 'load') {
        const selectedName = selectedItem.value.loads_name
          .filter((item) => item.selected) // Lọc các item có selected = true
          .map((item) => item.name); // Lấy giá trị _id của các item đã lọc

        emits('removeDataOnDevice', selectedItem.value._id, selectedName, type);
      } else if (type === 'branch') {
        const selectedName = selectedItem.value.branches_name
          .filter((item) => item.selected) // Lọc các item có selected = true
          .map((item) => item.name); // Lấy giá trị _id của các item đã lọc

        emits('removeDataOnDevice', selectedItem.value._id, selectedName, type);
      } else {
        const selectedName = selectedItem.value.equips_name
          .filter((item) => item.selected) // Lọc các item có selected = true
          .map((item) => item.name); // Lấy giá trị _id của các item đã lọc

        emits('removeDataOnDevice', selectedItem.value._id, selectedName, type);
      }
    },
    reject: () => {},
  });
};

const search = async (event) => {
  await dsaStore.getListEquipment(event.query, typeUpdateArea.value, datalistOnArea.value);
};
</script>
<style scoped>
.item-data:hover {
  cursor: pointer;
  background-color: var(--highlight-bg);
}

.selected-item {
  background-color: var(--highlight-bg);
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
</style>

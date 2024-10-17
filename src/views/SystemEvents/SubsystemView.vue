<template>
  <div class="card h-full">
    <Splitter style="height: 100%">
      <SplitterPanel
        class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
        :size="20"
        :minSize="10"
      >
        <div class="h-full w-full p-4">
          <div class="py-4 flex justify-content-between align-items-center">
            <span class="text-xl font-semibold"> List Sub System</span>
            <Button icon="pi pi-plus" text rounded aria-label="Filter" @click="handlerCreateThis" />
          </div>
          <DataView
            :value="listSubSystem"
            class="w-full"
            style="height: 43rem; overflow-y: auto; overflow-x: hidden; margin-right: -1rem"
          >
            <template #list="slotProps">
              <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                  <div
                    class="flex flex-column sm:flex-row sm:align-items-center gap-3 item-data p-2"
                    :class="{
                      'border-top-1 surface-border': index !== 0,
                      'selected-item': selectedItem && selectedItem.name === item.name,
                    }"
                    @click="handleRowClick(item)"
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
                        @click="(event) => confirmDeleteThis(item._id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex h-full w-full align-items-center justify-content-center" :size="80">
        <TabView class="h-full w-full">
          <TabPanel header="Common">
            <div class="p-fluid p-2">
              <div class="field">
                <label for="name" class="font-semibold">Name</label>
                <InputText id="name" class="flex-auto" autocomplete="off" v-model="selectedItem.name" />
              </div>
              <div class="flex align-items-center gap-3 mb-5">
                <label for="active" class="font-semibold">Active</label>
                <InputSwitch id="active" v-model="selectedItem.active" />
              </div>
            </div>
            <div class="card flex justify-content-end">
              <Button label="Submit" @click="updateThis()" />
            </div>
          </TabPanel>
          <TabPanel header="List Power System">
            <div class="p-3">
              <filterSubSystemView :current-filter="selectedItem.filterConditions" @changeFilter="changeFilter" />
            </div>
            <div class="flex gap-6">
              <div>
                selectedItem
                <pre>
              {{ selectedItem }}
              
            </pre
                >
              </div>

              <div>
                filterData
                <pre>{{ filterData }}</pre>
              </div>
              <div>
                filterConditions
                <div v-for="(val, key) in selectedItem.filterConditions">{{ key }}: {{ val }}</div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </SplitterPanel>
    </Splitter>
    <!-- dialog   -->
    <Dialog v-model:visible="visible" modal header="Create Sub System" :style="{ width: '25rem' }">
      <div class="p-fluid">
        <div class="field">
          <label for="name" class="font-semibold">Name</label>
          <InputText id="name" class="flex-auto" autocomplete="off" v-model="formItemCreate.name" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="active" class="font-semibold">Active</label>
          <InputSwitch id="active" v-model="formItemCreate.active" />
        </div>

        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Save" @click="createThis()"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiSubsystem, commonApi } from './api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import ContingencyView from './ContingencyView.vue';
import filterSubSystemView from './filterSubSystemView.vue';
const visible = ref(false);
const toast = useToast();
const confirm = useConfirm();

onMounted(() => {
  getListSubSystem();
});

const listSubSystem = ref([]);
const getListSubSystem = async () => {
  try {
    const res = await ApiSubsystem.getListSubsystemOnlyName();
    listSubSystem.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const selectedItem = ref({});
const formItemSelect = ref({
  active: false,
  name: '',
});

const handleRowClick = async (item) => {
  try {
    const res = await ApiSubsystem.getSubsystemData(item._id);
    selectedItem.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const updateThis = async () => {
  try {
    await ApiSubsystem.updateContingenciesData(selectedItem.value._id, formItemSelect.value);
    getListSubSystem();
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Update successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const formItemCreate = ref({
  name: '',
  active: false,
});

const handlerCreateThis = () => {
  formItemCreate.value = {
    name: '',
    active: false,
  };
  visible.value = true;
};

const createThis = async () => {
  try {
    await ApiSubsystem.createSubsystem(formItemCreate.value);
    getListSubSystem();
    visible.value = false;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Create successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};

const filterData = ref([]);
const changeFilter = async (newfilter) => {
  filterData.value = newfilter;
};
</script>

<style lang="scss" scoped>
.item-data:hover {
  cursor: pointer;
  background-color: var(--surface-hover);
}

.selected-item {
  background-color: var(--highlight-bg) !important;
}
.item-button:hover {
  transform: scale(1.3);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}
</style>

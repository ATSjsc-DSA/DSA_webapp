<template>
  <SpeedDial :model="items" direction="right" type="semi-circle" :style="{ top: 'calc(50% - 2rem)', left: '2rem' }" />
  <ConfirmPopup></ConfirmPopup>
  <div class="data-table-container">
    <div class="data-column">
      <div v-for="(item, index) in listData" :key="index" class="data-row">
        <input type="checkbox" v-model="selectedGens" :value="item.name" class="p-checkbox-input" />
        <div>{{ item.name }}</div>

        <div class="flex justify-content-between gap-5 align-items-center">
          <Tag
            v-if="type === 'branch'"
            :value="item.direction"
            :severity="item.direction === 1 ? 'success' : 'danger'"
            class="values-list-direction"
          ></Tag>
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteData($event, item)" />
        </div>
      </div>
    </div>
    <Paginator :rows="30" :totalRecords="totalRecords" @page="onPageChange"></Paginator>
  </div>

  <Dialog v-model:visible="visible" modal header="Create New Data" :style="{ width: '25rem' }">
    <div class="p-fluid">
      <div class="field grid">
        <label for="username" class="col-12 mb-2 md:col-3 md:mb-0">Name</label>
        <div class="col-12 md:col-9">
          <InputText id="username" class="flex-auto" autocomplete="off" v-model="newData" />
        </div>
      </div>
      <div class="field grid" v-if="type === 'branch'">
        <label for="direction" class="col-12 mb-2 md:col-3 md:mb-0">Direction</label>
        <div class="col-12 md:col-9">
          <Dropdown
            v-model="direction"
            :options="directions"
            id="direction"
            optionLabel="name"
            optionValue="value"
            placeholder="Select a direction"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="createData"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';
import Paginator from 'primevue/paginator';
const props = defineProps({
  listData: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: '',
  },
  total: Number,
});
const confirm = useConfirm();
const currentPage = ref(1);

const visible = ref(false);
const newData = ref();
const selectedGens = ref([]);
const totalRecords = computed(() => props.total);

const type = computed(() => props.type);
const emit = defineEmits(['getData', 'createData', 'deleteData', 'deleteDatas']);
const listData = computed(() => props.listData);

const direction = ref(1);
const directions = ref([
  { name: '1', value: 1 },
  { name: '-1', value: -1 },
]);

const items = ref([
  {
    label: 'Cancel',
    icon: 'pi pi-refresh',
    command: () => {
      selectedGens.value = [];
    },
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      emit('deleteDatas', selectedGens.value, currentPage.value);
    },
  },
  {
    label: 'Add',
    icon: 'pi pi-plus',
    command: () => {
      visible.value = true;
    },
  },
  {
    label: 'All',
    icon: 'pi pi-check-circle',
    command: () => {
      selectedGens.value = listData.value.map((item) => item._id);
    },
  },
]);

const createData = () => {
  const dataLoad = {
    name: newData.value,
  };
  if (type.value === 'branch') {
    dataLoad.direction = direction.value;
  }
  emit('createData', dataLoad);
  visible.value = false;
};
const confirmDeleteData = (event, item) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this account?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      emit('deleteData', [item.name], currentPage.value);
    },
    reject: () => {},
  });
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // event.page là chỉ số trang bắt đầu từ 0
  emit('getData', currentPage.value);
};
</script>

<style scoped>
.data-table-container {
  display: flex;
  width: 100%;
  /* height: 100%; */
  /* justify-content: center;
  align-items: center; */
  flex-direction: column;
  gap: 2rem;
}
.data-column {
  padding: 0px 2rem;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 1rem;
  column-gap: 3rem;
}
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  flex-grow: 1;
  height: calc(calc(100vh - 31rem) / 10);
}
.groupButton {
  display: flex;
  gap: 3;
  top: 10rem;
  right: 4rem;
}
/* .values-list-direction {
  float: right;
} */
</style>

<script setup>
import VSA_api from '../api/vsa_api';
import { intervalTime } from '@/Constants/';
import { useCommonStore } from '@/store';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import comboChartBase from '@/components/comboChartBase.vue';

const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

// primeVue
const listDataMon = ref([]);
const monActive = ref({
  mon: '',
  VSA_max: 0,
  modificationTime: 0,
});
const listBusbar = ref([]);
const detailBusbars = ref([]);
const busbarsActive = ref([]);
const loading = ref(false); // Biến trạng thái để theo dõi quá trình tải dữ liệu
const listSubActive = ref([]);

onMounted(async () => {
  await getListArea();
  await getListBusbar();
  getDetailBusbars(busbarsActive.value);
});

const getListArea = async () => {
  try {
    const res = await VSA_api.getAreaList();
    listDataMon.value = res.data;
    monActive.value = res.data[0];
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const updateMonActive = async (value) => {
  loading.value = true;
  monActive.value = value;
  await getListBusbar();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const getListBusbar = async () => {
  try {
    const res = await VSA_api.getBusbarList(monActive.value.mon);
    listBusbar.value = res.data.sub_list;
    busbarsActive.value = [res.data.sub_active];
    listSubActive.value = [res.data.sub_active];
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const getDetailBusbars = async () => {
  try {
    const payload = [];
    listSubActive.value.forEach((element) => {
      payload.push(element.name);
    });
    const res = await VSA_api.detailBusBar(monActive.value.mon, { payload: payload });

    detailBusbars.value = res.data;
  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
  }
};

const changeListBusbar = () => {
  listSubActive.value = busbarsActive.value;
  getDetailBusbars();
};

// const interval = ref(null);

watch(psm_active, async (newValue, oldValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    setTimeout(async () => {
      await getListArea();
      await getListBusbar();
      getDetailBusbars();
    }, 1000);
  }
});
const refeshData = () => {
  getDetailBusbars(listSubActive.value);
};
</script>

<template>
  <div class="h-full grid gap-3">
    <div class="grid-container h-full">
      <div class="card flex justify-content-center vsa-container">
        <div class="flex justify-content-start mb-3 gap-2 align-items-center" style="font-size: 1.1rem">
          <i class="pi pi-list" style="color: #3ecf99; font-size: 1.1rem"> </i>
          <span>List Monitor</span>
        </div>
        <Listbox
          v-model="monActive"
          :options="listDataMon"
          optionLabel="name"
          class="w-full listbox-full-height"
          listStyle="max-height:100%"
          @update:modelValue="updateMonActive"
        >
          <template #option="slotProps">
            <div class="flex align-items-center">
              <img alt="flag" src="/img/global.jpg" width="32" style="vertical-align: middle" class="mr-2" />
              <div>{{ slotProps.option.mon }}</div>
            </div>
          </template>
        </Listbox>
      </div>
      <div class="card flex justify-content-center vsa-container">
        <div class="flex justify-content-start mb-3 gap-2 align-items-center" style="font-size: 1.1rem">
          <i class="pi pi-credit-card" style="color: #3ecf99; font-size: 1.1rem"> </i>
          <span> Monitor Active</span>
        </div>
        <div>
          <Tag :value="monActive.mon" severity="contrast" class="flex justify-content-center text-base"></Tag>
        </div>
        <hr class="dashed" />
        <div class="flex justify-content-start mb-0 mt-3 gap-2 align-items-center" style="font-size: 1.1rem">
          <i class="pi pi-tags" style="color: #3ecf99; font-size: 1.1rem"> </i>
          <span> Device Active</span>
        </div>
        <div class="flex-1 flex flex-column listSubActive">
          <ul class="custom-list">
            <li v-for="(item, index) in listSubActive" :key="item.name">{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center vsa-container">
      <div v-if="loading" class="loader-container">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
      <div class="flex justify-content-start mb-3 gap-2 align-items-center" style="font-size: 1.1rem">
        <i class="pi pi-list" style="color: #3ecf99; font-size: 1.1rem"> </i>
        <span> List Device</span>
      </div>

      <Listbox
        v-model="busbarsActive"
        :options="listBusbar"
        filter
        multiple
        optionLabel="name"
        class="w-full listbox-full-height"
        listStyle="max-height:94%"
      />
      <div class="flex justify-content-end mt-2">
        <Button type="button" label="Load" outlined @click="changeListBusbar" class="w-full" />
      </div>
    </div>
    <div class="card vsa-container col h-full">
      <div class="areaChart flex flex-column">
        <comboChartBase
          :chartData="detailBusbars"
          :modificationTime="monActive.modificationTime"
          @refeshData="refeshData"
        ></comboChartBase>
        <!-- <span class="areaNameChart">{{ monActive.mon }}</span> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.vsa-container {
  position: relative;
  // display: grid;
  // grid-template-rows: auto 1fr auto;
  flex-direction: column;
  overflow-y: hidden;

  height: 100%;
}

.listbox-full-height {
  min-width: 16rem;
  overflow-y: auto;
  height: 100%;
}
.grid-container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1rem; /* Adjust gap as needed */
}

.half-height-container {
  // overflow: auto;
  display: flex;
  // justify-content: start;
  // align-items: start;
}

.areaChart {
  height: 100%;
  width: 100%;
  position: relative;

  .areaNameChart {
    position: absolute;
    top: 0.2rem;
    left: 50%;
    border-radius: 0%;
  }
}

.loader-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  width: 80%;
  z-index: 1000;
  // background-color: black;
  opacity: 0.8;
}
.custom-list {
  list-style: none;
  padding: 0;
}

.custom-list li {
  background: #008cba;
  color: white;
  margin: 5px 0;
  padding: 10px;
  border-radius: 2px;
  font-size: small;
  padding: 0.2rem;
  transition: background 0.3s ease;
  display: flex;
  justify-content: center;
}
.listSubActive {
  overflow-y: auto;
}
</style>

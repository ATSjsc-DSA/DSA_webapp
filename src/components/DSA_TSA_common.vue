<template>
  <div class="h-full">
    <div class="grid h-1/2">
      <div class="col h-full overflow-auto">
        <SPS_common_table
          :header="'SPS-F27'"
          :dataTable="dataProfile.SPSCheck?.F27"
          @onRowEditSave="onRowEditRowF27"
          @onDeleteRow="onDeleteRowF27"
          @createNewRow="createNewRowF27"
        ></SPS_common_table>
      </div>
      <div class="col h-full overflow-auto">
        <SPS_common_table
          :header="'SPS-F81'"
          :dataTable="dataProfile.SPSCheck?.F81"
          @onRowEditSave="onRowEditRowF81"
          @onDeleteRow="onDeleteRowF81"
          @createNewRow="createNewRowF81"
        ></SPS_common_table>
      </div>
    </div>
    <div class="grid h-1/2">
      <div class="col h-full overflow-auto">
        <SPS_common_table
          :header="'SPS-Power Transfer'"
          :dataTable="dataProfile.SPSCheck?.PT"
          @onRowEditSave="onRowEditRowPT"
          @onDeleteRow="onDeleteRowPT"
          @createNewRow="createNewRowPT"
        ></SPS_common_table>
      </div>
      <div class="col h-full overflow-auto">
        <TC_common_table
          :dataTable="dataProfile.SPSCheck?.TC"
          @onRowEditSave="onRowEditRowTC"
          @onDeleteRow="onDeleteRowTC"
          @createNewRow="createNewRowTC"
        ></TC_common_table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDSAStore } from '@/store';
import SPS_common_table from './SPS_common_table.vue';
import TC_common_table from './TC_common_table.vue';
const dsaStore = useDSAStore();
const { dataProfile, listLoad } = storeToRefs(dsaStore);

const onRowEditRowF27 = (data) => {
  let { newData, index } = data;
  dataProfile.value.SPSCheck.F27[index] = newData;
};

const onDeleteRowF27 = (data) => {
  dataProfile.value.SPSCheck.F27 = dataProfile.value.SPSCheck.F27.filter((item) => item.name !== data.name);
};

const createNewRowF27 = (data) => {
  dataProfile.value.SPSCheck.F27.push(data);
};

const onRowEditRowF81 = (data) => {
  let { newData, index } = data;
  dataProfile.value.SPSCheck.F81[index] = newData;
};

const onDeleteRowF81 = (data) => {
  dataProfile.value.SPSCheck.F81 = dataProfile.value.SPSCheck.F81.filter((item) => item.name !== data.name);
};

const createNewRowF81 = (data) => {
  dataProfile.value.SPSCheck.F81.push(data);
};

const onRowEditRowPT = (data) => {
  let { newData, index } = data;
  dataProfile.value.SPSCheck.PT[index] = newData;
};

const onDeleteRowPT = (data) => {
  dataProfile.value.SPSCheck.PT = dataProfile.value.SPSCheck.PT.filter((item) => item.name !== data.name);
};

const createNewRowPT = (data) => {
  dataProfile.value.SPSCheck.TC.push(data);
};

const onRowEditRowTC = (data) => {
  let { newData, index } = data;
  dataProfile.value.SPSCheck.TC[index] = newData;
};

const onDeleteRowTC = (data) => {
  dataProfile.value.SPSCheck.TC = dataProfile.value.SPSCheck.TC.filter((item) => item.name !== data.name);
};

const createNewRowTC = (data) => {
  const dataPush = {
    name: data.name,
    detail: [
      {
        name: 'thermal',
        offline: 0,
        current: 0,
      },
      {
        name: 'pv',
        offline: 0,
        current: 0,
      },
      {
        name: 'TSAT',
        offline: 0,
        current: 0,
      },
    ],
  };
  dataProfile.value.SPSCheck.TC.push(dataPush);
};
</script>

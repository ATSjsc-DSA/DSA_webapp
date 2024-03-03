<template>
  <div class="h-full">
    <div class="application-left-side-main h-full">
      <div :class="internalPdfMode ? 'containerView' : 'containerEdit'">
        <DSA_DashboardFrame
          :data="activeDashboardData"
          :component-getter="getComponent"
          :editing="canEdit"
          :pdfMode="internalPdfMode"
          ref="dashboard"
          @change="dirkChangeFile"
        ></DSA_DashboardFrame>
      </div>
    </div>
    <div class="application-right-side-custom">
      <div
        class="control_dashboard m-50 d-flex justify-content-center align-items-center"
        :style="{ flexDirection: 'column', display: 'flex' }"
      >
        <button :variant="isChanged ? 'success' : 'secondary'" size="sm" @click="callSave" class="mr-1 mt-1">
          <i class="pi pi-fw pi-save"></i>
        </button>
        <button variant="warning" size="sm" @click="callLoad" class="mr-1 mt-1">
          <i class="pi pi-fw pi-refresh"></i>
        </button>
        <button
          type="button"
          v-if="canEdit"
          size="sm"
          :style="{ backgroundColor: '#008CBA' }"
          @click="callEdit"
          class="mr-1 mt-1 mb-2"
        >
          <i class="pi pi-fw pi-pencil btn-info"></i>
        </button>
        <button
          type="button"
          v-else
          size="sm"
          :style="{ backgroundColor: '#04AA6D' }"
          @click="callEdit"
          class="mr-1 mt-1 mb-2"
        >
          <i class="pi pi-fw pi-play"></i>
        </button>
      </div>
      <div class="color-swatch d-flex justify-content-center align-items-center" :style="{ scrollSnapType: 'x' }">
        <div
          v-for="(item, index) in componentList"
          :key="index"
          :id="item"
          class="color-swatch__color"
          :style="{
            textAlign: 'center',
            height: 'auto',
            backgroundColor: 'hsl(' + (index - 1) * 30 + ', 80%, 73%)',
          }"
          @dragstart="handleDragstart"
          draggable="true"
        >
          <div class="mt-50">
            <i v-if="item == 'MAP'" class="pi pi-fw pi-map-marker"></i>
            <div
              v-if="item == 'LINE'"
              :style="{ height: '19.5px', borderBottom: 'solid 3px Gray', marginLeft: '8px', marginRight: '8px' }"
            ></div>
            <i v-if="item == 'SSR'" class="pi pi-fw pi-chart-line"></i>
            <i v-if="item == 'SPS-27'" class="pi pi-fw pi-chart-bar"></i>
            <i v-if="item == 'SPS-81'" class="pi pi-fw pi-chart-bar"></i>
            <i v-if="item == 'SPS-PT'" class="pi pi-fw pi-chart-bar"></i>
            <i v-if="item == 'TSA'" class="pi pi-fw pi-th-large"></i>
            <i v-if="item == 'RADAR'" class="pi pi-fw pi-chart-line"></i>
            <i v-if="item == 'LOG'" class="pi pi-fw pi-history py-1"></i>
          </div>
          <div class="mb-50" :style="{ fontSize: '10px' }">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import DSA_DashboardFrame from './DSA_DashboardFrame.vue';
import useDashboardHelper from '../combosables/DSA_DashboardHelper';
const {
  defaultSetting,
  saveSettingLocalStorage,
  loadSettingLocalStorage,
  getComponent,
  handleDragstart,
  dirkChange,
  toPDF,
} = useDashboardHelper();

const props = defineProps({
  pdfMode: {
    type: Boolean,
    default: false,
  },
});
const componentList = ['RADAR', 'MAP', 'SSR', 'SPS-27', 'SPS-81', 'SPS-PT', 'TSA', 'LOG'];
const canEdit = ref(false);
const internalPdfMode = ref(props.pdfMode);
const tempDashboardData = ref({});
let activeDashboardData = ref({}); //DSA_DashboardHelper.defaultSetting
const isChanged = ref(false);

const dirkChangeFile = () => {
  dirkChange(activeDashboardData.value);
  isChanged.value = true;
};

const callSave = () => {
  saveConfigReport();
};

const callLoad = () => {
  setTempDashboardData({ data: defaultSetting });
  activeDashboardData.value = tempDashboardData.value.data;
};

const callEdit = () => {
  canEdit.value = !canEdit.value;
};

const saveConfigReport = () => {
  setTempDashboardData({ data: activeDashboardData.value });
  saveSettingLocalStorage(tempDashboardData);
  isChanged.value = false;
};
onMounted(() => {
  let saveLayoutDashboard = loadSettingLocalStorage();
  if (!saveLayoutDashboard || !saveLayoutDashboard.data) {
    setTempDashboardData({ data: defaultSetting });
  } else {
    setTempDashboardData(saveLayoutDashboard);
  }

  activeDashboardData.value = tempDashboardData.value.data;
});
onBeforeUnmount(() => {
  if (isChanged.value) {
    saveConfigReport();
  }
});

const setTempDashboardData = (pData) => {
  tempDashboardData.value = pData;
};
</script>

<style lang="scss">
.application-left-side-main {
  float: left;
  width: calc((100vw - 8rem));
}
.application-right-side-custom {
  float: right;
  width: 4rem !important;
  position: relative;
  border: 1px solid rgb(240, 241, 242);
  height: auto;
}

.containerEdit {
  margin: 0px auto;
  border: 1px solid rgb(240, 241, 242);
  height: 100%;
  // background-color: rgb(240, 241, 242);

  .dashboard__block {
    &--panel {
      margin: 5px;
    }
  }
}

.containerView {
  margin: 20px auto;
  border: 1px solid rgb(240, 241, 242);
  height: 100%;
  // background-color: rgb(255, 255, 255);

  .dashboard__block {
    &--panel {
      margin: 1px;
    }
  }
}

.container {
  margin: 20px auto;
  border: 1px solid rgb(240, 241, 242);
  height: auto;
}

.color-swatch__color {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 5px;
  cursor: move;
  color: black;
}

.dashboard__block__component {
  // background-color: rgb(255, 255, 255);
}

.ql-container {
  border-bottom: none !important;
}

.ql-toolbar {
  border-bottom: none !important;
}
</style>

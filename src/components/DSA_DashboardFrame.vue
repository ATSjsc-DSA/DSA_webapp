<script setup>
import { ref, onMounted } from 'vue';
import DSA_DashboardBlock from './DSA_DashboardBlock.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const emit = defineEmits(['change', 'changing']);
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  },
  componentGetter: {
    type: Function,
    required: true,
  },
  editing: {
    type: Boolean,
    default: false,
  },
  pdfMode: {
    type: Boolean,
    default: false,
  },
});

const state = ref('none');

const handleReadyPrintDashboard = (_Component, _readyPrint) => {
  // emit('handleReadyPrintReport', _Component, _readyPrint);
  // console.log('handleReadyPrintDashboard : ' + _Component + ' - ' + _readyPrint);
  // emit('handleReadyPrintReport', _Component, _readyPrint);
};

onMounted(async () => {
  document.addEventListener('dragstart', () => {
    if (props.editing) {
      state.value = 'dragging';
    }
  });

  document.addEventListener(
    'dragover',
    (e) => {
      e.preventDefault();
    },
    false,
  );

  document.addEventListener('drop', (e) => {
    state.value = 'none';

    try {
      const data = JSON.parse(e.dataTransfer.getData('text'));

      if (data.component) {
        e.preventDefault();
      }
    } catch (e) {}
  });
});
</script>

<template>
  <Toast></Toast>
  <div class="h-full">
    <DSA_DashboardBlock
      :class="'dashboard dashboard--editing dashboard--' + state"
      v-if="props.data.children"
      v-bind="props.data"
      :component-getter="props.componentGetter"
      :editing="props.editing"
      :pdfMode="props.pdfMode"
      @change="$emit('change')"
      @changing="$emit('changing')"
    ></DSA_DashboardBlock>
    <!-- @handleReadyPrintDashboardBlock="handleReadyPrintDashboard" -->
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  min-height: 100px;
  &:-webkit-full-screen {
    width: 100%;
    height: 100%;
    .lights-off & {
      background-color: black;
    }
  }
}
</style>

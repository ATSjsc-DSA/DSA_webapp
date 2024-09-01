<template>
  <div class="card h-full relative layout-content">
    <AppProgressSpinner :showSpinner="progressSpinnerModal"></AppProgressSpinner>
    <BreadcrumbCommon :items="items"></BreadcrumbCommon>
    <div class="card h-full">
      <Splitter style="height: 100%">
        <SplitterPanel
          class="flex flex-column h-full align-items-start justify-content-start overflow-y-auto"
          :size="15"
          :minSize="10"
        >
          <div class="p-3">
            <Tree :items="treeItems" :isCheckable="false" :hideGuideLines="false" @onSelect="onItemSelected">
              <template v-slot:item-prepend-icon="treeViewItem">
                <img src="/img/folder-1485.png" alt="folder" height="20" width="20" />
              </template>
            </Tree>
          </div>
        </SplitterPanel>
        <SplitterPanel class="flex align-items-center justify-content-center p-2 relative" :size="85">
          <Suspense>
            <template #default>
              <component :is="currentComponent" v-if="showComponents" />

              <!-- <LoadingContainer v-show="showComponents"></LoadingContainer> -->
            </template>
            <template #fallback> </template>
          </Suspense>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Tree from 'vue3-tree-vue';
import 'vue3-tree-vue/dist/style.css';
import AppProgressSpinner from '@/components/AppProgressSpinner .vue';
import BreadcrumbCommon from '@/components/BreadcrumbCommon.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import BranchMoniterView from '../BranchMoniterView.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';

const items = ref([{ label: 'Configuration', route: '/DSA/SystemEvents/Disturbances' }]);
// Dữ liệu cây thư mục
const progressSpinnerModal = ref(false);
const selectedItem = ref();
const treeItems = ref([
  {
    name: 'Project',
    expanded: false,
    children: [
      { name: 'Area' },
      { name: 'Monitor' },
      { name: 'Contingencies' },
      { name: 'Disturbances' },
      { name: 'GridCode' },
      { name: 'SPS' },
      { name: 'SSR' },
      { name: 'TSA' },
      { name: 'VSA' },
    ],
  },
]);

const showComponents = ref(false);
const currentComponent = ref();
const onItemSelected = (checkedItems) => {
  console.log(`./components/${checkedItems.name}.vue`);
  currentComponent.value = defineAsyncComponent(() => import(`./components/${checkedItems.name}.vue`));
  showComponents.value = true;
};
</script>

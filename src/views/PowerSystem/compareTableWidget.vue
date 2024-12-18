<template>
  <template v-if="dataValidMessage">
    <Message :severity="dataValidMessageSeverity" :closable="false" class="p-3">
      {{ dataValidMessage }}
    </Message>
  </template>

  <template v-else>
    <TabView>
      <TabPanel header="Power System">
        <div v-for="(dataChange, definition) in psTableData" :key="definition">
          <div class="font-semibold my-3">
            {{ definition }}
          </div>

          <div class="px-3">
            <Panel v-if="dataChange.added.length > 0" toggleable>
              <template #header>
                <div class="text-green-500">New Power System ({{ dataChange.added.length }})</div>
              </template>
              <div class="py-2">
                <compareTableAdd :data="dataChange.added" />
              </div>
            </Panel>
            <!-- Update  -->
            <Panel v-if="dataChange.modified.length > 0" toggleable class="mt-3">
              <template #header>
                <div class="text-yellow-500">Update Power System ({{ dataChange.modified.length }})</div>
              </template>
              <div class="py-2">
                <compareTableUpdate :data="dataChange.modified" />
              </div>
            </Panel>
            <!-- Delete  -->
            <Panel v-if="dataChange.removed.length > 0" toggleable class="mt-3">
              <template #header>
                <div class="text-red-500">Delete Power System ({{ dataChange.removed.length }})</div>
              </template>
              <div class="py-2">
                <compareTableDelete :data="dataChange.removed" />
              </div>
            </Panel>
          </div>
        </div>
      </TabPanel>
      <TabPanel header="EMS">
        <div v-if="Object.keys(emsTableData).length === 0" style="min-height: 30rem;" >No Change</div>
        <div v-else>
          <div v-for="(dataChange, definition) in emsTableData" :key="definition">
            <div class="font-semibold my-3">
              {{ definition }}
            </div>
            <div class="px-3">
              <Panel v-if="dataChange.added.length > 0" toggleable>
                <template #header>
                  <div class="text-green-500">New Power System ({{ dataChange.added.length }})</div>
                </template>
                <div class="py-2">
                  <compareTableAdd :data="dataChange.added" />
                </div>
              </Panel>
              <!-- Update  -->
              <Panel v-if="dataChange.modified.length > 0" toggleable class="mt-3">
                <template #header>
                  <div class="text-yellow-500">Update Power System ({{ dataChange.modified.length }})</div>
                </template>
                <div class="py-2">
                  <compareTableEmsUpdate :data="dataChange.modified" />
                </div>
              </Panel>
              <!-- Delete  -->
              <Panel v-if="dataChange.removed.length > 0" toggleable class="mt-3">
                <template #header>
                  <div class="text-red-500">Delete Power System ({{ dataChange.removed.length }})</div>
                </template>
                <div class="py-2">
                  <compareTableDelete :data="dataChange.removed" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
    <!-- Add  -->
  </template>
</template>

<script setup>
import { computed } from 'vue';
import Message from 'primevue/message';

import compareTableAdd from './compareTable/compareTableAdd.vue';
import compareTableDelete from './compareTable/compareTableDelete.vue';
import compareTableUpdate from './compareTable/compareTableUpdate.vue';
import compareTableEmsUpdate from './compareTable/compareTableEmsUpdate.vue';
// --- compare
const props = defineProps({
  disabled: { type: Boolean, default: false },
  data: { type: Object, default: () => {} },
});

const dataValidMessageSeverity = ref('warn');

const dataValidMessage = computed(() => {
  if (!props.data) {
    return undefined;
  }
  if (props.data.message) {
    return props.data.message;
  }
  if (
    Object.keys(props.data).length === 0 ||
    (Object.keys(props.data.psd_diff).length == 0 && Object.keys(props.data.ems_diff).length == 0)
  ) {
    return 'No Change';
  }
  return undefined;
});

const psTableData = computed(() => {
  if (!props.data || !props.data.psd_diff) {
    return {};
  }
  return props.data.psd_diff;
});

const emsTableData = computed(() => {
  if (!props.data || !props.data.ems_diff) {
    return {};
  }
  return props.data.ems_diff;
});
</script>

<template>
  <template v-if="dataValidMessage">
    <Message :severity="dataValidMessageSeverity" :closable="false" class="p-3">
      {{ dataValidMessage }}
    </Message>
  </template>

  <template v-else>
    <TabView>
      <TabPanel header="Power System">
        <div v-if="Object.keys(psTableData).length === 0" style="min-height: 30rem">No Change</div>
        <template v-else>
          <Accordion style="min-height: 50rem" multiple :activeIndex="[0]">
            <template v-for="(dataChange, definition) in psTableData" :key="definition">
              <AccordionTab :header="definition">
                <div class="px-3">
                  <TabView>
                    <TabPanel :disabled="dataChange.added.length === 0" :header="`New (${dataChange.added.length})`">
                      <compareTableAdd :data="dataChange.added" />
                    </TabPanel>
                    <TabPanel
                      :disabled="dataChange.modified.length === 0"
                      :header="`Modified (${dataChange.modified.length})`"
                    >
                      <compareTableUpdate :data="dataChange.modified" />
                    </TabPanel>

                    <TabPanel
                      :disabled="dataChange.removed.length === 0"
                      :header="`Removed (${dataChange.removed.length})`"
                    >
                      <compareTableDelete :data="dataChange.removed" />
                    </TabPanel>
                  </TabView>
                </div>
              </AccordionTab>
            </template>
          </Accordion>
        </template>
      </TabPanel>
      <TabPanel header="EMS">
        <div v-if="Object.keys(emsTableData).length === 0" style="min-height: 30rem">No Change</div>
        <div v-else>
          <Accordion style="min-height: 50rem" multiple :activeIndex="[0]">
            <template v-for="(dataChange, definition) in emsTableData" :key="definition">
              <AccordionTab :header="definition">
                <div class="px-3">
                  <TabView>
                    <TabPanel :disabled="dataChange.added.length === 0" :header="`New (${dataChange.added.length})`">
                      <compareTableAdd :data="dataChange.added" />
                    </TabPanel>
                    <TabPanel
                      :disabled="dataChange.modified.length === 0"
                      :header="`Modified (${dataChange.modified.length})`"
                    >
                      <compareTableEmsUpdate :data="dataChange.modified" />
                    </TabPanel>

                    <TabPanel
                      :disabled="dataChange.removed.length === 0"
                      :header="`Removed (${dataChange.removed.length})`"
                    >
                      <compareTableDelete :data="dataChange.removed" />
                    </TabPanel>
                  </TabView>
                </div>
              </AccordionTab>
            </template>
          </Accordion>
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

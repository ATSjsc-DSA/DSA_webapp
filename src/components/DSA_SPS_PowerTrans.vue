<script setup>
import { VueFlow, useVueFlow } from '@vue-flow/core';
import DropzoneBackground from '@/components/logic_Diagram/DropzoneBackground.vue';
import Sidebar from '@/components/logic_Diagram/SidebarLayoutDiagram.vue';
import useDragAndDrop from '@/combosables/useDnD.js';
import UserNode from '@/components/logic_Diagram/custom_Node.vue';
import EdgeWithButton from '@/components/logic_Diagram/EdgeWithButton.vue';
import { Controls } from '@vue-flow/controls';
import ConnectionLine from '@/components/logic_Diagram/SnappableConnectionLine.vue';

const { addEdges } = useVueFlow();

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();

const nodes = ref([]);

function onConnect(params) {
  params.type = 'button';
  addEdges([params]);
}
const dark = ref(false);
const bgColor = computed(() => (dark.value ? '#1a1a1a' : '#e7f3ff'));
</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow :nodes="nodes" :class="{ dark }" @dragover="onDragOver" @dragleave="onDragLeave" @connect="onConnect">
      <template #node-OR_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #node-AND_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #node-NAND_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #node-NOR_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #node-NOT_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #node-XOR_gate="data">
        <UserNode v-bind="data" />
      </template>
      <template #edge-button="buttonEdgeProps">
        <EdgeWithButton
          :id="buttonEdgeProps.id"
          :source-x="buttonEdgeProps.sourceX"
          :source-y="buttonEdgeProps.sourceY"
          :target-x="buttonEdgeProps.targetX"
          :target-y="buttonEdgeProps.targetY"
          :source-position="buttonEdgeProps.sourcePosition"
          :target-position="buttonEdgeProps.targetPosition"
          :marker-end="buttonEdgeProps.markerEnd"
          :style="buttonEdgeProps.style"
        />
      </template>
      <template #connection-line="{ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }">
        <ConnectionLine
          :source-x="sourceX"
          :source-y="sourceY"
          :target-x="targetX"
          :target-y="targetY"
          :source-position="sourcePosition"
          :target-position="targetPosition"
        />
      </template>
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? bgColor : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      />
      <Controls />
    </VueFlow>

    <Sidebar class="h-full" />
  </div>
</template>
<style scoped>
.dndflow {
  flex-direction: row;
  display: flex;
  height: calc(100vh - 25rem);
  width: 100%;
  border: 1px solid var(--surface-border);
}
.dndflow aside {
  color: var(--text-color);
  font-weight: 700;
  padding: 1rem;
  font-size: 12px;
  background: var(--surface-overlay);
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 10px #0000004d;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--surface-border);
}

.dndflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}
@media screen and (min-width: 640px) {
  .dndflow {
    flex-direction: row;
  }
  .dndflow aside {
    /* min-width: 20%; */
  }
}
@media screen and (max-width: 639px) {
  .dndflow aside .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
}

.dark {
  background: #000000;
  color: #fffffb;
}
</style>

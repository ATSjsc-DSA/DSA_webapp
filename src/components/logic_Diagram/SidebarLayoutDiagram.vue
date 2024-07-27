<script setup>
import useDragAndDrop from '@/combosables/useDnD.js';
const { onDragStart } = useDragAndDrop();

import svgLoader from '@/components/common/svgLoader.vue';
</script>

<template>
  <aside>
    <div class="description">Drag these nodes to the pane.</div>

    <div class="nodes">
      <!-- <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div>

      <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'default')">
        Default Node
      </div>

      <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div> -->
      <!-- <ORNode @dragstart="onDragStart($event, 'custom')"></ORNode> -->
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'OR_gate')">
        <svgLoader name="OR_gate"> </svgLoader>
      </div>
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'AND_gate')">
        <svgLoader name="AND_gate"> </svgLoader>
      </div>
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'NOT_gate')">
        <svgLoader name="NOT_gate"> </svgLoader>
      </div>
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'NOR_gate')">
        <svgLoader name="NOR_gate"> </svgLoader>
      </div>
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'NAND_gate')">
        <svgLoader name="NAND_gate"> </svgLoader>
      </div>
      <div class="vue-flow__node-custom" :draggable="true" @dragstart="onDragStart($event, 'XOR_gate')">
        <svgLoader name="XOR_gate"> </svgLoader>
      </div>

      <!-- <div
        class="vue-flow__node-output"
        :draggable="true"
        @dragstart="onDragStart($event, 'custom')"
      >
        ABC Node
      </div> -->
    </div>
  </aside>
</template>
<style scope>
.vue-flow__node-custom {
  background-color: #4ccba1;
  /* padding: 10px; */
  /* border-radius: 3px; */
  width: 150px;
  font-size: 10px;
  text-align: center;
  /* border-width: 1px; */
  border: none;
  border-style: solid;
  color: var(--vf-node-text);
  scale: 0.7;
}
.nodes {
  cursor: grab;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.description {
  margin-bottom: 10px;
  font-weight: 500;
  white-space: nowrap;
}
</style>

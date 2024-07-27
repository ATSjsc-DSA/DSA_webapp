<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
});

const { removeEdges } = useVueFlow();

const path = computed(() => getBezierPath(props));
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />

  <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      class="nodrag nopan"
    >
      <div class="edgebutton" @click="removeEdges(id)">X</div>
    </div>
  </EdgeLabelRenderer>
</template>
<style scoped>
.edgebutton {
  /* border-radius: 999px; */
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  background-color: var(--text-color-secondary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--surface-overlay);
}
.edgebutton:hover {
  transform: scale(1.1);
  transition: all ease 0.5s;

  box-shadow:
    0 0 0 2px #10b98180,
    0 0 0 2px #10b981;
}
</style>

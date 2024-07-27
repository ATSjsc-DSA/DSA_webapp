<script setup>
import { Handle, Position, useVueFlow } from '@vue-flow/core';
// import { Handle, useHandleConnections, useNodesData } from "@vue-flow/core";
// import svgOR from "../assets/orGate.svg"; // Đảm bảo thay đổi đường dẫn tệp SVG tùy theo vị trí của nó trong dự án của bạn
import svgLoader from '@/components/common/svgLoader.vue';
import { NodeToolbar } from '@vue-flow/node-toolbar';

// props were passed from the slot using `v-bind="customNodeProps"`
// const props = defineProps(["label"]);
const props = defineProps(['label', 'type', 'data', 'id']);
const { removeNodes } = useVueFlow();
const typeGate = computed(() => props.type);
const OR_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.6rem',
  },
  {
    id: 'a',
    type: 'source',
    position: Position.Left,
    style: 'top: 1.89rem',
  },
  {
    id: 'b',
    type: 'source',
    position: Position.Left,
    style: 'top: 3.35rem',
  },
  {
    id: 'c',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.85rem; top: 2.65rem',
  },
  {
    id: 'd',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.35rem; top: 1.2rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.35rem; top: 4.1rem',
  },
];

const AND_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.65rem',
  },
  {
    id: 'a',
    type: 'source',
    position: Position.Left,
    style: 'top: 1.9rem',
  },
  {
    id: 'b',
    type: 'source',
    position: Position.Left,
    style: 'top: 3.4rem',
  },
  {
    id: 'c',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.7rem; top: 2.66rem',
  },
  {
    id: 'd',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.7rem; top: 1.2rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.7rem; top: 4.2rem',
  },
];

const NOT_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.82rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'top: 2.82rem',
  },
];

const NOR_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.2rem',
  },
  {
    id: 'a',
    type: 'source',
    position: Position.Left,
    style: 'top: 1.5rem',
  },
  {
    id: 'b',
    type: 'source',
    position: Position.Left,
    style: 'top: 3rem',
  },
  {
    id: 'c',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.9rem; top: 2.2rem',
  },
  {
    id: 'd',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.4rem; top: 0.7rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.4rem; top: 3.7rem',
  },
];
const NAND_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.2rem',
  },
  {
    id: 'a',
    type: 'source',
    position: Position.Left,
    style: 'top: 1.5rem',
  },
  {
    id: 'b',
    type: 'source',
    position: Position.Left,
    style: 'top: 3rem',
  },
  {
    id: 'c',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.85rem; top: 2.2rem',
  },
  {
    id: 'd',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.85rem; top: 0.8rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.85rem; top: 3.6rem',
  },
];
const XOR_gate_handles = [
  {
    id: 'x',
    type: 'target',
    position: Position.Right,
    style: 'top: 2.2rem; right: 1.4rem',
  },
  {
    id: 'a',
    type: 'source',
    position: Position.Left,
    style: 'top: 1.5rem',
  },
  {
    id: 'b',
    type: 'source',
    position: Position.Left,
    style: 'top: 3rem',
  },
  {
    id: 'c',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.85rem; top: 2.2rem',
  },
  {
    id: 'd',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.35rem; top: 0.7rem',
  },
  {
    id: 'e',
    type: 'source',
    position: Position.Left,
    style: 'left: 1.35rem; top: 3.7rem',
  },
];
const getHandles = (gateType) => {
  switch (gateType) {
    case 'OR_gate':
      return OR_gate_handles;
    case 'AND_gate':
      return AND_gate_handles;
    case 'NOT_gate':
      return NOT_gate_handles;
    case 'NOR_gate':
      return NOR_gate_handles;
    case 'NAND_gate':
      return NAND_gate_handles;
    default:
      return XOR_gate_handles;
  }
};
</script>

<template>
  <div class="custom-gate">
    <NodeToolbar
      style="display: flex; gap: 0.5rem; align-items: center"
      :is-visible="data.toolbarVisible"
      :position="data.toolbarPosition"
    >
      <div class="custom-gate__button" @click="removeNodes(id)">×</div>
    </NodeToolbar>
    <svgLoader :name="props.type"> </svgLoader>
    <div v-for="handle in getHandles(typeGate)" :key="handle.id">
      <Handle
        :id="handle.id"
        :type="handle.type"
        :position="handle.position"
        class="node__style"
        :style="handle.style"
      />
    </div>
  </div>
</template>

<style scoped>

.node__style {
  width: 3px;
  height: 3px;
  border: none;
  min-width: 4px;
  min-height: 4px;
}

.custom-gate {
  position: relative;
  /* background-color: #000000; */
  /* background-color: transparent; */
}

.custom-gate__button {
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
.custom-gate__button:hover {
  transform: scale(1.1);
  transition: all ease 0.5s;

  box-shadow:
    0 0 0 2px #10b98180,
    0 0 0 2px #10b981;
}
</style>

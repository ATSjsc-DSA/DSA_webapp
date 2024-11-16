<template>
  <ConfirmDialog group="updateDialog">
    <template #message="slotProps">
      <div class="flex align-items-center w-full gap-3 border-bottom-1 surface-border">
        <div>
          <i :class="slotProps.message.icon" class="text-6xl" style="color: #fb923c"></i>
        </div>
        <div class="flex flex-column gap-3 p-3">
          <div class="font-semibold">{{ message }}</div>
          <div class="text-orange-500 font-semibold">
            Are you sure you want to <b>{{ action }}</b
            >?
          </div>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import ConfirmDialog from 'primevue/confirmdialog';

const props = defineProps({
  message: {
    type: String,
    default: 'This Action will affect the final calculation result.',
  },
  action: {
    type: String,
    default: 'Update',
  },
});
</script>

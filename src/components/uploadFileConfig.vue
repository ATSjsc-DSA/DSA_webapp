<template>
  <div class="card">
    <FileUpload name="gen" :multiple="true" :maxFileSize="1000000">
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
          <div class="flex gap-2">
            <Button @click="chooseCallback()" icon="pi pi-file" rounded outlined></Button>
            <Button
              @click="uploadEvent(uploadCallback, files)"
              icon="pi pi-cloud-upload"
              rounded
              outlined
              severity="success"
              :disabled="!files || files.length === 0"
            ></Button>
            <Button
              @click="clearCallback()"
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              :disabled="!files || files.length === 0"
            ></Button>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex align-items-center justify-content-center flex-column">
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-2xl text-200 border-200" />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
const emit = defineEmits(['uploadFile']);

const uploadEvent = async (callback, files) => {
  const formData = new FormData();
  formData.append('file', files[0]);
  emit('uploadFile', formData, callback);
};
</script>

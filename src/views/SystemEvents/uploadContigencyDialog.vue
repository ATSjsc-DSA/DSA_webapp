<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="card">
    <FileUpload name="gen" accept=".xlsx, .xls, .csv">
      <template #header="{ chooseCallback, clearCallback, files }">
        <div class="w-full flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
          <div class="font-semibold text-lg">Dependency file</div>
          <div>
            <Button
              :disabled="files.length > 0"
              icon="pi pi-cloud-upload"
              title="Choose File"
              @click="chooseCallback"
            ></Button>
            <Button
              :disabled="files.length == 0"
              icon="pi pi pi-times"
              title="Clear File"
              severity="danger"
              class="ml-3"
              @click="clearCallback()"
            ></Button>
          </div>
        </div>
      </template>
      <template #content="{ removeFileCallback, uploadCallback, files }">
        <div v-if="files.length > 0">
          <div class="flex flex-wrap p-0 sm:p-1 gap-5">
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="card m-0 flex border-1 surface-border align-items-center gap-3 w-full"
            >
              <i class="pi pi-file-excel" style="font-size: 2rem"></i>
              <span class="font-semibold flex-grow-1">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Button
                icon="pi pi-times"
                rounded
                text
                severity="danger"
                class="w-4rem"
                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
              />
            </div>
          </div>
        </div>
        <div v-else class="flex align-items-center justify-content-center flex-column">
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-2xl text-200 border-200" />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>

        <div class="mt-6 flex flex-wrap justify-content-end align-items-center flex-1 gap-2">
          <Button
            icon="pi pi-cloud-upload"
            label="Upload"
            severity="success"
            :disabled="!files || files.length === 0"
            @click="uploadEvent(uploadCallback, files)"
          ></Button>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import { usePrimeVue } from 'primevue/config';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';

const emit = defineEmits(['uploadFile']);
const confirm = useConfirm();

const $primevue = usePrimeVue();
const totalSize = ref(0);
const totalSizePercent = ref(0);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
const uploadEvent = async (callback, files) => {
  confirm.require({
    message: 'All data will be replaced. Do you want to continue?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Continue',
    accept: () => {
      const formData = new FormData();
      formData.append('file', files[0]);
      totalSizePercent.value = totalSize.value / 10;
      emit('uploadFile', formData, callback);
    },
    reject: () => {
      console.log('abc');

      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};
</script>

<template>
  <div class="card">
    <FileUpload name="gen" :multiple="multipleFile" :fileLimit="fileLimit" accept=".xlsx, .xls, .csv">
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
          <div class="flex gap-2">
            <Button
              @click="chooseCallback()"
              icon="pi pi-file"
              rounded
              outlined
              :disabled="files.length === fileLimit"
            ></Button>
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

      <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
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
                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                rounded
                text
                severity="danger"
                class="w-4rem"
              />
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completed</h5>
          <div class="flex flex-wrap p-0 sm:p-5 gap-5">
            <div
              v-for="(file, index) of uploadedFiles"
              :key="file.name + file.type + file.size"
              class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
            >
              <div>
                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
              </div>
              <span class="font-semibold">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Completed" class="mt-3" severity="success" />
              <Button
                icon="pi pi-times"
                @click="removeUploadedFileCallback(index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
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
import { usePrimeVue } from 'primevue/config';

const props = defineProps({
  multipleFile: {
    type: Boolean,
    default: false,
  },
  fileLimit: {
    type: Number,
    default: 1,
  },
});
const multipleFile = computed(() => props.multipleFile);
const fileLimit = computed(() => props.fileLimit);
console.log(multipleFile.value, 'multipleFile');

const emit = defineEmits(['uploadFile']);

const $primevue = usePrimeVue();
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};
const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
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
  const formData = new FormData();
  if (multipleFile.value) {
    console.log(files, 'files');
    files.forEach((file) => {
      if (file.type === 'text/csv') {
        formData.append('file_gen', file);
      } else {
        formData.append('file_ems', file);
      }
    });
  } else {
    formData.append('file', files[0]);
    totalSizePercent.value = totalSize.value / 10;
  }
  emit('uploadFile', formData, callback);
};
</script>

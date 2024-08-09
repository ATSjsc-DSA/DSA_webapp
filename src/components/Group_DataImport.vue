<template>
  <div class="card h-full w-full flex flex-column gap-4">
    <div>
      <Dropdown
        v-model="selectedTeamplate"
        :options="teamplates"
        optionLabel="name"
        placeholder="Select a template"
        class="w-full"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <chip>{{ slotProps.value.name }}</chip>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <chip>{{ slotProps.option.name }}</chip>
          </div>
        </template>
      </Dropdown>
    </div>
    <FileUpload
      name="ems"
      @upload="onTemplatedUpload($event)"
      :maxFileSize="1000000"
      :fileLimit="1"
      @select="onSelectedFiles"
      invalidFileLimitMessage="Maximum number of files to be uploaded is 1"
      class="h-1rem"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
          <div class="flex gap-2">
            <Button
              @click="chooseCallback()"
              icon="pi pi-file"
              rounded
              outlined
              :disabled="!selectedTeamplate || selectedTeamplate === ''"
            ></Button>
            <Button
              @click="uploadEvent(uploadCallback)"
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
          <ProgressBar
            :value="totalSizePercent"
            :showValue="false"
            :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
            ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
          >
        </div>
      </template>

      <template #empty>
        <div class="flex align-items-center justify-content-center flex-column">
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </FileUpload>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const $primevue = usePrimeVue();
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const selectedTeamplate = ref();
const teamplates = ref([
  { name: 'EMS', code: 'EMS' },
  { name: 'PSSE', code: 'PSSE' },
  { name: 'ATS', code: 'ATS' },
]);
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

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
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
</script>

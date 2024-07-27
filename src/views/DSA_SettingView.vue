<template>
  <div class="h-full relative p-3 layout-content">
    <div class="grid gap-2">
      <Panel header="Manager Setting" class="col">
        <Fieldset legend="Database">
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-8">
              <label for="M_Add">Address</label>
              <InputText id="M_Add" type="text" v-model="dataSettingDSA.manager.address" />
            </div>
            <div class="field col-12 md:col-4">
              <label for="M_Port">Port</label>
              <InputNumber id="M_Port" v-model="dataSettingDSA.manager.port" inputId="integeronly" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="M_User">User</label>
              <InputText id="M_User" type="text" v-model="dataSettingDSA.manager.username" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="M_Pass">Pass</label>
              <InputText id="M_Pass" type="text" v-model="dataSettingDSA.manager.password" />
            </div>
            <div class="flex col-12 md:col-4 gap-4 justify-content-start my-3">
              <label>SE Validate</label>
              <div>
                <InputSwitch v-model="dataSettingDSA.manager.se_validate" />
              </div>
            </div>
            <div class="flex col-12 md:col-4 gap-4 justify-content-start my-3">
              <label>LF Validate</label>
              <div>
                <InputSwitch v-model="dataSettingDSA.manager.lf_validate" />
              </div>
            </div>
            <div class="flex col-12 md:col-4 gap-4 justify-content-start my-3">
              <label>PSM Upgrade</label>
              <div>
                <InputSwitch v-model="dataSettingDSA.manager.psm_upgrade" />
              </div>
            </div>
          </div>
        </Fieldset>
        <Fieldset legend=" Command">
          <div class="flex col-12 md:col-6 gap-4 justify-content-start my-3">
            <label for="M_Port">Automation Command</label>
            <div>
              <InputSwitch v-model="dataSettingDSA.manager.automation" />
            </div>
          </div>
          <div class="flex flex-wrap justify-content-center gap-3" v-if="!dataSettingDSA.manager.automation">
            <div class="flex align-items-center">
              <Checkbox v-model="dataSettingDSA.manager.customize" inputId="ingredient1" name="pizza" value="vsa" />
              <label for="ingredient1" class="ml-2"> VSA </label>
            </div>
            <div class="flex align-items-center">
              <Checkbox v-model="dataSettingDSA.manager.customize" inputId="ingredient2" name="pizza" value="ssr" />
              <label for="ingredient2" class="ml-2"> SSR </label>
            </div>
            <div class="flex align-items-center">
              <Checkbox v-model="dataSettingDSA.manager.customize" inputId="ingredient3" name="pizza" value="tsa" />
              <label for="ingredient3" class="ml-2"> TSA </label>
            </div>
          </div>
        </Fieldset>
      </Panel>
      <Panel header="Engineer Setting" class="col">
        <Fieldset legend="Database">
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-8">
              <label for="M_Add">Address</label>
              <InputText id="M_Add" type="text" v-model="dataSettingDSA.engineer.address" />
            </div>
            <div class="field col-12 md:col-4">
              <label for="M_Port">Port</label>
              <InputNumber id="M_Port" inputId="integeronly" v-model="dataSettingDSA.engineer.port" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="M_Add">User</label>
              <InputText id="M_Add" type="text" v-model="dataSettingDSA.engineer.username" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="M_Port">Pass</label>
              <InputText id="M_Add" type="text" v-model="dataSettingDSA.engineer.password" />
            </div>
          </div>
        </Fieldset>
        <Fieldset legend="Engineer">
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-8">
              <label for="M_Add">PF Path</label>
              <InputText id="M_Add" type="text" v-model="dataSettingDSA.engineer.pf_path" />
            </div>
            <div class="field col-12 md:col-4">
              <label for="M_Port">Time-out</label>
              <InputNumber id="M_Port" inputId="integeronly" v-model="dataSettingDSA.engineer.timeout" />
            </div>
          </div>
        </Fieldset>
      </Panel>
    </div>
    <div class="flex justify-content-center align-items-center p-5">
      <Button label="Submit" outlined rounded @click="updateSettingDSA()" />
    </div>
  </div>
  <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="p-text-secondary block mb-5">Update your information.</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="visible = false"></Button>
    </div>
  </Dialog>
  <Toast />
</template>

<script setup>
import DSA_api from '@/api/dsa_api';
import { onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const visible = ref(false);

const dataSettingDSA = ref({
  manager: {
    address: '192.168.1.1',
    automation: true,
    customize: ['tsa', 'ssr'],
    lf_validate: false,
    password: 'password',
    port: 8080,
    psm_upgrade: true,
    se_validate: true,
    username: 'admin',
  },
  engineer: {
    address: '192.168.1.1',
    password: 'password',
    pf_path: './abc',
    port: 8080,
    timeout: 1000,
    username: 'admin',
  },
});

onMounted(async () => {
  await getSettingDSA();
});

const getSettingDSA = async () => {
  try {
    const res = await DSA_api.getDSASetting();
    dataSettingDSA.value = res.data;
  } catch (error) {}
};

const updateSettingDSA = async () => {
  try {
    const res = await DSA_api.UpdateDSASetting(dataSettingDSA.value);
    dataSettingDSA.value = res.data;
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'update setting successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.data.detail, life: 3000 });
  }
};
</script>

<style lang="scss" scoped></style>

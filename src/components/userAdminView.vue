<template>
  <div class="grid gap-4 mt-0">
    <Toast />
    <div class="col p-0">
      <div class="grid card m-0 relative parent">
        <div class="child diagonal-top-left"></div>
        <div class="child diagonal-bottom-right grid">
          <div class="col-7"></div>
          <div class="col-5 flex justify-content-center align-items-center gap-4">
            <Avatar image="/img/admin.png" class="mr-2" size="xlarge" shape="circle" />

            <h1 class="text-5xl md:text-3xl lg:text-4xl mt-4 place-self-center">
              Hello, <br />
              <b>{{ user }}</b
              >!
            </h1>
          </div>
        </div>
      </div>
      <div class="card mt-4">
        <div class="p-fluid">
          <h5>Create new user</h5>
          <div class="field grid mt-5">
            <label for="username" class="col-12 mb-2 md:col-2 md:mb-0">Username</label>
            <div class="col-12 md:col-10">
              <InputText id="username" type="text" v-model="userFormCreate.username" />
            </div>
          </div>
          <div class="field grid">
            <label for="role" class="col-12 mb-2 md:col-2 md:mb-0">Role</label>
            <div class="col-12 md:col-10">
              <Dropdown
                id="role"
                v-model="userFormCreate.role"
                :options="roles"
                optionLabel="name"
                optionValue="code"
                placeholder="Select a Role"
                class="w-full"
              />
            </div>
          </div>
          <div class="field grid">
            <label for="password" class="col-12 mb-2 md:col-2 md:mb-0">Password</label>
            <div class="col-12 md:col-10">
              <Password id="password" v-model="userFormCreate.password" toggleMask>
                <template #header>
                  <h6>Pick a password</h6>
                </template>
                <template #footer>
                  <Divider />
                  <p class="mt-2">Suggestions</p>
                  <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                  </ul>
                </template>
              </Password>
            </div>
          </div>
          <div class="field grid">
            <label for="re-password" class="col-12 mb-2 md:col-2 md:mb-0">Re-Password</label>
            <div class="col-12 md:col-10">
              <Password
                id="re-password"
                v-model="userFormCreate.re_password"
                :feedback="false"
                toggleMask
                v-on:keyup.enter="addNewUser"
                :class="{ 'p-invalid': userFormCreate.re_password !== userFormCreate.password }"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-content-end">
          <Button label="Submit" @click="addNewUser" />
        </div>
      </div>
    </div>
    <div class="col p-0">
      <div class="card">
        <DataTable :value="list_user" sortMode="multiple" tableStyle="min-width: 50rem">
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
              <span class="text-xl text-900 font-bold">List User</span>
              <!-- <Button icon="pi pi-refresh" rounded raised /> -->
            </div>
          </template>
          <Column field="username" header="User" sortable style="width: 45%"></Column>
          <Column field="role" header="Role" sortable style="width: 40%"></Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-3" @click="editUser(slotProps.data)" />

              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteData($event, slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Header"
    :style="{ width: '23vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <Avatar v-if="userForm.role === 'admin'" image="/img/admin.png" shape="circle" />
        <Avatar v-else image="/img/operator.jpg" shape="circle" />

        <span class="font-bold white-space-nowrap">{{ userForm.username }}</span>
      </div>
    </template>
    <span class="p-text-secondary block mb-5">Update {{ userForm.username }}'s information.</span>

    <div class="flex align-items-center gap-3 mb-2">
      <label for="password" class="font-semibold w-7rem">Password</label>
      <Password id="password" v-model="userForm.password" toggleMask class="flex-auto">
        <template #header>
          <h6>Pick a password</h6>
        </template>
        <template #footer>
          <Divider />
          <p class="mt-2">Suggestions</p>
          <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
            <li>At least one lowercase</li>
            <li>At least one uppercase</li>
            <li>At least one numeric</li>
            <li>Minimum 8 characters</li>
          </ul>
        </template>
      </Password>
    </div>
    <div class="flex align-items-center gap-3 mb-2">
      <label for="re-password" class="font-semibold w-7rem">Re-Password</label>
      <Password
        id="re-password"
        v-model="userForm.re_password"
        :feedback="false"
        toggleMask
        v-on:keyup.enter="addNewUser"
        class="flex-auto"
        :class="{ 'p-invalid': userForm.re_password !== userForm.password }"
      />
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
      <Button
        label="Save"
        outlined
        severity="success"
        @click="updateInfo"
        autofocus
        :disabled="userForm.re_password !== userForm.password"
      />
    </template>
  </Dialog>
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup>
import user_api from '@/api/user';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmPopup from 'primevue/confirmpopup';

import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();

const value = ref(null);
const user = ref(localStorage.getItem('user'));
const roleActive = ref(localStorage.getItem('role'));

const role = ref();
const roles = ref([
  { name: 'Admin', code: 'admin' },
  { name: 'Operator', code: 'operator' },
]);

const list_user = ref([]);
const getListUser = async () => {
  try {
    const res = await user_api.getUsers();
    list_user.value = res.data;
  } catch (error) {}
};
const userFormBase = {
  _id: '',
  username: '',
  role: 'operator',
};
const userForm = ref(userFormBase);

const userFormCreate = ref({});

const addNewUser = async () => {
  if (userFormCreate.value.password !== userFormCreate.value.re_password) {
    return false;
  } else {
    try {
      const dataLoad = {
        password: userFormCreate.value.password,
        username: userFormCreate.value.username,
        role: userFormCreate.value.role,
      };
      const res = await user_api.addUsers(dataLoad);
      list_user.value.push(res.data);
      userFormCreate.value = {};
      toast.add({ severity: 'success', summary: 'Success Message', detail: 'Add new user success', life: 3000 });
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error add user', life: 3000 });
    }
  }
};

const visible = ref(false);
const editUser = (data) => {
  userForm.value = data;
  visible.value = true;
};
const updateInfo = async () => {
  if (userForm.value.password !== userForm.value.re_password) {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Password incorrect', life: 3000 });
  } else {
    try {
      const res = await user_api.updateUser(userForm.value.id, { password: userForm.value.password });
      visible.value = false;
      toast.add({ severity: 'success', summary: 'Success Message', detail: res.detail, life: 3000 });
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error edit user', life: 3000 });
    }
  }
};

const confirmDeleteData = (event, dataCell) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this account?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      onDeleteRow(dataCell);
    },
    reject: () => {},
  });
};
const onDeleteRow = async (data) => {
  try {
    const res = await user_api.deleteUser(data.id);
    list_user.value = list_user.value.filter((item) => item.id !== data.id);

    toast.add({ severity: 'success', summary: 'Success Message', detail: res.detail, life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error delete user', life: 3000 });
  }
};
onMounted(() => {
  getListUser();
});
</script>

<style lang="scss" scoped>
.p3 {
  font-family: Arial, Helvetica, sans-serif;
}

.verified {
  border-color: #19723a;
  background-color: #19723a;
}
.parent {
  min-height: 27rem;
}
.child {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden; /* Ẩn nội dung vượt ra khỏi khối con */
}

.diagonal-top-left {
  top: 0;
  right: 0;
  clip-path: polygon(0 0, 60% 0%, 40% 100%, 0% 100%);
  background-color: blue; /* Màu sắc của tam giác 1 */
  object-fit: cover;
  background: linear-gradient(rgb(72, 0, 72, 0.7), rgb(192, 72, 72, 0.6)), url('/img/operator_back.jpg');
  background-repeat: no-repeat;
  background-position: bottom center;
}

.diagonal-bottom-right {
  top: 0;
  right: 0;
  clip-path: polygon(60% 0%, 100% 0, 100% 100%, 40% 100%);
  z-index: 10;
}
</style>

<!-- 
<div class="col">
          <Avatar image="/img/admin.png" class="mr-2" size="xlarge" shape="circle" />

          <h1 class="text-5xl md:text-3xl lg:text-4xl mt-4 place-self-center">
            Hello, <br />
            <b>{{ user }}</b
            >!
          </h1>
        </div>
        <div class="border-1 border-round-3xl col m-8 flex justify-content-center verified">
          <i class="pi pi-check-circle" style="font-size: 1rem; color: white">
            &nbsp;<span class="p3">Verified</span></i
          >
        </div> -->

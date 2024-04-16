<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Toast />

    <div class="card grid mt-0 p-0">
      <div class="img col"></div>
      <div class="py-4 px-8 col">
        <div class="p-fluid flex-column flex h-full">
          <div>
            <div class="inline-flex align-items-center justify-content-center gap-2 text-2xl">
              <Avatar v-if="userForm.role === 'admin'" image="/app/admin.png" shape="circle" />
              <Avatar v-else image="/app/operator.jpg" shape="circle" />

              <span class="font-bold white-space-nowrap">{{ user }}</span>
            </div>
            <span class="p-text-secondary block mb-5 mt-3">Update {{ user }}'s information.</span>
          </div>
          <div class="flex-1 flex flex-column justify-content-center">
            <div class="mb-3">
              <label for="password" class="font-semibold">Password</label>
              <Password id="password" v-model="password" toggleMask class="mt-3">
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
            <div class="mb-3">
              <label for="re-password" class="font-semibold">Re-Password</label>
              <Password
                id="re-password"
                v-model="rePassword"
                :feedback="false"
                toggleMask
                v-on:keyup.enter="changePassword"
                class="mt-3"
                :class="{ 'p-invalid': rePassword !== password }"
              />
            </div>
            <div class="flex justify-content-end mt-4">
              <Button label="Submit" @click="changePassword" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import user_api from '@/api/user';
import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const user = ref(localStorage.getItem('user'));
const password = ref('');
const rePassword = ref('');

const userForm = ref({});

const changePassword = async () => {
  if (password.value !== rePassword.value) {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Password incorrect', life: 3000 });
  } else {
    try {
      const res = await user_api.updateOperatorPassword(password.value);
      toast.add({ severity: 'success', summary: 'Success Message', detail: res.detail, life: 3000 });
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error Message', detail: 'Error edit user', life: 3000 });
    }
  }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.p3 {
  font-family: Arial, Helvetica, sans-serif;
}

.verified {
  border-color: #19723a;
  background-color: #19723a;
}
.img {
  // width: 100%;
  padding: 0px;
  min-width: 35rem;
  min-height: 35rem;
  // width: 100%;
  object-fit: cover;
  background: linear-gradient(rgb(72, 0, 72, 0.7), rgb(192, 72, 72, 0.6)), url('/app/operator_back.jpg');
  background-position: bottom center;
  background-repeat: no-repeat;
}
</style>

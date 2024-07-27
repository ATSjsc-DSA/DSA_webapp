<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import user_api from '@/api/user';
import router from '@/router';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const username = ref('');
const password = ref('');
const checked = ref(false);
const loadding = ref(false);
const login = async () => {
  loadding.value = true;
  try {
    const res = await user_api.login(username.value, password.value);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('refreshToken', res.data.refresh_token);
    const user = await user_api.getUserActive();
    localStorage.setItem('user', user.data.username);
    localStorage.setItem('role', user.data.role);
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect);
    } else {
      router.push('/');
    }
    setTimeout(() => {
      loadding.value = false;
    }, 3000);
  } catch (error) {
    loadding.value = false;
    toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.data.detail, life: 3000 });
  }
};
</script>

<template>
  <div
    class="container-login100 surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
    style="background-image: url('./img/bg.jpg')"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img src="/img/ATS_logo.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Welcome, DSA Solution!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <div>
            <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
            <InputText
              id="username"
              type="text"
              placeholder="Username"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="username"
            />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password
              id="password1"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="false"
              v-model="password"
              v-on:keyup.enter="login()"
            ></Password>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)"
                >Forgot password?</a
              >
            </div>
            <Button label="Sign In" class="w-full p-3 text-xl" @click="login()"></Button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="loadding"
      class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden absolute opacity-80"
    >
      <ProgressSpinner />
    </div>
  </div>
  <AppConfig simple />
  <Toast></Toast>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 1;
}

.container-login100::before {
  content: '';
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--surface-overlay);
  opacity: 0.7;
}
</style>

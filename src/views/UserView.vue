<template>
  <UserAdminView v-if="role === 'admin'"></UserAdminView>
  <UserOperatorView v-else></UserOperatorView>
</template>

<script setup>
import UserAdminView from '@/components/userAdminView.vue';
import UserOperatorView from '@/components/userOperatorView.vue';
import user_api from '@/api/user';

const user = ref(localStorage.getItem('user'));
const role = ref(localStorage.getItem('role'));

const getInit = async () => {
  if (user.value || role.value) {
    const res = await user_api.getUserActive();
    user.value = res.data.username;
    role.value = res.data.role;
    localStorage.setItem('user', res.data.username);
    localStorage.setItem('role', res.data.role);
  }
};

onMounted(() => {
  getInit();
});
</script>

<style lang="scss" scoped></style>

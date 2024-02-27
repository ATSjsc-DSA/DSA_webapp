<script setup>
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Sidebar from 'primevue/sidebar';
import AppSidebar from './AppSidebar.vue';
import AppMenu from './AppMenu.vue';

import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
});
const scales = ref([12, 13, 14, 15, 16]);
const visible = ref(false);

const { changeThemeSettings, setScale, layoutConfig } = useLayout();

const onConfigButtonClick = () => {
  visible.value = !visible.value;
};
const onChangeTheme = (theme, mode) => {
  const elementId = 'theme-css';
  const linkElement = document.getElementById(elementId);
  const cloneLinkElement = linkElement.cloneNode(true);
  const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
  cloneLinkElement.setAttribute('id', elementId + '-clone');
  cloneLinkElement.setAttribute('href', newThemeUrl);
  cloneLinkElement.addEventListener('load', () => {
    linkElement.remove();
    cloneLinkElement.setAttribute('id', elementId);
    changeThemeSettings(theme, mode === 'dark');
  });
  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
  localStorage.setItem('theme', theme);
};
const decrementScale = () => {
  setScale(layoutConfig.scale.value - 1);
  applyScale();
};
const incrementScale = () => {
  setScale(layoutConfig.scale.value + 1);
  applyScale();
};
const applyScale = () => {
  document.documentElement.style.fontSize = layoutConfig.scale.value + 'px';
};
onMounted(() => {
  // Lấy giá trị theme từ localStorage
  const theme = localStorage.getItem('theme');

  // Kiểm tra xem theme có giá trị hay không trước khi thực hiện thay đổi
  if (theme !== null) {
    layoutConfig.theme.value = theme;
    const linkElement = document.getElementById('theme-css');

    // Thay đổi giá trị href bằng cách sử dụng replace
    if (linkElement) {
      linkElement.href = linkElement
        .getAttribute('href')
        .replace(/\/themes\/.*\/theme\.css/, `/themes/${theme}/theme.css`);
    }
  }
});
</script>

<template>
  <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
    <i class="pi pi-bars"></i>
  </button>

  <Sidebar
    v-model:visible="visible"
    position="left"
    :transitionOptions="'.3s cubic-bezier(0, 0, 0.2, 1)'"
    class="layout-config-sidebar w-20rem"
  >
    <div class="flex row-gap-5 flex-column justify-content-between" style="height: inherit">
      <app-menu @onMenuToggle="onConfigButtonClick"></app-menu>
      <div class="">
        <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
        <div class="config-item">Config</div>
        <div class="p-3 text-md">
          <p>Scale</p>
          <div class="flex align-items-center">
            <Button
              icon="pi pi-minus"
              type="button"
              @click="decrementScale()"
              class="p-button-text p-button-rounded w-2rem h-2rem mr-2"
              :disabled="layoutConfig.scale.value === scales[0]"
            ></Button>
            <div class="flex gap-2 align-items-center">
              <i
                class="pi pi-circle-fill text-300"
                v-for="s in scales"
                :key="s"
                :class="{ 'text-primary-500': s === layoutConfig.scale.value }"
              ></i>
            </div>
            <Button
              icon="pi pi-plus"
              type="button"
              pButton
              @click="incrementScale()"
              class="p-button-text p-button-rounded w-2rem h-2rem ml-2"
              :disabled="layoutConfig.scale.value === scales[scales.length - 1]"
            ></Button>
          </div>

          <p>Theme</p>
          <div class="grid">
            <div class="col-3">
              <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-light-indigo', 'light')">
                <img src="/layout/images/themes/lara-light-indigo.png" class="w-2rem h-2rem" alt="Lara Light Indigo" />
              </button>
            </div>
            <!-- <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-light-blue', 'light')">
            <img src="/layout/images/themes/lara-light-blue.png" class="w-2rem h-2rem" alt="Lara Light Blue" />
          </button>
        </div>
        <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-light-purple', 'light')">
            <img src="/layout/images/themes/lara-light-purple.png" class="w-2rem h-2rem" alt="Lara Light Purple" />
          </button>
        </div>
        <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-light-teal', 'light')">
            <img src="/layout/images/themes/lara-light-teal.png" class="w-2rem h-2rem" alt="Lara Light Teal" />
          </button>
        </div> -->
            <div class="col-3">
              <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-dark-indigo', 'dark')">
                <img src="/layout/images/themes/lara-dark-indigo.png" class="w-2rem h-2rem" alt="Lara Dark Indigo" />
              </button>
            </div>
            <!-- <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-dark-blue', 'dark')">
            <img src="/layout/images/themes/lara-dark-blue.png" class="w-2rem h-2rem" alt="Lara Dark Blue" />
          </button>
        </div>
        <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-dark-purple', 'dark')">
            <img src="/layout/images/themes/lara-dark-purple.png" class="w-2rem h-2rem" alt="Lara Dark Purple" />
          </button>
        </div>
        <div class="col-3">
          <button class="p-link w-2rem h-2rem" @click="onChangeTheme('lara-dark-teal', 'dark')">
            <img src="/layout/images/themes/lara-dark-teal.png" class="w-2rem h-2rem" alt="Lara Dark Teal" />
          </button>
        </div> -->
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>
.config-item {
  font-size: 0.857rem;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0.75rem 0;
}
</style>

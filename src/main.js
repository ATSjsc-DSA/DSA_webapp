import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/lara-light-teal/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core CSS

import '@/assets/main.css';
import '@/style/index.less';

createApp(App).use(PrimeVue).use(router).use(store).mount('#app');

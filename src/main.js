import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
const app = createApp(App);
app.use(router);
app.use(store);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);

app.mount('#app');

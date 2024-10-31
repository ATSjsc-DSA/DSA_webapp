import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';

// import as directive
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';
import BadgeDirective from 'primevue/badgedirective';
import Ripple from 'primevue/ripple';
// import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import '@/assets/styles.scss';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

const app = createApp(App);
// app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.use(router);
app.use(store);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');

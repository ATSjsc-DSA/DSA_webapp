import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: '/DSA/SSR',
          name: 'SSR',
          component: () => import('@/views/SSR_View.vue'),
        },
        {
          path: '/DSA/TSA',
          name: 'TSA',
          component: () => import('@/views/TSA_View.vue'),
        },
        {
          path: '/DSA/VSA',
          name: 'VSA',
          component: () => import('@/views/VSA_View.vue'),
        },
      ],
    },
  ],
});

export default router;

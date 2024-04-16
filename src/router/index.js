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
        {
          path: '/DSA/Info',
          name: 'Info',
          component: () => import('@/views/Info_View.vue'),
        },
        {
          path: '/DSA/Map',
          name: 'Map',
          component: () => import('@/views/MapVNA_View.vue'),
        },
        {
          path: '/DSA/Setting',
          name: 'Setting',
          component: () => import('@/views/settingView.vue'),
        },
        {
          path: '/DSA/User',
          name: 'User',
          component: () => import('@/views/UserView.vue'),
        },
      ],
    },
    {
      meta: {
        title: 'Login',
      },
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.name !== 'Login' && !isAuthenticated) {
    ('abc');
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }

  // next();
});

export default router;

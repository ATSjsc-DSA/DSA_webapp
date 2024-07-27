import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useCommonStore } from '@/store';
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
          path: '/DSA/Setting/Profile',
          name: 'Setting',
          component: () => import('@/views/ProfileSettingView.vue'),
        },
        {
          path: '/DSA/User',
          name: 'User',
          component: () => import('@/views/UserView.vue'),
        },
        {
          path: '/DSA/Task',
          name: 'Task',
          component: () => import('@/views/TaskList.vue'),
        },
        {
          path: '/DSA/Setting/System',
          name: 'System',
          component: () => import('@/views/DSA_SettingView.vue'),
        },
        {
          path: '/DSA/Setting/Area',
          name: 'Area',
          component: () => import('@/views/AreaSettingView.vue'),
        },
        {
          path: '/DSA/Setting/Monitor',
          name: 'Monitor',
          component: () => import('@/views/MonitorSettingView.vue'),
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
  } else {
    useCommonStore().setLoading(true);
  }

  // next();
});

router.afterEach((to, from) => {
  setTimeout(() => {
    useCommonStore().setLoading(false);
  }, 800);
  // useCommonStore().setLoading(false);
});

export default router;

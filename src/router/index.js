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
          path: '/DSA/Profile',
          name: 'Profile',
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
          path: '/DSA/Setting',
          name: 'Setting',
          component: () => import('@/views/DSA_SettingView.vue'),
        },
        {
          path: '/DSA/Initialize',
          name: 'Initialize',
          component: () => import('@/views/AreaSettingView.vue'),
        },
        {
          path: '/DSA/Monitor',
          name: 'Monitor',
          component: () => import('@/views/BranchMoniterView.vue'),
        },
        {
          path: '/DSA/SystemEvents/Disturbances',
          name: 'Disturbances',
          component: () => import('@/views/DisturbancesView.vue'),
        },
        {
          path: '/DSA/SystemEvents/Contingencies',
          name: 'Contingencies',
          component: () => import('@/views/ContigenciesView.vue'),
        },
        {
          path: '/DSA/DataInitialize',
          name: 'DataInitialize',
          component: () => import('@/views/DataInitializeView.vue'),
        },
        {
          path: '/DSA/StudyMode',
          name: 'StudyMode',
          component: () => import('@/views/StudyModeView.vue'),
        },
        {
          path: '/powersystem',
          name: 'powersystem',
          component: () => import('@/views/PowerSystem/PowerSystemView.vue'),
        },
        {
          path: '/Configuration',
          name: 'Configuration',
          component: () => import('@/views/ConfigurationView/ConfigurationView.vue'),
        },
        {
          path: '/user_config',
          name: 'User Configuration',
          component: () => import('@/views/UserConfigurationView/UserConfigurationView.vue'),
        },
      ],
    },
    {
      meta: {
        title: 'Project',
      },
      path: '/Project',
      name: 'Project',
      component: () => import('@/views/ProjectView/ProjectView.vue'),
    },
    {
      meta: {
        title: 'Global Definition',
      },
      path: '/globaldefinition',
      children: [
        {
          name: 'Global Definition',
          path: '',
          component: () => import('@/views/GlobalDefinitionView/GlobalDefinitionView.vue'),
        },
        {
          path: ':id',
          name: 'Global Dynamic Model',
          component: () => import('@/views/GlobalDynamicModelView/GlobalDynamicModelView.vue'),
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
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: '<h1>Hello App!</h1>' },
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
});

router.afterEach((to, from) => {
  if (!to.path.includes('/' + window.location.href.split('/').slice(-1)[0])) {
    Location.reload();
  }
  setTimeout(() => {
    useCommonStore().setLoading(false);
  }, 800);
  // useCommonStore().setLoading(false);
});
router.onError((error) => {
  console.error('Navigation Error:', error);
});

export default router;

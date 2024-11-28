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
          component: () => import('@/views/DashboardView/DashboardView.vue'),
        },
        {
          path: '/DSA/SSR',
          name: 'SSR',
          component: () => import('@/views/SSR_View.vue'),
        },
        {
          path: '/DSA/TSA',
          name: 'TSA',
          component: () => import('@/views/ApplicationTsaView.vue'),
        },
        {
          path: '/DSA/VSA',
          name: 'VSA',
          component: () => import('@/components/DSA_RadarChar.vue'),
          // component: () => import('@/views/VSA_View.vue'),
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
          component: () => import('@/views/CommonView/TaskList.vue'),
        },
        {
          path: '/DSA/Setting',
          name: 'Setting',
          component: () => import('@/views/DSASettingView/DSA_SettingView.vue'),
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
          path: '/powersystem/ps',
          name: 'powersystem',
          component: () => import('@/views/PowerSystem/PowerSystemView.vue'),
        },
        {
          path: '/SystemEvents/dynamicModelDefault',
          name: 'dynamicModelDefault',
          component: () => import('@/views/dynamicModelDefault/DynamicModelDefaultView.vue'),
        },
        {
          path: '/Configuration',
          name: 'Configuration',
          component: () => import('@/views/ConfigurationView/ConfigurationView.vue'),
        },
        {
          path: '/user_config/profile',
          name: 'Profile',
          component: () => import('@/views/ProfileView/ProfileView.vue'),
        },
        {
          path: '/user_config/config',
          name: 'User Configuration',
          component: () => import('@/views/UserConfigurationView/UserConfigurationView.vue'),
        },

        {
          path: '/SystemEvents/Disturbances',
          name: 'Disturbances',
          component: () => import('@/views/SystemEvents/DisturbancesView.vue'),
        },
        {
          path: '/SystemEvents/Contingencies',
          name: 'Contingencies',
          component: () => import('@/views/SystemEvents/ContingenciesView.vue'),
        },
        {
          path: '/SystemEvents/Subsystems',
          name: 'Subsystems',
          component: () => import('@/views/SystemEvents/SubsystemView.vue'),
        },

        {
          meta: {
            title: 'Grid Code',
          },
          path: '/gridcode',
          children: [
            {
              path: '/gridcode',
              name: 'Grid Code',
              component: () => import('@/views/GridCodeView/GridCodeView.vue'),
            },
            {
              path: '/gridcode/element/:id',
              name: 'Grid Code Element',
              component: () => import('@/views/GridCodeElementView/GridCodeElementView.vue'),
            },
          ],
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
      path: '/powersystem/slot',
      name: 'PowerSystemSlot',
      component: () => import('@/views/SlotView/SlotView.vue'),
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

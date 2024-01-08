import DSA_DashboardsEmpty from './DSA_DashboardsEmpty.vue';
import mapView from '@/components/mapView.vue';
import DSA_RadarChar from './DSA_RadarChar.vue';
import SSR_lineChart from './SSR_lineChart.vue';
import TSA_F81Chart from './TSA_F81Chart.vue';
import TSA_GTTTChart from './TSA_GTTTChart.vue';
import SSR_Module from './SSR_Module.vue';
const defaultSetting = {
  type: 'horizontal',
  size: 1,
  children: [
    {
      component: 'MAP',
      meta: {
        color: 'rgb(241, 131, 131)',
      },
      type: 'panel',
      size: 1,
    },
    {
      type: 'vertical',
      size: 1,
      children: [
        {
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
          type: 'panel',
          size: 0.5,
        },
        {
          type: 'panel',
          size: 0.5,
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
        },
      ],
    },
    {
      type: 'vertical',
      size: 1,
      children: [
        {
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
          type: 'panel',
          size: 0.5,
        },
        {
          type: 'panel',
          size: 0.5,
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
        },
      ],
    },
    {
      type: 'vertical',
      size: 1,
      children: [
        {
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
          type: 'panel',
          size: 0.5,
        },
        {
          type: 'panel',
          size: 0.5,
          component: 'RADAR',
          meta: {
            color: 'rgb(241, 131, 186)',
          },
        },
      ],
    },
  ],
};
const saveSettingLocalStorage = (data) => {
  localStorage.setItem('dashboard-layout-storage', JSON.stringify(data));
};
const loadSettingLocalStorage = () => {
  let data = ref(defaultSetting);
  try {
    let savedLayoutData = JSON.parse(localStorage.getItem('dashboard-layout-storage'));
    data = savedLayoutData._value;
  } catch (error) {}

  return data;
};
const getComponent = (name) => {
  if (name === 'RADAR') {
    return DSA_RadarChar;
  } else if (name === 'MAP') {
    return mapView;
  } else if (name === 'VSA') {
    return DSA_RadarChar;
  } else if (name === 'SSR') {
    return SSR_lineChart;
  } else if (name === 'SPS-81') {
    return TSA_F81Chart;
  } else if (name === 'TSA') {
    return TSA_GTTTChart;
  } else if (name === 'LINE') {
    return DSA_RadarChar;
  } else {
    return DSA_DashboardsEmpty; //{ render: (h) => h('p', '404 component not found') };
  }
};
const handleDragstart = (e) => {
  console.log(e);
  let srcData = e.srcElement.id;
  const data = {
    component: srcData,
    meta: {
      color: e.target.style.backgroundColor,
    },
  };
  e.dataTransfer.setData('text', JSON.stringify(data));
};
const dirkChange = (data) => {
  localStorage.setItem('dirk-data', JSON.stringify(data));
};
const toPDF = () => {
  window.print();
};
export default {
  defaultSetting,
  saveSettingLocalStorage,
  loadSettingLocalStorage,
  getComponent,
  handleDragstart,
  dirkChange,
  toPDF,
};

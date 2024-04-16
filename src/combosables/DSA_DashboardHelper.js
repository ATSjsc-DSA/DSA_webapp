// useDashboardHelper.js
import DSA_DashboardsEmpty from '@/components/DSA_DashboardsEmpty.vue';
import mapView from '@/components/mapView.vue';
import DSA_RadarChar from '@/components/DSA_RadarChar.vue';
import SSR_lineChart from '@/components/SSR_lineChart.vue';
import TSA_F81Chart from '@/components/TSA_F81Chart.vue';
import TSA_F27Chart from '@/components/TSA_F27Chart.vue';
import TSA_PowerTransfer from '@/components/TSA_PowerTransfer.vue';
import TSA_GTTTChart from '@/components/TSA_layoutTTTGCheck.vue';
import DSA_logTable from '@/components/DSA_logTable.vue';
import DSA_viewTrans from '@/components/VSA_moduleDashboard.vue';
const useDashboardHelper = () => {
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
            component: 'LOG',
            meta: {
              color: 'rgb(241, 131, 186)',
            },
            type: 'panel',
            size: 0.5,
          },
        ],
      },
      {
        type: 'vertical',
        size: 1,
        children: [
          {
            component: 'Check',
            meta: {
              color: 'rgb(241, 131, 186)',
            },
            type: 'panel',
            size: 0.5,
          },
          {
            type: 'panel',
            size: 0.5,
            component: 'TSA',
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
    switch (name) {
      case 'RADAR':
        return DSA_RadarChar;
      case 'MAP':
        return mapView;
      case 'SPS-27':
        return TSA_F27Chart;
      case 'SPS-PT':
        return TSA_PowerTransfer;
      case 'SSR':
        return SSR_lineChart;
      case 'SPS-81':
        return TSA_F81Chart;
      case 'TSA':
        return TSA_GTTTChart;
      case 'LINE':
        return DSA_RadarChar;
      case 'LOG':
        return DSA_logTable;
      case 'PTT':
        return DSA_viewTrans;
      default:
        return DSA_DashboardsEmpty;
    }
  };

  const handleDragstart = (e) => {
    const srcData = e.srcElement.id;
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

  return {
    defaultSetting,
    saveSettingLocalStorage,
    loadSettingLocalStorage,
    getComponent,
    handleDragstart,
    dirkChange,
    toPDF,
  };
};
export default useDashboardHelper;

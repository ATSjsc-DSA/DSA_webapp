import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class ApiApplication {
  static async getList(projectVersionId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/applications`);
  }

  static async createApp(projectVersionId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/applications`, data);
  }
  static async getAppData(appId) {
    return get(`/userconfig/applications/${appId}`);
  }
  static async updateAppData(appId, data) {
    return put(`/userconfig/applications/${appId}`, data);
  }
  static async delAppData(appId) {
    return _delete(`/userconfig/applications/${appId}`);
  }
}

export class ApiMonitor {
  static async getList(projectVersionId, appId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/monitors`);
  }
  static async createMonitor(projectVersionId, appId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/monitors`, data);
  }
  static async getMonitor(monitorId) {
    return get(`/userconfig/monitors/${monitorId}`);
  }
  static async updateMonitor(monitorId, data) {
    return put(`/userconfig/monitors/${monitorId}`, data);
  }
  static async delMonitor(monitorId) {
    return _delete(`/userconfig/monitors/${monitorId}`);
  }

  // Monitor Scada Config
  static async getScadaList(projectVersionId, monitorId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitor_scada_configs`);
  }
  static async createMonitorScada(projectVersionId, monitorId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitor_scada_configs`, data);
  }
  static async getMonitorScada(monitor_scada_id) {
    return get(`/userconfig/monitor_scada_configs/${monitor_scada_id}`);
  }
  static async updateMonitorScada(monitor_scada_id, data) {
    return put(`/userconfig/monitor_scada_configs/${monitor_scada_id}`, data);
  }
  static async delMonitorScada(monitor_scada_id) {
    return _delete(`/userconfig/monitor_scada_configs/${monitor_scada_id}`);
  }

  // Monitor PMU Config
  static async getPmuList(projectVersionId, monitorId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitor_pmu_configs`);
  }
  static async createMonitorPmu(projectVersionId, monitorId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitor_pmu_configs`, data);
  }
  static async getMonitorPmu(monitorPmuId) {
    return get(`/userconfig/monitor_pmu_configs/${monitorPmuId}`);
  }
  static async updateMonitorPmu(monitorPmuId, data) {
    return put(`/userconfig/monitor_pmu_configs/${monitorPmuId}`, data);
  }
  static async delMonitorPmu(monitorPmuId) {
    return _delete(`/userconfig/monitor_pmu_configs/${monitorPmuId}`);
  }
}

export class ApiDsa {
  static async getList(projectVersionId, appId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/dsa_modules`);
  }
  static async createDsa(projectVersionId, appId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/dsa_modules`, data);
  }
  static async getDsa(dsaId) {
    return get(`/userconfig/dsa_modules/${dsaId}`);
  }
  static async updateDsa(dsaId, data) {
    return put(`/userconfig/dsa_modules/${dsaId}`, data);
  }
  static async delDsa(dsaId) {
    return _delete(`/userconfig/dsa_modules/${dsaId}`);
  }
  // VSA Config
  static async getVsaList(projectVersionId, dsaId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/vsa_informations`);
  }
  static async createVsa(projectVersionId, dsaId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/vsa_informations`, data);
  }
  static async getVsa(vsaId) {
    return get(`/userconfig/vsa_informations/${vsaId}`);
  }
  static async updateVsa(vsaId, data) {
    return put(`/userconfig/vsa_informations/${vsaId}`, data);
  }
  static async delVsa(vsaId) {
    return _delete(`/userconfig/vsa_informations/${vsaId}`);
  }
}

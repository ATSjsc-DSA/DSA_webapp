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
  static async getAppData(application_id) {
    return get(`/userconfig/applications/${application_id}`);
  }
  static async updateAppData(application_id, data) {
    return put(`/userconfig/applications/${application_id}`, data);
  }
  static async delAppData(application_id) {
    return _delete(`/userconfig/applications/${application_id}`);
  }
}

export class ApiMonitor {
  static async getList(projectVersionId, appId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/monitors`);
  }
  static async createMonitor(projectVersionId, appId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/monitors`, data);
  }
  static async getMonitor(monitor_id) {
    return get(`/userconfig/monitors/${monitor_id}`);
  }
  static async updateMonitor(monitor_id, data) {
    return put(`/userconfig/monitors/${monitor_id}`, data);
  }
  static async delMonitor(monitor_id) {
    return _delete(`/userconfig/monitors/${monitor_id}`);
  }

  // Monitor Scada Config
  static async getScadaList(projectVersionId, monitor_id) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitor_id}/monitor_scada_configs`);
  }
  static async createMonitorScada(projectVersionId, monitor_id, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitor_id}/monitor_scada_configs`, data);
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
  static async getPmuList(projectVersionId, monitor_id) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitor_id}/monitor_pmu_configs`);
  }
  static async createMonitorPmu(projectVersionId, monitor_id, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitor_id}/monitor_pmu_configs`, data);
  }
  static async getMonitorPmu(monitor_pmu_id) {
    return get(`/userconfig/monitor_pmu_configs/${monitor_pmu_id}`);
  }
  static async updateMonitorPmu(monitor_pmu_id, data) {
    return put(`/userconfig/monitor_pmu_configs/${monitor_pmu_id}`, data);
  }
  static async delMonitorPmu(monitor_pmu_id) {
    return _delete(`/userconfig/monitor_pmu_configs/${monitor_pmu_id}`);
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
}

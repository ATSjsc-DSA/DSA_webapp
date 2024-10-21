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
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitorscada`);
  }
  static async createMonitorScada(projectVersionId, monitorId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitorscada`, data);
  }
  static async getMonitorScada(monitor_scada_id) {
    return get(`/userconfig/monitorscada/${monitor_scada_id}`);
  }
  static async updateMonitorScada(monitor_scada_id, data) {
    return put(`/userconfig/monitorscada/${monitor_scada_id}`, data);
  }
  static async delMonitorScada(monitor_scada_id) {
    return _delete(`/userconfig/monitorscada/${monitor_scada_id}`);
  }

  // Monitor PMU Config
  static async getPmuList(projectVersionId, monitorId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitorpmu`);
  }
  static async createMonitorPmu(projectVersionId, monitorId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${monitorId}/monitorpmu`, data);
  }
  static async getMonitorPmu(monitorPmuId) {
    return get(`/userconfig/monitorpmu/${monitorPmuId}`);
  }
  static async updateMonitorPmu(monitorPmuId, data) {
    return put(`/userconfig/monitorpmu/${monitorPmuId}`, data);
  }
  static async delMonitorPmu(monitorPmuId) {
    return _delete(`/userconfig/monitorpmu/${monitorPmuId}`);
  }
}

export class ApiDsa {
  static async getList(projectVersionId, appId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/dsamodules`);
  }
  static async createDsa(projectVersionId, appId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${appId}/dsamodules`, data);
  }
  static async getDsa(dsaId) {
    return get(`/userconfig/dsamodules/${dsaId}`);
  }
  static async updateDsa(dsaId, data) {
    return put(`/userconfig/dsamodules/${dsaId}`, data);
  }
  static async delDsa(dsaId) {
    return _delete(`/userconfig/dsamodules/${dsaId}`);
  }

  // VSA Config
  static async getVsaList(projectVersionId, dsaId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/vsainformations`);
  }
  static async createVsa(projectVersionId, dsaId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/vsainformations`, data);
  }
  static async getVsa(vsaId) {
    return get(`/userconfig/vsainformations/${vsaId}`);
  }
  static async updateVsa(vsaId, data) {
    return put(`/userconfig/vsainformations/${vsaId}`, data);
  }
  static async delVsa(vsaId) {
    return _delete(`/userconfig/vsainformations/${vsaId}`);
  }
  // TSA Config
  static async getTsaList(projectVersionId, dsaId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/tsainformations`);
  }
  static async createTsa(projectVersionId, dsaId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${dsaId}/tsainformations`, data);
  }
  static async getTsa(vsaId) {
    return get(`/userconfig/tsainformations/${vsaId}`);
  }
  static async updateTsa(vsaId, data) {
    return put(`/userconfig/tsainformations/${vsaId}`, data);
  }
  static async delTsa(vsaId) {
    return _delete(`/userconfig/tsainformations/${vsaId}`);
  }

  // module dependency
  static async getDependencyList(projectVersionId, dependencyId, page) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/${dependencyId}/moduledependency`, {
      page: page,
      page_size: 10,
    });
  }
  static async createDependency(projectVersionId, dependencyId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/${dependencyId}/moduledependency`, data);
  }
  static async getDependency(dependencyId) {
    return get(`/userconfig/moduledependency/${dependencyId}`);
  }
  static async updateDependency(dependencyId, data) {
    return put(`/userconfig/moduledependency/${dependencyId}`, data);
  }
  static async delDependency(dependencyId) {
    return _delete(`/userconfig/moduledependency/${dependencyId}`);
  }
}

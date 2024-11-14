import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { userConfigVersionId, projectData } = storeToRefs(commonStore);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class ApiApplication {
  static async getList() {
    return get(`/userconfig/${userConfigVersionId.value}/applications`);
  }

  static async createApp(data) {
    return post(`/userconfig/${userConfigVersionId.value}/applications`, data);
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
  static async getList(appId) {
    return get(`/userconfig/${userConfigVersionId.value}/${appId}/monitors`);
  }
  static async createMonitor(appId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${appId}/monitors`, data);
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
  static async getScadaList(monitorId) {
    return get(`/userconfig/${userConfigVersionId.value}/${monitorId}/monitorscada`);
  }
  static async createMonitorScada(monitorId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${monitorId}/monitorscada`, data);
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
  static async getPmuList(monitorId) {
    return get(`/userconfig/${userConfigVersionId.value}/${monitorId}/monitorpmu`);
  }
  static async createMonitorPmu(monitorId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${monitorId}/monitorpmu`, data);
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
  static async getList(appId) {
    return get(`/userconfig/${userConfigVersionId.value}/${appId}/dsamodules`);
  }
  static async createDsa(appId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${appId}/dsamodules`, data);
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
  static async getVsaList(dsaId) {
    return get(`/userconfig/${userConfigVersionId.value}/${dsaId}/vsainformations`);
  }
  static async createVsa(dsaId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${dsaId}/vsainformations`, data);
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
  static async getTsaList(dsaId) {
    return get(`/userconfig/${userConfigVersionId.value}/${dsaId}/tsainformations`);
  }
  static async createTsa(dsaId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${dsaId}/tsainformations`, data);
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
  static async getDependencyList(dependencyId, page) {
    return get(`/userconfig/${userConfigVersionId.value}/${dependencyId}/moduledependency`, {
      page: page,
      page_size: 10,
    });
  }
  static async createDependency(dependencyId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${dependencyId}/moduledependency`, data);
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
  // SSR
  static async getSsrList(dsaId) {
    return get(`/userconfig/${userConfigVersionId.value}/${dsaId}/ssrinformations`);
  }
  static async createSsr(dsaId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${dsaId}/ssrinformations`, data);
  }
  static async getSsr(vsaId) {
    return get(`/userconfig/ssrinformations/${vsaId}`);
  }
  static async updateSsr(vsaId, data) {
    return put(`/userconfig/ssrinformations/${vsaId}`, data);
  }
  static async delSsr(vsaId) {
    return _delete(`/userconfig/ssrinformations/${vsaId}`);
  }
  // SSR - frequency
  static async getSsrFrequencyList(ssrId, page) {
    return get(`/userconfig/${userConfigVersionId.value}/${ssrId}/frequency`, {
      page: page,
      page_size: 10,
    });
  }
  static async createSsrFrequency(ssrId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${ssrId}/frequency`, data);
  }

  static async getSsrFrequency(ssrFrequencyId) {
    return get(`/userconfig/SsrFrequency/${ssrFrequencyId}`);
  }
  static async updateSsrFrequency(ssrFrequencyId, data) {
    return put(`/userconfig/SsrFrequency/${ssrFrequencyId}`, data);
  }
  static async delSsrFrequency(ssrFrequencyId) {
    return _delete(`/userconfig/SsrFrequency/${ssrFrequencyId}`);
  }
  // OSL
  static async getOslList(dsaId) {
    return get(`/userconfig/${userConfigVersionId.value}/${dsaId}/oslinformations`);
  }
  static async createOsl(dsaId, data) {
    return post(`/userconfig/${userConfigVersionId.value}/${dsaId}/oslinformations`, data);
  }
  static async getOsl(vsaId) {
    return get(`/userconfig/oslinformations/${vsaId}`);
  }
  static async updateOsl(vsaId, data) {
    return put(`/userconfig/oslinformations/${vsaId}`, data);
  }
  static async delOsl(vsaId) {
    return _delete(`/userconfig/oslinformations/${vsaId}`);
  }
}

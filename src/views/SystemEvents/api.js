import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { projectData, profileData, slotData } = storeToRefs(commonStore);

export class ApiContingency {
  static async getListContingency(contingenciesActiveId, param) {
    return get(
      `/seedconfig/${projectData.value._id}/${slotData.value._id}/${contingenciesActiveId}/contingency`,
      param,
    );
  }
  static async createContingency(contingenciesActiveId, data) {
    return post(`/seedconfig/${contingenciesActiveId}/contingency`, data);
  }
  static async getContingencyData(id) {
    return get(`/seedconfig/contingency/${id}`);
  }
  static async updateContingencyData(id, data) {
    return put(`/seedconfig/contingency/${id}`, data);
  }
  static async deleteContingency(id) {
    return _delete(`/seedconfig/contingency/${id}`);
  }
  static async importContigency(contingenciesActiveId, data) {
    return put(`/seedconfig/${contingenciesActiveId}/import/contingency`, data);
  }
  static async exportContigency(contingenciesActiveId) {
    return get(`/seedconfig/${contingenciesActiveId}/export/contingency`);
  }
}

export class ApiContingencies {
  static async getListContingencies() {
    return get(`/seedconfig/${projectData.value._id}/contingencies`);
  }
  static async searchSubsystem(query = '', data = []) {
    return post(`/seedconfig/${projectData.value._id}/search/contingencies?query=${query}`, data);
  }
  static async createContingencies(data) {
    return post(`/seedconfig/${projectData.value._id}/contingencies`, data);
  }
  static async getContingenciesData(id) {
    return get(`/seedconfig/contingencies/${id}`);
  }
  static async updateContingenciesData(id, data) {
    return put(`/seedconfig/contingencies/${id}`, data);
  }
  static async deleteContingencies(id) {
    return _delete(`/seedconfig/contingencies/${id}`);
  }
}

export class ApiDisturbances {
  static async getList(tsaId, page) {
    return get(`/seedconfig/${profileData.value._id}/${tsaId}/disturbances`, {
      page: page,
      page_size: 10,
    });
  }

  static async createDisturbances(tsaId, data) {
    return post(`/seedconfig/${profileData.value._id}/${tsaId}/disturbances`, data);
  }
  static async getDisturbances(id) {
    return get(`/seedconfig/disturbances/${id}`);
  }
  static async updateDisturbances(id, data) {
    return put(`/seedconfig/disturbances/${id}`, data);
  }
  static async deleteDisturbances(id) {
    return _delete(`/seedconfig/disturbances/${id}`);
  }
}

export class ApiDisturbance {
  static async getDisturbanceList(disturbanceCaseId, page) {
    return get(`/seedconfig/${projectData.value._id}/${slotData.value._id}/${disturbanceCaseId}/disturbance`, {
      page: page,
      page_size: 10,
    });
  }

  static async createDisturbance(disturbanceCaseId, data) {
    return post(`/seedconfig/${profileData.value._id}/${disturbanceCaseId}/disturbance`, data);
  }
  static async getDisturbanceData(id) {
    return get(`/seedconfig/disturbance/${id}`);
  }
  static async updateDisturbanceData(id, data) {
    return put(`/seedconfig/disturbance/${id}`, data);
  }
  static async deleteDisturbance(id) {
    return _delete(`/seedconfig/disturbance/${id}`);
  }
}

export class ApiSubsystem {
  static async getListSubsystem(param) {
    return get(`/seedconfig/${projectData.value._id}/subsystem`, param);
  }
  static async getListSubsystemOnlyName() {
    return get(`/seedconfig/${projectData.value._id}/subsystemonlyname`);
  }

  static async searchSubsystem(query = '', data = []) {
    return post(`/seedconfig/${projectData.value._id}/search/subsystem?query=${query}`, data);
  }
  static async createSubsystem(data) {
    return post(`/seedconfig/${projectData.value._id}/subsystem`, data);
  }

  static async getSubsystemData(id) {
    return get(`/seedconfig/${projectData.value._id}/${slotData.value._id}/subsystem/${id}`);
  }
  static async updateSubsystemData(id, data) {
    return put(`/seedconfig/subsystem/${id}`, data);
  }
  static async deleteSubsystem(id) {
    return _delete(`/seedconfig/subsystem/${id}`);
  }
}

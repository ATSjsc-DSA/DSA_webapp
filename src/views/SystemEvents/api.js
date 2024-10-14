import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { psm_active, projectData, versionId } = storeToRefs(commonStore);

export class commonApi {
  static async searchPowerSystemData(psdDefinition_id = '', query = '', exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemedit/66decf1dcff005199529524b/search`;
    if (psdDefinition_id) {
      url += `?psdDefinition_id=${psdDefinition_id}`;
    }
    if (query) {
      url += (psdDefinition_id ? '&' : '?') + `query=${query}`;
    }
    return post(url, exceptionArr);
  }
}

export class ApiContingency {
  static async getListContingency(contingenciesActiveId, param) {
    return get(`/seedconfig/${contingenciesActiveId}/contingency`, param);
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
}

export class ApiDisturbance {
  static async getListDisturbance(param) {
    return get(`/seedconfig/${projectData.value._id}/${versionId.value}/disturbance`, param);
  }

  static async createDisturbance(data) {
    return post(`/seedconfig/${projectData.value._id}/${versionId.value}/disturbance`, data);
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

export class ApiContingencies {
  static async getListContingencies() {
    return get(`/seedconfig/${projectData.value._id}/${versionId.value}/contingencies`);
  }

  static async createContingencies(data) {
    return post(`/seedconfig/${projectData.value._id}/${versionId.value}/contingencies`, data);
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

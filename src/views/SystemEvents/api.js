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
  static async getListContingency(param) {
    return get(`/seedconfig/${projectData.value._id}/${versionId.value}/contingency`, param);
  }

  static async createContingency(data) {
    return post(`/seedconfig/${projectData.value._id}/${versionId.value}/contingency`, data);
  }
  static async getContingencyData(id) {
    return get(`/seedconfig/contingency/${id}`);
  }
  static async updateContingencyData(id, data) {
    return put(`/seedconfig/contingency/${id}`, data);
  }
  static async delContingencyData(id) {
    return _delete(`/seedconfig/contingency/${id}`);
  }
}

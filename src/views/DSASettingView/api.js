import { get, post, put, _delete } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);

export class DSA_api {
  static async getDsaService() {
    return get(`/common/${projectData.value._id}/dsa/service`);
  }

  static async updateDsaService(data) {
    return put(`/common/${projectData.value._id}/dsa/service`, data);
  }
}

export class ApiEngine {
  static async getList() {
    return get(`/common/dsa/engine`);
  }
  static async createEngine(data) {
    return post(`common/dsa/engine`, data);
  }
  static async updateEngine(engine_id, data) {
    return put(`common/dsa/engine?engine_id=${engine_id}`, data);
  }
  static async deleteEngine(engine_id) {
    return _delete(`common/dsa/engine?engine_id=${engine_id}`);
  }
}

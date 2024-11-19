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

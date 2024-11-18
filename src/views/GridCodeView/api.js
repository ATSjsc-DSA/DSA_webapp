import { get, post, put, _delete } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);

export class Api {
  static async getGridCodeList(page) {
    return get(`/gridcode/${projectData.value._id}/group`, {
      page: page,
      page_size: 10,
    });
  }
  static async getGridCodeData(gridcodeId) {
    return get(`/gridcode/group/${gridcodeId}`);
  }
  static async createGridCode(data) {
    return post(`/gridcode/${projectData.value._id}/group`, data);
  }
  static async updateGridCode(gridcodeId, data) {
    return put(`/gridcode/group/${gridcodeId}`, data);
  }
  static async deleteGridcode(gridcodeId) {
    return _delete(`/gridcode/group/${gridcodeId}`);
  }

  static async activeGridcode(gridcodeId) {
    return put(`/gridcode/group/${gridcodeId}/active`);
  }
}

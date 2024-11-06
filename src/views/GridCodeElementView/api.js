import { get, post, put, _delete } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, userConfigVersionId } = storeToRefs(commonStore);

export class ApiVsaCase {
  static async getList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodevsacase`);
  }
  static async getVsaCaseById(vsaCaseId) {
    return get(`/gridcode/gridcodevsacase/${vsaCaseId}`);
  }
  static async create(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodevsacase`, data);
  }
  static async update(vsaCaseId, data) {
    return put(`/gridcode/gridcodevsacase/${vsaCaseId}`, data);
  }
  static async deleteVsaCase(vsaCaseId) {
    return _delete(`/gridcode/gridcodevsacase/${vsaCaseId}`);
  }
}

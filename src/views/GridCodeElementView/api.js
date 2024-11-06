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

export class ApiAngleStability {
  static async getList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodeanglestability`);
  }
  static async getAngleStabilityById(angleStabilityId) {
    return get(`/gridcode/gridcodeanglestability/${angleStabilityId}`);
  }
  static async create(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodeanglestability`, data);
  }
  static async update(angleStabilityId, data) {
    return put(`/gridcode/gridcodeanglestability/${angleStabilityId}`, data);
  }
  static async deleteAngleStability(angleStabilityId) {
    return _delete(`/gridcode/gridcodeanglestability/${angleStabilityId}`);
  }
}

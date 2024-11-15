import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class Api {
  static async getList(page) {
    return get(`/userconfig/${projectData.value._id}/profile`, { page: page, page_size: 10 });
  }
  static async createProfile(data) {
    return post(`/userconfig/${projectData.value._id}/profile`, data);
  }

  static async cloneProfile(profileId) {
    return put(`/userconfig/profile/${profileId}/clone`);
  }

  static async updateProfileData(profileId, data) {
    return put(`/userconfig/profile/${profileId}`, data);
  }
  static async delProfileData(profileId) {
    return _delete(`/userconfig/profile/${profileId}`);
  }
}

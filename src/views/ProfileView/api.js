import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { userConfigVersionId, projectData } = storeToRefs(commonStore);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class Api {
  static async getList(page) {
    return get(`/userconfig/${projectData.value._id}/profile`, { page: page, page_size: 10 });
  }
  static async createProfile(data) {
    return post(`/userconfig/${userConfigVersionId.value}/profile`, data);
  }

  static async updateProfileData(profileId, data) {
    return put(`/userconfig/profile/${profileId}`, data);
  }
  static async delProfileData(profileId) {
    return _delete(`/userconfig/profile/${profileId}`);
  }
}

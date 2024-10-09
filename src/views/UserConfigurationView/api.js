import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class ApiApplication {
  static async getList(projectVersionId) {
    return get(`/userconfig/${projectData.value._id}/${projectVersionId}/applications`);
  }

  static async createApp(projectVersionId, data) {
    return post(`/userconfig/${projectData.value._id}/${projectVersionId}/applications`, data);
  }
  static async getAppData(application_id) {
    return get(`/userconfig/applications/${application_id}`);
  }
  static async updateAppData(application_id, data) {
    return put(`/userconfig/applications/${application_id}`, data);
  }
  static async delAppData(application_id) {
    return _delete(`/userconfig/applications/${application_id}`);
  }
}

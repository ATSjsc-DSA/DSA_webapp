import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

export default class additionApi {
  static async getDynamicModelList(version_id, page) {
    return get(`/addition/${projectData.value._id}/${version_id}/dynamicModel`, { page: page });
  }

  static async createDynamicModel(versionId, data) {
    return post(`addition/${projectData.value._id}/${versionId}/dynamicModel`, data);
  }

  static async deleteDynamicModel(versionId, dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${versionId}/dynamicModel/${dynamicModel_id}`);
  }
}

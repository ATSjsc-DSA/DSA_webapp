import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData } = storeToRefs(commonStore);

export default class additionApi {
  static async getDynamicModelList(additionVersion_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersion_id}/dynamicModel`, { page: page });
  }

  static async getDynamicModelListWithTree(additionVersion_id, parent_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersion_id}/${parent_id}/dynamicModel`, { page: page });
  }
  static async createDynamicModel(versionId, data) {
    return post(`addition/${projectData.value._id}/${versionId}/dynamicModel`, data);
  }

  static async updateDynamicModel(versionId, dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${versionId}/dynamicModel/${dynamicModel_id}`, data);
  }
  static async deleteDynamicModel(versionId, dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${versionId}/dynamicModel/${dynamicModel_id}`);
  }
}

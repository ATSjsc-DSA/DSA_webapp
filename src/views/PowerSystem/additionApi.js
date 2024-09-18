import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

export default class additionApi {
  static async getDynamicModelList(version_id, page) {
    return get(`/addition/${projectData.value._id}/${version_id}/dynamicModel`, { page: page });
  }

  static async createDynamicModel(versionId, data) {
    data.projectId = projectData.value._id;
    return post(`addition/${projectData.value._id}/${versionId}/dynamicModel`, data);
  }
}

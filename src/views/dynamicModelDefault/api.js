import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, additionVersionId } = storeToRefs(commonStore);

export class Api {
  static async getList(page) {
    return get(`/addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault`, { page: page });
  }

  static async createDynamicDefault(data) {
    return post(`addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault`, data);
  }

  static async updateDynamicDefault(dynamicModel_id, data) {
    return put(
      `addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
      data,
    );
  }
  static async deleteDynamicDefault(dynamicModel_id) {
    return _delete(
      `addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
    );
  }

  static async importFile(data) {
    return put(`addition/${projectData.value._id}/${additionVersionId.value}/import/dynamicDefaultModel`, data);
  }
}

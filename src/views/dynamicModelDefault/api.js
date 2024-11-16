import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, slotData } = storeToRefs(commonStore);

export class Api {
  static async getList(page) {
    return get(`/addition/${projectData.value._id}/${slotData.value._id}/dynamicModelDefault`, { page: page });
  }

  static async createDynamicDefault(data) {
    return post(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModelDefault`, data);
  }

  static async updateDynamicDefault(dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModelDefault/${dynamicModel_id}`, data);
  }
  static async deleteDynamicDefault(dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModelDefault/${dynamicModel_id}`);
  }

  static async importFile(data) {
    return put(`addition/${projectData.value._id}/${slotData.value._id}/import/dynamicDefaultModel`, data);
  }
}

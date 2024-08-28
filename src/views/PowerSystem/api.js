import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

console.log('projectId', projectId.value);
console.log('psm_active', psm_active.value._id);

export default class api {
  // power system definition
  static async getPSD(data) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition`, data);
  }

  static async getActivePSD(psdId) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition/${psdId}`);
  }

  static async getPSDEdit(psdId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/definition/${psdId}`);
  }

  // power system

  static async getComparePSD() {
    return get(`/powersystem/${projectId.value}/compare_powersystem`);
  }

  static async createPS(data) {
    data.projectId = projectId.value;
    return post(`/powersystem/${projectId.value}/powersystemedit`, data);
  }

  static async editPSE(data) {
    return put(`/powersystem/${projectId.value}/powersystemedit/${data._id}`, data);
  }
  static async deletePSE(psde_id) {
    return _delete(`/powersystem/${projectId.value}/powersystemedit/${psde_id}`);
  }
}

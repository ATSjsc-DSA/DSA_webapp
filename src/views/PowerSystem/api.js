import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

console.log('projectId', projectId.value);
console.log('psm_active', psm_active.value._id);

export default class api {
  // list - definition list
  static async getDefinitionList(data) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition`, data);
  }

  static async getDefinitionHeader(definitionId) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition/${definitionId}`);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/definition/${definitionId}`);
  }

  // tree - powersystem edit

  static async getChildOnPSEdit(parentId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/child/${parentId}`);
  }

  static async getPSEditData(pseId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/${pseId}`);
  }

  // CRUD
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

  // compare

  static async getComparePSD() {
    return get(`/powersystem/${projectId.value}/compare_powersystem`);
  }
}

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
    const updateData = {
      generalInfo: {
        name: data.generalInfo.name,
        uniqueId: data.generalInfo.uniqueId,
        emsName: data.generalInfo.emsName,
        operationName: data.generalInfo.operationName,
        operationUniqueId: data.generalInfo.operationUniqueId,
        softwareName: data.generalInfo.softwareName,
        softwareUniqueId: data.generalInfo.softwareUniqueId,
      },
      scadaInfo: {
        skey: data.scadaInfo.skey,
        scadaName: data.scadaInfo.scadaName,
        scadaUniqueId: data.scadaInfo.scadaUniqueId,
      },
    };
    return put(`/powersystem/${projectId.value}/powersystemedit/${data._id}`, updateData);
  }
  static async deletePSE(psde_id) {
    return _delete(`/powersystem/${projectId.value}/powersystemedit/${psde_id}`);
  }

  // compare

  static async getComparePSD() {
    return get(`/powersystem/${projectId.value}/compare_powersystem`);
  }

  static async createNewVersion(nameVersion) {
    return post(`/powersystem/${projectId.value}/newversion_powersystem`, { name: nameVersion });
  }

  // version
  static async getVersionList(page) {
    return get(`/powersystem/${projectId.value}/powersystemversion`, {
      page: page,
      page_size: 10,
    });
  }
  static async rollbackVersion(versionId) {
    return put(`/powersystem/${projectId.value}/powersystemversion/${versionId}`);
  }
}

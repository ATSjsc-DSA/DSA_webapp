import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

console.log('projectId', projectData.value._id);
console.log('psm_active', psm_active.value._id);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export default class api {
  // flat list - definition list
  static async getDefinitionList(data) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition`, data);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/${definitionId}`);
  }

  static async getPsDataWithDefinition(definitionId, versionId, page = 1, data = {}) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  // tree - powersystem edit

  // static async getChildOnPs(parentId, versionId) {
  //   return get(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/child/${parentId}`);
  // }
  static async getChildOnPs(versionId, data) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/child`, data);
  }
  static async searchPs(versionId, psdDefinition_id, query, exceptionArr = []) {
    return post(
      `/powersystem/${projectData.value._id}/search/powersystemedit/${versionId}/${psdDefinition_id}?query=${query}`,
      exceptionArr,
    );
  }

  static async getPsDataWithTree(psedId, versionId, page = 1, parentId = undefined) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/${psedId}`, {
      page: page,
      parentId: parentId,
    });
  }

  // CRUD
  static async createPS(data, versionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}`, data);
  }

  static async editPSE(data, versionId) {
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
      engineInfo: {
        powerSystemDefinitionId: data.engineInfo.powerSystemDefinitionId,
        values: data.engineInfo.values,
      },

      scadaInfo: {
        skey: data.scadaInfo.skey,
        scadaName: data.scadaInfo.scadaName,
        scadaUniqueId: data.scadaInfo.scadaUniqueId,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/${data._id}`, updateData);
  }
  static async deletePSE(psde_id, versionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemedit/${versionId}/${psde_id}`);
  }

  // compare

  static async getComparePSD() {
    return get(`/powersystem/${projectData.value._id}/compare_powersystem`);
  }

  static async createNewVersion(nameVersion, scheduledOperationTime) {
    return post(`/powersystem/${projectData.value._id}/newversion_powersystem`, {
      name: nameVersion,
      // tạo sẵn `scheduledOperationTime` chưa gửi
      // scheduledOperationTime: convertTimeStringToInt(scheduledOperationTime),
    });
  }

  // version
  static async getVersionList(page) {
    return get(`/powersystem/${projectData.value._id}/powersystemversion`, {
      page: page,
      page_size: 10,
    });
  }
  static async openVersion(versionId) {
    return put(`/powersystem/${projectData.value._id}/powersystemversion/${versionId}`);
  }
}

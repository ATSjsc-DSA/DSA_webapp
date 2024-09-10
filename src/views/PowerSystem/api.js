import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

console.log('projectId', projectId.value);
console.log('psm_active', psm_active.value._id);

export default class api {
  // flat list - definition list
  static async getDefinitionList(data) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition`, data);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectId.value}/powersystemdefinition/${definitionId}`);
  }

  static async getPsDataWithDefinition(definitionId, versionId, page, data = {}) {
    console.log('getPsDataWithDefinition', data, definitionId);
    return get(`/powersystem/${projectId.value}/powersystemedit/${versionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  // tree - powersystem edit

  static async getChildOnPSEdit(parentId, versionId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/${versionId}/child/${parentId}`);
  }

  static async getPSEditData(pseId, versionId) {
    return get(`/powersystem/${projectId.value}/powersystemedit/${versionId}/${pseId}`);
  }

  // CRUD
  static async createPS(data, versionId) {
    data.projectId = projectId.value;
    return post(`/powersystem/${projectId.value}/powersystemedit/${versionId}`, data);
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
      scadaInfo: {
        skey: data.scadaInfo.skey,
        scadaName: data.scadaInfo.scadaName,
        scadaUniqueId: data.scadaInfo.scadaUniqueId,
      },
    };
    return put(`/powersystem/${projectId.value}/powersystemedit/${versionId}/${data._id}`, updateData);
  }
  static async deletePSE(psde_id, versionId) {
    return _delete(`/powersystem/${projectId.value}/powersystemedit/${versionId}/${psde_id}`);
  }

  // compare

  static async getComparePSD() {
    return get(`/powersystem/${projectId.value}/compare_powersystem`);
  }

  static async createNewVersion(nameVersion, scheduledOperationTime) {
    return post(`/powersystem/${projectId.value}/newversion_powersystem`, {
      name: nameVersion,
      // tạo sẵn `scheduledOperationTime` chưa gửi
      // scheduledOperationTime: convertTimeStringToInt(scheduledOperationTime),
    });
  }

  // version
  static async getVersionList(page) {
    return get(`/powersystem/${projectId.value}/powersystemversion`, {
      page: page,
      page_size: 10,
    });
  }
  static async openVersion(versionId) {
    return put(`/powersystem/${projectId.value}/powersystemversion/${versionId}`);
  }
}

import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

console.log('projectId', projectData.value._id);
console.log('psm_active', psm_active.value._id);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class api {
  // flat list - definition list
  static async getDefinitionList(data) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/parameter`, data);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/${definitionId}`);
  }

  static async getPsDataWithDefinition(definitionId, projectVersionId, page = 1, data = {}) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  // tree - powersystem edit

  // static async getChildOnPs(parentId, projectVersionId) {
  //   return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/child/${parentId}`);
  // }
  static async getChildOnPs(projectVersionId, data) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/child`, data);
  }
  static async searchPs(projectVersionId, psdDefinition_id, query, exceptionArr = []) {
    return post(
      `/powersystem/${projectData.value._id}/search/powersystemedit/${projectVersionId}/${psdDefinition_id}?query=${query}`,
      exceptionArr,
    );
  }

  static async getPsDataWithTree(psId, projectVersionId, page = 1, parentId = undefined) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${psId}`, {
      page: page,
      parentId: parentId,
    });
  }

  // CRUD
  static async createPS(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}`, data);
  }

  static async editPSE(data, projectVersionId) {
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
    return put(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${data._id}`, updateData);
  }
  static async deletePSE(psde_id, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${psde_id}`);
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

  static async openVersion(projectVersionId) {
    return put(`/powersystem/${projectData.value._id}/powersystemversion/${projectVersionId}`);
  }
}

export class DefinitionList {
  static async getParameterDefinitionList() {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/parameter`);
  }
  static async getEmsList() {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/ems`);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/${definitionId}`);
  }
}

export class PsTree {
  static async getChild(projectVersionId, data) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/child`, data);
  }
  static async searchPsByPatternName(projectVersionId, definitionId, query, exceptionArr = []) {
    return post(
      `/powersystem/${projectData.value._id}/search/powersystemedit/${projectVersionId}/${definitionId}?query=${query}`,
      exceptionArr,
    );
  }
}

export class PowerSystemParameter {
  static async getPsDataWithDefinition(definitionId, projectVersionId, data = {}, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  static async getPsDataWithTree(psId, projectVersionId, parentId = undefined, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${psId}`, {
      page: page,
      parentId: parentId,
    });
  }

  // CRUD
  static async create(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}`, data);
  }

  static async update(data, projectVersionId) {
    const updateData = {
      generalInfo: {
        name: data.generalInfo.name,
        uniqueId: data.generalInfo.uniqueId,
        operationName: data.generalInfo.operationName,
        operationUniqueId: data.generalInfo.operationUniqueId,
      },
      engineInfo: {
        values: data.engineInfo.values,
      },

      scadaInfo: {
        skey: data.scadaInfo.skey,
        scadaName: data.scadaInfo.scadaName,
        scadaUniqueId: data.scadaInfo.scadaUniqueId,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${data._id}`, updateData);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${psId}`);
  }
}

export class PowerSystemEms {
  static async getPsDataWithDefinition(definitionId, projectVersionId, data = {}, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  static async getPsDataWithTree(psId, projectVersionId, page = 1, parentId = undefined) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${psId}`, {
      page: page,
      parentId: parentId,
    });
  }

  // CRUD
  static async create(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}`, data);
  }

  static async update(data, projectVersionId) {
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
    return put(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${data._id}`, updateData);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${psId}`);
  }
}

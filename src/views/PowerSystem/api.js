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
  // tree - powersystem edit

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

export class DefinitionListApi {
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

export class PsTreeApi {
  static async getChild(projectVersionId, data) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/child`, data);
  }
}

export class PowerSystemParameterApi {
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
  static async searchPs(projectVersionId, psdDefinition_id, query, exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/search`;
    if (psdDefinition_id) {
      url += `?psdDefinition_id=${psdDefinition_id}`;
    }
    if (query) {
      url += (psdDefinition_id ? '&' : '?') + `query=${query}`;
    }
    return post(url, exceptionArr);
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
        operationName: data.generalInfo.operationName,
      },
      engineInfo: {
        values: data.engineInfo.values,
      },

      scadaInfo: {
        skey: data.scadaInfo.skey,
        scadaName: data.scadaInfo.scadaName,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${data._id}`, updateData);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/${psId}`);
  }
}

export class PowerSystemEmsApi {
  static async getPsDataWithDefinition(definitionId, projectVersionId, data = {}, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/definition/${definitionId}`, {
      ...data,
      page: page,
    });
  }

  static async getPsDataWithTree(psId, projectVersionId, parentId = undefined, ems_definition_id, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${psId}`, {
      page: page,
      parentId: parentId,
      ems_definition_id: ems_definition_id,
    });
  }
  static async searchPs(projectVersionId, psdDefinition_id = '', query = '', exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/search`;
    if (psdDefinition_id) {
      url += `?psdDefinition_id=${psdDefinition_id}`;
    }
    if (query) {
      url += (psdDefinition_id ? '&' : '?') + `query=${query}`;
    }
    return post(url, exceptionArr);
  }
  // CRUD
  static async create(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}`, data);
  }

  static async update(data, projectVersionId) {
    const updateData = {
      engineInfo: {
        values: data.engineInfo.values,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${data._id}`, updateData);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${psId}`);
  }
}

// pole
export class SubLineApi {
  static async getData(psId, projectVersionId, page = 1) {
    return get(`/powersystem/${projectData.value._id}/${projectVersionId}/PoleSubLine/${psId}`, {
      page: page,
    });
  }
  // CRUD
  static async create(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/${projectVersionId}/PoleSubLine`, data);
  }

  static async update(data, projectVersionId) {
    data.projectId = projectData.value._id;
    return put(`/powersystem/${projectData.value._id}/${projectVersionId}/PoleSubLine/${data._id}`, data);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/${projectVersionId}/PoleSubLine/${psId}`);
  }
}

export class DynamicModelApi {
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
export class DynamicDefaultApi {
  static async getDynamicDefaultList(additionVersion_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersion_id}/dynamicModelDefault`, { page: page });
  }

  static async getDynamicDefaultListWithTree(additionVersion_id, parent_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersion_id}/${parent_id}/dynamicModelDefault`, {
      page: page,
    });
  }
  static async createDynamicDefault(additionVersion_id, data) {
    return post(`addition/${projectData.value._id}/${additionVersion_id}/dynamicModelDefault`, data);
  }

  static async updateDynamicDefault(additionVersion_id, dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${additionVersion_id}/dynamicModelDefault/${dynamicModel_id}`, data);
  }
  static async deleteDynamicDefault(additionVersion_id, dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${additionVersion_id}/dynamicModelDefault/${dynamicModel_id}`);
  }
}

import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectData } = storeToRefs(commonStore);

import DSA_Common from '@/combosables/DSA_common';
const { convertTimeStringToInt } = DSA_Common();

console.log('projectId', projectData.value._id);
console.log('psm_active', psm_active.value._id);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class DefinitionListApi {
  static async getDefinitionListInStation(projectVersionId, parentId = undefined) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/child?`, {
      parent_id: parentId,
    });
  }
}

export class PowerSystemParameterApi {
  static async getPsDataWithDefinition(definitionId, projectVersionId, stationId) {
    return get(`/powersystem/${projectData.value._id}/${projectVersionId}/station/${stationId}/${definitionId}`);
  }
  static async getNodeDataWithDefinition(projectVersionId, stationId) {
    return get(`/powersystem/${projectData.value._id}/${projectVersionId}/node/${stationId}`);
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
      url += psdDefinition_id ? '&' : '?' + `query=${query}`;
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
        powerSystemDefinitionId: data.engineInfo.powerSystemDefinitionId,
        values: data.engineInfo.values,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${data._id}`, updateData);
  }

  static async delete(psId, projectVersionId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemems/${projectVersionId}/${psId}`);
  }
}

export class SubLineApi {
  static async getData(psId, projectVersionId, page = 1) {
    return get(`/powersystem/${projectData.value._id}/${projectVersionId}/PoleSubLine/${psId}`, {
      page: page,
    });
  }
}

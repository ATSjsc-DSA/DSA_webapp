import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, powerSystemVersionId } = storeToRefs(commonStore);

export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class DefinitionListApi {
  static async getDefinitionListInStation(parentId = undefined) {
    return get(`/powersystem/${projectData.value._id}/powersystemdata/${powerSystemVersionId.value}/child?`, {
      parent_id: parentId,
    });
  }
}

export class PowerSystemParameterApi {
  static async getPsDataWithDefinition(definitionId, stationId) {
    return get(
      `/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/station/${stationId}/${definitionId}`,
    );
  }
  static async getNodeDataWithDefinition(stationId) {
    return get(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/node/${stationId}`);
  }
}

export class PowerSystemEmsApi {
  static async getPsDataWithDefinition(definitionId, data = {}, page = 1) {
    return get(
      `/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/definition/${definitionId}`,
      {
        ...data,
        page: page,
      },
    );
  }

  static async getPsDataWithTree(psId, parentId = undefined, ems_definition_id, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/${psId}`, {
      page: page,
      parentId: parentId,
      ems_definition_id: ems_definition_id,
    });
  }
  static async searchPs(psdDefinition_id = '', query = '', exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/search`;
    if (psdDefinition_id) {
      url += `?psdDefinition_id=${psdDefinition_id}`;
    }
    if (query) {
      url += psdDefinition_id ? '&' : '?' + `query=${query}`;
    }
    return post(url, exceptionArr);
  }
  // CRUD
  static async create(data) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}`, data);
  }

  static async update(data) {
    const updateData = {
      engineInfo: {
        powerSystemDefinitionId: data.engineInfo.powerSystemDefinitionId,
        values: data.engineInfo.values,
      },
    };
    return put(
      `/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/${data._id}`,
      updateData,
    );
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/${psId}`);
  }
}

export class SubLineApi {
  static async getData(psId, page = 1) {
    return get(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/PoleSubLine/${psId}`, {
      page: page,
    });
  }
}

import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, dynamicPsVersionId } = storeToRefs(commonStore);

console.log('projectId', projectData.value._id);
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
    return get(`/powersystem/${projectData.value._id}/parameter/powersystemdefinition`);
  }
  static async getEmsList() {
    return get(`/powersystem/${projectData.value._id}/ems/powersystemdefinition`);
  }

  static async getDefinitionData(definitionId) {
    return get(`/powersystem/${projectData.value._id}/powersystemdefinition/${definitionId}`);
  }

  static async getDefinitionSubsystem() {
    return get(`/powersystem/${projectData.value._id}/subsystem/powersystemdefinition`);
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

  static async getPsDataWithSubsystem(projectVersionId, data = {}, page = 1) {
    return post(`/powersystem/${projectData.value._id}/subsystem/${projectVersionId}/parameter`, {
      ...data,
      page: page,
    });
  }

  static async searchPs(projectVersionId = '66decf1dcff005199529524b', definitionList = [], query, exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemedit/${projectVersionId}/search`;

    if (query) {
      url += `?query=${query}`;
    }
    return post(url, {
      listDefinition: definitionList,
      form_data: exceptionArr,
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

  static async getPowersystemMonitor(psde_id) {
    return get(`/powersystem/powersystemedit/monitor/${psde_id}`);
  }

  static async getPowersystemData(psde_id) {
    return get(`/powersystem/powersystemedit/${psde_id}`);
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

  static async getPsDataWithSubsystem(projectVersionId, data = {}, page = 1) {
    return post(`/powersystem/${projectData.value._id}/subsystem/${projectVersionId}/ems`, {
      ...data,
      page: page,
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
  static async getPowersystemEmsData(pss_id) {
    return get(`/powersystem/powersystems/${pss_id}`);
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
  static async getDynamicModelList(page) {
    return get(`/addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModel`, { page: page });
  }

  static async getDynamicModelListWithTree(parent_id, page) {
    return get(`/addition/${projectData.value._id}/${dynamicPsVersionId.value}/${parent_id}/dynamicModel`, {
      page: page,
    });
  }
  static async createDynamicModel(data) {
    return post(`addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModel`, data);
  }

  static async updateDynamicModel(dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModel/${dynamicModel_id}`, data);
  }
  static async deleteDynamicModel(dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModel/${dynamicModel_id}`);
  }
}
export class DynamicDefaultApi {
  static async getDynamicDefaultList(page) {
    return get(`/addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModelDefault`, { page: page });
  }

  static async getDynamicDefaultListWithTree(parent_id, page) {
    return get(`/addition/${projectData.value._id}/${dynamicPsVersionId.value}/${parent_id}/dynamicModelDefault`, {
      page: page,
    });
  }
  static async createDynamicDefault(data) {
    return post(`addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModelDefault`, data);
  }

  static async updateDynamicDefault(dynamicModel_id, data) {
    return put(
      `addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
      data,
    );
  }
  static async deleteDynamicDefault(dynamicModel_id) {
    return _delete(
      `addition/${projectData.value._id}/${dynamicPsVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
    );
  }
}

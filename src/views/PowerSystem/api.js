import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, additionVersionId, powerSystemVersionId } = storeToRefs(commonStore);

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

  static async openVersion(powerSystemVersionId) {
    return put(`/powersystem/${projectData.value._id}/powersystemversion/${powerSystemVersionId.value}`);
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
  static async getChild(data) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/child`, data);
  }
}

export class PowerSystemParameterApi {
  static async getPsDataWithDefinition(definitionId, data = {}, page = 1) {
    return get(
      `/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/definition/${definitionId}`,
      {
        ...data,
        page: page,
      },
    );
  }

  static async getPsDataWithTree(psId, parentId = undefined, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/${psId}`, {
      page: page,
      parentId: parentId,
    });
  }

  static async getPsDataWithSubsystem(data = {}, page = 1) {
    return post(`/powersystem/${projectData.value._id}/subsystem/${powerSystemVersionId.value}/parameter`, {
      ...data,
      page: page,
    });
  }

  static async searchPs(definitionList = [], query, exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/search`;

    if (query) {
      url += `?query=${query}`;
    }
    return post(url, {
      listDefinition: definitionList,
      form_data: exceptionArr,
    });
  }
  // CRUD
  static async create(data) {
    data.projectId = projectData.value._id;
    data.currentPowerSystemVersionId = powerSystemVersionId.value;
    return post(`/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}`, data);
  }

  static async update(data) {
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
      currentPowerSystemVersionId: powerSystemVersionId.value,
    };
    return put(
      `/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/${data._id}`,
      updateData,
    );
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemedit/${powerSystemVersionId.value}/${psId}`);
  }

  static async getPowersystemMonitor(psde_id) {
    return get(`/powersystem/powersystemedit/monitor/${psde_id}`);
  }

  static async getPowersystemData(psde_id) {
    return get(`/powersystem/powersystemedit/${psde_id}`);
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

  static async getPsDataWithSubsystem(data = {}, page = 1) {
    return post(`/powersystem/${projectData.value._id}/subsystem/${powerSystemVersionId.value}/ems`, {
      ...data,
      page: page,
    });
  }
  static async searchPs(psdDefinition_id = '', query = '', exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}/search`;
    if (psdDefinition_id) {
      url += `?psdDefinition_id=${psdDefinition_id}`;
    }
    if (query) {
      url += (psdDefinition_id ? '&' : '?') + `query=${query}`;
    }
    return post(url, exceptionArr);
  }
  // CRUD
  static async create(data) {
    data.projectId = projectData.value._id;
    data.currentPowerSystemVersionId = powerSystemVersionId.value;

    return post(`/powersystem/${projectData.value._id}/powersystemems/${powerSystemVersionId.value}`, data);
  }

  static async update(data) {
    const updateData = {
      engineInfo: {
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
  static async getPowersystemEmsData(pss_id) {
    return get(`/powersystem/powersystems/${pss_id}`);
  }
}

// pole
export class SubLineApi {
  static async getData(psId, page = 1) {
    return get(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/PoleSubLine/${psId}`, {
      page: page,
    });
  }
  // CRUD
  static async create(data) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/PoleSubLine`, data);
  }

  static async update(data) {
    data.projectId = projectData.value._id;
    return put(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/PoleSubLine/${data._id}`, data);
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/${powerSystemVersionId.value}/PoleSubLine/${psId}`);
  }
}

export class DynamicModelApi {
  static async getDynamicModelList(page) {
    return get(`/addition/${projectData.value._id}/${additionVersionId.value}/dynamicModel`, { page: page });
  }

  static async getDynamicModelListWithTree(parent_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersionId.value}/${parent_id}/dynamicModel`, {
      page: page,
    });
  }
  static async createDynamicModel(data) {
    return post(`addition/${projectData.value._id}/${additionVersionId.value}/dynamicModel`, data);
  }

  static async updateDynamicModel(dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${additionVersionId.value}/dynamicModel/${dynamicModel_id}`, data);
  }
  static async deleteDynamicModel(dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${additionVersionId.value}/dynamicModel/${dynamicModel_id}`);
  }
  static async importDynamicModel(data) {
    return put(`addition/${projectData.value._id}/${additionVersionId.value}/import/dynamicModel`, data);
  }
}
export class DynamicDefaultApi {
  static async getDynamicDefaultList(page) {
    return get(`/addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault`, { page: page });
  }

  static async getDynamicDefaultListWithTree(parent_id, page) {
    return get(`/addition/${projectData.value._id}/${additionVersionId.value}/${parent_id}/dynamicModelDefault`, {
      page: page,
    });
  }
  static async createDynamicDefault(data) {
    return post(`addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault`, data);
  }

  static async updateDynamicDefault(dynamicModel_id, data) {
    return put(
      `addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
      data,
    );
  }
  static async deleteDynamicDefault(dynamicModel_id) {
    return _delete(
      `addition/${projectData.value._id}/${additionVersionId.value}/dynamicModelDefault/${dynamicModel_id}`,
    );
  }

  static async importDynamicDefaultModel(data) {
    return put(`addition/${projectData.value._id}/${additionVersionId.value}/import/dynamicDefaultModel`, data);
  }
}

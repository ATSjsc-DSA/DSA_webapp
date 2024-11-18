import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { projectData, additionVersionId, slotData } = storeToRefs(commonStore);
console.log('slotData', slotData.value._id);
export const VALUE_DATA_NAME = ['EMS', 'PSSE'];

export class ApiVersion {
  // version
  static async getList(page) {
    return get(`/powersystem/${projectData.value._id}/powersystemversion`, {
      page: page,
      page_size: 10,
    });
  }

  static async rollbackVersion(versionId) {
    return put(`/powersystem/${projectData.value._id}/powersystemversion/${slotData.value._id}`);
  }

  static async saveVersion(data) {
    return post(`/powersystem/${projectData.value._id}/${slotData.value._id}/newversion_powersystem`, data);
  }

  static async createNewVersion(nameVersion, scheduledOperationTime) {
    return post(`/powersystem/${projectData.value._id}/newversion_powersystem`, {
      name: nameVersion,
      // tạo sẵn `scheduledOperationTime` chưa gửi
      // scheduledOperationTime: convertTimeStringToInt(scheduledOperationTime),
    });
  }
}

export class ApiCompare {
  static async getComparePSD() {
    return get(`/powersystem/${projectData.value._id}/${slotData.value._id}/compare_powersystem`);
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
    return get(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/child`, data);
  }
}

export class PowerSystemParameterApi {
  static async getPsDataWithDefinition(definitionId, data = {}, page = 1) {
    return get(
      `/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/definition/${definitionId}`,
      {
        ...data,
        page: page,
      },
    );
  }
  static async getPsDataWithTree(psId, parentId = undefined, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/tree/${psId}`, {
      page: page,
      parentId: parentId,
    });
  }

  static async getPsDataWithSubsystem(data = {}, page = 1) {
    return post(
      `/powersystem/${projectData.value._id}/subsystem/${slotData.value._id}/parameter?page=${page}&page_size=10`,
      {
        ...data,
      },
    );
  }

  static async searchPs(definitionList = [], query, exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/search`;

    if (query) {
      url += `?query=${query}`;
    }
    return post(url, {
      listDefinition: definitionList,
      form_data: exceptionArr,
    });
  }
  // CRUD
  static async importPowerSystemData(data) {
    return put(`/powersystem/${projectData.value._id}/${slotData.value._id}/upload`, data);
  }

  static async create(data) {
    data.projectId = projectData.value._id;
    data.currentPowerSystemVersionId = slotData.value._id;
    return post(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}`, data);
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
      currentPowerSystemVersionId: slotData.value._id,
    };
    return put(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/${data._id}`, updateData);
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/${psId}`);
  }

  static async getPowersystemMonitor(psde_id) {
    return get(`/powersystem//${projectData.value._id}/${slotData.value._id}/powersystemdata/monitor/${psde_id}`);
  }

  static async getPowersystemData(psde_id) {
    return get(`/powersystem/${projectData.value._id}/powersystemdata/${slotData.value._id}/data/${psde_id}`);
  }
}

export class PowerSystemEmsApi {
  static async getPsDataWithDefinition(definitionId, data = {}, page = 1) {
    return get(
      `/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/definition/${definitionId}`,
      {
        ...data,
        page: page,
      },
    );
  }

  static async getPsDataWithTree(psId, parentId = undefined, ems_definition_id, page = 1) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/tree/${psId}`, {
      page: page,
      parentId: parentId,
      ems_definition_id: ems_definition_id,
    });
  }

  static async getPsDataWithSubsystem(data = {}, page = 1) {
    return post(`/powersystem/${projectData.value._id}/subsystem/${slotData.value._id}/ems`, {
      ...data,
      page: page,
    });
  }
  static async searchPs(definitionList = [], query = '', exceptionArr = []) {
    let url = `/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/search`;
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
    data.currentPowerSystemVersionId = slotData.value._id;

    return post(`/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}`, data);
  }

  static async update(data) {
    const updateData = {
      engineInfo: {
        values: data.engineInfo.values,
      },
    };
    return put(`/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/${data._id}`, updateData);
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/${psId}`);
  }
  static async getPowersystemEmsData(pss_id) {
    return get(`/powersystem/${projectData.value._id}/powersystemems/${slotData.value._id}/data/${pss_id} `);
  }
}

// pole
export class SubLineApi {
  static async getData(psId, page = 1) {
    return get(`/powersystem/${projectData.value._id}/${slotData.value._id}/PoleSubLine/${psId}`, {
      page: page,
    });
  }
  // CRUD
  static async create(data) {
    data.projectId = projectData.value._id;
    return post(`/powersystem/${projectData.value._id}/${slotData.value._id}/PoleSubLine`, data);
  }

  static async update(data) {
    data.projectId = projectData.value._id;
    return put(`/powersystem/${projectData.value._id}/${slotData.value._id}/PoleSubLine/${data._id}`, data);
  }

  static async delete(psId) {
    return _delete(`/powersystem/${projectData.value._id}/${slotData.value._id}/PoleSubLine/${psId}`);
  }
}

export class DynamicModelApi {
  static async getDynamicModelList(page) {
    return get(`/addition/${projectData.value._id}/${slotData.value._id}/dynamicModel`, { page: page });
  }

  static async getDynamicModelListWithTree(parent_id, page) {
    return get(`/addition/${projectData.value._id}/${slotData.value._id}/${parent_id}/dynamicModel`, {
      page: page,
    });
  }
  static async createDynamicModel(data) {
    return post(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModel`, data);
  }

  static async updateDynamicModel(dynamicModel_id, data) {
    return put(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModel/${dynamicModel_id}`, data);
  }
  static async deleteDynamicModel(dynamicModel_id) {
    return _delete(`addition/${projectData.value._id}/${slotData.value._id}/dynamicModel/${dynamicModel_id}`);
  }
  static async importDynamicModel(data) {
    return put(`addition/${projectData.value._id}/${slotData.value._id}/import/dynamicModel`, data);
  }
}

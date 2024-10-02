import { get, post, put, _delete } from '@/utils/request';

export default class api {
  // GD list
  static TypeGlobalDynamicModelDefinition = {
    Traditional: {
      Generator: 'Generator',
      Excitation: 'Excitation',
      Governor: 'Governor',
      Stabilizer: 'Stabilizer',
    },
    Renewable: {
      Generic: 'Generic',
      Renewable: 'Renewable',
      PlanControl: 'PlanControl',
      DriveTrain: 'DriveTrain',
    },
  };

  //  Dynamic Definition;

  static async getGlobalDynamicModelDefinitionList(page = 1) {
    return get(`/common/globaldynamicmodeldefinition`, {
      page: page,
    });
  }

  static async getGlobalDynamicModelDefinitionByType(type) {
    return get(`/common/globaldynamicmodeldefinition/${type}`);
  }

  static async getGlobalDynamicModelDefinitionById(modelId) {
    return get(`/common/globaldynamicmodeldefinition/${modelId}`);
  }

  static async searchGlobalDynamicModelDefinition(query = '') {
    if (query) {
      return post(`/common/globaldynamicmodeldefinition/search?query=${query}`, []);
    }
    return post(`/common/globaldynamicmodeldefinition/search`, []);
  }
  static async createGlobalDynamicModelDefinitionList(data) {
    return post(`/common/globaldynamicmodeldefinition`, data);
  }

  static async updateGlobalDynamicModelDefinition(dynamicDefinition_id, data) {
    return put(`/common/globaldynamicmodeldefinition/${dynamicDefinition_id}`, data);
  }

  static async deleteGlobalDynamicModelDefinition(dynamicDefinition_id) {
    return _delete(`/common/globaldynamicmodeldefinition/${dynamicDefinition_id}`);
  }

  static async uploadGlobalDynamicModelDefinitionFile(data) {
    return put(`/common/upload/globaldynamicmodeldefinition`, data);
  }

  static async exportGlobalDynamicModelDefinitionFile() {
    return put(`/common/download/globaldynamicmodeldefinition`);
  }

  //  Dynamic Mapping;
  static async getGlobalDynamicModelMappingList(page = 1) {
    return get(`/common/globaldynamicmodelmapping`, {
      page: page,
    });
  }
  static async createGlobalDynamicModelMappingList(data) {
    return post(`/common/globaldynamicmodelmapping`, data);
  }

  static async updateGlobalDynamicModelMapping(dynamicMapping_id, data) {
    return put(`/common/globaldynamicmodelmapping/${dynamicMapping_id}`, data);
  }

  static async deleteGlobalDynamicModelMapping(dynamicMapping_id) {
    return _delete(`/common/globaldynamicmodelmapping/${dynamicMapping_id}`);
  }

  static async uploadGlobalDynamicModelMappingFile(data) {
    return put(`/common/upload/globaldynamicmodeldefinitionmapping`, data);
  }

  static async exportGlobalDynamicModelMappingFile() {
    return put(`/common/download/globaldynamicmodeldefinitionmapping`);
  }
}

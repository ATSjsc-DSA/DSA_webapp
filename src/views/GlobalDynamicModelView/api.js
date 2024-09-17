import { get, post, put, _delete } from '@/utils/request';

export default class api {
  // GD list
  static TypeGlobalDynamicModelDefinition = {
    Traditional: {
      Generator: 'Generator',
      Excitation: 'Excitation ',
      Governor: 'Governor',
      Stabilizer: 'Stabilizer',
    },
    Renews: {
      Generic: 'Generic',
      Renewable: 'Renewable',
      PlanControl: 'PlanControl',
      DriveTrain: 'DriveTrain',
    },
  };

  //  Dynamic Definition;

  static async getGlobalDynamicModelDefinitionList( page = 1) {
    return get(`/common/globaldynamicmodeldefinition`, {
      page: page,
    });
  }

  static async createGlobalDynamicModelDefinitionList( data) {
    return post(`/common/globaldynamicmodeldefinition`, data);
  }

  static async updateGlobalDynamicModelDefinition( dynamicDefinition_id, data) {
    return put(`/common/globaldynamicmodeldefinition/${dynamicDefinition_id}`, data);
  }

  static async deleteGlobalDynamicModelDefinition( dynamicDefinition_id) {
    return _delete(`/common/globaldynamicmodeldefinition/${dynamicDefinition_id}`);
  }

  //  Dynamic Mapping;
  static async getGlobalDynamicModelMappingList( page = 1) {
    return get(`/common/globaldynamicmodelmapping`, {
      page: page,
    });
  }
  static async createGlobalDynamicModelMappingList( data) {
    return post(`/common/globaldynamicmodelmapping`, data);
  }

  static async updateGlobalDynamicModelMapping( dynamicMapping_id, data) {
    return put(`/common/globaldynamicmodelmapping/${dynamicMapping_id}`, data);
  }

  static async deleteGlobalDynamicModelMapping( dynamicMapping_id) {
    return _delete(`/common/globaldynamicmodelmapping/${dynamicMapping_id}`);
  }
}

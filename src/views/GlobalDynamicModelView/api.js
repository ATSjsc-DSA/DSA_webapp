import { get, post, put, _delete } from '@/utils/request';

export default class api {
  // GD list
  static TypeGlobalDynamicModelDefinition = {
    Traditional: {
      Generator: 'Generator',
      Excitation: 'Excitation ',
      Governor: 'Governor',
      Generic: 'Generic',
    },
    Renew: {
      Stabilizer: 'Stabilizer',
      Renewable: 'Renewable',
      PlanControl: 'PlanControl',
      DriveTrain: 'DriveTrain',
    },
  };

  //  Dynamic Definition;

  static async getGlobalDynamicModelDefinitionList(globaldefinition_id, page = 1) {
    return get(`/common/${globaldefinition_id}/globaldynamicmodeldefinition`, {
      page: page,
    });
  }

  static async createGlobalDynamicModelDefinitionList(globaldefinition_id, data) {
    return post(`/common/${globaldefinition_id}/globaldynamicmodeldefinition`, data);
  }

  //  Dynamic Mapping;
  static async getGlobalDynamicModelMappingList(globaldefinition_id, page = 1) {
    return get(`/common/${globaldefinition_id}/globaldynamicmodelmapping`, {
      page: page,
    });
  }
}

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

  static async getGlobaldefinitionList(page = 1) {
    return get('/common/globaldefinition', {
      page: page,
    });
  }

  //  Dynamic Definition;

  static async getGlobalDynamicModelDefinitionList(globaldefinition_id, page = 1) {
    return get(`/common/${globaldefinition_id}/globaldynamicmodeldefinition`, {
      page: page,
    });
  }

  //  Dynamic Mapping;
  static async getGlobalDynamicModelMappingList(globaldefinition_id, page = 1) {
    return get(`/common/${globaldefinition_id}/globaldynamicmodelmapping`, {
      page: page,
    });
  }
}

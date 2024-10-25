import { get, post } from '@/utils/request';
import VSA from '../ConfigurationView/components/VSA.vue';
import Monitor from '../ConfigurationView/components/Monitor.vue';

export class CommonApi {}

export class VsaApi {
  /* 
  vsa Tree 
  app 
  --> VSA
      --> Case
          --> Monitor (subcase)
              --> Curse (Power System)
                 --> Type
          --> Export (subcase)
              --> Curse (Power System)
                 --> Type

  vẽ chart của 1 list type 
 */
  static async getVsaList(application_id) {
    return get(`/hmi/applications/${application_id}/vsa`);
  }

  static async getCaseList(vsa_id) {
    return get(`/hmi/vsa/${vsa_id}/case`);
  }

  static async getMonitorList(case_id) {
    return get(`/hmi/vsa/case/${case_id}/caseMonitor`);
  }

  static async getExportList(case_id) {
    return get(`/hmi/vsa/case/${case_id}/caseExport`);
  }

  // subcaseId is monitorId or ExportId
  static async getCurveList(subcaseId) {
    return get(`/hmi/vsa/subcase/${subcaseId}/curve`);
  }

  static async getTypeList(subcaseId, curveId) {
    return get(`/hmi/vsa/curve/${subcaseId}/${curveId}/curveType`);
  }
  static async getChartData(caseId, typeList = []) {
    return post(`/hmi/curvevsa/${caseId}/chart`, { payload: typeList });
  }
}
export class TsaApi {
  /* 
  Tsa Tree 
  app 
  --> TSA
      --> Case
          --> SubCase
              --> Curse (Power System)
                 --> Type

  vẽ 2 chart của 1  type 
 */
  static async getTsaList(application_id) {
    return get(`/hmi/applications/${application_id}/tsa`);
  }
  static async getCaseList(tsaId) {
    return get(`/hmi/tsa/${tsaId}/case`);
  }
  static async getSubcaseList(caseId) {
    return get(`/hmi/tsa/case/${caseId}/subcase`);
  }
  static async getCurveList(subcaseId) {
    return get(`/hmi/tsa/subcase/${subcaseId}/curve`);
  }
  static async getTypeList(subcaseId, curveId) {
    return get(`/hmi/tsa/curve/${subcaseId}/${curveId}/curveType`);
  }
  static async getChartData(caseId, typeId = '') {
    return post(`/hmi/curvetsa/${caseId}/chart`, { payload: [typeId] });
  }
}

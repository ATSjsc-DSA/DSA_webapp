import { get, post } from '@/utils/request';

export class api {
  static async GetVsaHmiWithApp(application_id) {
    return get(`/hmiapplications/${application_id}/vsa`);
  }

  static async GetTsaHmiWithApp(application_id) {
    return get(`/hmiapplications/${application_id}/tsa`);
  }

  static async GetCaseOnVsa(vsa_id) {
    return get(`/hmivsa/${vsa_id}/case`);
  }

  static async GetMonitorList(case_id) {
    return get(`/hmivsa/case/${case_id}/caseMonitor`);
  }

  static async GetExportList(case_id) {
    return get(`/hmivsa/case/${case_id}/caseExport`);
  }

  // subcaseId is monitorId or ExportId
  static async GetCurveList(subcaseId) {
    return get(`/hmivsa/subcase/${subcaseId}/curve`);
  }

  static async GetTypeList(subcaseId, curveId) {
    return get(`/hmivsa/curve/${subcaseId}/${curveId}/curveType`);
  }

  static async GetTypeData(curve_id) {
    return get(`/hmicurve/${curve_id}`);
  }

  static async GetChartData(caseId, typeList = []) {
    return post(`/hmicurve/${caseId}/chart`, { payload: typeList });
  }
}

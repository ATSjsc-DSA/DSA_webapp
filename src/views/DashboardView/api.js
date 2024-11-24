import { get, post, put } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { measInfoActive, projectData } = storeToRefs(commonStore);

export class ApplicationApi {
  static async getBarChartData(appId = '') {
    return get(`/hmi/${measInfoActive.value._id}/app/${appId}`);
  }
  static async getRadarChartData(appId = '') {
    return get(`/hmi/${measInfoActive.value._id}/radar/app/${appId}`);
  }

  static async getBarTimeSeriesChartData(appId = '', startTime = 0, endTime = 0) {
    return get(`/hmi/app/timeseries/${appId}`, {
      startTime: parseInt(startTime),
      endTime: parseInt(endTime),
    });
  }
}

export class CommonApi {
  static async getDsaService() {
    return get(`/common/${projectData.value._id}/dsa/service`);
  }
  static async getAppList(userConfigProfileIdActive = '') {
    return get(`/hmi/${userConfigProfileIdActive}/applications`);
  }
  static async getDsaModuleList(app_id) {
    return get(`hmi/dsamodule/${app_id}`);
  }
  static async getProjectRadarChartData() {
    return get(`/hmi/${measInfoActive.value._id}/radar/project/${projectData.value._id}`);
  }
  static async getLogs() {
    return get(`/common/${projectData.value._id}/dsa/logs`);
  }
}

export class VsaApi {
  /*
  vsa Tree
    app
    --> DSA module
        --> VSA
            --> Case
                --> Curse
  vẽ chart của 1 list Curse
 */
  static async getVsaList(dsaId) {
    return get(`/hmi/${measInfoActive.value._id}/child/vsa/module/${dsaId}`);
  }
  static async getCaseList(vsa_info_id) {
    return get(`hmi/${measInfoActive.value._id}/child/vsa/case/${vsa_info_id}`);
  }

  static async updateVsaCase(vsaCaseId, data) {
    return put(`hmi/vsa/case/${vsaCaseId}`, data);
  }
  static async getCurveList(vsa_info_id, case_info_id) {
    return get(`hmi/${measInfoActive.value._id}/child/vsa/curve/${vsa_info_id}/${case_info_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${measInfoActive.value._id}/chart/vsa/curve`, { payload: curveNameList });
  }
}

export class TsaApi {
  /*
    tsa Tree
    app
    --> DSA module
        --> TSA
            --> Case
                --> SubCase
                    --> Curse
    vẽ chart của 1 list Curse
   */
  static async getTsaList(dsaId) {
    return get(`/hmi/${measInfoActive.value._id}/child/tsa/module/${dsaId}`);
  }
  static async getCaseList(tsa_info_id) {
    return get(`hmi/${measInfoActive.value._id}/child/tsa/case/${tsa_info_id}`);
  }
  static async updateTsaCase(tsaCaseId, data) {
    return put(`hmi/tsa/case/${tsaCaseId}`, data);
  }
  static async getSubCaseList(tsa_info_id, tsa_case_id) {
    return get(`hmi/${measInfoActive.value._id}/child/tsa/subCase/${tsa_info_id}/${tsa_case_id}`);
  }
  static async getCurveList(subCase_id) {
    return get(`hmi/child/tsa/curve/${subCase_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${measInfoActive.value._id}/chart/tsa/curve`, { payload: curveNameList });
  }
}

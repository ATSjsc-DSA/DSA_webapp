import { get, post, put } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { measInfoActiveId, projectData, userConfigProfileIdActive } = storeToRefs(commonStore);

export class ApplicationApi {
  static async getBarChartData(appId = '') {
    return get(`/hmi/${measInfoActiveId.value}/app/${appId}`);
  }
  static async getRadarChartData(appId = '') {
    return get(`/hmi/${measInfoActiveId.value}/radar/app/${appId}`);
  }
}

export class CommonApi {
  static async getAppList() {
    return get(`/hmi/${userConfigProfileIdActive.value}/applications`);
  }
  static async getDsaModuleList(app_id) {
    return get(`hmi/dsamodule/${app_id}`);
  }
  static async getProjectRadarChartData() {
    return get(`/hmi/${measInfoActiveId.value}/radar/project/${projectData.value._id}`);
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
    return get(`/hmi/${measInfoActiveId.value}/child/vsa/module/${dsaId}`);
  }
  static async getCaseList(vsa_info_id) {
    return get(`hmi/${measInfoActiveId.value}/child/vsa/case/${vsa_info_id}`);
  }

  static async updateVsaCase(vsaCaseId, data) {
    return put(`hmi/vsa/case/${vsaCaseId}`, data);
  }
  static async getCurveList(vsa_info_id, case_info_id) {
    return get(`hmi/${measInfoActiveId.value}/child/vsa/curve/${vsa_info_id}/${case_info_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${measInfoActiveId.value}/chart/vsa/curve`, { payload: curveNameList });
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
    return get(`/hmi/${measInfoActiveId.value}/child/tsa/module/${dsaId}`);
  }
  static async getCaseList(tsa_info_id) {
    return get(`hmi/${measInfoActiveId.value}/child/tsa/case/${tsa_info_id}`);
  }
  static async updateTsaCase(tsaCaseId, data) {
    return put(`hmi/tsa/case/${tsaCaseId}`, data);
  }
  static async getSubCaseList(tsa_info_id, tsa_case_id) {
    return get(`hmi/${measInfoActiveId.value}/child/tsa/subCase/${tsa_info_id}/${tsa_case_id}`);
  }
  static async getCurveList(subCase_id) {
    return get(`hmi/child/tsa/curve/${subCase_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${measInfoActiveId.value}/chart/tsa/curve`, { payload: curveNameList });
  }
}

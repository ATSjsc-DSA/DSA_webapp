import { get, post } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { hmiTaskId, projectData, userConfigVersionId } = storeToRefs(commonStore);

export class ApplicationApi {
  static async getBarChartData(appId = '') {
    return get(`/hmi/task/${hmiTaskId.value}/app/${appId}`);
  }
  static async getRadarChartData(appId = '') {
    return get(`/hmi/task/${hmiTaskId.value}/radar/app/${appId}`);
  }
}

export class CommonApi {
  static async getAppList() {
    return get(`/hmi/${projectData.value._id}/${userConfigVersionId.value}/applications`);
  }
  static async getDsaModuleList(app_id) {
    return get(`hmi/${projectData.value._id}/${userConfigVersionId.value}/${app_id}/dsamodule`);
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
    return get(`/hmi/${hmiTaskId.value}/child/vsa/module/${dsaId}`);
  }
  static async getCaseList(vsa_info_id) {
    return get(`hmi/${hmiTaskId.value}/child/vsa/case/${vsa_info_id}`);
  }

  static async getCurveList(vsa_info_id, case_info_id) {
    return get(`hmi/${hmiTaskId.value}/child/vsa/curve/${vsa_info_id}/${case_info_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${hmiTaskId.value}/chart/vsa/curve`, { payload: curveNameList });
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
    return get(`/hmi/${hmiTaskId.value}/child/tsa/module/${dsaId}`);
  }
  static async getCaseList(tsa_info_id) {
    return get(`hmi/${hmiTaskId.value}/child/tsa/case/${tsa_info_id}`);
  }
  static async getSubCaseList(tsa_info_id, tsa_case_id) {
    return get(`hmi/${hmiTaskId.value}/child/tsa/subCase/${tsa_info_id}/${tsa_case_id}`);
  }
  static async getCurveList(subCase_id) {
    return get(`hmi/child/tsa/curve/${subCase_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/${hmiTaskId.value}/chart/tsa/curve`, { payload: curveNameList });
  }
}

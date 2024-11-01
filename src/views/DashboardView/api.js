import { get, post } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { hmiTaskId, projectData, userConfigVersionId } = storeToRefs(commonStore);

export class ApplicationApi {
  static async getChartData(appId = '') {
    return get(`/hmi/task/${hmiTaskId.value}/app/${appId}`);
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
    return get(`/hmi/task/${hmiTaskId.value}/child/vsa/module/${dsaId}`);
  }
  static async getCaseList(vsa_info_id) {
    return get(`hmi/child/vsa/case/${vsa_info_id}`);
  }

  static async getCurveList(vsa_info_id, case_info_id) {
    return get(`hmi/child/vsa/curve/${vsa_info_id}/${case_info_id}`);
  }
  static async getChartData(curveNameList = []) {
    return post(`hmi/chart/vsa/curve`, { payload: curveNameList });
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
    return get(`/hmi/task/${hmiTaskId.value}/child/tsa/module/${dsaId}`);
  }
  static async getCaseList(tsaName) {
    return get(`hmi/child/tsa/case/${tsaName}`);
  }
  static async getSubCaseList(caseName) {
    return get(`hmi/child/tsa/subCase/${caseName}`);
  }
  static async getCurveList(subCaseName) {
    return get(`hmi/child/tsa/curve/${subCaseName}`);
  }
  static async getChartData(curveList = []) {
    return post(`hmi/chart/tsa/curve`, { payload: curveList });
  }
}

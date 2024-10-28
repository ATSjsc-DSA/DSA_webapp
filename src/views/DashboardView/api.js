import { get, post } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { hmiTaskId } = storeToRefs(commonStore);

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
  static async getCaseList(vsaName) {
    return get(`hmi/child/vsa/case/${vsaName}`);
  }
  static async getCurveList(caseName) {
    return get(`hmi/child/vsa/curve/${caseName}`);
  }
  static async getChartData(curveList = []) {
    return post(`hmi/chart/vsa/curve`, { payload: curveList });
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

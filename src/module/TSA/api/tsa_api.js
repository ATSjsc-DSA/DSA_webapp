import { get, post } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

export default class TSA_api {
  static async getSpsCodeInfo(code_name) {
    return get('/tsa/' + code_name + '/' + psm_active.value._id);
  }
  static async getDetailTC(typeLine) {
    return get('/tsa/TC/' + psm_active.value._id + '/' + typeLine);
  }
  static async getListTypeLine() {
    return get('/tsa/tttg/listTypeLine');
  }
  static async getLineData(typeline, code_name) {
    return get('/tsa/Line/' + psm_active.value._id + '/' + typeline + '/' + code_name);
  }
  static async getListLineWithType(typeline) {
    return get('/tsa/Line/' + psm_active.value._id + '/' + typeline);
  }
  static async getTransCapData() {
    return get('/tsa/tttg/TransferCapacity');
  }
  static async getListAreaTC() {
    return get('/tsa/TC/' + psm_active.value._id);
  }
}

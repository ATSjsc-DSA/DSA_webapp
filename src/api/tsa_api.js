import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getSpsCodeInfo(code_name) {
    return get('/tsa/' + code_name);
  }
  static async getDetailTC(param) {
    return get('/tsa/TC/', param);
  }
  static async getListTypeLine() {
    return get('/tsa/tttg/listTypeLine');
  }
  static async getLineData(param) {
    return get('/tsa/Line/', param);
  }
  static async getListLineWithType(param) {
    return get('/tsa/Line/', param);
  }
  static async getTransCapData() {
    return get('/tsa/tttg/TransferCapacity');
  }
  static async getListAreaTC() {
    return get('/tsa/TC');
  }
}

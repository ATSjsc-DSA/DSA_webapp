import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getSpsCodeInfo(code_name) {
    return get('/tsa/sps/' + code_name);
  }
  static async getTransCap() {
    return get('/tsa/gtth/TransferCapacity');
  }
  static async getLineData(line_name) {
    return get('/tsa/line/' + line_name);
  }
  static async getListLine() {
    return get('/tsa/line');
  }
}

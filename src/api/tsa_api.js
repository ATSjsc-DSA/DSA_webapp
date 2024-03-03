import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getSpsCodeInfo(code_name) {
    return get('/tsa/sps/' + code_name);
  }
  static async getTransCap(line_name) {
    return get('/tsa/tttg/TransferCapacity/' + line_name);
  }
  static async getListTypeLine() {
    return get('/tsa/tttg/listTypeLine');
  }
  static async getLineData(line_name) {
    return get('/tsa/line/' + line_name);
  }
  static async getListLineWithType(type_line) {
    return get('/tsa/listLine/' + type_line);
  }
}

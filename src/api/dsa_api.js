import { get, post } from '@/utils/request';

export default class DSA_api {
  static async getListSub() {
    return get('/dsa/listSub');
  }
  static async getdataSub() {
    return get('/dsa/dataSub');
  }
  static async getListLine() {
    return get('/dsa/listLine');
  }
  static async voltageStandards() {
    return get('/dsa/voltageStandards');
  }
  static async ssrStandards() {
    return get('/dsa/SSRStandards');
  }
  static async lineLoadingStandards() {
    return get('/dsa/lineLoadingStandards');
  }
}

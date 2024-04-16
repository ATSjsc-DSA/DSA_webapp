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
  static async tsaStandards() {
    return get('/dsa/TSAStandards');
  }
  static async vsaStandards() {
    return get('/dsa/VSAStandards');
  }
  static async lineLoadingStandards() {
    return get('/dsa/lineLoadingStandards');
  }
  static async transStandards() {
    return get('/dsa/transStandards');
  }
  static async generatorStandards() {
    return get('/dsa/generatorStandards');
  }
  static async excitationLimiterStandards() {
    return get('/dsa/excitationLimiterStandards');
  }
  static async getLogs() {
    return get('/dsa/logs');
  }

  // ---- setting ----
  static async getSetting() {
    return get('/dsa');
  }
  static async getSettingWithTime(time) {
    return get('/dsa/' + time);
  }
  static async createSetting(data) {
    return post('/dsa', data);
  }
}

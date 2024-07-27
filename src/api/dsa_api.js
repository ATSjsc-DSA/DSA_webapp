import { get, post, put, _delete } from '@/utils/request';

export default class DSA_api {
  static async getListSub() {
    return get('/dsa/listSub');
  }
  static async getdataCriteria() {
    return get('/dsa/criteria');
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
  static async putLogsViewed(data) {
    return put('/dsa/logs', data);
  }

  // ---- setting profile----
  static async getProfile(param) {
    return get('/dsa/profile', param);
  }
  static async getProfileWithTime(time) {
    return get('/dsa/profile/' + time);
  }
  static async createProfile(data) {
    return post('/dsa/profile', data);
  }
  static async activeProfile(param) {
    return put('/dsa/profile/' + param);
  }

  static async deleteProfile(param) {
    return _delete('/dsa/profile/' + param);
  }

  // initSetingView
  static async getArea() {
    return get('/dsa/area');
  }
  static async getAreaWithoutEquip() {
    return get('/dsa/data/area');
  }
  static async createArea(data) {
    return post('/dsa/area', data);
  }
  static async deleteArea(param) {
    return _delete('/dsa/area/' + param);
  }
  static async AddDataArea(param, data) {
    return put('/dsa/area/data/' + param, data);
  }
  static async RemoveDataArea(param, data) {
    return _delete('/dsa/area/data/' + param, data);
  }
  static async getListGen(param) {
    return get('/dsa/gen', param);
  }
  static async deleteGen(data) {
    return _delete('/dsa/gen', data);
  }
  static async createGen(data) {
    return post('/dsa/gen', data);
  }
  static async getListLoad(param) {
    return get('/dsa/load', param);
  }
  static async deleteLoad(data) {
    return _delete('/dsa/load', data);
  }
  static async createLoad(data) {
    return post('/dsa/load', data);
  }
  static async getMonitor() {
    return get('/dsa/monitor');
  }
  static async getMonitorWithoutEquip() {
    return get('/dsa/data/monitor');
  }
  static async putGenFile(data) {
    return put('/dsa/gen/upload', data, {}, 0);
  }
  static async putLoadFile(data) {
    return put('/dsa/load/upload', data, {}, 0);
  }
  static async putBranchFile(data) {
    return put('/dsa/branch/upload', data, {}, 0);
  }
  static async putMonFile(data) {
    return put('/dsa/monitor/upload', data, {}, 0);
  }
  static async putConFile(data) {
    return put('/dsa/contingencies/upload', data, {}, 0);
  }
  static async getMonitor() {
    return get('/dsa/monitor');
  }
  static async createMonitor(data) {
    return post('/dsa/monitor', data);
  }
  static async deleteMonitor(param) {
    return _delete('/dsa/monitor/' + param);
  }
  static async AddDataMonitor(param, data) {
    return put('/dsa/monitor/data/' + param, data);
  }
  static async RemoveDataMonitor(param, data) {
    return _delete('/dsa/monitor/data/' + param, data);
  }
  static async getListBranch(param) {
    return get('/dsa/branch', param);
  }
  static async deleteBranch(data) {
    return _delete('/dsa/branch', data);
  }
  static async createBranch(data) {
    return post('/dsa/branch', data);
  }
  static async getDSASetting() {
    return get('/dsa/setting');
  }
  static async UpdateDSASetting(data) {
    return put('/dsa/setting', data);
  }

  //contingencies
  static async getContingencies() {
    return get('/dsa/contingencies');
  }
  static async getContingenciesWithoutEquip() {
    return get('/dsa/data/contingencies');
  }
  static async createContingencies(data) {
    return post('/dsa/contingencies', data);
  }
  static async deleteContingencies(param) {
    return _delete('/dsa/contingencies/' + param);
  }
  static async AddDataContingencies(param, data) {
    return put('/dsa/contingencies/data/' + param, data);
  }
  static async RemoveDataContingencies(param, data) {
    return _delete('/dsa/contingencies/data/' + param, data);
  }
  //
  static async getDSASetting() {
    return get('/dsa/setting');
  }
  //common
  static async getListPSM() {
    return get('/common/psm-list');
  }

  static async getPSMIdActive() {
    return get('/common/psm');
  }

  static async getListPsm() {
    return get('/common/psm-list');
  }

  static async downloadFileGen() {
    return get('/common/download/gen');
  }

  static async downloadFileLoad() {
    return get('/common/download/load');
  }

  static async downloadFileBranch() {
    return get('/common/download/branch');
  }

  static async downloadFileMonitor() {
    return get('/common/download/monitor');
  }

  static async downloadFileCon() {
    return get('/common/download/contingencies');
  }

  static async getSearchContingencies(data, param) {
    return post('/dsa/search', data, param);
  }

  static async getQueueTask(param) {
    return get('/common/task', param);
  }
}

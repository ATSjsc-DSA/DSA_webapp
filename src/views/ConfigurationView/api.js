import { get, post, put, _delete } from '@/utils/request';

export default class api {
  // Area
  static async getListArea(projectId) {
    return get('/global/' + '66cbfbaa4cbf3b8182e3a100' + '/area');
  }
  static async getDetailArea(area_name) {
    return get('/global/' + '66cbfbaa4cbf3b8182e3a100' + '/area/' + area_name);
  }

  static async getDetailArea(area_name) {
    return get('/global/' + '66cbfbaa4cbf3b8182e3a100' + '/area/' + area_name);
  }
}

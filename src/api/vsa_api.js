import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getAreaList() {
    return get('/vsa/area');
  }
  static async getBusbarList(area) {
    return get('/vsa/sub/' + area);
  }
  static async detailBusBar(area, payload) {
    return post('/vsa/sub/' + area, payload);
  }
}

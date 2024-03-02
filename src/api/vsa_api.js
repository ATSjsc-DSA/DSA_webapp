import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getAreaList() {
    return get('/vsa/areaList');
  }
  static async getBusbarList(area) {
    return get('/vsa/detail/' + area);
  }
  static async detailBusBar(area, payload) {
    return post('/vsa/' + area, payload);
  }
}

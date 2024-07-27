import { get, post } from '@/utils/request';

export default class SSR_api {
  static async getSubInfo(sub_name) {
    return get('/ssr/' + sub_name);
  }
  static async getGenList() {
    return get('/ssr');
  }
}

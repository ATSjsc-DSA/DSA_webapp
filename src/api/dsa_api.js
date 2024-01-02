import { get, post } from '@/utils/request';

export default class DSA_api {
  static async getListSub() {
    return get('/dsa/listSub');
  }
}

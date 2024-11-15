import { get } from '@/utils/request';

export class Api {
  static async getList() {
    return get(`/common/slot`);
  }
}

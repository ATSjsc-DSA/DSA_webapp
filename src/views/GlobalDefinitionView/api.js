import { get, post, put, _delete } from '@/utils/request';

export default class api {
  static async getGlobaldefinitionList(page = 1) {
    return get('/common/globaldefinition', {
      page: page,
    });
  }
}

import { get, post, put, _delete } from '@/utils/request';

export default class api {
  static async getList(page = 1) {
    return get('/common/globaldefinition', {
      page: page,
    });
  }

  static async createGlobaldefinition(data) {
    return post('/common/globaldefinition', data);
  }

  static async editGlobaldefinition(id, data) {
    return put(`/common/globaldefinition/${id}`, data);
  }
  static async deleteGlobaldefinition(id) {
    return _delete(`/common/globaldefinition/${id}`);
  }
}

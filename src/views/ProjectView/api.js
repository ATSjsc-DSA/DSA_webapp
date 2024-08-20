import { get, post, put, _delete } from '@/utils/request';

export default class api {
  static async getProjectList(param) {
    return get('/project', param);
  }
  static async createProject(data) {
    return post('/project', data);
  }
  static async deleteroject(id) {
    return _delete('/project/' + id);
  }
}

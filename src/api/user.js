import { post, get, put, _delete } from '@/utils/request';

export default class User {
  /**
   *
   * @param {String} username
   * @param {String} password
   * @returns
   */
  static async login(username, password) {
    return post('/login', {
      username,
      password,
    });
  }

  static async getUserActive() {
    return get('/auth/user/active');
  }

  static async getUsers() {
    return get('/auth/users');
  }

  static async addUsers(data) {
    return post('/register', data);
  }

  static async updateUser(param, data) {
    return put('/auth/user/' + param, data);
  }

  static async deleteUser(param) {
    return _delete('/auth/user/' + param);
  }

  static async updateOperatorPassword(data) {
    return put('/auth/user/active', data);
  }
}

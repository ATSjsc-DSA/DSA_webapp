import { post } from '@/utils/request';

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
}

import axios from 'axios';
import router from '@/router';

import { BASE_URL } from '@/Constants';
const instance = axios.create({
  baseURL: BASE_URL + '/api',
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    /**
     * const token = getToken()
     * if (token) {
     *  config.headers.token = token
     * }
     */
    const token = localStorage.getItem('token');
    const isLoggedIn = Boolean(token !== undefined);
    // const isApiUrl = config.url.startsWith(BASE_URL);
    if (isLoggedIn) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    /**
     */
    return response;
  },
  async (error) => {
    const { response } = error;
    if (!response) {
      console.log('SERVER ERROR 500');
      return Promise.reject({
        data: {
          detail: 'SERVER ERROR NO DATA',
        },
      });
    }
    if (response.status === 401) {
      if (response.data.detail === 'jwt expired') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // check refreshToken, func reload login
          localStorage.removeItem('token'); // clear token at localStorage
          localStorage.removeItem('refreshToken'); // clear refreshToken at localStorage
          router.push('/login');
          return Promise.reject(error);
        }
        try {
          const res = await instance.post('/auth/token', {
            refresh_token: refreshToken,
          });
          // set new token
          localStorage.setItem('token', res.data.access_token);

          // update on axios.defaults.headers.common
          instance.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;

          const originalRequest = response.config;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('refreshToken');
          router.push('/');
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('token'); // clear token at localStorage
        localStorage.removeItem('refreshToken'); // clear refreshToken at localStorage
        router.push('/');
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(response);
    }
  },
);

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const post = (url, data = {}, params = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const get = (url, params = {}) => {
  return instance({
    method: 'get',
    url,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const put = (url, data = {}, params = {}, customTimeout = null) => {
  const config = {
    method: 'put',
    url,
    params,
    data,
  };

  // Nếu customTimeout được cung cấp, ghi đè giá trị timeout
  if (customTimeout !== null) {
    config.timeout = customTimeout;
  }

  return instance(config);
};

/**
 * @param {string} url
 * @param {object} params
 * @param {object} data

 */
export const _delete = (url, data = {}, params = {}) => {
  return instance({
    method: 'delete',
    url,
    data,
    params,
  });
};

export default instance;

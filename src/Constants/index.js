export const BASE_URL =
  !import.meta.env.MODE || import.meta.env.MODE === 'development' ? 'http://192.168.110.138:9000' : '';
export const intervalTime = 5000;

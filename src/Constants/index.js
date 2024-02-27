export const BASE_URL =
  !import.meta.env.MODE || import.meta.env.MODE === 'development' ? 'http://192.168.64.14:3000' : '';
export const intervalTime = 5000;

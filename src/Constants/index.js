export const BASE_URL =
  !import.meta.env.MODE || import.meta.env.MODE === 'development' ? 'http://192.169.254.14:3000' : '';

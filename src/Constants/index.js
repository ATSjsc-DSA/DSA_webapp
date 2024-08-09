export const BASE_URL =
  !import.meta.env.MODE || import.meta.env.MODE === 'development' ? 'http://10.10.11.190:9000' : '';

export const intervalTime = 5000;

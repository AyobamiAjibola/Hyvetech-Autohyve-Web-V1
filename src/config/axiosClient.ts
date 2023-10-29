import axios from 'axios';
import settings from './settings';

// axios.defaults.headers.get['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.patch['Content-Type'] = 'application/json';
// axios.defaults.headers.put['Content-Type'] = 'application/json';
// axios.defaults.headers.delete['Accept'] = 'application/json';

axios.defaults.baseURL = settings.api.baseURL;

// Create an axios instance
// const instance = axios.create();

// Add an interceptor to set the Authorization header before each request
axios.interceptors.request.use((config: any) => {
  const token = sessionStorage.getItem(settings.auth.admin);
  // config.headers.Authorization = `Bearer ${token}`;

  // return config;
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  }
});

export default axios;

// import axios from 'axios';

// import settings from './settings';

// axios.defaults.headers.get['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.patch['Content-Type'] = 'application/json';
// axios.defaults.headers.put['Content-Type'] = 'application/json';
// axios.defaults.headers.delete['Accept'] = 'application/json';

// // axios.defaults.withCredentials = true;
// axios.defaults.baseURL = settings.api.baseURL;

// export default (() => {
//   const token = sessionStorage.getItem(settings.auth.admin);

//   // alert((token))
//   axios.defaults.headers.get['Authorization'] = `Bearer ${token}`;
//   axios.defaults.headers.post['Authorization'] = `Bearer ${token}`;
//   axios.defaults.headers.patch['Authorization'] = `Bearer ${token}`;
//   axios.defaults.headers.put['Authorization'] = `Bearer ${token}`;
//   axios.defaults.headers.delete['Authorization'] = `Bearer ${token}`;

//   return axios;
// })();

import axios from 'axios';
import settings from './settings';

axios.defaults.headers.get['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Accept'] = 'application/json';

axios.defaults.baseURL = settings.api.baseURL;

// Create an axios instance
const instance = axios.create();

// Add an interceptor to set the Authorization header before each request
instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(settings.auth.admin);
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;

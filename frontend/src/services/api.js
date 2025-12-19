import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://alimukti.pythonanywhere.com/api';

const api = axios.create({ baseURL });

// Attach Authorization header from localStorage token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }
  return config;
}, (error) => Promise.reject(error));

// Normalize response errors
api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    const data = err?.response?.data || { message: err.message || 'Request failed' };
    return Promise.reject(data);
  }
);

export default api;

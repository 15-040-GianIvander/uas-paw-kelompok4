import axios from 'axios';

const api = axios.create({
  // relative base URL so it works in dev/prod without extra env setup
  baseURL: ''
});

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  const res = await api.get('/api/profile', { headers: getAuthHeader() });
  return res.data;
}

export async function updateProfile(formData) {
  const res = await api.post('/api/profile', formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

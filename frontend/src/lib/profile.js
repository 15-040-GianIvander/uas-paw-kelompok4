import axios from 'axios';

const api = axios.create({
  // relative base URL so it works in dev/prod without extra env setup
  baseURL: 'https://alimukti.pythonanywhere.com/api'
});

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  const res = await api.get('/profile', { headers: getAuthHeader() });
  return res.data;
}

export async function updateProfile(formData) {
  const res = await api.post('/profile', formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

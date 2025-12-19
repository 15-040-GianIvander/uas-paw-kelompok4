import axios from 'axios';

const api = axios.create({ baseURL: 'https://alimukti.pythonanywhere.com/api' });

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  try {
    const res = await api.get('/profile', { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function updateProfile(formData) {
  try {
    const res = await api.post('/profile', formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}

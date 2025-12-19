import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  try {
    const res = await api.get('/api/profile', { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function updateProfile(formData) {
  try {
    const res = await api.post('/api/profile', formData, {
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

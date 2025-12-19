import axios from 'axios';

const api = axios.create({ baseURL: 'https://alimukti.pythonanywhere.com/api' });

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllUsers() {
  try {
    const res = await api.get('/superadmin/users', { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to fetch users' };
  }
}

export async function createUser(payload) {
  try {
    const res = await api.post('/superadmin/users', payload, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to create user' };
  }
}

export async function updateUserRole(id, role) {
  try {
    const res = await api.put(`/superadmin/users/${id}`, { role }, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to update role' };
  }
}

export async function deleteUser(id) {
  try {
    const res = await api.delete(`/superadmin/users/${id}`, { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to delete user' };
  }
}

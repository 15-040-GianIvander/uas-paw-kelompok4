import axios from 'axios';

const api = axios.create({ baseURL: '' });

async function register({ name, email, password }) {
  try {
    const res = await api.post('/api/register', { name, email, password });
    return res.data;
  } catch (err) {
    // normalize error
    throw err?.response?.data || { message: err.message || 'Register failed' };
  }
}

async function login({ email, password }) {
  try {
    const res = await api.post('/api/login', { email, password });
    return res.data; // { token, role, user_id }
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Login failed' };
  }
}

async function logout() {
  try {
    const res = await api.post('/api/logout');
    // clear client-side storage regardless
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    return res.data;
  } catch (err) {
    // still clear storage on error to force logout locally
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    throw err?.response?.data || { message: err.message || 'Logout failed' };
  }
}

async function forgotPassword({ email }) {
  try {
    const res = await api.post('/api/forgot-password', { email });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Forgot password failed' };
  }
}

async function resetPassword({ email, token, new_password }) {
  try {
    const res = await api.post('/api/reset-password', { email, token, new_password });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Reset password failed' };
  }
}

export { register, login, logout, forgotPassword, resetPassword };

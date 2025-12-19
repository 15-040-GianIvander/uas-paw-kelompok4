import axios from 'axios';

const api = axios.create({ baseURL: 'https://alimukti.pythonanywhere.com/api' });

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEvents() {
  try {
    const res = await api.get('/events');
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getEventById(id) {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function createEvent(formData) {
  try {
    // Let axios set Content-Type and boundary automatically for FormData
    const res = await api.post('/events', formData, { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to create event' };
  }
}

export async function updateEvent(id, formData) {
  try {
    const res = await api.put(`/events/${id}`, formData, { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to update event' };
  }
}

export async function deleteEvent(id) {
  try {
    const res = await api.delete(`/events/${id}`, { headers: getAuthHeader() });
    return res.data;
  } catch (err) {
    throw err;
  }
}

import axios from 'axios';

const api = axios.create({ baseURL: 'https://alimukti.pythonanywhere.com/api' });

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createBooking({ event_id, quantity, payment_method, whatsapp }) {
  try {
    const res = await api.post('/bookings', { event_id, quantity, payment_method, whatsapp }, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } });
    return res.data; // { id, status, payment_info }
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to create booking' };
  }
}

export async function confirmPayment(bookingId) {
  try {
    const res = await api.post(`/bookings/${bookingId}/pay`, {}, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } });
    return res.data; // { status: 'confirmed', message }
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to confirm payment' };
  }
}

export async function getMyBookings() {
  try {
    const res = await api.get('/my-bookings', { headers: getAuthHeader() });
    return res.data; // array of bookings
  } catch (err) {
    throw err?.response?.data || { message: err.message || 'Failed to fetch bookings' };
  }
}

import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getMyBookings();
      setBookings(res || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">My Bookings</h2>
      <p className="text-sm text-slate-500">Daftar booking dan status pembayaran Anda.</p>

      {loading && <div className="mt-6">Memuat...</div>}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      <div className="mt-6 grid grid-cols-1 gap-4">
        {bookings.length === 0 && !loading && <div className="text-sm text-slate-500">Belum ada booking.</div>}
        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded flex items-center justify-between">
            <div>
              <div className="font-bold">{b.event_title || b.event?.title || '—'}</div>
              <div className="text-sm text-slate-500">{b.quantity} tiket • Rp {(b.total_amount || 0).toLocaleString('id-ID')}</div>
              <div className="text-sm text-slate-500">Booking ID: {b.id}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded text-sm ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</div>
              <div className="flex gap-2">
                {b.status !== 'confirmed' && <button onClick={() => navigate(`/payment/${b.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">Bayar Sekarang</button>}
                <button onClick={() => navigate(`/ticket/${b.id}`)} className="px-3 py-1 border rounded">Detail</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

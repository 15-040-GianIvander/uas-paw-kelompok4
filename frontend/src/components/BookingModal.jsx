import React, { useState } from 'react';
import { QrCode, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { createBooking, confirmPayment } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ event, onClose, onBooked }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form | payment | success
  const [qty, setQty] = useState(1);
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const total = (event?.ticket_price || 0) * qty;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (!whatsapp) return setError('Masukkan nomor WhatsApp untuk konfirmasi.');
    setLoading(true);
    try {
      const res = await createBooking({ event_id: event.id, quantity: qty, payment_method: paymentMethod, whatsapp });
      setBooking(res);
      setStep('payment');
      if (onBooked) onBooked(res);
    } catch (err) {
      setError(err?.message || 'Gagal membuat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!booking) return;
    setLoading(true); setError(null);
    try {
      const res = await confirmPayment(booking.id);
      setBooking((b) => ({ ...b, status: res.status }));
      setStep('success');
    } catch (err) {
      setError(err?.message || 'Gagal konfirmasi pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4">
              <h3 className="text-xl font-bold">Beli Tiket — {event.title}</h3>
              <p className="text-sm text-slate-500">Pilih jumlah dan metode pembayaran.</p>

              <div className="flex items-center gap-3">
                <label className="block text-xs font-bold text-slate-500 uppercase">Jumlah</label>
                <div className="ml-auto flex items-center gap-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-slate-100 rounded">-</button>
                  <div className="px-4 font-bold">{qty}</div>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 py-1 bg-blue-600 text-white rounded">+</button>
                </div>
              </div>

              <label className="block">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Nomor WhatsApp</div>
                <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0812..." className="w-full border rounded px-3 py-2" />
              </label>

              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 border rounded ${paymentMethod === 'qris' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                  <input type="radio" name="pm" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} />
                  <QrCode />
                  <div>
                    <div className="font-bold">QRIS</div>
                    <div className="text-sm text-slate-500">Scan QRIS untuk bayar.</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded ${paymentMethod === 'va_bca' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                  <input type="radio" name="pm" checked={paymentMethod === 'va_bca'} onChange={() => setPaymentMethod('va_bca')} />
                  <CreditCard />
                  <div>
                    <div className="font-bold">Transfer / VA</div>
                    <div className="text-sm text-slate-500">Transfer via bank (VA).</div>
                  </div>
                </label>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Batal</button>
                <button type="submit" disabled={loading} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded font-bold">{loading ? 'Memproses...' : `Bayar Rp ${total.toLocaleString('id-ID')}`}</button>
              </div>
            </form>
          )}

          {step === 'payment' && booking && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Informasi Pembayaran</h3>
              <p className="text-sm text-slate-500">Selesaikan pembayaran menggunakan informasi di bawah ini.</p>

              {booking.payment_info?.type === 'image' ? (
                <div className="border rounded p-3 text-center">
                  <img src={booking.payment_info.details} alt="QRIS" className="mx-auto max-h-64" />
                  <div className="text-sm text-slate-500 mt-2">Scan QRIS di atas dengan e-wallet Anda.</div>
                </div>
              ) : (
                <div className="border rounded p-3">
                  <div className="font-bold">Virtual Account / Info</div>
                  <div className="text-sm text-slate-700 mt-1">{booking.payment_info?.details}</div>
                </div>
              )}

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => { setStep('form'); setBooking(null); }} className="px-4 py-2 border rounded">Kembali</button>
                <button type="button" onClick={handleConfirm} disabled={loading} className="ml-auto px-4 py-2 bg-amber-500 text-white rounded font-bold">{loading ? 'Memproses...' : 'Saya Sudah Transfer'}</button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold">Pembayaran Dikonfirmasi</h3>
              <p className="text-sm text-slate-600">Tiket akan dikirimkan ke WhatsApp Anda dan tersedia di halaman My Bookings.</p>

              <div className="flex gap-3 justify-center">
                <button type="button" onClick={() => { onClose(); navigate('/booking-history'); }} className="px-4 py-2 bg-blue-600 text-white rounded">Lihat Tiket Saya</button>
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Tutup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

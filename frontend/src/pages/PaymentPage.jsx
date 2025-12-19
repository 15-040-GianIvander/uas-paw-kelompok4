import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import shareqr from '../assets/qris/shareqr.png';

function formatCurrency(v) {
  return v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const qty = state?.qty ?? null;
  const pricePer = state?.pricePer ?? null;
  const total = state?.total ?? null;
  const eventTitle = state?.eventTitle ?? '';

  return (
    <div className="min-h-screen page-bg flex items-start justify-center py-32 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-white/40 p-6 text-center">
        <h2 className="text-lg font-bold font-outfit text-slate-900 mb-2">Pembayaran via QRIS</h2>
        <p className="text-sm text-slate-600 mb-4">Pembayaran dilakukan melalui QRIS. Scan kode di bawah menggunakan aplikasi dompet digital Anda.</p>

        <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-center mb-4">
          <img src={shareqr} alt="QRIS" className="w-64 h-64 object-contain" />
        </div>

        {total !== null ? (
          <div className="mb-4 text-left">
            <div className="text-sm text-slate-500">Acara: <span className="font-medium text-slate-800">{eventTitle}</span></div>
            <div className="text-sm text-slate-500">Jumlah tiket: <span className="font-medium">{qty}</span></div>
            <div className="text-sm text-slate-500">Harga per tiket: <span className="font-medium">{formatCurrency(pricePer)}</span></div>
            <div className="mt-2 text-lg font-bold text-blue-600">Total: {formatCurrency(total)}</div>
          </div>
        ) : (
          <div className="mb-4 text-sm text-slate-500">Total pembelian tidak tersedia. Kembali ke halaman pemesanan jika perlu.</div>
        )}

        <button onClick={() => navigate('/my-bookings')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition">
          Sudah Membayar
        </button>

        <div className="text-xs text-slate-400 mt-4">Booking ID: <span className="font-mono">{bookingId}</span></div>
      </div>
    </div>
  );
}

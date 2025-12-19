import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import shareqr from '../assets/qris/shareqr.jpeg';

function formatCurrency(v) {
  return v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [booking, setBooking] = React.useState(null);
  const [paymentInfo, setPaymentInfo] = React.useState(state?.paymentInfo || null);

  React.useEffect(() => {
    let cancelled = false;
    // try to get booking from storage
    import('../lib/bookings').then(({ getBookingById, addBooking }) => {
      const b = getBookingById(bookingId);
      if (!cancelled) setBooking(b || null);

      // if booking wasn't saved locally but we arrived here with state (server-created booking), persist it
      if (!b && state && state.bookingId && state.bookingId === bookingId) {
        const toSave = {
          id: bookingId,
          eventName: state.eventTitle,
          date: state.date,
          time: state.time,
          location: state.location,
          status: state.paymentInfo?.status === 'paid' ? 'Confirmed' : 'Pending',
          qty: state.qty ?? 1,
          pricePer: state.pricePer ?? state.total ?? 0,
          total: state.total ?? 0,
          buyer: state.buyerName || 'Nama Pemesan',
        };
        try { addBooking(toSave); } catch(e) { /* ignore */ }
        if (!cancelled) setBooking(toSave);
      }
    });

    // if arrived with state (newly created booking), reflect it in UI
    if (state && state.bookingId && state.bookingId === bookingId) {
      setBooking(prev => prev || { id: bookingId, eventName: state.eventTitle, qty: state.qty, total: state.total, pricePer: state.pricePer, date: state.date, time: state.time, location: state.location });
      if (state.paymentInfo) setPaymentInfo(state.paymentInfo);
    }
    return () => { cancelled = true; };
  }, [bookingId, state]);

  const qty = booking?.qty ?? state?.qty ?? null;
  const pricePer = booking?.pricePer ?? state?.pricePer ?? null;
  const total = booking?.total ?? state?.total ?? null;
  const eventTitle = booking?.eventName ?? state?.eventTitle ?? '';

  // payment actions
  const onPaid = (method = 'manual') => {
    // mark booking as confirmed and redirect to history
    import('../lib/bookings').then(({ updateBooking }) => {
      const patch = { status: 'Confirmed', paidAt: new Date().toISOString(), paidMethod: method };
      updateBooking(bookingId, patch);
      navigate('/booking-history');
    });
  };

  const onPayNow = () => {
    // simulate immediate payment (used for "Bayar Sekarang" if present)
    import('../lib/bookings').then(({ updateBooking }) => {
      updateBooking(bookingId, { status: 'Pending' });
      setTimeout(() => {
        updateBooking(bookingId, { status: 'Confirmed', paidAt: new Date().toISOString(), paidMethod: 'qris' });
        navigate('/booking-history');
      }, 1200);
    });
  };

  const onPayLater = () => {
    // set booking to pending (pay later) and return to bookings list
    import('../lib/bookings').then(({ updateBooking }) => {
      updateBooking(bookingId, { status: 'Pending' });
      navigate('/booking-history');
    });
  };

  const onCancel = () => {
    // confirm then cancel booking and return to bookings list
    if (!window.confirm('Batalkan booking ini? Tindakan tidak dapat dibatalkan.')) return;
    import('../lib/bookings').then(({ updateBooking }) => {
      updateBooking(bookingId, { status: 'Cancelled', cancelledAt: new Date().toISOString() });
      navigate('/booking-history');
    });
  };

  return (
    <div className="min-h-screen page-bg flex items-start justify-center py-32 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-white/40 p-6 text-center">
        <h2 className="text-lg font-bold font-outfit text-slate-900 mb-2">Pembayaran via QRIS</h2>
        <p className="text-sm text-slate-600 mb-4">Pembayaran dilakukan melalui QRIS. Scan kode di bawah menggunakan aplikasi dompet digital Anda.</p>

        <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-center mb-4">
          {paymentInfo && paymentInfo.method === 'qris' && paymentInfo.details ? (
            <img src={paymentInfo.details} alt="QRIS" className="w-64 h-64 object-contain" />
          ) : paymentInfo && paymentInfo.method && paymentInfo.details ? (
            <div className="text-left p-4">
              <div className="text-sm text-slate-500">Payment Method: <span className="font-medium text-slate-800">{paymentInfo.method}</span></div>
              <div className="mt-2 font-mono text-sm text-slate-700">{paymentInfo.details}</div>
            </div>
          ) : (
            <img src={shareqr} alt="QRIS" className="w-64 h-64 object-contain" />
          )}
        </div>

        { (paymentInfo?.total_price ?? total) !== null ? (
          <div className="mb-4 text-left">
            <div className="text-sm text-slate-500">Acara: <span className="font-medium text-slate-800">{eventTitle}</span></div>
            <div className="text-sm text-slate-500">Jumlah tiket: <span className="font-medium">{qty}</span></div>
            <div className="text-sm text-slate-500">Harga per tiket: <span className="font-medium">{formatCurrency(pricePer)}</span></div>
            <div className="mt-2 text-lg font-bold text-blue-600">Total: {formatCurrency(paymentInfo?.total_price ?? total)}</div>
          </div>
        ) : (
          <div className="mb-4 text-sm text-slate-500">Total pembelian tidak tersedia. Kembali ke halaman pemesanan jika perlu.</div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 no-print">
          <button onClick={() => onPayLater()} className="w-full bg-slate-300 hover:bg-slate-400 text-slate-800 py-3 rounded-xl font-bold shadow-md transition">Bayar Nanti</button>
          <button onClick={() => onPaid('manual')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition">Sudah Membayar</button>
        </div>

        <div className="mb-4 no-print">
          <button onClick={() => onCancel()} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold shadow-md transition">Batalkan Booking</button>
        </div>

        <div className="text-xs text-slate-400 mt-4">Booking ID: <span className="font-mono">{bookingId}</span></div>
      </div>
    </div>
  );
}

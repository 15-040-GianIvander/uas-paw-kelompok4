import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function formatCurrency(v) {
  return v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export default function TicketPage() {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const buyerName = state?.buyerName || 'Nama Pemesan';
  const eventName = state?.eventName || 'Nama Event';
  const date = state?.date || 'Tanggal';
  const time = state?.time || 'Waktu';
  const location = state?.location || 'Lokasi';
  const qty = state?.qty ?? 1;
  const total = state?.total ?? 0;

  return (
    <div className="min-h-screen page-bg flex items-start justify-center py-32 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg border border-white/40 overflow-hidden">

          <div className="p-6 border-b">
            <div className="text-2xl font-extrabold text-slate-900 font-outfit">{eventName}</div>
            <div className="text-sm text-slate-500 mt-1">E-Ticket</div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Detail</div>
                <div className="mt-1 font-bold text-slate-800">{date} • {time}</div>
                <div className="text-sm text-slate-500 mt-1">{location}</div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Nama Pemesan</div>
                <div className="mt-1 font-medium text-slate-800">{buyerName}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Status</div>
                  <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">LUNAS</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Jumlah</div>
                  <div className="mt-1 font-bold text-slate-800">{qty} tiket</div>
                  <div className="text-sm text-slate-500 mt-1">Total: {formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex items-center justify-between">
            <div className="text-xs text-slate-400">Kode Tiket</div>
            <div className="font-mono font-bold">{bookingId}</div>
          </div>

          <div className="p-6 flex gap-3 no-print">
            <button onClick={() => navigate(-1)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold">Kembali</button>
            <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold">Download PDF</button>
          </div>

        </div>
      </div>
    </div>
  );
}

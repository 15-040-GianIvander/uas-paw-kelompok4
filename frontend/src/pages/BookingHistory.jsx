import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const BookingHistory = () => {
  // Mock Data
  const bookings = [
    { id: 'INV-001', eventName: 'Evoria Music Fest', date: '20 Des 2024', status: 'Confirmed', qty: 2, total: 300000 },
    { id: 'INV-002', eventName: 'React Workshop', date: '15 Jan 2025', status: 'Pending', qty: 1, total: 50000 },
  ];

  return (
    // HAPUS <Navbar /> DISINI KARENA SUDAH ADA DI APP.JSX
    <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 font-outfit">Riwayat Pemesanan</h1>
            
            <div className="space-y-4">
                {bookings.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-slate-400">#{item.id}</span>
                                {item.status === 'Confirmed' ? (
                                    <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <CheckCircle size={12}/> Lunas
                                    </span>
                                ) : (
                                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <Clock size={12}/> Menunggu
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{item.eventName}</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Calendar size={14}/> {item.date} • {item.qty} Tiket
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Total Harga</p>
                            <p className="text-xl font-bold text-blue-600">Rp {item.total.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default BookingHistory;
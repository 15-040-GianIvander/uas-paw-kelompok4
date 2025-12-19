import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Clock, CheckCircle2, XCircle, ChevronRight, QrCode, Sparkles, Hourglass, Receipt } from 'lucide-react';

const BookingHistory = () => {
  // Dummy Data
  const bookings = [
    {
      id: 'INV-2024001',
      eventName: 'Evoria Music Festival 2024',
      date: '20 Des 2024',
      time: '19:00 WIB',
      location: 'PKOR Way Halim',
      status: 'Confirmed',
      qty: 2,
      total: 300000,
      buyer: 'Ayu Pratiwi'
    },
    {
      id: 'INV-2024002',
      eventName: 'Workshop React & Tailwind',
      date: '15 Jan 2025',
      time: '09:00 WIB',
      location: 'Evoria Creative Hub',
      status: 'Pending',
      qty: 1,
      total: 50000,
      buyer: 'Rian Saputra'
    },
    {
       id: 'INV-2024003',
       eventName: 'Startup Talk 2024',
       date: '10 Nov 2024',
       time: '13:00 WIB',
       location: 'Zoom Meeting',
       status: 'Cancelled',
       qty: 1,
       total: 0,
       buyer: 'Dewi Lestari'
    }
  ];

  // === WARNA STATUS (Pending = Amber/Emas) ===
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-500 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
      switch(status) {
        case 'Confirmed': return <CheckCircle2 size={14} weight="fill"/>;
        case 'Pending': return <Hourglass size={14} />;
        case 'Cancelled': return <XCircle size={14} />;
        default: return null;
      }
  };

  const getStatusLabel = (status) => {
      switch(status) {
        case 'Confirmed': return 'Lunas';
        case 'Pending': return 'Menunggu Pembayaran';
        case 'Cancelled': return 'Dibatalkan';
        default: return status;
      }
  }

  return (
    // BACKGROUND GRADASI BIRU KE PUTIH
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
        
        {/* HERO HEADER (YANG KAMU SUKA) */}
        <div className="relative pt-36 pb-32 px-6 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-blue-50 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
                    <Ticket size={14} /> Booking History
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold font-outfit text-white mb-2 tracking-tight">
                    Tiket & Pesanan Saya
                </h1>
                <p className="text-blue-100 font-light">
                    Kelola semua tiket event yang pernah kamu pesan di sini.
                </p>
            </div>
        </div>

        {/* LIST TIKET */}
        <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-20 space-y-6">
            
            {bookings.length > 0 ? (
                bookings.map((item) => (
                    // CARD STYLE SIMPLE & CLEAN
                    <div 
                        key={item.id} 
                        className="group bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50/50 overflow-hidden hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="p-6 sm:p-8">
                            
                            {/* HEADER CARD: Nama Event & Status */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Event</span>
                                    <h3 className="text-xl md:text-2xl font-extrabold font-outfit text-slate-900 group-hover:text-blue-600 transition">
                                        {item.eventName}
                                    </h3>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(item.status)}`}>
                                    {getStatusIcon(item.status)} 
                                    {getStatusLabel(item.status)}
                                </span>
                            </div>

                            {/* BODY CARD: Detail Waktu & Lokasi (Sejajar Kiri-Kanan) */}
                            <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between mb-8">
                                
                                {/* Kiri: Waktu */}
                                <div className="flex-1 flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 flex-shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wide">Tanggal & Waktu</p>
                                        <p className="text-sm md:text-base font-bold text-slate-800 mt-1">{item.date}</p>
                                        <p className="text-xs md:text-sm font-medium text-slate-500">{item.time}</p>
                                    </div>
                                </div>

                                {/* Tengah: Separator Visual (Garis Vertikal Tipis) */}
                                <div className="hidden md:block w-[1px] bg-slate-100 mx-6"></div>

                                {/* Kanan: Lokasi (Rata Kanan di Desktop) */}
                                <div className="flex-1 flex items-start gap-4 md:justify-end text-left md:text-right">
                                    {/* Icon Lokasi (Di Mobile kiri, Desktop kanan) */}
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 flex-shrink-0 md:order-2 md:ml-4">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="md:order-1">
                                         <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wide">Lokasi Event</p>
                                         <p className="text-sm md:text-base font-bold text-slate-800 mt-1">{item.location}</p>
                                         <Link to="#" className="text-xs md:text-sm font-medium text-blue-600 hover:underline">Lihat Peta</Link>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER SEPARATOR: Garis Putus-putus Halus */}
                            <div className="border-t-2 border-dashed border-slate-100 -mx-8 mb-6"></div>

                            {/* FOOTER CONTENT: Compact Layout (Kiri: Harga, Kanan: Tombol) */}
                            <div className="flex flex-row justify-between items-end gap-4">
                                
                                {/* BAGIAN KIRI: Harga & Detail Order */}
                                <div>
                                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Pembayaran</p>
                                    
                                    {/* Harga Besar */}
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-xl md:text-3xl font-extrabold font-outfit text-blue-600">
                                            Rp {item.total.toLocaleString('id-ID')}
                                        </h4>
                                    </div>

                                    {/* Info Kecil di Bawah Harga */}
                                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">#{item.id}</span>
                                        <span>•</span>
                                        <span>{item.qty} Tiket</span>
                                    </p>
                                </div>

                                {/* BAGIAN KANAN: Tombol Aksi (Compact) */}
                                <div className="flex-shrink-0">
                                    {item.status === 'Confirmed' ? (
                                        <Link to={`/ticket/${item.id}`} state={{ buyerName: item.buyer, eventName: item.eventName, date: item.date, time: item.time, location: item.location, qty: item.qty, total: item.total }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-blue-200/50 transition-all active:scale-95">
                                            <QrCode size={18}/> 
                                            <span className="hidden sm:inline">Lihat</span> E-Ticket
                                        </Link>
                                    ) : item.status === 'Pending' ? (
                                        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-amber-200/50 transition-all active:scale-95">
                                            Bayar <span className="hidden sm:inline">Sekarang</span> <ChevronRight size={16}/>
                                        </button>
                                    ) : (
                                        <button disabled className="flex items-center gap-2 bg-slate-100 text-slate-400 px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold cursor-not-allowed">
                                            <Receipt size={18}/> Detail
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                // TAMPILAN KOSONG
                <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/50">
                    <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Ticket size={40} className="text-blue-300"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 font-outfit">Belum ada tiket</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Wah, riwayat pemesananmu masih kosong nih. Yuk mulai petualangan barumu!</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200/50">
                        <Sparkles size={18}/> Jelajahi Event
                    </Link>
                </div>
            )}
            
            {/* Footer Info Kecil */}
            <p className="text-center text-slate-400 text-sm mt-8">
                Hanya menampilkan transaksi 6 bulan terakhir.
            </p>
        </div>
    </div>
  );
};

export default BookingHistory;
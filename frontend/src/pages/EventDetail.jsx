import React from 'react';
import { useParams, Link } from 'react-router-dom';
// Tambahkan import icon baru: Ticket, CheckCircle2, ChevronRight, Sparkles
import { MapPin, Calendar, Clock, Share2, Heart, ShieldCheck, User, Ticket, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();

  // Dummy Data
  const event = {
    id: 1,
    title: "Evoria Music Festival 2024",
    organizer: "Evoria Entertainment",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200",
    description: "Rasakan euforia musik indie terbesar tahun ini! Evoria Music Festival menghadirkan kolaborasi epik antara musisi papan atas dan seniman visual dalam satu panggung spektakuler. Nikmati pengalaman audio-visual yang memukau di tengah kota.",
    date: "20 Desember 2024",
    time: "19:00 - 23:00 WIB",
    location: "PKOR Way Halim, Bandar Lampung",
    price: 150000,
    quota: 45, // Anggap total kuota 100, sisa 45
    totalQuota: 100, 
    category: "Music",
    tags: ["Concert", "Indie", "Outdoor"]
  };

  // Hitung persentase sisa kuota untuk progress bar
  const quotaPercentage = (event.quota / event.totalQuota) * 100;

  return (
    <div className="min-h-screen page-bg pb-20">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[500px] bg-slate-200">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90"></div>
        
        {/* Navbar Placeholder Fix (Agar tidak ketutup di mode mobile) */}
        <div className="h-20 md:h-0"></div>

        {/* Tombol Back & Share */}
        <div className="absolute top-28 md:top-32 left-0 right-0 max-w-7xl mx-auto px-6 flex justify-between items-start pointer-events-none z-20">
             <Link to="/" className="pointer-events-auto bg-white/80 backdrop-blur-md text-slate-700 px-4 py-2 rounded-full font-medium hover:bg-white transition shadow-sm flex items-center gap-1 group">
                <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={18}/> Kembali
             </Link>
             <div className="pointer-events-auto flex gap-2">
                 <button className="bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-700 hover:text-red-500 hover:bg-white transition shadow-sm">
                    <Heart size={20} />
                 </button>
                 <button className="bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-white transition shadow-sm">
                    <Share2 size={20} />
                 </button>
             </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* KOLOM KIRI: Detail Event */}
          <div className="lg:col-span-2 space-y-8">
            {/* Judul & Info Utama */}
            <div>
               <div className="flex gap-2 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles size={12} /> {event.category}
                  </span>
                  {event.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                  ))}
               </div>
               <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900 mb-3 leading-tight">{event.title}</h1>
               <div className="flex items-center gap-2 text-slate-500 font-medium pl-1">
                  <User size={18} className="text-blue-500"/>
                  <span>Organizer: <span className="text-slate-800 font-semibold">{event.organizer}</span></span>
               </div>
            </div>

            <hr className="border-slate-100" />

            {/* Deskripsi */}
            <div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-4 flex items-center gap-2">
                    Event Description
                </h3>
                <p className="text-slate-600 leading-relaxed text-justify font-poppins">
                    {event.description}
                </p>
                <div className="mt-6 p-4 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-3">
                    <ShieldCheck className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Official Ticket Guarantee</h4>
                        <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">Transaksi Anda di Evoria dijamin aman. Tiket resmi 100% atau uang kembali jika acara dibatalkan oleh penyelenggara.</p>
                    </div>
                </div>
            </div>

            {/* Lokasi & Waktu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-start gap-4 group">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Tanggal & Waktu</p>
                        <p className="font-semibold text-slate-800">{event.date}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Clock size={14}/> {event.time}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-start gap-4 group">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Lokasi</p>
                        <p className="font-semibold text-slate-800 line-clamp-2">{event.location}</p>
                        <Link to="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 mt-1">Lihat Peta <ChevronRight size={12}/></Link>
                    </div>
                </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: Booking Card (WOW VERSION) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
                {/* Container dengan efek Glass & Dekorasi Background */}
                <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-blue-100/50 p-8 z-0">
                    
                    {/* Dekorasi Blob Abstrak di belakang */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>

                    {/* Header Harga yang "Wah" */}
                    <div className="mb-8">
                        <span className="block text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Penawaran Terbaik</span>
                        <div className="flex items-end gap-1">
                             {/* Teks Gradient */}
                             <h2 className="text-[2.75rem] font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 leading-none">
                                Rp {event.price.toLocaleString('id-ID').replace(',00', '')}
                            </h2>
                            <span className="text-slate-400 font-bold pb-2 text-lg">/pax</span>
                        </div>
                    </div>

                    {/* Detail Tiket & Progress Bar Kuota */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-white/50 rounded-2xl p-5 mb-8 backdrop-blur-sm border border-blue-100/50 shadow-inner">
                         {/* Status */}
                         <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2 text-blue-800 font-bold">
                                 <Ticket size={20} className="text-blue-600" />
                                 <span>Tiket Tersedia</span>
                             </div>
                             <span className="bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <CheckCircle2 size={14} weight="fill" /> Ready Stok
                             </span>
                         </div>

                         {/* Progress Bar Kuota (Visualisasi Kelangkaan) */}
                         <div>
                             <div className="flex justify-between text-sm mb-2 font-semibold">
                                 <span className="text-slate-500">Sisa Kuota Saat Ini</span>
                                 <span className="text-blue-700">{event.quota} <span className="text-slate-400 font-normal">/ {event.totalQuota}</span></span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-[2px]">
                                 {/* Bar Gradient yang bergerak */}
                                 <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-300 h-full rounded-full shadow-sm transition-all duration-1000 ease-out relative overflow-hidden"
                                    style={{ width: `${quotaPercentage}%` }}
                                 >
                                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12"></div>
                                 </div>
                             </div>
                             <p className="text-xs text-blue-600/80 mt-2 font-medium flex items-center gap-1">
                                <Sparkles size={12}/> Peminat tinggi! Segera amankan tiketmu.
                             </p>
                         </div>
                    </div>

                    {/* Tombol CTA yang "Wah" */}
<Link 
    to={`/booking/${event.id}`} 
    // PERUBAHAN DI SINI:
    // 1. ganti 'justify-center' jadi 'justify-between'
    // 2. tambah 'px-8' (padding kanan kiri)
    className="group relative w-full flex items-center justify-between px-8 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-4 rounded-2xl font-bold font-outfit text-xl overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
>
    {/* Teks di Kiri */}
    <span className="relative z-10">
        Book Now
    </span>

    {/* Ikon di Kanan */}
    <ChevronRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
    
    {/* Efek Kilau saat Hover (Tetap Sama) */}
    <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-white/20 opacity-0 group-hover:opacity-100"></div>
</Link>
                    
                    <p className="text-xs text-center text-slate-400 mt-5 px-4 font-medium">
                        Pembayaran 100% Aman & Terpercaya via Evoria.
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
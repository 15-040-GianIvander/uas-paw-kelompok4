import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Ticket, CreditCard, Calendar, MapPin, ShieldCheck, Minus, Plus, ChevronRight, Lock } from 'lucide-react';
import { sampleEvents } from '../data/events';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State untuk form
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('qris'); // qris, bank, ewallet
  const [fullname, setFullname] = useState('');

  // Lookup event by :id from shared data
  const event = sampleEvents.find((e) => String(e.id) === String(id)) || {
    title: 'Event tidak ditemukan',
    price: 0,
    date: '',
    time: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=200'
  };

  // Resolve image from local assets (same logic as EventList)
  const imageModules = import.meta.glob('../assets/event-list/*.{png,jpg,jpeg,webp}', { eager: true });
  const availableImages = Object.fromEntries(
    Object.entries(imageModules).map(([path, mod]) => {
      const name = path.split('/').pop();
      return [name, mod.default];
    })
  );

  const filenameMap = {
    1: 'konser-indie.png',
    2: 'tech-meetup.png',
    3: 'festival-musik.png',
    4: 'workshop-foto.png',
    5: 'board-game.png',
    6: 'marketing-digital.png',
    7: 'teater-lokal.png',
    8: 'yoga-pagi.png',
    9: 'hackaton-48h.png',
    10: 'food-festival.png'
  };

  function slugify(title) {
    return title
      .toLowerCase()
      .replace(/[\s]+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const slug = filenameMap[event.id] || `${slugify(event.title)}.png`;
  const defaultImg = availableImages['for-nan.jpg'] || availableImages['for-nan.jpeg'] || Object.values(availableImages)[0] || '';
  const imgUrl = availableImages[slug] || event.image || defaultImg;

  // Hitung Total
  const total = event.price * qty;
  const adminFee = 5000;
  const grandTotal = total + adminFee;

  const handleIncrement = () => setQty(qty + 1);
  const handleDecrement = () => { if (qty > 1) setQty(qty - 1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create booking and persist to localStorage via bookings lib
    const bookingId = 'INV-' + Date.now();
    const newBooking = {
      id: bookingId,
      eventName: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      status: 'Pending',
      qty,
      total: grandTotal,
      buyer: fullname || 'Nama Pemesan',
    };

    // add to storage
    import('../lib/bookings').then(({ addBooking }) => {
      addBooking(newBooking);
      // navigate to payment page with booking id
      navigate(`/payment/${bookingId}`, { state: { bookingId, qty, pricePer: event.price, total: grandTotal, eventTitle: event.title } });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="relative pt-36 pb-32 px-6 text-center">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="relative z-10">
         </div>
      </div>

      {/* 2. FORM CONTENT */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- KOLOM KIRI: FORM INPUT --- */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Section 1: Data Pemesan */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-white/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><User size={20}/></div>
                        Data Pemesan
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Masukkan nama sesuai KTP" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                            </div>
                        </div>

                        {/* Grid Email & Telpon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="email" placeholder="email@contoh.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nomor WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="tel" placeholder="0812..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Jumlah Tiket */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-white/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Ticket size={20}/></div>
                        Detail Tiket
                    </h3>

                    <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100 gap-4">
                        <div className="text-center md:text-left">
                            <p className="font-bold text-slate-800">Tiket Regular</p>
                            <p className="text-sm text-slate-500">Rp {event.price.toLocaleString('id-ID')} / pax</p>
                        </div>

                        {/* Counter Button */}
                        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <button type="button" onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition disabled:opacity-50">
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-900">{qty}</span>
                            <button type="button" onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KOLOM KANAN: ORDER SUMMARY (STICKY) --- */}
            <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                    
                    {/* Card Ringkasan */}
                    <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-blue-900/10 border border-white/50 overflow-hidden">
                        <div className="relative h-32 rounded-2xl overflow-hidden mb-6">
                            <img src={imgUrl} alt="Event" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <h4 className="text-white font-bold font-outfit text-lg leading-tight">{event.title}</h4>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 pb-6 border-b border-dashed border-slate-200 text-sm">
                            <div className="flex items-start gap-3">
                                <Calendar size={16} className="text-blue-500 mt-0.5"/>
                                <span className="text-slate-600">{event.date} • {event.time}</span>
                            </div>
                             <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-blue-500 mt-0.5"/>
                                <span className="text-slate-600">{event.location}</span>
                            </div>
                        </div>

                        {/* Detail Harga */}
                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Tiket x {qty}</span>
                                <span>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Biaya Layanan</span>
                                <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <span className="font-bold text-slate-800">Total Bayar</span>
                                <span className="font-extrabold text-2xl text-blue-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Tombol Bayar */}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            <Lock size={18}/> Bayar Sekarang
                        </button>

                        <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck size={12}/> Pembayaran aman & terenkripsi
                        </p>
                    </div>

                </div>
            </div>

        </form>
      </div>
    </div>
  );
};

export default BookingForm;
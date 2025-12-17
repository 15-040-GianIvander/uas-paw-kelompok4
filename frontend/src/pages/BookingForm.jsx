import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  // Mock Event Data
  const event = {
    title: "Evoria Music Festival 2024",
    price: 150000,
    date: "20 Desember 2024"
  };

  const totalPrice = event.price * qty;

  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Berhasil memesan ${qty} tiket! Total: Rp ${totalPrice.toLocaleString('id-ID')}`);
    navigate('/my-bookings');
  };

  return (
    // ✅ SUDAH BERSIH: Tidak ada <Navbar />
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Kiri: Ringkasan Event */}
          <div className="md:w-1/2 bg-blue-600 p-10 text-white flex flex-col justify-between">
              <div>
                  <h2 className="text-3xl font-bold font-outfit mb-2">Konfirmasi Pemesanan</h2>
                  <p className="opacity-80 font-poppins">Selesaikan pembayaran untuk mengamankan tiketmu.</p>
              </div>
              <div className="mt-8 space-y-4">
                  <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm">
                      <p className="text-sm opacity-70 mb-1">Event</p>
                      <h3 className="text-xl font-semibold font-outfit">{event.title}</h3>
                  </div>
                  <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm">
                      <p className="text-sm opacity-70 mb-1">Tanggal</p>
                      <h3 className="text-xl font-semibold font-outfit">{event.date}</h3>
                  </div>
              </div>
          </div>

          {/* Kanan: Form */}
          <div className="md:w-1/2 p-10">
              <form onSubmit={handleBooking} className="space-y-6">
                  <div>
                      <label className="block text-slate-600 font-medium mb-2 font-poppins">Jumlah Tiket</label>
                      <input 
                          type="number" 
                          min="1" 
                          max="5"
                          value={qty}
                          onChange={(e) => setQty(parseInt(e.target.value))}
                          className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between mb-2 text-slate-600 text-sm">
                          <span>Harga Satuan</span>
                          <span>Rp {event.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-slate-600 text-sm">
                          <span>Jumlah</span>
                          <span>x {qty}</span>
                      </div>
                      <div className="flex justify-between mt-4 text-xl font-bold text-blue-900 font-outfit">
                          <span>Total Bayar</span>
                          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                      <button 
                          type="submit" 
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                      >
                          Bayar Sekarang
                      </button>
                      <button 
                          type="button" 
                          onClick={() => navigate(-1)}
                          className="w-full text-slate-500 py-3 font-medium hover:text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                          Batal
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </div>
  );
};

export default BookingForm;
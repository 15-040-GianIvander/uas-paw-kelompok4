import React from 'react';
import { Link } from 'react-router-dom'; // Pastikan Link diimport
import { User, Mail, Phone, MapPin, Camera, Edit3, Settings, Shield, LogOut, Calendar, ChevronRight } from 'lucide-react';

const UserProfile = () => {
  // Mock Data User
  const user = {
    name: "Choirunnisa Syawaldina",
    role: "Mahasiswa",
    email: "choirunnisa@student.itera.ac.id",
    phone: "+62 812-3456-7890",
    location: "Bandar Lampung, Indonesia",
    joinDate: "Bergabung sejak September 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Ngumpulin tiket, bukan kenangan doang dari seminar sampai konser, gas!"
  };

  return (
    // Background Gradasi Biru ke Putih (Tetap sama biar konsisten)
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
      
      {/* HEADER UTAMA HALAMAN */}
      <div className="relative pt-36 pb-32 px-6 text-center">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold font-outfit text-white mb-2">
                Profil Saya
            </h1>
            <p className="text-blue-100 font-light">
                Kelola informasi akun dan preferensi Anda.
            </p>
         </div>
      </div>

      {/* KARTU PROFIL UTAMA (Floating Up) */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/50 overflow-hidden">
            
            <div className="p-8 md:p-10">
                
                {/* BAGIAN ATAS: Foto & Nama (Layout Flex yang Lega) */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                    
                    {/* Foto Profil (Tanpa overlap aneh-aneh) */}
                    <div className="relative group flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-50 shadow-lg overflow-hidden bg-slate-200">
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        {/* Tombol Kamera */}
                        <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-110 border-4 border-white">
                            <Camera size={18} />
                        </button>
                    </div>

                    {/* Nama & Info Utama */}
                    <div className="flex-1 pt-2 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900 mb-2">
                                    {user.name}
                                </h2>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-500 mb-4">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {user.role}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-medium">
                                        <MapPin size={16} className="text-slate-400"/> {user.location}
                                    </span>
                                </div>
                            </div>
                            
                            {/* --- PERUBAHAN DISINI: Button jadi Link --- */}
                            <Link 
                                to="/profile/edit" 
                                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Edit3 size={18} /> Edit Profil
                            </Link>
                            {/* ----------------------------------------- */}

                        </div>

                        {/* Bio Singkat */}
                        <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm md:text-base text-center md:text-left">
                            "{user.bio}"
                        </div>
                    </div>
                </div>

                {/* GARIS PEMBATAS */}
                <div className="border-b border-slate-100 my-10"></div>

                {/* BAGIAN BAWAH: Grid Info & Menu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    {/* KOLOM KIRI: Detail Kontak */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <User size={18} className="text-blue-600"/> Informasi Pribadi
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {/* Email */}
                             <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Alamat Email</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <Mail size={18} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Telepon */}
                            <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Nomor Telepon</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <Phone size={18} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm">{user.phone}</p>
                                </div>
                            </div>

                             {/* Tanggal Join */}
                             <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition group sm:col-span-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status Keanggotaan</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <Calendar size={18} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm">{user.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Menu Aksi */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Settings size={18} className="text-blue-600"/> Pengaturan
                        </h3>
                        
                        <div className="bg-slate-50 rounded-2xl p-2 space-y-1">
                            <Link to="/forgot-password" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-left group" style={{ textDecoration: 'none' }}>
                                <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">Ubah Password</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                            </Link>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-left group">
                                <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">Notifikasi</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-left group">
                                <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">Bantuan & Support</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                            </button>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 transition font-bold text-sm mt-4">
                            <LogOut size={18} /> Keluar Akun
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
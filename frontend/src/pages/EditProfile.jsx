import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, X, ChevronLeft } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();

  // State awal (Pre-fill dengan data dummy sebelumnya)
  const [formData, setFormData] = useState({
    name: "Choirunnisa Syawaldina",
    email: "niscil@student.itera.ac.id",
    phone: "+62 812-3456-7890",
    location: "Bandar Lampung, Indonesia",
    bio: "Informatics Student @ITERA. Suka desain UI/UX dan nonton konser musik indie."
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi simpan data
    alert("Profil berhasil diperbarui!");
    navigate('/profile'); // Kembali ke halaman profil
  };

  return (
    <div className="min-h-screen page-bg pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Simple */}
        <div className="mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition mb-4 text-sm font-medium">
                <ChevronLeft size={16}/> Kembali
            </button>
            <h1 className="text-3xl font-extrabold font-outfit text-slate-900">
                Edit Profil
            </h1>
            <p className="text-slate-500 mt-1">
                Perbarui informasi pribadi dan tampilan publikmu.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
            <div className="p-8 md:p-10 space-y-8">
                
                {/* 1. Ubah Foto Profil */}
                <div className="flex flex-col items-center sm:flex-row gap-6 border-b border-slate-100 pb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition border-2 border-white">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="font-bold text-slate-900">Foto Profil</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-3">Format: JPG, PNG. Maksimal 2MB.</p>
                        <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-xl transition">
                            Upload Foto Baru
                        </button>
                    </div>
                </div>

                {/* 2. Form Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nama Lengkap (Full Width) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" 
                            />
                        </div>
                    </div>

                    {/* Bio (Full Width) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio Singkat</label>
                        <textarea 
                            name="bio" 
                            rows="3"
                            value={formData.bio} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium resize-none"
                        ></textarea>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">Maksimal 150 karakter.</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" 
                            />
                        </div>
                    </div>

                    {/* Telepon */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nomor Telepon</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" 
                            />
                        </div>
                    </div>

                    {/* Lokasi (Full Width) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Domisili / Lokasi</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" 
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Action Buttons (Footer) */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-4">
                
                {/* TOMBOL BATAL (Updated Style) */}
                <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    // Perubahan style di sini:
                    // - Menambahkan border-2 border-slate-200 (garis tepi)
                    // - Mengubah hover effect agar lebih jelas
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition"
                >
                    <X size={18} /> Batal
                </button>

                {/* TOMBOL SIMPAN (Tetap sama) */}
                <button 
                    type="submit" 
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition"
                >
                    <Save size={18} /> Simpan Perubahan
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
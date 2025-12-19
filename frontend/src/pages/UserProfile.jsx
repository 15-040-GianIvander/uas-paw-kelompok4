import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Edit3, Settings, Shield, LogOut, Calendar, ChevronRight } from 'lucide-react';
// Pastikan path service ini benar sesuai struktur foldermu
import { getProfile, updateProfile } from '../services/profileService'; 
import { logout } from '../services/authService'; // ✅ FIX: Import logout disini

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProfile()
      .then((data) => {
        if (!mounted) return;
        setUser(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setPhone(data.phone_number || '');
        setLocation(data.location || '');
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleLogout(); // Auto logout jika token expired
        } else {
          setMessage({ type: 'error', text: 'Gagal memuat profil.' });
        }
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran maksimal 2MB' });
      return;
    }
    setSelectedFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    fd.append('phone_number', phone);
    fd.append('location', location);
    if (selectedFile) fd.append('profile_picture', selectedFile);

    try {
      setSaving(true);
      const res = await updateProfile(fd);
      setMessage({ type: 'success', text: res.message || 'Profil berhasil diperbarui.' });
      
      const newUrl = res.profile_picture_url;
      setUser((prev) => ({ 
        ...(prev || {}), 
        name, 
        bio, 
        phone_number: phone, 
        location, 
        profile_picture_url: newUrl || prev?.profile_picture_url 
      }));

      if (newUrl) {
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }
      setEditMode(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleLogout();
      } else {
        const text = err?.response?.data?.message || 'Gagal menyimpan profil.';
        setMessage({ type: 'error', text });
      }
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIX: Fungsi Logout Terpisah & Bersih
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // Jika API logout gagal, tetap hapus data lokal
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
        <div className="max-w-4xl mx-auto px-4 pt-36">
          <div className="bg-white rounded-3xl shadow p-8 text-center">Memuat data profil...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
        <div className="max-w-4xl mx-auto px-4 pt-36">
          <div className="bg-white rounded-3xl shadow p-8 text-center">Profil tidak ditemukan.</div>
        </div>
      </div>
    );
  }

  return (
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
                {/* notification */}
                {message && (
                  <div className={`p-3 mb-4 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} rounded-xl`}> 
                    {message.text}
                  </div>
                )}

                {/* TOP SECTION: Avatar -> Name -> Actions -> Bio (stacked vertically) */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-50 shadow-lg overflow-hidden bg-slate-200 mx-auto">
                      <img src={preview || user.profile_picture_url || user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-110 border-4 border-white">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900">{user.name}</h2>
                    <div className="flex items-center justify-center gap-3 text-slate-500 mt-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{user.role}</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {user.location || '-'}</span>
                    </div>
                  </div>

                  {/* actions */}
                  <div>
                    {editMode ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Batal</button>
                        <button form="profile-form" type="submit" disabled={saving} className={`flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition shadow-lg hover:shadow-xl ${saving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                          <Edit3 size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <Edit3 size={18} /> Edit Profil
                      </button>
                    )}
                  </div>

                  {/* bio */}
                  {!editMode ? (
                    <div className="mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm md:text-base w-full md:w-3/4">
                      {user.bio ? `"${user.bio}"` : 'Belum ada bio.'}
                    </div>
                  ) : (
                    <form id="profile-form" onSubmit={handleSave} className="w-full md:w-3/4 mt-4">
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 resize-none" rows={3} />

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border" placeholder="Nama" />
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 rounded-xl border" placeholder="Lokasi" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 rounded-xl border" placeholder="Nomor Telepon" />

                        <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100">
                            <img src={preview || user.profile_picture_url || user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'} alt="avatar" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border">Pilih Foto</button>
                              {selectedFile && <button type="button" onClick={handleRemoveFile} className="px-3 py-2 rounded-xl bg-red-50 text-red-700 border">Hapus</button>}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                            <p className="text-xs text-slate-400 mt-2">JPG/PNG, maksimal 2MB.</p>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
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
                                    <p className="text-slate-800 font-bold text-sm">{user.phone_number || user.phone || '-'}</p>
                                </div>
                            </div>

                             {/* Tanggal Join */}
                             <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition group sm:col-span-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Bergabung Sejak</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <Calendar size={18} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm">
                                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                    </p>
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
                            <Link to="/notifications" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-left group" style={{ textDecoration: 'none' }}>
                                <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">Notifikasi</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                            </Link>
                            <Link to="/help" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-left group" style={{ textDecoration: 'none' }}>
                                <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">Bantuan & Support</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                            </Link>
                        </div>

                        {/* ✅ FIX: Gunakan handler logout yang sudah diperbaiki */}
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 transition font-bold text-sm mt-4">
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
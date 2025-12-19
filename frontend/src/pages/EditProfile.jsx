import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, X, ChevronLeft } from 'lucide-react';
import { getProfile, updateProfile } from '../lib/profile';

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true); // fetch loading
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const [profilePicUrl, setProfilePicUrl] = useState(null); // existing URL from backend
  const [selectedFile, setSelectedFile] = useState(null); // File object
  const [preview, setPreview] = useState(null); // local preview URL

  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProfile()
      .then((data) => {
        if (!mounted) return;
        setName(data.name || '');
        setBio(data.bio || '');
        setPhone(data.phone_number || '');
        setLocation(data.location || '');
        // email often not returned but keep if present
        if (data.email) setEmail(data.email);
        setProfilePicUrl(data.profile_picture_url || null);
      })
      .catch((err) => {
        // handle token expired or other errors
        if (err?.response?.status === 401) {
          setMessage({ type: 'error', text: 'Session berakhir. Silakan login kembali.' });
          setTimeout(() => navigate('/login'), 1000);
        } else {
          setMessage({ type: 'error', text: 'Gagal mengambil data profil.' });
        }
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
      // revoke preview url when unmount
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // cleanup preview when selectedFile changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // simple client-side file size check (optional)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB.' });
      return;
    }

    setSelectedFile(file);

    // create local preview
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    // keep existing profilePicUrl as-is
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    fd.append('phone_number', phone);
    fd.append('location', location);
    if (selectedFile) {
      fd.append('profile_picture', selectedFile);
    }

    try {
      setSaving(true);
      const res = await updateProfile(fd);
      setMessage({ type: 'success', text: res.message || 'Profil berhasil diperbarui.' });
      // update profile picture url returned by server (if any)
      if (res.profile_picture_url) {
        setProfilePicUrl(res.profile_picture_url);
        // clear preview & selected file
        setSelectedFile(null);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
      }
      // navigate back to profile after short delay
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      if (err?.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session berakhir. Silakan login kembali.' });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        const text = err?.response?.data?.message || 'Gagal menyimpan profil.';
        setMessage({ type: 'error', text });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen page-bg pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition mb-4 text-sm font-medium">
            <ChevronLeft size={16} /> Kembali
          </button>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-900">Edit Profil</h1>
          <p className="text-slate-500 mt-1">Perbarui informasi pribadi dan tampilan publikmu.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* notification */}
          {message && (
            <div className={`p-4 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border-b`}> 
              {message.text}
            </div>
          )}

          <div className="p-8 md:p-10 space-y-8">

            {/* Avatar & Upload */}
            <div className="flex flex-col items-center sm:flex-row gap-6 border-b border-slate-100 pb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-200 overflow-hidden">
                  <img
                    src={preview || profilePicUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-0 right-0 flex items-center gap-2">
                  <button
                    type="button"
                    className="bg-white border border-slate-200 p-2 rounded-full shadow-sm hover:bg-slate-50 transition"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    title="Pilih foto baru"
                  >
                    <Camera size={14} className="text-slate-600" />
                  </button>

                  {selectedFile && (
                    <button
                      type="button"
                      className="bg-red-50 border border-red-100 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-100 transition"
                      onClick={handleRemoveFile}
                      title="Hapus foto terpilih"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-bold text-slate-900">Foto Profil</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">Format: JPG, PNG. Maksimal 2MB.</p>
                <button
                  type="button"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-xl transition"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Upload Foto Baru
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio Singkat</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} name="bio" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium resize-none" />
                <p className="text-[10px] text-slate-400 mt-1 text-right">Maksimal 150 karakter.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="phone" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Domisili / Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" name="location" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium" />
                </div>
              </div>

            </div>

          </div>

          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition">
              <X size={18} /> Batal
            </button>

            <button disabled={saving || loading} type="submit" className={`flex items-center justify-center gap-2 ${saving || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition`}>
              <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>

        {/* simple loading indicator when fetching */}
        {loading && (
          <div className="mt-6 text-center text-slate-500">Memuat data profil...</div>
        )}

      </div>
    </div>
  );
};

export default EditProfile;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { resetPassword } from '../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefEmail = (location.state && location.state.email) || '';

  const [email, setEmail] = useState(prefEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token || !newPassword) return alert('Semua field harus diisi');
    setLoading(true);
    try {
      await resetPassword({ email, token, new_password: newPassword });
      alert('Password berhasil direset. Silakan login.');
      navigate('/login');
    } catch (err) {
      alert(err?.message || 'Gagal mereset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container min-h-screen page-bg pt-32 pb-20 px-4">
      <div className="fp-card">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition mb-4 text-sm font-medium">
            <ChevronLeft size={16}/> Kembali
          </button>
        </div>

        <h2 className="fp-title">Reset Password</h2>
        <p className="fp-desc">Masukkan email, token yang kamu terima, dan password baru.</p>

        <form onSubmit={handleSubmit} className="fp-form">
          <label className="fp-label">Email</label>
          <input type="email" className="fp-input" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label className="fp-label">Token</label>
          <input className="fp-input" value={token} onChange={(e) => setToken(e.target.value)} required />

          <label className="fp-label">Password Baru</label>
          <input type="password" className="fp-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

          <div className="fp-actions">
            <button type="submit" className="fp-btn" disabled={loading}>{loading ? 'Memproses...' : 'Reset Password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

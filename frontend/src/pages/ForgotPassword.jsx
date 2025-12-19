import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ChevronLeft } from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return alert('Masukkan email yang valid');
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="forgot-password-container min-h-screen page-bg pt-32 pb-20 px-4">
        <div className="fp-card">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition mb-4 text-sm font-medium">
              <ChevronLeft size={16}/> Kembali
            </button>
          </div>

          <div className="fp-success-icon">
            <CheckCircle size={58} color="#2563eb" />
          </div>
          <h2 className="fp-title">Cek Email Anda</h2>
          <p className="fp-desc">Kami telah mengirimkan tautan reset password ke <strong>{email}</strong>. Silakan periksa kotak masuk Anda.</p>

          <div className="fp-actions">
            <button className="fp-btn" onClick={() => navigate('/login')}>Kembali ke Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container min-h-screen page-bg pt-32 pb-20 px-4">
      <div className="fp-card">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition mb-4 text-sm font-medium">
            <ChevronLeft size={16}/> Kembali
          </button>
        </div>

        <h2 className="fp-title">Lupa Password?</h2>
        <p className="fp-desc">Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mereset password Anda.</p>

        <form onSubmit={handleSubmit} className="fp-form">
          <label className="fp-label">Email</label>
          <div className="fp-input-wrap">
            <Mail size={18} className="fp-icon" />
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fp-input"
              disabled={isLoading}
              required
            />
          </div>

          <div className="fp-actions">
            <button type="submit" className="fp-btn" disabled={isLoading}>{isLoading ? 'Mengirim...' : 'Kirim Link Reset'}</button>
          </div>

          <div className="fp-footer">
            <Link to="/login" className="fp-link">Kembali ke Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

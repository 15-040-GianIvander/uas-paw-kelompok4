import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password minimal 6 karakter');
    if (password !== confirm) return setError('Password dan konfirmasi tidak cocok');
    alert(`Registrasi berhasil untuk ${name} (${email})`);
  };

  return (
    <div className="login-layout">
      <div className="auth-card">
        <div className="auth-left">
          <div className="hero">
            <h3>Selamat datang di Evoria</h3>
            <p>Daftar untuk membuat atau mengikuti event seru di Evoria.</p>
          </div>
        </div>

        <div className="auth-right">
          <button className="social-btn" onClick={() => alert('Sign up with Google (placeholder)')} aria-label="Sign up with Google">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35 11.1h-9.2v2.95h5.27c-.23 1.3-1.38 3.8-5.27 3.8-3.18 0-5.79-2.63-5.79-5.86s2.61-5.86 5.79-5.86c1.8 0 3.01.77 3.7 1.43l2.53-2.44C17.8 3.7 15.86 2.7 12.98 2.7 7.9 2.7 3.9 6.86 3.9 12s4 9.3 9.08 9.3c5.26 0 8.62-3.7 8.62-8.9 0-.6-.07-1.05-.25-1.3z" fill="#EA4335"/>
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          <div className="divider">atau</div>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Nama Lengkap</label>
              <div className="input-with-icon">
                <span className="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Email</label>
              <div className="input-with-icon icon-left">
                <span className="icon" aria-hidden="true">@</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Password</label>
                <div className="input-with-icon">
                  <span className="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a2.5 2.5 0 0 0 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12s2.5-6 10-6 10 6 10 6-2.5 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Konfirmasi</label>
                <div className="input-with-icon">
                  <span className="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a2.5 2.5 0 0 0 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12s2.5-6 10-6 10 6 10 6-2.5 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Konfirmasi password" required />
                </div>
              </div>
            </div>



            {error && <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>}

            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/login" className="small-link small-link--primary" style={{ alignSelf: 'center' }}>Sudah punya akun?</Link>
            </div>

            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Daftar</button>
            </div>

            <div style={{ marginTop: 18, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dengan mendaftar, Anda menyetujui <Link to="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Syarat & Ketentuan</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Pastikan CSS terhubung

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login dengan:', email, password);
    // TODO: connect to backend auth API
  };

  return (
    <div className="login-layout">
      <div className="auth-card">
        <div className="auth-left">
          <div className="hero">
            <h3>Selamat datang di Evoria</h3>
            <p>Kelola event, tiket, dan peserta dengan mudah — semua di satu tempat. Masuk untuk melanjutkan ke dashboard admin.</p>
            <small style={{ color: 'var(--text-muted)' }}>Didesain dengan palet & bentuk yang sama seperti referensi.</small>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-logo">
            <div className="brand">Ev</div>
            <div>
              <div style={{ fontWeight: 700 }}>Evoria Admin</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Masuk untuk melanjutkan</div>
            </div>
          </div>

          <button className="social-btn" onClick={() => alert('Sign in with Google (placeholder)')} aria-label="Sign in with Google">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35 11.1h-9.2v2.95h5.27c-.23 1.3-1.38 3.8-5.27 3.8-3.18 0-5.79-2.63-5.79-5.86s2.61-5.86 5.79-5.86c1.8 0 3.01.77 3.7 1.43l2.53-2.44C17.8 3.7 15.86 2.7 12.98 2.7 7.9 2.7 3.9 6.86 3.9 12s4 9.3 9.08 9.3c5.26 0 8.62-3.7 8.62-8.9 0-.6-.07-1.05-.25-1.3z" fill="#EA4335"/>
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          <div className="divider">atau</div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Email</label>
              <div className="input-with-icon">
                <span className="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a2.5 2.5 0 0 0 2.5-2.5v-11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div className="field-row" style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-main)' }}>Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Lupa Password?</Link>
              </div>

              <div className="input-with-icon">
                <span className="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a2.5 2.5 0 0 0 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12s2.5-6 10-6 10 6 10 6-2.5 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <label className="remember"><input type="checkbox" style={{ marginRight: 6 }} /> Ingat saya</label>
              <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Daftar</Link>
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Masuk</button>
              <button type="button" className="btn" style={{ border: '1px solid var(--border)', background: 'transparent' }} onClick={() => { setEmail('demo@a.com'); setPassword('password'); }}>
                Demo
              </button>
            </div>
          </form>

          <div style={{ marginTop: 18, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Dengan masuk, Anda menyetujui <Link to="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
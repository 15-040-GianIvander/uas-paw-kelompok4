import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('attendee');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password minimal 6 karakter');
    if (password !== confirm) return setError('Password dan konfirmasi tidak cocok');
    alert(`Registrasi berhasil untuk ${name} (${email}) — role: ${role}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ maxWidth: 560, margin: '0 auto', background: 'var(--bg-card)', padding: 28, borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginTop: 0 }}>Buat Akun Evoria</h2>
        <p style={{ color: 'var(--text-muted)' }}>Daftar sebagai organizer atau attendee untuk mulai membuat / membeli tiket.</p>

        <form onSubmit={handleRegister} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Nama Lengkap</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Konfirmasi</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Konfirmasi password" />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 10 }}>
              <option value="attendee">Participant / Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {error && <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>}

          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" type="submit">Daftar</button>
            <Link to="/login" style={{ alignSelf: 'center' }}>Sudah punya akun?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 

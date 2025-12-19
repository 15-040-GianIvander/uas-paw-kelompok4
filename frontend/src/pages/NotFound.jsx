import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.title}>Halaman Tidak Ditemukan</h2>
      <p style={styles.text}>
        Waduh, sepertinya kamu tersesat. Halaman yang kamu cari tidak ada.
      </p>
      
      {/* Tombol kembali ke Home */}
      <Link to="/" className="btn btn-danger" style={{ marginTop: '20px' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(180deg, #c0392b 0%, #ff6b6b 45%, #ffffff 100%)',
    backgroundRepeat: 'no-repeat',
  },
  errorCode: {
    fontSize: '6rem',
    fontWeight: '700',
    color: '#ffffff', // putih di atas latar merah
    marginBottom: '0',
    lineHeight: '1',
    textShadow: '0 6px 20px rgba(0,0,0,0.12)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: 'rgba(255,255,255,0.95)',
  },
  text: {
    color: 'rgba(255,255,255,0.92)',
    maxWidth: '540px',
    marginBottom: '20px',
  }
};

export default NotFound;
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
      <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  errorCode: {
    fontSize: '6rem',
    fontWeight: 'bold',
    color: 'var(--primary)', // Biru
    marginBottom: '0',
    lineHeight: '1',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: 'var(--text-main)',
  },
  text: {
    color: 'var(--text-muted)',
    maxWidth: '400px',
    marginBottom: '20px',
  }
};

export default NotFound;
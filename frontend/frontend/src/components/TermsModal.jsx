import React from 'react';

const TermsModal = ({ onClose }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} role="dialog" aria-modal="true">
      <div style={{ width: 'min(920px, 94%)', maxHeight: '86vh', background: '#fff', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Syarat dan Ketentuan Penggunaan Evoria</h3>
          <button onClick={onClose} aria-label="Tutup" style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: 18, overflow: 'auto' }}>
          <section style={{ marginBottom: 12 }}>
            <h4>1. Pendahuluan</h4>
            <p>Selamat datang di Evoria. Dengan mendaftar dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.</p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h4>2. Pendaftaran Akun</h4>
            <ul>
              <li>Pengguna wajib memberikan informasi nama, email, dan data diri yang benar dan akurat.</li>
              <li>Pengguna bertanggung jawab menjaga kerahasiaan kata sandi (password). Evoria tidak bertanggung jawab atas kerugian akibat kelalaian pengguna dalam menjaga akun.</li>
              <li>Satu pengguna hanya diperbolehkan memiliki satu akun aktif (untuk menghindari spam).</li>
            </ul>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h4>3. Ketentuan Pembelian Tiket (Attendee)</h4>
            <ul>
              <li><strong>Booking:</strong> Tiket dianggap sah hanya jika status pemesanan telah "Confirmed" dan memiliki Kode Booking yang valid.</li>
              <li><strong>Pembayaran:</strong> Pengguna wajib menyelesaikan pembayaran (jika berbayar) sesuai nominal yang tertera.</li>
              <li><strong>Non-Refundable:</strong> Tiket yang sudah dibeli tidak dapat dikembalikan uangnya, kecuali jika acara dibatalkan oleh pihak Penyelenggara.</li>
              <li><strong>Kehadiran:</strong> E-Ticket wajib ditunjukkan saat check-in di lokasi acara.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h4>4. Ketentuan Penyelenggara Acara (Organizer)</h4>
            <ul>
              <li>Organizer bertanggung jawab penuh atas kebenaran informasi event (Lokasi, Waktu, Harga, Deskripsi).</li>
              <li>Dilarang membuat event fiktif, mengandung unsur SARA, pornografi, atau kegiatan ilegal.</li>
              <li>Evoria hanya bertindak sebagai perantara platform. Segala perselisihan antara Organizer dan Attendee di luar sistem kami adalah tanggung jawab masing-masing pihak.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h4>5. Pembatalan Acara</h4>
            <p>Jika acara dibatalkan, Organizer wajib memberikan informasi kepada Attendee. Mekanisme pengembalian dana (refund) diatur sepenuhnya oleh kebijakan Organizer, bukan oleh platform Evoria.</p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h4>6. Hak Kekayaan Intelektual</h4>
            <p>Seluruh desain, logo, kode program, dan konten dalam aplikasi ini adalah hak milik Evoria. Dilarang menyalin atau memodifikasi tanpa izin.</p>
          </section>

          <section>
            <h4>7. Perubahan Ketentuan</h4>
            <p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Pengguna disarankan memeriksa halaman ini secara berkala.</p>
          </section>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} className="btn" style={{ padding: '8px 12px' }}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

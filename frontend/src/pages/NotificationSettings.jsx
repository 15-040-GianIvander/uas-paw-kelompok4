import React, { useState } from 'react';
import './NotificationSettings.css';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // locked (required) toggles: must be true and disabled
  const [payment, setPayment] = useState(true);
  const [eticket, setEticket] = useState(true);

  // user-controllable toggles
  const [reminderDayBefore, setReminderDayBefore] = useState(true);
  const [scheduleChange, setScheduleChange] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [discount, setDiscount] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Pengaturan disimpan!');
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="notifications-container page-bg">
      <div className="ns-card">
        <div className="ns-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Pengaturan Notifikasi</h2>
              <p>Atur bagaimana kami menghubungi Anda.</p>
            </div>
            <button className="ns-back" onClick={() => navigate(-1)}>Kembali</button>
          </div>
        </div>

        <div className="ns-body">
          <div className="ns-group">
            <h4>Aktivitas Tiket &amp; Transaksi</h4>
            <div className="ns-item locked">
              <div className="ns-text">
                <div className="ns-title">Konfirmasi Pembayaran</div>
                <div className="ns-desc">Kirim email saat pembayaran berhasil</div>
              </div>
              <div className="ns-toggle">
                <div className="toggle" role="switch" aria-checked="true" aria-disabled="true">
                  <input aria-hidden="true" tabIndex={-1} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </div>
                <Lock size={16} className="ns-lock" />
              </div>
            </div>

            <div className="ns-item locked">
              <div className="ns-text">
                <div className="ns-title">E-Ticket</div>
                <div className="ns-desc">Kirim tiket digital ke email</div>
              </div>
              <div className="ns-toggle">
                <div className="toggle" role="switch" aria-checked="true" aria-disabled="true">
                  <input aria-hidden="true" tabIndex={-1} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </div>
                <Lock size={16} className="ns-lock" />
              </div>
            </div>
          </div>

          <div className="ns-group">
            <h4>Reminder Event</h4>
            <div className="ns-item">
              <div className="ns-text">
                <div className="ns-title">Pengingat H-1</div>
                <div className="ns-desc">Beritahu saya 24 jam sebelum acara dimulai</div>
              </div>
              <div className="ns-toggle">
                <label className={`toggle ${reminderDayBefore ? 'on' : ''}`}>
                  <input type="checkbox" checked={reminderDayBefore} onChange={() => setReminderDayBefore((s) => !s)} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </label>
              </div>
            </div>

            <div className="ns-item">
              <div className="ns-text">
                <div className="ns-title">Perubahan Jadwal</div>
                <div className="ns-desc">Beritahu jika ada perubahan waktu atau lokasi</div>
              </div>
              <div className="ns-toggle">
                <label className={`toggle ${scheduleChange ? 'on' : ''}`}>
                  <input type="checkbox" checked={scheduleChange} onChange={() => setScheduleChange((s) => !s)} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="ns-group">
            <h4>Promosi &amp; Rekomendasi</h4>
            <div className="ns-item">
              <div className="ns-text">
                <div className="ns-title">Newsletter</div>
                <div className="ns-desc">Info event terbaru setiap minggu</div>
              </div>
              <div className="ns-toggle">
                <label className={`toggle ${newsletter ? 'on' : ''}`}>
                  <input type="checkbox" checked={newsletter} onChange={() => setNewsletter((s) => !s)} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </label>
              </div>
            </div>

            <div className="ns-item">
              <div className="ns-text">
                <div className="ns-title">Diskon Spesial</div>
                <div className="ns-desc">Info promo tiket atau voucher</div>
              </div>
              <div className="ns-toggle">
                <label className={`toggle ${discount ? 'on' : ''}`}>
                  <input type="checkbox" checked={discount} onChange={() => setDiscount((s) => !s)} />
                  <span className="track">
                    <span className="thumb" />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="ns-footer">
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

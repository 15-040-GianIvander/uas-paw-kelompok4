import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HelpCenter.css';

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="page-bg">
      <div className="help-container">
        <div className="help-card">
          <div className="help-header">
            <button className="help-back" onClick={() => navigate(-1)}>Kembali</button>
            <div>
              <h2>Bantuan &amp; Dukungan</h2>
              <p>Butuh bantuan? Hubungi tim kami melalui kontak berikut.</p>
            </div>
          </div>

          <div className="help-body">
            <div className="hc-grid single">
              <div className="hc-contact">
                <div className="hc-item">
                  <Mail className="hc-icon" />
                  <div>
                    <div className="hc-title">Email Support</div>
                    <a href="mailto:support@evoria.id" className="hc-link">support@evoria.id</a>
                  </div>
                </div>

                <div className="hc-item">
                  <Phone className="hc-icon" />
                  <div>
                    <div className="hc-title">WhatsApp Admin</div>
                    <a href="https://wa.me/62812xxxxxxxx" target="_blank" rel="noreferrer" className="hc-link">0812-XXXX-XXXX</a>
                  </div>
                </div>

                <div className="hc-item">
                  <Clock className="hc-icon" />
                  <div>
                    <div className="hc-title">Jam Operasional</div>
                    <div className="hc-text">Senin - Jumat, 09.00 - 17.00 WIB</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

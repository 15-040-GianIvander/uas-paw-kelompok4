import React from 'react';
import { Link } from 'react-router-dom';

const sample = {
  totalEvents: 12,
  ticketsSold: 1245,
  revenue: 185450000,
  events: [
    { id: 1, name: 'Konser Indie Night', date: '2026-01-15', attendees: 300 },
    { id: 2, name: 'Tech Meetup: DevTalks', date: '2026-02-05', attendees: 120 },
    { id: 3, name: 'Festival Musik', date: '2026-03-20', attendees: 900 },
  ]
};

const DashboardAdmin = () => {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard Admin</h2>
          <div style={{ color: 'var(--text-muted)' }}>Ringkasan cepat Evoria</div>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => alert('Buat Event (placeholder)')}>Buat Event</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)' }}>Total Event</div>
          <div className="box-heading stat-number">{sample.totalEvents}</div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)' }}>Tickets Sold</div>
          <div className="box-heading stat-number">{sample.ticketsSold}</div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)' }}>Revenue</div>
          <div className="box-heading stat-number">Rp {sample.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ marginBottom: 12 }}>Upcoming Events</h3>
        <div className="events-table">
          {sample.events.map(ev => (
            <div key={ev.id} className="event-row">
              <div style={{ fontWeight: 700 }}>{ev.name}</div>
              <div style={{ color: 'var(--text-muted)' }}>{ev.date}</div>
              <div>{ev.attendees} peserta</div>
              <div>
                <button className="btn">Edit</button>
                <button className="btn" style={{ marginLeft: 8 }} onClick={() => alert('Hapus (placeholder)')}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin; 

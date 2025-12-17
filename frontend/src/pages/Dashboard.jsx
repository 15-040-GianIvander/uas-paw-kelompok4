import React from 'react';
import './Dashboard.css';

const dummy = {
  organizer: 'Evoria Admin',
  stats: {
    totalEvents: 8,
    ticketsSold: 2780,
    revenue: 84250000,
    checkins: 1932,
  },
  recent: [
    { id: 'BKG-00123', event: 'Konser Indie Night', buyer: 'Ayu Pratiwi', status: 'Completed', date: '2026-01-12' },
    { id: 'BKG-00122', event: 'Tech Meetup: DevTalks', buyer: 'Budi Santoso', status: 'Checked-in', date: '2026-01-10' },
    { id: 'BKG-00121', event: 'Pelatihan Yoga Pagi', buyer: 'Siti Rahma', status: 'Pending', date: '2026-01-09' },
    { id: 'BKG-00120', event: 'Festival Musik', buyer: 'Andi Pratama', status: 'Canceled', date: '2026-01-08' },
    { id: 'BKG-00119', event: 'Workshop Fotografi', buyer: 'Nina', status: 'Completed', date: '2026-01-07' },
  ],
};

export default function OrganizerDashboard() {
  const { organizer, stats, recent } = dummy;

  return (
    <div className="org-dashboard">
      <aside className="org-sidebar" aria-label="Organizer navigation">
        <div className="org-brand">Evoria</div>
        <nav>
          <a className="active" href="/organizer/dashboard">Dashboard</a>
          <a href="/organizer/events">Manage Events</a>
          <a href="/organizer/bookings">My Bookings</a>
          <a href="/organizer/scan">Scan Ticket</a>
          <a href="/logout">Logout</a>
        </nav>
      </aside>

      <main className="org-main">
        <header className="org-header">
          <div>
            <h2>Hello, <span className="org-name">{organizer}</span></h2>
            <div className="org-sub">Welcome back — manage your events and attendees here.</div>
          </div>
          <div className="org-profile" aria-hidden>
            <div className="avatar">R</div>
          </div>
        </header>

        <section className="org-stats">
          <article className="stat-card">
            <div className="stat-label">Total Events Active</div>
            <div className="stat-value">{stats.totalEvents}</div>
          </article>

          <article className="stat-card">
            <div className="stat-label">Tickets Sold</div>
            <div className="stat-value">{stats.ticketsSold.toLocaleString()}</div>
          </article>

          <article className="stat-card">
            <div className="stat-label">Total Revenue (Rp)</div>
            <div className="stat-value">Rp {stats.revenue.toLocaleString()}</div>
          </article>

          <article className="stat-card">
            <div className="stat-label">Attendees Check-in</div>
            <div className="stat-value">{stats.checkins.toLocaleString()}</div>
          </article>
        </section>

        <section className="org-table">
          <div className="table-header">
            <h3>Recent Activity</h3>
            <div className="table-actions">
              <button className="btn" onClick={() => alert('View all (placeholder)')}>View all</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event Name</th>
                <th>Buyer Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.event}</td>
                  <td>{r.buyer}</td>
                  <td><span className={`status status-${r.status.toLowerCase().replace(/\s+/g, '-')}`}>{r.status}</span></td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}

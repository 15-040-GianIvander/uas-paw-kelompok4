import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// import images via Vite glob (eager for simplicity)
const imageModules = import.meta.glob('../assets/event-list/*.{png,jpg,jpeg,webp}', { eager: true });
const availableImages = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => {
    const name = path.split('/').pop();
    return [name, mod.default];
  })
);

const sampleEvents = [
  { id: 1, title: 'Konser Indie Night', date: '2026-01-15', venue: 'Jakarta Hall', price: 125000, tag: 'Music' },
  { id: 2, title: 'Tech Meetup: DevTalks', date: '2026-02-05', venue: 'Coworking Space', price: 0, tag: 'Tech' },
  { id: 3, title: 'Festival Musik', date: '2026-03-20', venue: 'Lapangan Utama', price: 200000, tag: 'Music' },
  { id: 4, title: 'Workshop Fotografi', date: '2026-02-28', venue: 'Studio Evoria', price: 75000, tag: 'Workshop' },
  { id: 5, title: 'Komunitas Board Game Night', date: '2026-01-25', venue: 'BoardRoom', price: 50000, tag: 'Games' },
  { id: 6, title: 'Seminar Marketing Digital', date: '2026-02-12', venue: 'Hotel Santika', price: 150000, tag: 'Business' },
  { id: 7, title: 'Pentas Teater Lokal', date: '2026-03-05', venue: 'Teater Kota', price: 90000, tag: 'Art' },
  { id: 8, title: 'Pelatihan Yoga Pagi', date: '2026-01-30', venue: 'Taman Kota', price: 30000, tag: 'Wellness' },
  { id: 9, title: 'Hackathon 48h', date: '2026-04-01', venue: 'Evoria Campus', price: 0, tag: 'Tech' },
  { id: 10, title: 'Food Festival Street', date: '2026-03-15', venue: 'Alun-Alun', price: 35000, tag: 'Food' },
];

// mapping for filenames that don't directly match slugs
const filenameMap = {
    1: 'konser-indie.png',
    2: 'tech-meetup.png',
    3: 'festival-musik.png',
    4: 'workshop-foto.png',
    5: 'board-game.png',
    6: 'marketing-digital.png',
    7: 'teater-lokal.png',
    8: 'yoga-pagi.png',
    9: 'hackaton-48h.png',
    10: 'food-festival.png'
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const EventList = () => {
  const [query, setQuery] = useState('');

  const filtered = sampleEvents.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.venue.toLowerCase().includes(query.toLowerCase()) || e.tag.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="events-page">
      <section className="events-hero" aria-label="Event hero">
        <div className="hero-inner">
          <div className="hero-badge">Event List</div>
          <h1 className="hero-title">Event Organization & Integrated Access</h1>
          <p className="hero-sub">Temukan event menarik di Evoria</p>

          <div className="hero-controls">
            <input className="search-bar" placeholder="Cari event, venue atau kategori" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </section>

      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 20 }}>
          {/* Header area intentionally left empty; hero contains title/search */}
        </div>

      <div className="events-grid">
        {filtered.map(evt => (
          <div className="event-card" key={evt.id}>
            <div className="event-thumb">
              {(() => {
                const mapped = filenameMap[evt.id];
                const slug = mapped || `${slugify(evt.title)}.png`;
                const imgUrl = availableImages[slug];
                if (imgUrl) {
                  return <img src={imgUrl} alt={evt.title} />;
                }
                return (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.04))' }} aria-hidden />
                );
              })()}

              <div className="tag">{evt.tag}</div>
              <div className="price-pill">{evt.price === 0 ? 'Gratis' : `Rp ${evt.price.toLocaleString()}`}</div>
            </div>

            <div style={{ padding: 14 }}>
              <h3 className="event-title">{evt.title}</h3>
              <div className="event-meta">{evt.date} • {evt.venue}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{evt.tag}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn">Lihat</button>
                  <button className="btn btn-primary" onClick={() => alert(`Beli tiket ${evt.title} (placeholder)`)}>Beli Tiket</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default EventList; 

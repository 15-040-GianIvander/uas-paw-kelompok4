import React, { useState, useRef, useEffect } from 'react';

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
  { id: 11, title: 'Open Mic Night', date: '2026-04-10', venue: 'Cafe Rasa', price: 25000, tag: 'Music' },
  { id: 12, title: 'Charity Run 5K', date: '2026-05-02', venue: 'Taman Kota', price: 50000, tag: 'Sport' },
  { id: 13, title: 'Design Sprint', date: '2026-04-22', venue: 'Evoria Studio', price: 80000, tag: 'Tech' },
  { id: 14, title: 'Photography Exhibition', date: '2026-05-18', venue: 'Galeria', price: 40000, tag: 'Art' },
  { id: 15, title: 'Farmers Market', date: '2026-04-30', venue: 'Alun-Alun', price: 0, tag: 'Food' },
  { id: 16, title: 'Comedy Night', date: '2026-05-05', venue: 'Comedy Club', price: 60000, tag: 'Entertainment' },
  { id: 17, title: 'Standup Comedy Special', date: '2026-05-12', venue: 'Laugh House', price: 70000, tag: 'Entertainment' },
  { id: 18, title: 'Open Air Cinema', date: '2026-05-14', venue: 'Park Screen', price: 25000, tag: 'Film' },
  { id: 19, title: 'Craft & Makers Fair', date: '2026-05-20', venue: 'Convention Hall', price: 30000, tag: 'Market' },
  { id: 20, title: 'Local Choir Concert', date: '2026-06-01', venue: 'City Hall', price: 45000, tag: 'Music' },
  { id: 21, title: 'Night Market Bazaar', date: '2026-06-05', venue: 'Harbour Lane', price: 0, tag: 'Food' },
  { id: 22, title: 'Startup Pitch Day', date: '2026-06-12', venue: 'Auditorium A', price: 100000, tag: 'Business' },
  { id: 23, title: 'Gardening Workshop', date: '2026-06-18', venue: 'Community Garden', price: 20000, tag: 'Workshop' },
  { id: 24, title: 'Indie Film Festival', date: '2026-06-25', venue: 'Cinema Loko', price: 80000, tag: 'Film' },
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
    10: 'food-festival.png',
    // no images for new items yet; they will show placeholder
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

  const filtered = sampleEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.venue.toLowerCase().includes(query.toLowerCase()) ||
      e.tag.toLowerCase().includes(query.toLowerCase())
  );

  // Pagination: 16 per page (4 columns)
  const itemsPerPage = 16;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => setPage(1), [query]);

  // animation / observer
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.event-card');
    cards.forEach((c) => c.classList.remove('in-view'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.12 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [page, query]);

  const start = (page - 1) * itemsPerPage;
  const current = filtered.slice(start, start + itemsPerPage);

  // chunk into rows of 4
  const rows = [];
  for (let i = 0; i < current.length; i += 4) rows.push(current.slice(i, i + 4));

  const goPage = (n) => setPage(Math.min(Math.max(1, n), totalPages));

  return (
    <div className="events-page">
      <section className="events-hero" aria-label="Event hero">
        <div className="hero-inner">
          <div className="hero-badge">Event List</div>
          <h1 className="hero-title">Event Organization & Integrated Access</h1>
          <p className="hero-sub">Temukan event menarik di Evoria</p>

          <div className="hero-controls">
            <input
              className="search-bar"
              placeholder="Cari event, venue, atau kategori"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 20 }}>
          {/* Header area intentionally left empty; hero contains title/search */}
        </div>

        <div className="events-rows" ref={containerRef}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className={`events-row ${row.length < 4 ? 'row-center' : ''}`}>
              {row.map((evt, colIdx) => {
                const gIndex = rowIdx * 4 + colIdx;
                return (
                  <div
                    className="event-card"
                    key={evt.id}
                    data-idx={gIndex}
                    style={{ ['--delay']: `${gIndex * 60}ms` }}
                  >
                    <div className="event-thumb">
                      {(() => {
                        const mapped = filenameMap[evt.id];
                        const slug = mapped || `${slugify(evt.title)}.png`;
                        const defaultImg = availableImages['for-nan.jpg'] || availableImages['for-nan.jpeg'] || Object.values(availableImages)[0] || null;
                        const imgUrl = availableImages[slug] || defaultImg;
                        if (imgUrl) {
                          return <img src={imgUrl} alt={evt.title} />;
                        }
                        return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.04))' }} aria-hidden />;
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
                );
              })}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination" style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button className="btn" onClick={() => goPage(page - 1)} disabled={page === 1}>Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={`btn ${page === i + 1 ? 'btn-primary' : ''}`} onClick={() => goPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="btn" onClick={() => goPage(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EventList; 

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';

// import images via Vite glob (eager for simplicity)
const imageModules = import.meta.glob('../assets/event-list/*.{png,jpg,jpeg,webp}', { eager: true });
const availableImages = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => {
    const name = path.split('/').pop();
    return [name, mod.default];
  })
);

import { sampleEvents } from '../data/events';

// (events now come from shared data module)


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
  const navigate = useNavigate();

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
      <section className="events-hero relative pt-72 pb-32 px-6 text-center overflow-hidden" aria-label="Event hero">
        <div className="hero-inner" style={{ marginTop: '70px' }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-blue-50 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
              <Ticket size={14} /> Event List
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-outfit text-white mb-2 tracking-tight">
              Temukan Event Seru di Sekitarmu
            </h1>
            <p className="text-blue-100 font-light">
              Konser, workshop, festival & lainnya — semua di satu tempat.
            </p>

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
                      <div className="price-pill">{`Rp ${evt.price.toLocaleString()}`}</div>
                    </div>

                    <div style={{ padding: 14 }}>
                      <h3 className="event-title">{evt.title}</h3>
                      <div className="event-meta">{evt.date} • {evt.venue}</div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{evt.tag}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-primary" onClick={() => navigate(`/booking/${evt.id}`)}>Beli Tiket</button>
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

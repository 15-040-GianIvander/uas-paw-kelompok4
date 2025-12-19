import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // Filter Logic
  const filtered = events.filter((e) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return true;
    return (
      (e.title || '').toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page saat search berubah
  useEffect(() => setPage(1), [query]);

  // Fetch Data dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data.data) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Gagal ambil event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white pb-20">
      <div className="relative pt-36 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-blue-50 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
              <Ticket size={14} /> Event List
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-outfit text-white mb-2 tracking-tight">
              Temukan Event Seru di Sekitarmu
            </h1>
            <p className="text-blue-100 font-light">
              Konser, workshop, festival & lainnya — semua di satu tempat.
            </p>

            <div className="hero-controls mt-6">
              <input
                className="search-bar w-full max-w-md mx-auto p-3 rounded-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl"
                placeholder="Cari event, venue, atau kategori"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Card Event */}
        {filtered.length > 0 ? (
          <> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paged.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1" style={{ textDecoration: 'none' }}>
                  
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    <img
                      src={event.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Error+Image'; }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                      Event
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-3 uppercase tracking-wider">
                      <Calendar size={14} className="text-blue-500" />
                      {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Belum Ada'}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                      <MapPin size={16} />
                      <span className="truncate">{event.location || 'Lokasi belum ditentukan'}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Mulai dari</span>
                        <span className="text-lg font-bold text-blue-600">
                          {event.ticket_price ? `Rp ${parseInt(event.ticket_price).toLocaleString('id-ID')}` : 'Gratis'}
                        </span>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                <div className="text-sm text-slate-600">Halaman {page} / {totalPages}</div>
                <button className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Belum ada event tersedia</h3>
            <p className="text-slate-500">Coba refresh halaman atau cek kembali nanti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
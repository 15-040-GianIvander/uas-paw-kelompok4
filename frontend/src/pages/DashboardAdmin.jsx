import React, { useState, useMemo } from 'react';
import './AdminDashboard.css';
import { Plus, Edit3, Trash2, LogOut, DollarSign, Calendar, MapPin, Users } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';

const dummyEvents = [
  { id: 'E-001', title: 'Konser Indie Jakarta', date: '2025-12-12', venue: 'Istora Senayan', price: 150000, img: '/assets/event-list/concert1.png' },
  { id: 'E-002', title: 'Festival Musik Selatan', date: '2026-01-05', venue: 'Lapangan Merdeka', price: 120000, img: '/assets/event-list/concert2.png' },
  { id: 'E-003', title: 'Acoustic Night', date: '2026-02-20', venue: 'Cafe Kecil', price: 75000, img: '/assets/event-list/concert3.jpg' },
];

const dummyBookings = [
  { id: 'B-1001', userId: '1001', user: 'Ayu Pratiwi', eventName: 'Konser Indie Jakarta', orderDate: '2025-11-01', status: 'Paid' },
  { id: 'B-1002', userId: '1002', user: 'Rian Saputra', eventName: 'Festival Musik Selatan', orderDate: '2025-11-18', status: 'Pending' },
  { id: 'B-1003', userId: '1003', user: 'Dewi Lestari', eventName: 'Acoustic Night', orderDate: '2025-12-02', status: 'Paid' },
];

function formatCurrency(v) {
  return v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export default function DashboardAdmin({ initialTab = 'events' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [events, setEvents] = useState(dummyEvents);
  const [bookings] = useState(dummyBookings);
  const [search, setSearch] = useState('');

  // Modal & form state for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', venue: '', price: '', img: '' });
  const [originalImg, setOriginalImg] = useState(null); // used to track pre-existing image during edit

  const openAddModal = () => {
    setEditingEvent(null);
    setOriginalImg(null);
    setForm({ title: '', date: '', venue: '', price: '', img: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (id) => {
    const ev = events.find((x) => x.id === id);
    if (!ev) return;
    setEditingEvent(id);
    setOriginalImg(ev.img || null);
    setForm({ title: ev.title, date: ev.date, venue: ev.venue, price: String(ev.price), img: ev.img });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // if we were adding a new event and an object URL was created but not saved, revoke it
    if (!editingEvent && form.img && form.img.startsWith && form.img.startsWith('blob:')) {
      try { URL.revokeObjectURL(form.img); } catch (e) { /* ignore */ }
    }
    // if editing and we changed the preview to a new blob but didn't save, revoke the new blob
    if (editingEvent && form.img && form.img.startsWith && form.img.startsWith('blob:') && originalImg !== form.img) {
      try { URL.revokeObjectURL(form.img); } catch (e) { /* ignore */ }
    }
    setIsModalOpen(false);
    setEditingEvent(null);
    setForm({ title: '', date: '', venue: '', price: '', img: '' });
    setOriginalImg(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Revoke previous preview blob if it was an object URL and different
    if (form.img && form.img.startsWith && form.img.startsWith('blob:') && form.img !== originalImg) {
      try { URL.revokeObjectURL(form.img); } catch (err) { /* ignore */ }
    }
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, img: url, file }));
  };

  const handleSaveEvent = (ev) => {
    ev.preventDefault();
    if (!form.title.trim() || !form.date || !form.venue || !form.price) return alert('Lengkapi semua field.');

    if (editingEvent) {
      // if we replaced an existing blob URL image, revoke the old blob to avoid leaks
      setEvents((prev) => prev.map((e) => {
        if (e.id !== editingEvent) return e;
        if (originalImg && originalImg.startsWith && originalImg.startsWith('blob:') && originalImg !== form.img) {
          try { URL.revokeObjectURL(originalImg); } catch (err) { /* ignore */ }
        }
        return { ...e, title: form.title, date: form.date, venue: form.venue, price: Number(form.price), img: form.img };
      }));
    } else {
      // generate next id like E-004
      const maxIndex = events.reduce((m, x) => Math.max(m, Number(x.id.split('-')[1] || 0)), 0);
      const nextId = 'E-' + String(maxIndex + 1).padStart(3, '0');
      setEvents((prev) => [{ id: nextId, title: form.title, date: form.date, venue: form.venue, price: Number(form.price), img: form.img || '/assets/event-list/festival-musik.png' }, ...prev]);
    }

    setOriginalImg(null);
    setIsModalOpen(false);
  };

  const totals = useMemo(() => {
    const totalSales = bookings.reduce((s) => s + 0, 0); // placeholder (no prices on bookings)
    return {
      totalEvents: events.length,
      totalBookings: bookings.length,
      totalRevenue: events.reduce((s, e) => s + e.price, 0),
    };
  }, [events, bookings]);

  const filteredBookings = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => {
      return b.id.toLowerCase().includes(q) ||
             (b.user && b.user.toLowerCase().includes(q)) ||
             (b.eventName && b.eventName.toLowerCase().includes(q)) ||
             (b.userId && b.userId.includes(q));
    });
  }, [bookings, search]);

  const handleEditEvent = (id) => openEditModal(id);
  const handleDeleteEvent = (id) => {
    if (!confirm('Hapus event ini?')) return;
    setEvents((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target && target.img && target.img.startsWith && target.img.startsWith('blob:')) {
        try { URL.revokeObjectURL(target.img); } catch (e) { /* ignore */ }
      }
      return prev.filter((e) => e.id !== id);
    });
  }; 

  const renderStatus = (s) => {
    const key = s.toLowerCase();
    return (
      <span className={`badge ${key}`}>{s}</span>
    );
  };

  return (
    <div className={`admin-page page-bg min-h-screen`}>
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="logo">E</div>
          <div className="brand-name">Evoria</div>
        </div>

        <nav className="menu">
          <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <DollarSign size={16} />
            <span>Overview</span>
          </button>

          <button className={`menu-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            <Calendar size={16} />
            <span>Manage Events</span>
          </button>

          <button className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <Users size={16} />
            <span>Booking History</span>
          </button>

          <div className="menu-bottom">
            <button className="menu-item logout" onClick={() => alert('Logout (simulated)')}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'events' ? 'Daftar Event' : activeTab === 'bookings' ? 'Riwayat Pemesanan User' : 'Overview'}</h1>
          {activeTab === 'events' && <button className="btn btn-primary btn-add" onClick={openAddModal}><Plus size={14} /> Tambah Event</button>} 
        </header>

        {activeTab === 'overview' && (
          <>
            <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Events</div>
              <div className="stat-value">{totals.totalEvents}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{totals.totalBookings}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">{formatCurrency(totals.totalRevenue)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Active Events</div>
              <div className="stat-value">{events.length}</div>
            </div>
          </section>
            <div className="mt-6"><DashboardChart /></div>
          </>
        )}

        {activeTab === 'events' && (
          <section className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Judul Event</th>
                  <th>Tanggal</th>
                  <th>Venue</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td><div className="thumb"><img src={e.img} alt={e.title} /></div></td>
                    <td>
                      <div className="event-title">{e.title}</div>
                      <div className="event-id">{e.id}</div>
                    </td>
                    <td>{e.date}</td>
                    <td>{e.venue}</td>
                    <td>{formatCurrency(e.price)}</td>
                    <td className="actions">
                      <button className="btn-icon edit" onClick={() => handleEditEvent(e.id)} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon delete" onClick={() => handleDeleteEvent(e.id)} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Booking, Nama user, atau ID (4 digit)..." className="input input-search w-full max-w-md" />
              <div className="text-sm text-count">Menampilkan {filteredBookings.length} / {bookings.length}</div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td className="font-mono">{b.userId || '—'}</td>
                    <td>{b.user}</td>
                    <td>{b.eventName}</td>
                    <td>{b.orderDate}</td>
                    <td>{renderStatus(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {isModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <form onSubmit={handleSaveEvent} className="modal-form">
                <h3>{editingEvent ? 'Edit Event' : 'Tambah Event'}</h3>

                <label>
                  Judul Event
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </label>

                <label>
                  Tanggal
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </label>

                <label>
                  Venue
                  <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
                </label>

                <label>
                  Harga (IDR)
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </label>

                <label>
                  Upload Gambar (JPG/PNG)
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {form.img && (
                    <div className="img-preview"><img src={form.img} alt="preview" /></div>
                  )}
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModal}>Batal</button>
                  <button type="submit" className="btn btn-primary">{editingEvent ? 'Simpan Perubahan' : 'Tambah Event'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* simple footer space */}
        <div style={{ height: 40 }} />
      </main>
    </div>
  );
}
 

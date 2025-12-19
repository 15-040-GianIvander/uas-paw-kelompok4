import React, { useState, useMemo } from 'react';
import './AdminDashboard.css';
import { Plus, Trash2, Users, ShieldX, DollarSign, Calendar } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';

const seedUsers = [
  { userId: '1001', name: 'Ayu Pratiwi', email: 'ayu@example.com', role: 'user' },
  { userId: '1002', name: 'Rian Saputra', email: 'rian@example.com', role: 'user' },
  { userId: '1003', name: 'Dewi Lestari', email: 'dewi@example.com', role: 'user' },
];

const seedAdmins = [
  { userId: '2001', name: 'Admin Satu', email: 'admin1@example.com', role: 'admin' },
];

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

function gen4Digit() {
  // generate a pseudo-random 4-digit id (1000-9999)
  return String(1000 + Math.floor(Math.random() * 9000));
}

export default function DashboardSuperAdmin({ initialTab = 'users' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState(seedUsers);
  const [admins, setAdmins] = useState(seedAdmins);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('user'); // 'user' or 'admin'
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // simple handlers that operate on local state (frontend simulation)
  const openAddModal = (type) => {
    setModalType(type);
    setForm({ name: '', email: '', phone: '' });
    setModalOpen(true);
  };

  const handleAddUser = () => openAddModal('user');

  const handleDeleteUser = (id) => {
    if (!confirm('Hapus user ini?')) return;
    setUsers((prev) => prev.filter((u) => u.userId !== id));
  };

  const handlePromoteToAdmin = (id) => {
    const u = users.find((x) => x.userId === id);
    if (!u) return;
    if (!confirm(`Jadikan ${u.name} sebagai Admin?`)) return;
    setUsers((prev) => prev.filter((x) => x.userId !== id));
    setAdmins((prev) => [{ ...u, role: 'admin' }, ...prev]);
  };

  const handleAddAdmin = () => openAddModal('admin');

  const handleSubmitAdd = (e) => {
    e && e.preventDefault();
    const { name, email, phone } = form;
    if (!name || !email) {
      alert('Mohon isi minimal Nama dan Email.');
      return;
    }
    const id = gen4Digit();
    if (modalType === 'user') {
      setUsers((prev) => [{ userId: id, name, email, phone: phone || '', role: 'user' }, ...prev]);
    } else {
      setAdmins((prev) => [{ userId: id, name, email, phone: phone || '', role: 'admin' }, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDeleteAdmin = (id) => {
    if (!confirm('Hapus admin ini?')) return;
    setAdmins((prev) => prev.filter((a) => a.userId !== id));
  };

  const handleDemoteAdmin = (id) => {
    const a = admins.find((x) => x.userId === id);
    if (!a) return;
    if (!confirm(`Demosi ${a.name} menjadi user biasa?`)) return;
    setAdmins((prev) => prev.filter((x) => x.userId !== id));
    setUsers((prev) => [{ ...a, role: 'user' }, ...prev]);
  };

  // totals depend on events/bookings so are declared after they are initialized below

  // events & bookings (match DashboardAdmin)
  const [events, setEvents] = useState(dummyEvents);
  const [bookings, setBookings] = useState(dummyBookings);

  const totals = useMemo(() => ({
    users: users.length,
    admins: admins.length,
    totalEvents: events.length,
    totalBookings: bookings.length,
    totalRevenue: events.reduce((s, e) => s + e.price, 0),
  }), [users, admins, events, bookings]);

  // modal & form for events
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', venue: '', price: '', img: '' });
  const [originalImg, setOriginalImg] = useState(null);

  const openAddEventModal = () => {
    setEditingEvent(null);
    setOriginalImg(null);
    setEventForm({ title: '', date: '', venue: '', price: '', img: '' });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (id) => {
    const ev = events.find((x) => x.id === id);
    if (!ev) return;
    setEditingEvent(id);
    setOriginalImg(ev.img || null);
    setEventForm({ title: ev.title, date: ev.date, venue: ev.venue, price: String(ev.price), img: ev.img });
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    if (!editingEvent && eventForm.img && eventForm.img.startsWith && eventForm.img.startsWith('blob:')) {
      try { URL.revokeObjectURL(eventForm.img); } catch (e) { /* ignore */ }
    }
    if (editingEvent && eventForm.img && eventForm.img.startsWith && eventForm.img.startsWith('blob:') && originalImg !== eventForm.img) {
      try { URL.revokeObjectURL(eventForm.img); } catch (e) { /* ignore */ }
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEventForm({ title: '', date: '', venue: '', price: '', img: '' });
    setOriginalImg(null);
  };

  const handleEventFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (eventForm.img && eventForm.img.startsWith && eventForm.img.startsWith('blob:') && eventForm.img !== originalImg) {
      try { URL.revokeObjectURL(eventForm.img); } catch (err) { /* ignore */ }
    }
    const url = URL.createObjectURL(file);
    setEventForm((f) => ({ ...f, img: url, file }));
  };

  const handleSaveEvent = (ev) => {
    ev.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.venue || !eventForm.price) return alert('Lengkapi semua field.');

    if (editingEvent) {
      setEvents((prev) => prev.map((e) => {
        if (e.id !== editingEvent) return e;
        if (originalImg && originalImg.startsWith && originalImg.startsWith('blob:') && originalImg !== eventForm.img) {
          try { URL.revokeObjectURL(originalImg); } catch (err) { /* ignore */ }
        }
        return { ...e, title: eventForm.title, date: eventForm.date, venue: eventForm.venue, price: Number(eventForm.price), img: eventForm.img };
      }));
    } else {
      const maxIndex = events.reduce((m, x) => Math.max(m, Number(x.id.split('-')[1] || 0)), 0);
      const nextId = 'E-' + String(maxIndex + 1).padStart(3, '0');
      setEvents((prev) => [{ id: nextId, title: eventForm.title, date: eventForm.date, venue: eventForm.venue, price: Number(eventForm.price), img: eventForm.img || '/assets/event-list/festival-musik.png' }, ...prev]);
    }

    setOriginalImg(null);
    setIsEventModalOpen(false);
  };

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

  const renderStatus = (s) => {
    const key = s.toLowerCase();
    return (
      <span className={`badge ${key}`}>{s}</span>
    );
  };

  const filteredUsers = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.userId.includes(q) || u.name.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }, [users, search]);

  const filteredAdmins = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return admins;
    return admins.filter((a) => a.userId.includes(q) || a.name.toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q));
  }, [admins, search]);

  return (
    <div className={`admin-page page-bg min-h-screen`}>
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="logo">E</div>
          <div className="brand-name">Evoria</div>
        </div>

        <nav className="menu">
          <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setSearch(''); }}>
            <DollarSign size={16} />
            <span>Overview</span>
          </button>

          <button className={`menu-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); setSearch(''); }}>
            <Calendar size={16} />
            <span>Manage Events</span>
          </button>

          <button className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); setSearch(''); }}>
            <Users size={16} />
            <span>Booking History</span>
          </button>

          <button className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSearch(''); }}>
            <Users size={16} />
            <span>Manage Users</span>
          </button>

          <button className={`menu-item ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => { setActiveTab('admins'); setSearch(''); }}>
            <ShieldX size={16} />
            <span>Manage Admins</span>
          </button>

          <div className="menu-bottom">
            <button className="menu-item logout" onClick={() => alert('Logout (simulated)')}>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'users' ? 'Manage Users' : activeTab === 'admins' ? 'Manage Admins' : activeTab === 'events' ? 'Daftar Event' : activeTab === 'bookings' ? 'Riwayat Pemesanan' : 'Overview'}</h1>
        </header>

        {activeTab === 'overview' && (
          <>
            <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{totals.users}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Total Admins</div>
              <div className="stat-value">{totals.admins}</div>
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
              <div className="stat-value">{totals.totalEvents}</div>
            </div>
          </section>
            <div className="mt-6"><DashboardChart /></div>
          </>
        )}

        {activeTab === 'users' && (
          <section className="panel">
            <div className="panel-controls">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Cari user (nama, email, ID)...'} className="input-search" />
                <div className="text-sm text-count">Menampilkan {filteredUsers.length} / {users.length}</div>
              </div>
              <div>
                <button className="btn-add" onClick={() => openAddModal('user')}>
                  <Plus size={16} />
                  <span style={{ fontWeight: 800 }}>Add User</span>
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.userId}>
                    <td className="font-mono">{u.userId}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td className="actions">
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDeleteUser(u.userId)}><Trash2 size={14} /></button>
                      <button className="btn-action promote" title="Jadikan Admin" onClick={() => handlePromoteToAdmin(u.userId)}>Jadikan Admin</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'admins' && (
          <section className="panel">
            <div className="panel-controls">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Cari admin (nama, email, ID)...'} className="input-search" />
                <div className="text-sm text-count">Menampilkan {filteredAdmins.length} / {admins.length}</div>
              </div>
              <div>
                <button className="btn-add" onClick={() => openAddModal('admin')}>
                  <Plus size={16} />
                  <span style={{ fontWeight: 800 }}>Add Admin</span>
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((a) => (
                  <tr key={a.userId}>
                    <td className="font-mono">{a.userId}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.role}</td>
                    <td className="actions">
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDeleteAdmin(a.userId)}><Trash2 size={14} /></button>
                      <button className="btn-action demote" title="Demosi ke User" onClick={() => handleDemoteAdmin(a.userId)}>Demosi</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* reuse existing events/bookings views if needed */}
        {activeTab === 'events' && (
          <section className="panel">
            <div className="panel-controls">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Cari event (judul, venue, ID)...'} className="input-search" />
                <div className="text-sm text-count">Menampilkan {events.length} events</div>
              </div>
              <div>
                <button className="btn-add" onClick={openAddEventModal}><Plus size={14} /> <span style={{ fontWeight: 800 }}>Tambah Event</span></button>
              </div>
            </div>

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
                      <button className="btn-icon edit" onClick={() => openEditEventModal(e.id)} title="Edit"><span role="img" aria-hidden>✏️</span></button>
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

        <div style={{ height: 40 }} />
      </main>

      {modalOpen && (
        <div className="modal-overlay" onMouseDown={() => setModalOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={handleSubmitAdd}>
              <h3>{modalType === 'user' ? 'Tambah User' : 'Tambah Admin'}</h3>

              <label>
                Nama
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Nama lengkap" />
              </label>

              <label>
                Email
                <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="email@contoh.com" />
              </label>

              <label>
                Nomor HP
                <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="08xxxxxxxx" />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Batal</button>
                <button className="btn-action promote" type="submit">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

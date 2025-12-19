import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { Plus, Trash2, Users, ShieldX, DollarSign, Calendar } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';
import * as superadminService from '../services/superadminService';
import * as eventService from '../services/eventService';

// initial state will be loaded from API
const seedUsers = [];
const seedAdmins = [];

// events will be fetched from API
const dummyEvents = []; // keep variable name for backward compat



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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState(seedUsers);
  const [admins, setAdmins] = useState(seedAdmins);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('user'); // 'user' or 'admin'
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Fetch live users from backend (requires superadmin token)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);

    // Quick client-side guard: ensure current role is superadmin
    const myRole = localStorage.getItem('user_role');
    if (myRole !== 'superadmin') {
      setUsersError('Access denied: login as superadmin to manage users');
      setLoadingUsers(false);
      return;
    }

    try {
      const data = await superadminService.getAllUsers();
      setUsers(data.filter(u => u.role === 'user').map(u => ({ userId: u.id, name: u.name, email: u.email, role: u.role })));
      setAdmins(data.filter(u => u.role === 'admin' || u.role === 'superadmin').map(u => ({ userId: u.id, name: u.name, email: u.email, role: u.role })));
    } catch (err) {
      // Improve message for Forbidden
      if (err && err.message && err.message.toLowerCase().includes('forbidden')) {
        setUsersError('Forbidden: your account is not a superadmin (login with superadmin account)');
      } else {
        setUsersError(err?.message || 'Gagal memuat user');
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // simple handlers that operate on local state (frontend simulation)
  const openAddModal = (type) => {
    setModalType(type);
    setForm({ name: '', email: '', phone: '' });
    setModalOpen(true);
  }; 

  const handleAddUser = () => openAddModal('user');

  const handleDeleteUser = async (id) => {
    if (!confirm('Hapus user ini?')) return;
    try {
      await superadminService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      alert(err?.message || 'Gagal menghapus user');
    }
  };

  const handlePromoteToAdmin = async (id) => {
    const u = users.find((x) => x.userId === id);
    if (!u) return;
    if (!confirm(`Jadikan ${u.name} sebagai Admin?`)) return;
    try {
      await superadminService.updateUserRole(id, 'admin');
      await fetchUsers();
    } catch (err) {
      alert(err?.message || 'Gagal mempromosikan user');
    }
  };

  const handleAddAdmin = () => openAddModal('admin');

  const handleSubmitAdd = async (e) => {
    e && e.preventDefault();
    const { name, email, phone } = form;
    if (!name || !email) {
      alert('Mohon isi minimal Nama dan Email.');
      return;
    }
    try {
      const tmpPass = Math.random().toString(36).slice(-8) || 'changeme123';
      const payload = { name, email, password: tmpPass, role: modalType === 'admin' ? 'admin' : 'user' };
      await superadminService.createUser(payload);
      alert(`User dibuat dengan password sementara: ${tmpPass}`);
      await fetchUsers();
      setModalOpen(false);
    } catch (err) {
      alert(err?.message || 'Gagal membuat user');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm('Hapus admin ini?')) return;
    try {
      await superadminService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      alert(err?.message || 'Gagal menghapus admin');
    }
  };

  const handleDemoteAdmin = async (id) => {
    const a = admins.find((x) => x.userId === id);
    if (!a) return;
    if (!confirm(`Demosi ${a.name} menjadi user biasa?`)) return;
    try {
      await superadminService.updateUserRole(id, 'user');
      await fetchUsers();
    } catch (err) {
      alert(err?.message || 'Gagal demosi admin');
    }
  };

  // totals depend on events/bookings so are declared after they are initialized below

  // events & bookings (fetched from API)
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState(dummyBookings);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  const fetchEvents = async () => {
    setLoadingEvents(true); setEventsError(null);
    try {
      const list = await eventService.getEvents();
      // map backend shape to our table shape and include formatted date/time (keep rawDate for editing)
      setEvents(list.map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.date ? new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ev.date,
        time: ev.date ? new Date(ev.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '',
        rawDate: ev.date,
        venue: ev.location,
        price: ev.ticket_price,
        capacity: ev.capacity,
        img: ev.image_url
      })));
    } catch (err) {
      setEventsError(err?.message || 'Gagal memuat event');
    } finally { setLoadingEvents(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

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
  const [eventForm, setEventForm] = useState({ title: '', date: '', venue: '', price: '', capacity: '', img: '' });
  const [originalImg, setOriginalImg] = useState(null);

  const openAddEventModal = () => {
    setEditingEvent(null);
    setOriginalImg(null);
    setEventForm({ title: '', date: '', venue: '', price: '', capacity: '', img: '' });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (id) => {
    const ev = events.find((x) => x.id === id);
    if (!ev) return;
    setEditingEvent(id);
    setOriginalImg(ev.img || null);
    setEventForm({
      title: ev.title,
      date: ev.rawDate ? ev.rawDate.slice(0,10) : ev.date,
      venue: ev.venue,
      price: String(ev.price),
      capacity: String(ev.capacity || ''),
      img: ev.img
    });
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
    setEventForm({ title: '', date: '', time: '', venue: '', price: '', capacity: '', img: '' });
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

  const handleSaveEvent = async (ev) => {
    ev.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.venue || !eventForm.price) return alert('Lengkapi semua field.');

    try {
      const formData = new FormData();
      // date might be yyyy-mm-dd from <input type=date>, convert to "YYYY-MM-DD HH:MM"
      const dateValue = eventForm.date && eventForm.date.length === 10 ? `${eventForm.date} ${eventForm.time || '00:00'}` : eventForm.date;
      formData.append('title', eventForm.title);
      formData.append('date', dateValue);
      formData.append('location', eventForm.venue);
      formData.append('capacity', eventForm.capacity || '100');
      formData.append('ticket_price', eventForm.price);
      if (eventForm.file) formData.append('image', eventForm.file);

      if (editingEvent) {
        const updated = await eventService.updateEvent(editingEvent, formData);
        alert('Event updated successfully');
        // attach time to updated snapshot for immediate UI merge
        try { const uWithTime = { ...(updated || {}), time: eventForm.time || '' }; localStorage.setItem('last_updated_event', JSON.stringify(uWithTime)); localStorage.setItem('events_updated_at', String(Date.now())); } catch(e) { /* ignore */ }
        // dispatch same-tab custom event so EventList updates immediately
        try { window.dispatchEvent(new Event('events-updated')); } catch(e) {}
      } else {
        const created = await eventService.createEvent(formData);
        alert('Event created successfully');
        // attach time to created snapshot for immediate UI merge
        try { const cWithTime = { ...(created || {}), time: eventForm.time || '' }; localStorage.setItem('last_created_event', JSON.stringify(cWithTime)); localStorage.setItem('events_updated_at', String(Date.now())); } catch(e) { /* ignore */ }
        try { window.dispatchEvent(new Event('events-updated')); } catch(e) {}
      }

      await fetchEvents();
      setIsEventModalOpen(false);
      setOriginalImg(null);
    } catch (err) {
      alert(err?.message || 'Gagal menyimpan event');
    }
  };


  const handleDeleteEvent = async (id) => {
    if (!confirm('Hapus event ini?')) return;
    try {
      await eventService.deleteEvent(id);
      await fetchEvents();
      try { localStorage.setItem('last_deleted_event', JSON.stringify({ id })); localStorage.setItem('events_updated_at', String(Date.now())); } catch(e) { /* ignore */ }
      try { window.dispatchEvent(new Event('events-updated')); } catch(e) {}
      alert('Event deleted');
    } catch (err) {
      alert(err?.message || 'Gagal menghapus event');
    }
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
                {loadingUsers && <div className="text-sm text-blue-600">Memuat...</div>}
                {usersError && (
                  <div className="text-sm text-red-600" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>{usersError}</span>
                    <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user_role'); localStorage.removeItem('user_id'); navigate('/login'); }}>Login as Superadmin</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn" onClick={fetchUsers} disabled={loadingUsers}>Refresh</button>
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
                {loadingEvents && <div className="text-sm text-blue-600">Memuat...</div>}
                {eventsError && <div className="text-sm text-red-600">{eventsError}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn" onClick={fetchEvents} disabled={loadingEvents}>Refresh</button>
                <button className="btn-add" onClick={openAddEventModal}><Plus size={14} /> <span style={{ fontWeight: 800 }}>Tambah Event</span></button>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Judul Event</th>
                  <th>Tanggal • Waktu</th>
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
                    <td>{e.date}{e.time ? ' • ' + e.time : ''}</td>
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

      {isEventModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={closeEventModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={handleSaveEvent}>
              <h3>{editingEvent ? 'Edit Event' : 'Tambah Event'}</h3>

              <label>
                Judul Event
                <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
              </label>

              <label>
                Tanggal
                <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
              </label>

              <label>
                Waktu
                <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
              </label>

              <label>
                Venue / Lokasi
                <input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} required />
              </label>

              <label>
                Harga (IDR)
                <input type="number" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} required />
              </label>

              <label>
                Kapasitas
                <input type="number" value={eventForm.capacity || ''} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
              </label>

              <label>
                Upload Gambar (JPG/PNG)
                <input type="file" accept="image/*" onChange={handleEventFileChange} />
                {eventForm.img && (
                  <div className="img-preview"><img src={eventForm.img} alt="preview" /></div>
                )}
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeEventModal}>Batal</button>
                <button type="submit" className="btn btn-primary">{editingEvent ? 'Simpan Perubahan' : 'Tambah Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

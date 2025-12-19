import React, { useState, useMemo } from 'react';
import './AdminDashboard.css';
import { Plus, Trash2, Users, ShieldX, DollarSign, Calendar } from 'lucide-react';

const seedUsers = [
  { userId: '1001', name: 'Ayu Pratiwi', email: 'ayu@example.com', role: 'user' },
  { userId: '1002', name: 'Rian Saputra', email: 'rian@example.com', role: 'user' },
  { userId: '1003', name: 'Dewi Lestari', email: 'dewi@example.com', role: 'user' },
];

const seedAdmins = [
  { userId: '2001', name: 'Admin Satu', email: 'admin1@example.com', role: 'admin' },
];

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

  const totals = useMemo(() => ({ users: users.length, admins: admins.length }), [users, admins]);

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
    <div className={`admin-page page-bg`}>
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
              <div className="stat-title">Managed Events</div>
              <div className="stat-value">—</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Active Bookings</div>
              <div className="stat-value">—</div>
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section className="panel">
            <div className="panel-controls">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Cari user (nama, email, ID)...'} className="input-search" />
                <div className="text-sm text-slate-500">Menampilkan {filteredUsers.length} / {users.length}</div>
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
                <div className="text-sm text-slate-500">Menampilkan {filteredAdmins.length} / {admins.length}</div>
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
            <div className="text-slate-500">Manage events area (shared layout) — use existing DashboardAdmin to edit events.</div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="panel">
            <div className="text-slate-500">Booking history area (shared layout) — use existing DashboardAdmin to view bookings.</div>
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

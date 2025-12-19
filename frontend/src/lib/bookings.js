// Simple bookings store using localStorage with update events
const KEY = 'evoria:bookings_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function save(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
  // notify listeners
  window.dispatchEvent(new CustomEvent('bookings:updated', { detail: { count: arr.length } }));
}

export function getBookings() {
  return load();
}

export function getBookingById(id) {
  const items = load();
  return items.find((b) => b.id === id) || null;
}

export function addBooking(booking) {
  const items = load();
  items.unshift(booking);
  save(items);
  return booking;
}

export function updateBooking(id, patch) {
  const items = load();
  let changed = false;
  const next = items.map((b) => {
    if (b.id === id) {
      changed = true;
      return { ...b, ...patch };
    }
    return b;
  });
  if (changed) save(next);
  return changed ? getBookingById(id) : null;
}

// initialize with some demo data if empty
(function ensureSeed() {
  const items = load();
  if (items.length === 0) {
    const seed = [
      { id: 'INV-2024001', eventName: 'Evoria Music Festival 2024', date: '20 Des 2024', time: '19:00 WIB', location: 'PKOR Way Halim', status: 'Confirmed', qty: 2, total: 300000, buyer: 'Ayu Pratiwi' },
      { id: 'INV-2024002', eventName: 'Workshop React & Tailwind', date: '15 Jan 2025', time: '09:00 WIB', location: 'Evoria Creative Hub', status: 'Pending', qty: 1, total: 50000, buyer: 'Rian Saputra' },
      { id: 'INV-2024003', eventName: 'Startup Talk 2024', date: '10 Nov 2024', time: '13:00 WIB', location: 'Zoom Meeting', status: 'Cancelled', qty: 1, total: 0, buyer: 'Dewi Lestari' },
    ];
    save(seed);
  }
})();

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HIDE_ON = ['/login', '/register', '/admin/dashboard', '/super-admin/dashboard', '/404', '/organizer/events', '/forgot-password', '/notifications'];

export default function Footer() {
  const location = useLocation();
  const pathname = location.pathname || '';

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="no-print bg-white border-t" style={{ fontFamily: 'var(--font-header)' }}> 
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

        {/* Left */}
        <div className="space-y-2">
          <div className="text-blue-600 font-bold text-lg">Evoria</div>
          <p className="text-sm text-gray-600">Platform event lokal — temukan dan beli tiket acara favoritmu dengan mudah.</p>
        </div>

        {/* Middle */}
        <div className="flex flex-col md:items-center">
          <div className="font-semibold mb-2">Quick Links</div>
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-600">Events</Link>
            <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600">My Booking</Link>
          </nav>
        </div>

        {/* Right */}
        <div className="md:text-right space-y-2">
          <div className="font-semibold">Kontak</div>
          <div className="text-sm text-gray-600">support@evoria.id</div>
          <div className="mt-2 font-semibold">Social</div>
          <div className="text-sm text-gray-600">Twitter · Instagram · Facebook</div>
        </div>
      </div>

      <div className="border-t mt-6">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-500 text-center">
          © {year} Evoria. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';

import Login from './pages/Login';
import Register from './pages/Register';

import BookingForm from './pages/BookingForm';
import BookingHistory from './pages/BookingHistory';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile'; // <--- 1. IMPORT FILE INI
import ForgotPassword from './pages/ForgotPassword'; // <-- Forgot Password page
import NotificationSettings from './pages/NotificationSettings'; // <-- Notification Settings page
import HelpCenter from './pages/HelpCenter'; // <-- Help & Support

import OrganizerDashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar selalu tampil */}
      <Navbar />

      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<EventList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />

        {/* === Auth Routes === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === User Routes === */}
        <Route path="/booking/:id" element={<BookingForm />} />
        <Route path="/my-bookings" element={<BookingHistory />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* 2. TAMBAHKAN ROUTE INI DI SINI */}
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="/help" element={<HelpCenter />} />

        {/* === Organizer Routes === */}
        <Route path="/organizer/events" element={<DashboardAdmin initialTab="events" />} />
        <Route path="/organizer/bookings" element={<DashboardAdmin initialTab="bookings" />} />

        {/* === Admin Routes === */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        {/* === 404 === */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
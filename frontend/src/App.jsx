import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth pages are static to avoid chunk load glitches on navigation/back
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Pages (lazy-loaded for smaller initial bundle)
const EventList = React.lazy(() => import('./pages/EventList'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const BookingForm = React.lazy(() => import('./pages/BookingForm'));
const BookingHistory = React.lazy(() => import('./pages/BookingHistory'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const NotificationSettings = React.lazy(() => import('./pages/NotificationSettings'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));
const TicketPage = React.lazy(() => import('./pages/TicketPage'));
const DashboardAdmin = React.lazy(() => import('./pages/DashboardAdmin'));
const DashboardSuperAdmin = React.lazy(() => import('./pages/DashboardSuperAdmin'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="min-h-screen page-bg flex items-center justify-center">
    <div className="text-slate-500 text-sm">Memuat...</div>
  </div>
);

// Scroll restoration and navigation handler
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    // Force scroll to top on route change
    window.scrollTo(0, 0);
    
    // Force page visibility (fixes white screen on back/forward)
    document.body.style.display = 'block';
    document.documentElement.style.display = 'block';
  }, [location.pathname]);
  
  return null;
}

function App() {
  // Prevent white screen on initial load and navigation
  useEffect(() => {
    // Ensure body is visible
    document.body.style.display = 'block';
    document.documentElement.style.display = 'block';
    
    // Handle browser back/forward button
    const handlePopState = () => {
      // Force re-render
      window.location.reload();
    };
    
    // Listen to popstate (back/forward navigation)
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* === Auth Routes === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* === User Routes === */}
          <Route path="/booking/:id" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/notifications" element={<NotificationSettings />} />
          <Route path="/help" element={<HelpCenter />} />

          {/* === Organizer Routes === */}
          <Route path="/organizer/events" element={<DashboardAdmin initialTab="events" />} />
          <Route path="/organizer/bookings" element={<DashboardAdmin initialTab="bookings" />} />

          {/* === Admin Routes === */}
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          
          {/* === Super Admin Routes === */}
          <Route path="/super-admin/dashboard" element={<DashboardSuperAdmin />} />

          {/* === Payment === */}
          <Route path="/payment/:bookingId" element={<PaymentPage />} />

          {/* === Ticket (E-Ticket) === */}
          <Route path="/ticket/:bookingId" element={<TicketPage />} />

          {/* === 404 === */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;
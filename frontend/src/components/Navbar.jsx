import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Ticket, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simulasi status login (Ubah ke false untuk tes tampilan belum login)
  const isLoggedIn = true; 

  // Efek scroll biar navbar makin solid pas discroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    alert("Logout Berhasil");
    navigate('/login');
  };

  // Helper untuk mengecek menu aktif
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-600";

  return (
    <>
      {/* Container Utama Navbar (Floating) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        
        {/* Kapsul Navbar */}
        <nav className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 ease-in-out border border-white/40
          ${scrolled ? 'bg-white/90 shadow-xl py-3' : 'bg-white/70 shadow-lg py-4'} 
          backdrop-blur-md rounded-full px-6 flex justify-between items-center`}
        >
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold font-outfit text-lg shadow-blue-300 shadow-md group-hover:scale-110 transition">E</div>
             <span className="text-2xl font-bold font-outfit text-blue-900 tracking-tight">Evoria</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition ${isActive('/')}`}>Home</Link>
            <Link to="/events" className={`text-sm font-medium transition ${isActive('/events')}`}>Events</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                <Link to="/my-bookings" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition" title="My Booking">
                  <Ticket size={18} />
                </Link>
                <Link to="/profile" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition" title="Profile">
                  <User size={18} />
                </Link>
                <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-5 py-2 text-sm text-slate-600 font-semibold hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition transform hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown (Floating Box Terpisah) */}
      {isOpen && (
        <div className="fixed top-24 left-4 right-4 z-40 md:hidden animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-4 flex flex-col gap-2">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-medium ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Home</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-medium ${location.pathname === '/events' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Events</Link>
            
            <div className="h-px bg-gray-100 my-1"></div>

            {isLoggedIn ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                    <Ticket size={18} className="text-blue-500"/> My Booking
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                    <User size={18} className="text-blue-500"/> Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium">
                    <LogOut size={18}/> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link to="/login" className="text-center py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">Login</Link>
                <Link to="/register" className="text-center py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
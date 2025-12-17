import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import DashboardAdmin from './pages/DashboardAdmin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* === Route Publik (Bisa diakses siapa saja) === */}
        <Route path="/" element={<EventList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* === Route Admin (Nanti kita proteksi) === */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        {/* === Route Error (Kalau link ngawur) === */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
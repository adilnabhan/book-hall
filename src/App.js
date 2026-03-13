import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookHall from './pages/BookHall';
import WaitingList from './pages/WaitingList';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import BottomNav from './components/BottomNav';

/* Read auth state from localStorage */
function readAuth() {
  return {
    loggedIn: localStorage.getItem('isLoggedIn') === 'true',
    admin:    localStorage.getItem('isAdmin')    === 'true',
  };
}

/* Protected route wrapper */
function ProtectedRoute({ loggedIn, children }) {
  return loggedIn ? children : <Navigate to="/login" replace />;
}

/* Admin-only route wrapper */
function AdminRoute({ loggedIn, admin, children }) {
  if (!loggedIn) return <Navigate to="/login" replace />;
  if (!admin)    return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [auth, setAuth] = useState(readAuth);

  /* Re-sync auth state any time localStorage changes (login / logout) */
  useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener('storage', sync);
    /* Also listen to a custom event fired within the same tab */
    window.addEventListener('authChanged', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('authChanged', sync);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login onAuth={() => { setAuth(readAuth()); }} />} />
            <Route path="/" element={<ProtectedRoute loggedIn={auth.loggedIn}><Dashboard /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute loggedIn={auth.loggedIn}><BookHall /></ProtectedRoute>} />
            <Route path="/waiting-list" element={<ProtectedRoute loggedIn={auth.loggedIn}><WaitingList /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute loggedIn={auth.loggedIn}><BookingConfirmation /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute loggedIn={auth.loggedIn}><MyBookings /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute loggedIn={auth.loggedIn} admin={auth.admin}><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {auth.loggedIn && <BottomNav onLogout={() => setAuth(readAuth())} />}
      </div>
    </BrowserRouter>
  );
}

export default App;

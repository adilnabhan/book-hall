import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, getHalls } from '../api';

const STATUS_LABELS = {
  scheduled: 'Scheduled',
  active: 'Active',
  released: 'Released',
  completed: 'Completed',
};

const STATUS_COLORS = {
  scheduled: 'status-scheduled',
  active: 'status-active',
  released: 'status-released',
  completed: 'status-completed',
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [hallsMap, setHallsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    Promise.all([getMyBookings(userId), getHalls()])
      .then(([bookingsRes, hallsRes]) => {
        setBookings(bookingsRes.data || []);
        const map = {};
        (hallsRes.data || []).forEach((h) => {
          map[h.id] = h.name;
        });
        setHallsMap(map);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || err.message || 'Failed to load');
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>My Bookings</h1>
        <p className="subtitle">Your lecture hall reservations</p>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <small>User ID: {userId}</small>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <p>No bookings yet</p>
          <Link to="/book" className="btn btn-outline">
            Book a hall
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{hallsMap[b.hall] || `Hall #${b.hall}`}</h3>
                <span
                  className={`status-badge ${
                    STATUS_COLORS[b.status] || STATUS_COLORS.scheduled
                  }`}
                >
                  {STATUS_LABELS[b.status] || b.status}
                </span>
              </div>
              <div className="booking-card-body">
                <p>
                  <strong>Date:</strong> {b.date}
                </p>
                <p>
                  <strong>Time:</strong> {String(b.start_time).slice(0, 5)} –{' '}
                  {String(b.end_time).slice(0, 5)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/book" className="nav-item">
          <span className="nav-icon">📅</span>
          <span>Book</span>
        </Link>
        <Link to="/waiting-list" className="nav-item">
          <span className="nav-icon">⏳</span>
          <span>Waiting</span>
        </Link>
        <Link to="/my-bookings" className="nav-item active">
          <span className="nav-icon">✓</span>
          <span>My Bookings</span>
        </Link>
      </nav>
    </div>
  );
}
export default MyBookings;
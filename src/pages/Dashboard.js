import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHalls, getHallAvailability } from '../api';

const STATUS_LABELS = {
  available: 'Available',
  scheduled: 'Scheduled',
  active: 'Active',
  waiting: 'Waiting',
};

const STATUS_COLORS = {
  available: 'status-available',
  scheduled: 'status-scheduled',
  active: 'status-active',
  waiting: 'status-waiting',
};

function Dashboard() {
  const [halls, setHalls] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hallsRes, availRes] = await Promise.all([
        getHalls(),
        getHallAvailability(selectedDate),
      ]);
      setHalls(hallsRes.data);
      const availMap = {};
      (availRes.data || []).forEach((item) => {
        availMap[item.hall_id || item.hall] = item;
      });
      setAvailability(availMap);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load halls');
      setHalls([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getHallStatus = (hall) => {
    const avail = availability[hall.id] || availability[hall.name];
    return avail?.status || 'available';
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="hero-card">
          <div className="hero-text">
            <p className="hero-greeting">Hello {localStorage.getItem("username") || "User"}</p>
            <h1 className="hero-title">Lecture Hall Booking</h1>
            <p className="hero-subtitle">
              Welcome to the Lecture Hall Booking System.
            </p>
          </div>
        </div>
      </header>

      <div className="date-filter">
        <label htmlFor="date">Check availability for</label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <small>Ensure the Django API is running on port 8000</small>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading halls...</div>
      ) : (
        <div className="hall-grid">
          {halls.map((hall) => {
            const status = getHallStatus(hall);
            return (
              <Link
                to={`/book?hall=${hall.id}`}
                key={hall.id}
                className={`hall-card hall-card-${status}`}
              >
                <div className="hall-card-header">
                  <h3 className="hall-name">{hall.name}</h3>
                  <span
                    className={`status-badge ${STATUS_COLORS[status] || STATUS_COLORS.available}`}
                  >
                    {STATUS_LABELS[status] || 'Available'}
                  </span>
                </div>
                <div className="hall-card-body">
                  <p className="hall-capacity">Capacity: {hall.capacity}</p>
                  <p className="hall-location">{hall.location}</p>
                </div>
                <div className="hall-card-footer">
                  <span className="card-action">Book this hall →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}


<nav className="bottom-nav">
  <Link to="/" className="nav-item active">
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

  <Link to="/my-bookings" className="nav-item">
    <span className="nav-icon">✓</span>
    <span>My Bookings</span>
  </Link>

  <Link to="/admin" className="nav-item">
    <span className="nav-icon">⚙</span>
    <span>Admin</span>
  </Link>
</nav>
    </div>
  );
}

export default Dashboard;




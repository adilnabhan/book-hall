import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyWaitingList } from '../api';

function WaitingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    getMyWaitingList(userId)
      .then((res) => setItems(res.data || []))
      .catch((err) => {
        setError(err.response?.data?.detail || err.message || 'Failed to load');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const first = items[0];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Waiting List</h1>
        <p className="subtitle">You’ll be notified when a slot opens</p>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <small>User ID: {userId} (change via localStorage)</small>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✓</span>
          <p>You're not on any waiting list</p>
          <Link to="/book" className="btn btn-outline">
            Book a hall
          </Link>
        </div>
      ) : (
        <>
          <div className="waiting-header-card">
            <h2 className="waiting-hall-title">
              {first.hall_name} Waiting List
            </h2>
            <p className="waiting-current">
              Current Booking:&nbsp;
              {first.start_time?.slice(0, 5)} – {first.end_time?.slice(0, 5)}
            </p>
          </div>

          <div className="waiting-list">
            {items.map((item) => (
              <div key={item.id} className="waiting-card">
                <div className="waiting-position">
                  <span className="position-num">{item.position}</span>
                </div>
                <div className="waiting-details">
                  <h3>
                    {item.position === 1 ? 'You' : `Position ${item.position}`}
                  </h3>
                  <p className="waiting-date">{item.booking_date}</p>
                  <p className="waiting-time">
                    {item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}
                  </p>
                  {item.position === 1 && (
                    <p className="waiting-next">Next in line</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
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
        <Link to="/waiting-list" className="nav-item active">
          <span className="nav-icon">⏳</span>
          <span>Waiting</span>
        </Link>
        <Link to="/my-bookings" className="nav-item">
          <span className="nav-icon">✓</span>
          <span>My Bookings</span>
        </Link>
      </nav>
    </div>
  );
}

export default WaitingList;

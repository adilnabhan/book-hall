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
        <p className="subtitle">You'll be notified when a slot opens</p>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <small>User ID: {userId}</small>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="waiting-card" style={{ pointerEvents: 'none' }}>
              <div className="skeleton skeleton-circle"></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '60%', height: 16 }}></div>
                <div className="skeleton skeleton-text short" style={{ height: 12 }}></div>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
}

export default WaitingList;

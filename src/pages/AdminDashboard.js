import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHalls, getAdminBookings, adminCancelBooking } from "../api";

function AdminDashboard() {
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hallsRes, bookingsRes] = await Promise.all([
        getHalls(),
        getAdminBookings(),
      ]);
      setHalls(hallsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const hallNameById = (id) =>
    (halls.find((h) => h.id === id) || {}).name || `Hall #${id}`;

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await adminCancelBooking(bookingId);
      setActionMessage(res.data?.message || "Booking updated");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to cancel");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Manage halls and bookings</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {actionMessage && (
        <div className="alert">
          {actionMessage}
        </div>
      )}

      <div className="bookings-list">
        <div className="booking-card">
          <div className="booking-card-header">
            <h3>Total Halls</h3>
            <span className="status-badge status-active">{halls.length}</span>
          </div>
          <div className="booking-card-body">
            <p className="hall-location">Total bookings: {bookings.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="bookings-list" style={{ marginTop: 16 }}>
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{hallNameById(b.hall)}</h3>
                <span className={`status-badge status-${b.status}`}>
                  {b.status}
                </span>
              </div>
              <div className="booking-card-body">
                <p>
                  <strong>Date:</strong> {b.date}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {String(b.start_time).slice(0, 5)} –{" "}
                  {String(b.end_time).slice(0, 5)}
                </p>
                <p>
                  <strong>User ID:</strong> {b.user}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleCancel(b.id)}
              >
                Cancel booking
              </button>
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
        <Link to="/my-bookings" className="nav-item">
          <span className="nav-icon">✓</span>
          <span>My Bookings</span>
        </Link>
        <span className="nav-item active">
          <span className="nav-icon">⚙</span>
          <span>Admin</span>
        </span>
      </nav>
    </div>
  );
}

export default AdminDashboard;
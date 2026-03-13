import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function BookingConfirmation() {
  const location = useLocation();
  const state = location.state || {};
  const booking = state.booking;
  const message = state.message || 'Booking confirmed';

  return (
    <div className="page">
      <header className="page-header">
        <h1>Booking Confirmed!</h1>
        <p className="subtitle">
          {message || 'Your hall is reserved. Please tap your NFC card on the reader when you arrive.'}
        </p>
      </header>

      <div className="confirmation-card">
        {booking ? (
          <>
            <div className="confirmation-icon">✓</div>
            <h2>Hall Booking Details</h2>
            <dl className="confirmation-details">
              <dt>Hall ID</dt>
              <dd>{booking.hall}</dd>
              <dt>Date</dt>
              <dd>{booking.date}</dd>
              <dt>Time</dt>
              <dd>
                {String(booking.start_time || '').slice(0, 5)} –{' '}
                {String(booking.end_time || '').slice(0, 5)}
              </dd>
              <dt>Status</dt>
              <dd className="status-badge status-scheduled">Scheduled</dd>
            </dl>
          </>
        ) : (
          <>
            <div className="confirmation-icon">✓</div>
            <p>{message}</p>
          </>
        )}
      </div>

      <div className="confirmation-actions">
        <Link to="/my-bookings" className="btn btn-primary">
          OK, Got It
        </Link>
        <Link to="/book" className="btn btn-outline">
          Book another hall
        </Link>
      </div>

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

export default BookingConfirmation;

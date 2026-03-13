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
              <dd>
                <span className="status-badge status-scheduled">Scheduled</span>
              </dd>
            </dl>
          </>
        ) : (
          <>
            <div className="confirmation-icon">✓</div>
            <p style={{ color: 'var(--gray-600)', fontSize: 15 }}>{message}</p>
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
    </div>
  );
}

export default BookingConfirmation;

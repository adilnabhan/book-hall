import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getHalls, bookHall } from "../api";

const TIME_SLOTS = [
  '09:00:00', 
  '10:00:00',
  '11:00:00',
  '12:00:00',
  '13:00:00',
  '14:00:00',
  '15:00:00',
  '16:00:00',
  '17:00:00',
];

function BookHall() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedHallId = searchParams.get('hall');

  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('10:00:00');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const userId = parseInt(localStorage.getItem('userId') || '1', 10);

  useEffect(() => {
    getHalls()
      .then((res) => {
        setHalls(res.data);
        if (preselectedHallId) {
          const hall = res.data.find((h) => String(h.id) === preselectedHallId);
          if (hall) setSelectedHall(hall);
        }
      })
      .catch(() => setHalls([]))
      .finally(() => setLoading(false));
  }, [preselectedHallId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHall) {
      setError('Please select a hall');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await bookHall({
        hall: selectedHall.id,
        user: userId,
        date,
        start_time: startTime,
        end_time: endTime,
      });
      navigate('/confirmation', {
        state: {
          booking: res.data?.data,
          message: res.data?.message || 'Hall booked successfully',
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.hall?.[0] ||
        err.response?.data?.user?.[0] ||
        JSON.stringify(err.response?.data || err.message);
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading halls...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Book a Hall</h1>
        <p className="subtitle">Select hall, date and time slot</p>
      </header>

      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Hall</label>
          <select
            value={selectedHall?.id || ''}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedHall(halls.find((h) => String(h.id) === id) || null);
            }}
            required
          >
            <option value="">Choose a hall</option>
            {halls.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.capacity} seats)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <select
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              const idx = TIME_SLOTS.indexOf(e.target.value);
              if (idx >= 0 && idx < TIME_SLOTS.length - 1) {
                setEndTime(TIME_SLOTS[idx + 1]);
              }
            }}
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t.slice(0, 5)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>End Time</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t.slice(0, 5)}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>
        <span className="nav-item active">
          <span className="nav-icon">📅</span>
          <span>Book</span>
        </span>
        <Link to="/waiting-list" className="nav-item">
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

export default BookHall;

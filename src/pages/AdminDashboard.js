import React, { useEffect, useState } from "react";
import {
  getHalls,
  getAdminBookings,
  adminCancelBooking,
  adminAddHall,
  adminDeleteHall,
  listNfcCards,
  registerNfcCard,
} from "../api";

function AdminDashboard() {
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nfcCards, setNfcCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("bookings"); // bookings | halls | nfc

  // Add Hall form
  const [showAddHall, setShowAddHall] = useState(false);
  const [newHall, setNewHall] = useState({ name: "", capacity: "", location: "" });
  const [addingHall, setAddingHall] = useState(false);

  // NFC Register form
  const [showNfcForm, setShowNfcForm] = useState(false);
  const [nfcForm, setNfcForm] = useState({ user_id: "", uid: "" });
  const [registeringNfc, setRegisteringNfc] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hallsRes, bookingsRes, nfcRes] = await Promise.all([
        getHalls(),
        getAdminBookings(),
        listNfcCards().catch(() => ({ data: [] })),
      ]);
      setHalls(hallsRes.data || []);
      setBookings(bookingsRes.data || []);
      setNfcCards(nfcRes.data || []);
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

  const handleAddHall = async (e) => {
    e.preventDefault();
    setAddingHall(true);
    setError(null);
    try {
      const res = await adminAddHall(newHall);
      setActionMessage(res.data?.message || "Hall added");
      setNewHall({ name: "", capacity: "", location: "" });
      setShowAddHall(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to add hall");
    } finally {
      setAddingHall(false);
    }
  };

  const handleDeleteHall = async (hallId, hallName) => {
    if (!window.confirm(`Delete "${hallName}"? This will cancel all its future bookings.`)) return;
    try {
      const res = await adminDeleteHall(hallId);
      setActionMessage(res.data?.message || "Hall removed");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete hall");
    }
  };

  const handleRegisterNfc = async (e) => {
    e.preventDefault();
    setRegisteringNfc(true);
    setError(null);
    try {
      const res = await registerNfcCard(nfcForm);
      setActionMessage(res.data?.message || "NFC card registered");
      setNfcForm({ user_id: "", uid: "" });
      setShowNfcForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to register NFC");
    } finally {
      setRegisteringNfc(false);
    }
  };

  // Clear messages after 4s
  useEffect(() => {
    if (actionMessage) {
      const t = setTimeout(() => setActionMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [actionMessage]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Manage halls, bookings & NFC cards</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{halls.length}</div>
          <div className="stat-label">Total Halls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bookings.length}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          📋 Bookings
        </button>
        <button
          className={`admin-tab ${activeTab === "halls" ? "active" : ""}`}
          onClick={() => setActiveTab("halls")}
        >
          🏫 Halls
        </button>
        <button
          className={`admin-tab ${activeTab === "nfc" ? "active" : ""}`}
          onClick={() => setActiveTab("nfc")}
        >
          💳 NFC Cards
        </button>
      </div>

      {/* ═══════ BOOKINGS TAB ═══════ */}
      {activeTab === "bookings" && (
        <>
          <h2 className="admin-section-title">All Bookings</h2>
          {loading ? (
            <div className="bookings-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="booking-card" style={{ pointerEvents: "none" }}>
                  <div className="booking-card-header">
                    <div className="skeleton skeleton-text" style={{ width: "50%", height: 18 }}></div>
                    <div className="skeleton" style={{ width: 75, height: 26, borderRadius: 9999 }}></div>
                  </div>
                  <div className="booking-card-body" style={{ marginTop: 12 }}>
                    <div className="skeleton skeleton-text" style={{ width: "70%" }}></div>
                    <div className="skeleton skeleton-text short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((b) => (
                <div key={b.id} className="booking-card">
                  <div className="booking-card-header">
                    <h3>{hallNameById(b.hall)}</h3>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                  <div className="booking-card-body">
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Time:</strong> {String(b.start_time).slice(0, 5)} – {String(b.end_time).slice(0, 5)}</p>
                    <p><strong>User ID:</strong> {b.user}</p>
                  </div>
                  {(b.status === "scheduled" || b.status === "active") && (
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════ HALLS TAB ═══════ */}
      {activeTab === "halls" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="admin-section-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: "none" }}>
              Manage Halls
            </h2>
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
              onClick={() => setShowAddHall(!showAddHall)}
            >
              {showAddHall ? "✕ Cancel" : "+ Add Hall"}
            </button>
          </div>

          {/* Add Hall Form */}
          {showAddHall && (
            <form className="admin-form-card" onSubmit={handleAddHall}>
              <div className="form-group">
                <label>Hall Name</label>
                <input
                  type="text"
                  value={newHall.name}
                  onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                  placeholder="e.g. Lecture Hall A"
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={newHall.capacity}
                  onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
                  placeholder="e.g. 120"
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newHall.location}
                  onChange={(e) => setNewHall({ ...newHall, location: e.target.value })}
                  placeholder="e.g. Block A, Floor 2"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={addingHall}>
                {addingHall && <span className="spinner"></span>}
                {addingHall ? "Adding..." : "Add Hall"}
              </button>
            </form>
          )}

          {/* Halls List */}
          <div className="bookings-list">
            {halls.map((hall) => (
              <div key={hall.id} className="booking-card">
                <div className="booking-card-header">
                  <h3>{hall.name}</h3>
                  <span className="status-badge status-available">Active</span>
                </div>
                <div className="booking-card-body">
                  <p><strong>Capacity:</strong> {hall.capacity} seats</p>
                  <p><strong>Location:</strong> {hall.location}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={() => handleDeleteHall(hall.id, hall.name)}
                >
                  Cancel Hall
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ NFC TAB ═══════ */}
      {activeTab === "nfc" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="admin-section-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: "none" }}>
              NFC Cards
            </h2>
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
              onClick={() => setShowNfcForm(!showNfcForm)}
            >
              {showNfcForm ? "✕ Cancel" : "+ Register Card"}
            </button>
          </div>

          {/* Register NFC Form */}
          {showNfcForm && (
            <form className="admin-form-card" onSubmit={handleRegisterNfc}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="number"
                  value={nfcForm.user_id}
                  onChange={(e) => setNfcForm({ ...nfcForm, user_id: e.target.value })}
                  placeholder="Enter user ID"
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>NFC Card UID</label>
                <input
                  type="text"
                  value={nfcForm.uid}
                  onChange={(e) => setNfcForm({ ...nfcForm, uid: e.target.value })}
                  placeholder="Scan or enter card UID"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={registeringNfc}>
                {registeringNfc && <span className="spinner"></span>}
                {registeringNfc ? "Registering..." : "Register Card"}
              </button>
            </form>
          )}

          {/* NFC Cards List */}
          {nfcCards.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💳</span>
              <p>No NFC cards registered yet</p>
            </div>
          ) : (
            <div className="bookings-list">
              {nfcCards.map((card) => (
                <div key={card.id} className="booking-card">
                  <div className="booking-card-header">
                    <h3>Card: {card.uid}</h3>
                    <span className="status-badge status-active">Active</span>
                  </div>
                  <div className="booking-card-body">
                    <p><strong>User:</strong> {card.username}</p>
                    <p><strong>User ID:</strong> {card.user_id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
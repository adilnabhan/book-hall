import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_URL || 'https://lecturehall-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auth ──────────────────────────────
export const loginUser = (data) => api.post('/auth/login/', data);
export const registerUser = (data) => api.post('/auth/register/', data);

// ── Halls ─────────────────────────────
export const getHalls = () => api.get('/halls/');
export const getHallAvailability = (date) =>
  api.get('/halls/availability/', { params: { date } });

// ── Booking ───────────────────────────
export const bookHall = (data) => api.post('/book-hall/', data);
export const getMyBookings = (userId) =>
  api.get('/my-bookings/', { params: { user: userId } });
export const getMyWaitingList = (userId) =>
  api.get('/my-waiting-list/', { params: { user: userId } });

// ── Admin ─────────────────────────────
export const getAdminBookings = () => api.get('/admin/bookings/');
export const adminCancelBooking = (bookingId) =>
  api.post('/admin/cancel-booking/', { booking_id: bookingId });
export const adminAddHall = (data) => api.post('/admin/add-hall/', data);
export const adminDeleteHall = (hallId) =>
  api.post('/admin/delete-hall/', { hall_id: hallId });

// ── NFC ───────────────────────────────
export const registerNfcCard = (data) => api.post('/nfc/register/', data);
export const nfcTap = (uid) => api.post('/nfc/tap/', { uid });
export const listNfcCards = () => api.get('/admin/nfc-cards/');

export default api;

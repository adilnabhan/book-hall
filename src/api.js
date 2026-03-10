import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHalls = () => api.get('/halls/');
export const getHallAvailability = (date) =>
  api.get('/halls/availability/', { params: { date } });
export const bookHall = (data) => api.post('/book-hall/', data);
export const getMyBookings = (userId) =>
  api.get('/my-bookings/', { params: { user: userId } });
export const getMyWaitingList = (userId) =>
  api.get('/my-waiting-list/', { params: { user: userId } });

export default api;

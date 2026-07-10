import api from './api';

const amenityService = {
  getAmenities: () => api.get('/amenities').then((res) => res.data),
  create: (payload) => api.post('/amenities', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/amenities/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/amenities/${id}`).then((res) => res.data),
  book: (payload) => api.post('/amenities/bookings', payload).then((res) => res.data),
  getMyBookings: () => api.get('/amenities/bookings/my').then((res) => res.data),
  cancelBooking: (id) => api.put(`/amenities/bookings/${id}/cancel`).then((res) => res.data),
  getAllBookings: (params) => api.get('/amenities/bookings', { params }).then((res) => res.data),
};

export default amenityService;

import api from './api';

const visitorService = {
  preRegister: (payload) => api.post('/visitors/pre-register', payload).then((res) => res.data),
  gateEntry: (formData) =>
    api
      .post('/visitors/gate-entry', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  approve: (id) => api.put(`/visitors/${id}/approve`).then((res) => res.data),
  reject: (id, reason) => api.put(`/visitors/${id}/reject`, { reason }).then((res) => res.data),
  checkIn: (id) => api.put(`/visitors/${id}/check-in`).then((res) => res.data),
  checkOut: (id) => api.put(`/visitors/${id}/check-out`).then((res) => res.data),
  scanQr: (token) => api.post('/visitors/scan-qr', { token }).then((res) => res.data),
  getMyVisitors: (params) => api.get('/visitors/my', { params }).then((res) => res.data),
  getAllVisitors: (params) => api.get('/visitors', { params }).then((res) => res.data),
  getVisitorById: (id) => api.get(`/visitors/${id}`).then((res) => res.data),
  exportCsvUrl: () => `${api.defaults.baseURL}/visitors/export`,
};

export default visitorService;

import api from './api';

const maintenanceService = {
  createBill: (payload) => api.post('/maintenance', payload).then((res) => res.data),
  generateBulkBills: (payload) => api.post('/maintenance/bulk', payload).then((res) => res.data),
  getMyBills: () => api.get('/maintenance/my').then((res) => res.data),
  getAllBills: (params) => api.get('/maintenance', { params }).then((res) => res.data),
  payBill: (id, payload) => api.put(`/maintenance/${id}/pay`, payload).then((res) => res.data),
  // Receipt is a PDF stream — fetched as a blob so it can trigger a browser download.
  downloadReceipt: (id) => api.get(`/maintenance/${id}/receipt`, { responseType: 'blob' }),
};

export default maintenanceService;

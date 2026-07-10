import api from './api';

const securityService = {
  searchResident: (query) => api.get('/security/residents/search', { params: { query } }).then((res) => res.data),
  getMyVisitorHistory: () => api.get('/security/my-history/visitors').then((res) => res.data),
  getMyDeliveryHistory: () => api.get('/security/my-history/deliveries').then((res) => res.data),
};

export default securityService;

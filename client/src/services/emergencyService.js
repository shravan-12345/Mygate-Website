import api from './api';

const emergencyService = {
  getContacts: (params) => api.get('/emergency-contacts', { params }).then((res) => res.data),
  create: (payload) => api.post('/emergency-contacts', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/emergency-contacts/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/emergency-contacts/${id}`).then((res) => res.data),
};

export default emergencyService;

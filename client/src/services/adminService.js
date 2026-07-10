import api from './api';

const adminService = {
  getPendingRegistrations: () => api.get('/admin/registrations/pending').then((res) => res.data),
  updateRegistrationStatus: (userId, status) =>
    api.put(`/admin/registrations/${userId}`, { status }).then((res) => res.data),
  getAllResidents: () => api.get('/admin/residents').then((res) => res.data),
  getAllSecurityGuards: () => api.get('/admin/security-guards').then((res) => res.data),
  toggleUserActiveStatus: (userId) => api.put(`/admin/users/${userId}/status`).then((res) => res.data),
  sendEmergencyAlert: (payload) => api.post('/admin/emergency-alert', payload).then((res) => res.data),
};

export default adminService;

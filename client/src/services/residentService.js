import api from './api';

const residentService = {
  getMyProfile: () => api.get('/residents/me').then((res) => res.data),
  updateMyProfile: (formData) =>
    api
      .put('/residents/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  addFamilyMember: (payload) => api.post('/residents/me/family', payload).then((res) => res.data),
  updateFamilyMember: (memberId, payload) =>
    api.put(`/residents/me/family/${memberId}`, payload).then((res) => res.data),
  deleteFamilyMember: (memberId) => api.delete(`/residents/me/family/${memberId}`).then((res) => res.data),
};

export default residentService;

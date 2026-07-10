import api from './api';

const complaintService = {
  create: (formData) =>
    api
      .post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  getMyComplaints: () => api.get('/complaints/my').then((res) => res.data),
  getAllComplaints: (params) => api.get('/complaints', { params }).then((res) => res.data),
  getComplaintById: (id) => api.get(`/complaints/${id}`).then((res) => res.data),
  update: (id, payload) => api.put(`/complaints/${id}`, payload).then((res) => res.data),
};

export default complaintService;

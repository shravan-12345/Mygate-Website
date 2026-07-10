import api from './api';

const noticeService = {
  getNotices: (params) => api.get('/notices', { params }).then((res) => res.data),
  getNoticeById: (id) => api.get(`/notices/${id}`).then((res) => res.data),
  create: (payload) => api.post('/notices', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/notices/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/notices/${id}`).then((res) => res.data),
};

export default noticeService;

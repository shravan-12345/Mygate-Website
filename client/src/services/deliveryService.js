import api from './api';

const deliveryService = {
  create: (formData) =>
    api
      .post('/deliveries', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  markExit: (id, status) => api.put(`/deliveries/${id}/exit`, { status }).then((res) => res.data),
  getMyDeliveries: () => api.get('/deliveries/my').then((res) => res.data),
  getAllDeliveries: (params) => api.get('/deliveries', { params }).then((res) => res.data),
};

export default deliveryService;

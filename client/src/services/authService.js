import api from './api';

const authService = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  sendOtp: (mobile) => api.post('/auth/send-otp', { mobile }).then((res) => res.data),
  verifyOtp: (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp }).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (resetToken, password) =>
    api.put(`/auth/reset-password/${resetToken}`, { password }).then((res) => res.data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then((res) => res.data),
};

export default authService;
// Serviço de API para comunicação com o backend
import axios from 'axios';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (userData) => api.post('/users/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Serviços de usuário
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadProfileImage: (formData) => api.post('/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Serviços de profissionais
export const professionalService = {
  getNearbyProfessionals: (latitude, longitude) => 
    api.get(`/geolocation/nearby?lat=${latitude}&lng=${longitude}`),
  getProfessionalDetails: (id) => api.get(`/users/professionals/${id}`),
  updateAvailability: (available) => api.put('/users/professionals/availability', { available }),
  updateLocation: (latitude, longitude) => 
    api.put('/users/professionals/location', { latitude, longitude })
};

// Serviços de agendamentos
export const appointmentService = {
  getAppointments: () => api.get('/appointments'),
  getAppointmentDetails: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointmentStatus: (id, status) => api.put(`/appointments/${id}/status`, { status })
};

// Serviços de pagamentos
export const paymentService = {
  getPayments: () => api.get('/payments'),
  processPayment: (paymentData) => api.post('/payments', paymentData)
};

// Serviços de avaliações
export const ratingService = {
  getRatings: (professionalId) => api.get(`/ratings/professional/${professionalId}`),
  createRating: (ratingData) => api.post('/ratings', ratingData)
};

// Serviços de referências
export const referralService = {
  getReferrals: () => api.get('/referrals'),
  generateReferralCode: () => api.post('/referrals/generate'),
  getReferralStats: () => api.get('/referrals/stats'),
  applyReferralCode: (code) => api.post('/referrals/apply', { code })
};

export default api;

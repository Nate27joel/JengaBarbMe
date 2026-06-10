import axios from 'axios';

// 1. Core Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Auth Interceptor: Attaches JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response Interceptor: Handles global errors (like expired tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: Clear local storage and redirect to login if necessary
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 4. Resource-Based Endpoints
export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    getProfile: () => apiClient.get('/auth/profile'),
  },

  // Appointments/Bookings
  appointments: {
    create: (bookingData) => apiClient.post('/appointments/book', bookingData),
    getUserBookings: () => apiClient.get('/appointments/my-bookings'),
    getProBookings: () => apiClient.get('/appointments/pro-bookings'),
  },

  // Professionals/Barbers
  barbers: {
    getAll: (params) => apiClient.get('/barbers', { params }), // For search & filtering
    getById: (id) => apiClient.get(`/barbers/${id}`),
    updateProfile: (data) => apiClient.put('/barbers/profile', data),
  },

  // Blog & Content
  blog: {
    getPosts: () => apiClient.get('/blog'),
    getPost: (slug) => apiClient.get(`/blog/${slug}`),
  },

  // Support/Inquiries
  support: {
    submitInquiry: (data) => apiClient.post('/support/inquire', data),
  }
};

export default api;
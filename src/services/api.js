import axios from 'axios';

// 1. Configure the base connection
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an Interceptor (Optional - useful for the Patient Portal)
// This automatically attaches your login token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Define your API "Endpoints" (Functions to call the backend)
export const api = {
  // --- Appointments ---
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/appointments/book', bookingData);
    return response.data;
  },

  // --- Blog ---
  getBlogPosts: async () => {
    const response = await apiClient.get('/blog');
    return response.data;
  },

  // --- New Patient (Insurance Check) ---
  verifyInsurance: async (provider) => {
    const response = await apiClient.get(`/insurance/check?provider=${provider}`);
    return response.data;
  },

  // --- Investment / Contact ---
  submitInquiry: async (inquiryData) => {
    const response = await apiClient.post('/investment/inquire', inquiryData);
    return response.data;
  },

  // --- Auth (Portal) ---
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }
};

export default api;
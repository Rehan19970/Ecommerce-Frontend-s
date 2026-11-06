import axios from 'axios';

const api = axios.create({
  // Vercel wala variable use karega, agar na mile toh localhost chalega
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token add karo
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Token parse error:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — 401 par logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

export default api;
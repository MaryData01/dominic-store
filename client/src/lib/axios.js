import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const isAdminPage = window.location.pathname.startsWith('/admin');

    if (isAdminPage) {
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        try {
          const { token } = JSON.parse(adminInfo);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          }
        } catch (e) {}
      }
    }

    // Default to user token
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else {
      // Fallback to admin info if user token doesn't exist
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        try {
          const { token } = JSON.parse(adminInfo);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {}
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin')) {
        // Clear admin token and redirect on unauthorized admin route
        localStorage.removeItem('adminInfo');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } else {
        // Clear user token on unauthorized regular route
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

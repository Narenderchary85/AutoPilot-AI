// utils/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Your FastAPI backend URL

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });
        
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authService = {
  // Login
  login: async (email, password) => {
    const response = await authApi.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await authApi.post('/auth/signup', userData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await authApi.post('/auth/verify-email', { token });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await authApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await authApi.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authApi.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await authApi.get('/auth/me');
    return response.data;
  }
};

export default authApi;
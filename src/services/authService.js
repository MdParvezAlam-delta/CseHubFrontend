import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('csehub-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'An error occurred');
};

export const authService = {
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      const data = handleResponse(response);
      if (data.token) {
        localStorage.setItem('csehub-token', data.token);
      }
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  async signin(credentials) {
    try {
      const response = await api.post('/auth/signin', credentials);
      const data = handleResponse(response);
      if (data.token) {
        localStorage.setItem('csehub-token', data.token);
      }
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  signout() {
    localStorage.removeItem('csehub-token');
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async validateToken() {
    const token = localStorage.getItem('csehub-token');
    if (!token) return false;
    try {
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      localStorage.removeItem('csehub-token');
      return false;
    }
  },

  getToken() {
    return localStorage.getItem('csehub-token');
  }
};

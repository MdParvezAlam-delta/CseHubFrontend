import axios from 'axios';
import { getSupabase, hasSupabaseConfig } from './supabase';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
});

export const isLocalAuthEnabled = import.meta.env.DEV;
export const getLocalAuthToken = () => (
  isLocalAuthEnabled ? window.sessionStorage.getItem('csehub_local_access_token') : null
);
export const setLocalAuthToken = (token) => {
  if (isLocalAuthEnabled) window.sessionStorage.setItem('csehub_local_access_token', token);
};
export const clearLocalAuthToken = () => {
  if (isLocalAuthEnabled) window.sessionStorage.removeItem('csehub_local_access_token');
};
api.interceptors.request.use(async (config) => {
  const localToken = getLocalAuthToken();
  if (localToken) {
    config.headers.Authorization = `Bearer ${localToken}`;
  } else if (hasSupabaseConfig) {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) throw error;

    const token = data.session?.access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    const message = error.response?.data?.message;
    const fieldErrors = error.response?.data;
    const formattedErrors = fieldErrors && typeof fieldErrors === 'object'
      ? Object.entries(fieldErrors)
        .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ')
      : '';

    return Promise.reject(new Error(
      detail || message || formattedErrors || error.message || 'The API request failed.'
    ));
  }
);

export default api;

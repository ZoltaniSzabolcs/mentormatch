import axios from 'axios';

// During local development, this might fall back to '/api' (handled by Vite proxy).
// On Cloudflare, it will use the public URL injected during the build process.
// Replace the URL below with the actual live URL of your Spring Boot backend!
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const axiosClient = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') ?? localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

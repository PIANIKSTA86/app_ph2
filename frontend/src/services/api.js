import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', 
      error.config?.url || 'unknown URL',
      error.response?.status || 'no status',
      error.message
    );
    
    if (error.response && error.response.status === 401) {
      // Si el token expiró o es inválido, limpiar localStorage
      console.log('Detectado error 401 - Unauthorized');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // No hacer redirección directa, dejar que React Router lo maneje
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

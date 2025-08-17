import api from './api';

const AuthService = {
  /**
   * Inicia sesión con correo y contraseña
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} - Promise con los datos del usuario y token
   */
  login: async (email, password) => {
    try {
      // Intentar primero con la ruta API
      try {
        const response = await api.post('/api/auth/login', {}, { params: { email, password } });
        
        if (response.data.success && response.data.token) {
          console.log('Login exitoso:', response.data);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.usuario));
          return response.data;
        }
        
        return response.data;
      } catch (apiError) {
        // Si falla, intentar con la ruta alternativa
        console.log('Intentando ruta alternativa de login');
        const fallbackResponse = await api.post('/login', { email, password });
        
        if (fallbackResponse.data.success && fallbackResponse.data.token) {
          console.log('Login alternativo exitoso:', fallbackResponse.data);
          localStorage.setItem('token', fallbackResponse.data.token);
          localStorage.setItem('user', JSON.stringify(fallbackResponse.data.usuario));
        }
        
        return fallbackResponse.data;
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario actual
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Evitamos redirect automático para permitir que React Router maneje la navegación
    // window.location.href = '/login';
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - True si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object|null} - Datos del usuario o null si no está autenticado
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Solicita restablecer la contraseña
   * @param {string} email - Correo electrónico del usuario
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar reset de contraseña:', error);
      throw error;
    }
  },

  /**
   * Actualiza la contraseña con un token de reseteo
   * @param {string} token - Token de reset
   * @param {string} password - Nueva contraseña
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/api/auth/update-password', { token, password });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }
};

export default AuthService;

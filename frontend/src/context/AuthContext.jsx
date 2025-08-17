import { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

// Crear contexto
const AuthContext = createContext();

/**
 * Proveedor de autenticación que maneja el estado de autenticación global
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Cambiado a false para pruebas
  const [error, setError] = useState(null);

  console.log("AuthProvider renderizado");

  useEffect(() => {
    console.log("AuthProvider useEffect ejecutado");
    
    // Verificar si hay un usuario y token en localStorage al iniciar
    const initAuth = async () => {
      setLoading(true);
      try {
        // Intentar obtener el token y usuario del localStorage
        const token = localStorage.getItem('token');
        let currentUser = null;
        
        try {
          // Intentar parsear el usuario del localStorage
          const userStr = localStorage.getItem('user');
          currentUser = userStr ? JSON.parse(userStr) : null;
        } catch (parseError) {
          console.error('Error al parsear usuario:', parseError);
          localStorage.removeItem('user'); // Eliminar datos corruptos
        }
        
        console.log("Token encontrado:", token ? "Sí" : "No");
        console.log("Usuario encontrado:", currentUser ? "Sí" : "No");
        
        if (token && currentUser) {
          console.log("Iniciando sesión con usuario almacenado:", currentUser.nombre);
          setUser(currentUser);
          
          // Para desarrollo, establecer un usuario en modo de emergencia
          if (process.env.NODE_ENV === 'development' && !currentUser) {
            setUser({
              id: 1,
              nombre: 'Usuario Desarrollo',
              email: 'dev@ejemplo.com',
              rol: 'admin'
            });
          }
        } else {
          // Si no hay token o usuario, limpiar todo por seguridad
          console.log("No se encontró información de sesión válida");
          AuthService.logout();
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        AuthService.logout(); // Si hay un error, cerrar sesión
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Inicia sesión de usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Promise con resultado de la operación
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      if (response.success) {
        setUser(response.usuario);
        return { success: true };
      } else {
        setError(response.message || 'Error al iniciar sesión');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al conectar con el servidor';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra sesión de usuario
   */
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} - Promise con resultado de la operación
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(userData);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Error al registrar usuario');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al conectar con el servidor';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Función de emergencia para desarrollo que permite iniciar sesión sin backend
  const loginDev = () => {
    console.log('Usando login de desarrollo');
    const mockUser = {
      id: 999,
      nombre: 'Usuario Desarrollo',
      email: 'dev@ejemplo.com',
      rol: 'admin'
    };
    
    const mockToken = 'dev-token-12345';
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    
    return { success: true, usuario: mockUser, token: mockToken };
  };
  
  // Valor que se proporcionará a los consumidores del contexto
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    loginDev, // Solo para desarrollo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} - Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

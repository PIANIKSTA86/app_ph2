import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log("ProtectedRoute renderizado, autenticado:", isAuthenticated);

  // Verificar si el token existe en localStorage
  const token = localStorage.getItem('token');
  
  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay token o no está autenticado, redirigir a login
  if (!token || !isAuthenticated) {
    console.log("No hay token o usuario autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;

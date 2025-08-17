import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle 
} from '@mui/material';

// Componente simplificado para aislar el problema
const InventarioPageSimple = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para manejar errores globales
  useEffect(() => {
    const handleError = (event) => {
      console.error('Error en InventarioPage:', event);
      setError(event.error || event);
    };

    // Agregar listener para errores no capturados
    window.addEventListener('error', handleError);
    
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error al cargar la página de inventario</AlertTitle>
          <Typography>
            {error.message || JSON.stringify(error) || 'Error desconocido'}
          </Typography>
          {process.env.NODE_ENV !== 'production' && error.stack && (
            <Box component="pre" sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', fontSize: '0.8rem', overflow: 'auto' }}>
              {error.stack}
            </Box>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Inventario (Versión Simple)</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Información del Inventario</Typography>
        <Typography>
          Esta es una versión simplificada de la página de inventario para diagnosticar problemas de renderizado.
        </Typography>
      </Paper>
      
      <Button variant="contained" color="primary">
        Acción de Prueba
      </Button>
    </Box>
  );
};

export default InventarioPageSimple;

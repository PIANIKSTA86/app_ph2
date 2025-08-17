import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, Alert } from '@mui/material';
import ErrorDisplay from '../components/ErrorDisplay';

const HomePage = () => {
  const [debugInfo, setDebugInfo] = useState('Cargando información de debug...');
  
  useEffect(() => {
    // Información de debug para ayudar a diagnosticar problemas
    const gatherDebugInfo = async () => {
      try {
        const info = {
          url: window.location.href,
          localStorage: Object.keys(localStorage),
          userAgent: navigator.userAgent,
          time: new Date().toISOString()
        };
        setDebugInfo(JSON.stringify(info, null, 2));
      } catch (error) {
        setDebugInfo(`Error al recopilar información: ${error.message}`);
      }
    };
    
    gatherDebugInfo();
  }, []);
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Sistema de Gestión de Propiedad Horizontal
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bienvenido a la plataforma integral para la administración de conjuntos residenciales.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/login"
              size="large"
            >
              Iniciar Sesión
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/dashboard"
              size="large"
            >
              Ver Dashboard
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mt: 4, width: '100%', textAlign: 'left' }}>
            <Typography variant="h6">Información de Debug:</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {debugInfo}
            </pre>
          </Alert>
        </Paper>
      </Box>
      
      <ErrorDisplay message="Aplicación inicializada correctamente" severity="success" />
    </Container>
  );
};

export default HomePage;
